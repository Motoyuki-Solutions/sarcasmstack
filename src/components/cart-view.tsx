"use client";

import Link from "next/link";
import { useDetailedCart, useCart } from "./cart-context";
import { formatPrice } from "@/data/catalog";
import { CheckoutButton } from "./checkout-button";

/** Full-page cart view (the /cart route). Mirrors the drawer but as a page. */
export function CartView() {
  const { lines, subtotalCents, hydrated } = useDetailedCart();
  const { setQuantity, remove, clear } = useCart();

  if (!hydrated) {
    return <p className="py-12 text-center text-sm text-zinc-500">Loading cart…</p>;
  }
  if (lines.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-ink-900/50 py-20 text-center">
        <p className="font-display text-3xl text-white">CART&apos;S EMPTY.</p>
        <p className="mt-2 text-sm text-zinc-500">Tragic. Go fix that.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 font-display text-sm tracking-wide text-ink-950 transition-colors hover:bg-accent-soft"
        >
          SHOP THE SNARK →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-white/5 rounded-xl border border-white/10 bg-ink-900">
        {lines.map((line) => (
          <li key={`${line.productId}-${line.variantId}`} className="flex gap-4 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={line.product.imageFront}
              alt={line.product.title}
              className="h-24 w-24 flex-none rounded-lg object-contain"
            />
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/product/${line.product.id}`}
                  className="font-display text-lg leading-tight tracking-wide text-white hover:text-accent"
                >
                  {line.product.title}
                </Link>
                <button
                  type="button"
                  onClick={() => remove(line.productId, line.variantId)}
                  className="text-zinc-600 hover:text-accent"
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
              <p className="mt-1 text-sm text-zinc-500">{line.variant.label}</p>
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(line.productId, line.variantId, line.quantity - 1)}
                    className="grid h-8 w-8 place-items-center rounded-md border border-white/10 text-zinc-300 hover:border-white/30"
                    aria-label="decrease"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-mono text-sm text-white">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(line.productId, line.variantId, line.quantity + 1)}
                    className="grid h-8 w-8 place-items-center rounded-md border border-white/10 text-zinc-300 hover:border-white/30"
                    aria-label="increase"
                  >
                    +
                  </button>
                </div>
                <span className="font-mono font-bold text-white">
                  {formatPrice(line.lineTotalCents)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col items-end gap-2">
        <div className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-ink-900 px-5 py-4">
          <span className="text-sm text-zinc-400">Subtotal</span>
          <span className="font-mono text-xl font-bold text-white">
            {formatPrice(subtotalCents)}
          </span>
        </div>
        <p className="text-xs text-zinc-500">
          Shipping + tax at checkout. Printed on demand via Printify.
        </p>
        <div className="mt-2 w-full max-w-xs">
          <CheckoutButton lines={lines} />
        </div>
        <button
          type="button"
          onClick={clear}
          className="mt-1 text-xs text-zinc-600 hover:text-accent"
        >
          Clear cart
        </button>
      </div>
    </div>
  );
}
