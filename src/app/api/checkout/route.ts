export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

interface CheckoutBody {
  productId: number;
  variantId: number;
  quantity: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    region: string;
    address1: string;
    address2?: string;
    city: string;
    zip: string;
  };
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.PRINTIFY_API_KEY;
  const shopId = process.env.PRINTIFY_SHOP_ID;

  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.productId || !body.variantId || !body.shippingAddress) {
    return NextResponse.json(
      { error: "Missing required fields: productId, variantId, shippingAddress" },
      { status: 400 }
    );
  }

  if (apiKey && shopId) {
    try {
      const orderPayload = {
        line_items: [
          {
            product_id: body.productId,
            variant_id: body.variantId,
            quantity: body.quantity || 1,
          },
        ],
        shipping_address: {
          first_name: body.shippingAddress.firstName,
          last_name: body.shippingAddress.lastName,
          email: body.shippingAddress.email,
          phone: body.shippingAddress.phone,
          country: body.shippingAddress.country,
          region: body.shippingAddress.region,
          address1: body.shippingAddress.address1,
          address2: body.shippingAddress.address2 || "",
          city: body.shippingAddress.city,
          zip: body.shippingAddress.zip,
        },
      };

      const res = await fetch(
        "https://api.printify.com/v1/shops/" + shopId + "/orders.json",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderPayload),
        }
      );

      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error("Printify order failed: " + res.status + " " + errorBody);
      }

      const order = await res.json();
      return NextResponse.json({ success: true, orderId: order.id, source: "printify" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return NextResponse.json({ error: message }, { status: 502 });
    }
  }

  return NextResponse.json({
    success: true,
    orderId: "mock-order-" + Date.now(),
    source: "mock",
    message: "Order simulated (no PRINTIFY_API_KEY set)",
  });
}
