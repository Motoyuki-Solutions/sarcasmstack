/**
 * POST /api/checkout
 *
 * Creates a Stripe Checkout Session for the cart and returns its URL.
 * Request body: { lines: [{ productId, variantId, quantity }] }
 *
 * Each Stripe line item carries metadata (productId, variantId, quantity,
 * printifyProductId, blueprintId, printProviderId) so the webhook can create
 * the matching Printify order without re-resolving the catalog.
 *
 * In mock mode (no STRIPE_SECRET_KEY) it returns a clear demo payload.
 */

import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getProduct, getProductVariant } from "@/data/catalog";
import { getStripe, stripeEnabled, appOrigin } from "@/lib/stripe";
import { isMockMode } from "@/lib/printify";

export const runtime = "nodejs"; // Stripe SDK needs the Node runtime, not edge

interface IncomingLine {
  productId: string;
  variantId: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  let body: { lines?: IncomingLine[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const lines = body?.lines;
  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: "lines must be a non-empty array" }, { status: 400 });
  }

  // Resolve + validate every line against the catalog.
  type Resolved = {
    productId: string;
    variantId: string;
    quantity: number;
    title: string;
    label: string;
    priceCents: number;
    printifyProductId: string;
    blueprintId: number;
    printProviderId: number;
  };
  const resolved: Resolved[] = [];
  for (const l of lines) {
    const product = getProduct(l.productId);
    if (!product) {
      return NextResponse.json({ error: `unknown product: ${l.productId}` }, { status: 400 });
    }
    const variant = getProductVariant(product, l.variantId);
    if (!variant) {
      return NextResponse.json(
        { error: `unknown variant ${l.variantId} for ${l.productId}` },
        { status: 400 },
      );
    }
    const qty = Math.max(1, Math.floor(l.quantity));
    resolved.push({
      productId: product.id,
      variantId: variant.id,
      quantity: qty,
      title: product.title,
      label: variant.label,
      priceCents: variant.priceCents,
      printifyProductId: product.printifyProductId,
      blueprintId: product.blueprintId,
      printProviderId: product.printProviderId,
    });
  }

  // Mock mode: no Stripe key. Return a demo payload so the UI degrades cleanly.
  if (!stripeEnabled() || isMockMode()) {
    const subtotal = resolved.reduce((s, r) => s + r.priceCents * r.quantity, 0);
    return NextResponse.json({
      mock: true,
      url: null,
      message: "Mock mode — set STRIPE_SECRET_KEY to enable real checkout.",
      subtotal,
      lineCount: resolved.length,
    });
  }

  const origin = appOrigin();
  const stripe = getStripe();

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = resolved.map((r) => ({
    quantity: r.quantity,
    price_data: {
      currency: "usd",
      unit_amount: r.priceCents,
      product_data: {
        name: `${r.title} (${r.label})`,
        // SarcasmStack-branded statement descriptor handled at session level.
        metadata: {
          productId: r.productId,
          variantId: r.variantId,
          printifyProductId: r.printifyProductId,
          blueprintId: String(r.blueprintId),
          printProviderId: String(r.printProviderId),
        },
      },
    },
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?canceled=1`,
      // Stash the whole cart as session metadata too, for resilient webhook handling.
      metadata: {
        cart: JSON.stringify(
          resolved.map((r) => ({
            productId: r.productId,
            variantId: r.variantId,
            quantity: r.quantity,
            printifyProductId: r.printifyProductId,
            blueprintId: r.blueprintId,
            printProviderId: r.printProviderId,
          })),
        ),
      },
      shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR"] },
      phone_number_collection: { enabled: true },
      payment_intent_data: {
        // Carry cart through to the payment intent for webhook reconciliation.
        metadata: { cart_items: String(resolved.length) },
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("[checkout] stripe session create failed:", err);
    return NextResponse.json(
      { error: "could not create checkout session" },
      { status: 500 },
    );
  }
}
