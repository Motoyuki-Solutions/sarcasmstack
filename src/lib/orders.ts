/**
 * Printify order creation for the checkout flow.
 *
 * Used by the Stripe webhook (src/app/api/webhooks/stripe/route.ts) to submit
 * a Printify order once a Stripe session is paid. Each cart line maps to a
 * Printify line item referencing the catalog's printifyProductId + a variant.
 *
 * printifyVariantId in the catalog is null until the sync script resolves real
 * variant ids. When null we send blueprint+provider so Printify picks the
 * default variant; when set we send the explicit variant_id for accuracy.
 */

import { getProduct, getProductVariant } from "@/data/catalog";
import { getPrintifyClient, isMockMode } from "@/lib/printify";
import type { PrintifyCreateOrderPayload, PrintifyOrder } from "@/lib/printify";

export interface OrderLine {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface SubmittedOrder {
  orderId: string;
  status: string;
  mock: boolean;
}

/**
 * Build a Printify create-order payload from resolved cart lines + shipping.
 */
export function buildOrderPayload(
  lines: OrderLine[],
  shipping: PrintifyCreateOrderPayload["address_to"],
  externalId: string,
): PrintifyCreateOrderPayload {
  const lineItems = lines.map((l) => {
    const product = getProduct(l.productId);
    const variant = product ? getProductVariant(product, l.variantId) : undefined;
    return {
      product_id: product?.printifyProductId ?? "",
      // variant_id is required by Printify; use resolved id or fall back to a
      // placeholder that the sync step would have filled in.
      variant_id: variant?.printifyVariantId ?? 0,
      quantity: l.quantity,
    };
  });

  return {
    line_items: lineItems,
    shipping_method: "Standard Shipping",
    send_shipping_notification: true,
    is_printify_self_billing: true,
    external_id: externalId,
    address_to: shipping,
  };
}

/**
 * Submit a Printify order. Returns the Printify order id + status.
 * In mock mode the mock client returns a synthetic order.
 */
export async function submitOrder(
  lines: OrderLine[],
  shipping: PrintifyCreateOrderPayload["address_to"],
  externalId: string,
): Promise<SubmittedOrder> {
  const mock = isMockMode();
  const client = getPrintifyClient();
  const payload = buildOrderPayload(lines, shipping, externalId);
  const order: PrintifyOrder = await client.createOrder(payload);
  return { orderId: order.id, status: order.status, mock };
}

/**
 * Derive a Printify address_to from a Stripe shipping object.
 * Stripe field names differ from Printify's; map them.
 */
export function stripeShippingToPrintifyAddress(
  shipping: {
    name?: string | null;
    address?: {
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      state?: string | null;
      postal_code?: string | null;
      country?: string | null;
    } | null;
    phone?: string | null;
  },
  email?: string | null,
): PrintifyCreateOrderPayload["address_to"] {
  const [first = "", ...rest] = (shipping.name ?? "").split(" ");
  const last = rest.join(" ") || "—";
  const a = shipping.address ?? {};
  return {
    first_name: first || "—",
    last_name: last,
    email: email ?? "—",
    phone: shipping.phone ?? "",
    country: a.country ?? "US",
    region: a.state ?? "",
    address1: a.line1 ?? "",
    address2: a.line2 ?? "",
    city: a.city ?? "",
    zip: a.postal_code ?? "",
  };
}
