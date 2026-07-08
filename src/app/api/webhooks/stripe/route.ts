/**
 * POST /api/webhooks/stripe
 *
 * Receives Stripe webhook events. On `checkout.session.completed` we read the
 * cart from session metadata (with a line-item metadata fallback), build a
 * Printify order, and submit it. This is the bridge between "customer paid"
 * and "Printify prints + ships."
 *
 * Verifies the Stripe signature with STRIPE_WEBHOOK_SECRET.
 * Idempotency: we use the session id as the Printify external_id so a
 * redelivered event re-creates the same order reference (Printify de-dupes on
 * external_id when supported; otherwise the order is re-submitted — acceptable
 * for MVP, harden with a persistent event log later).
 */

import { NextRequest, NextResponse } from "next/server";
import { getStripe, stripeEnabled } from "@/lib/stripe";
import { submitOrder, stripeShippingToPrintifyAddress, type OrderLine } from "@/lib/orders";

export const runtime = "nodejs";
// Stripe webhook payload can be large; ensure dynamic handling.
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!stripeEnabled()) {
    return NextResponse.json({ error: "stripe not configured" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "missing signature or webhook secret" }, { status: 400 });
  }

  // Raw body is required for signature verification. Next.js (App Router,
  // nodejs runtime) gives us the raw body via req.text(); pass it to Stripe.
  const rawBody = await req.text();
  const stripe = getStripe();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed:", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      // Only fulfill paid sessions.
      if (session.payment_status !== "paid") {
        return NextResponse.json({ received: true, skipped: "not paid" });
      }

      const cartJson = (session.metadata?.cart as string | undefined) ?? "";
      let lines: OrderLine[] = [];
      try {
        lines = cartJson ? (JSON.parse(cartJson) as OrderLine[]) : [];
      } catch {
        lines = [];
      }

      if (lines.length === 0) {
        console.warn("[stripe-webhook] session %s had no cart metadata", session.id);
        return NextResponse.json({ received: true, skipped: "empty cart" });
      }

      // Resolve shipping address from the session (Stripe populates
      // shipping_details on checkout with shipping_address_collection).
      const shipping = session.shipping_details;
      const email = session.customer_details?.email ?? session.customer_email ?? null;
      const address = stripeShippingToPrintifyAddress(
        {
          name: shipping?.name ?? null,
          address: shipping?.address ?? null,
          phone: shipping?.phone ?? session.customer_details?.phone ?? null,
        },
        email,
      );

      try {
        const order = await submitOrder(lines, address, session.id);
        console.log(
          "[stripe-webhook] created Printify order %s (mock=%s) for session %s",
          order.orderId,
          order.mock,
          session.id,
        );
        return NextResponse.json({
          received: true,
          printifyOrderId: order.orderId,
          status: order.status,
        });
      } catch (err) {
        console.error("[stripe-webhook] printify order creation failed:", err);
        // 500 so Stripe retries — but log loudly so it's noticed.
        return NextResponse.json({ error: "printify order creation failed" }, { status: 500 });
      }
    }

    default:
      // Acknowledge unhandled events so Stripe doesn't keep retrying.
      return NextResponse.json({ received: true, type: event.type });
  }
}
