"use client";

import { useState } from "react";
import { useCart } from "./cart-context";
import { CartDrawer } from "./cart-drawer";

/** Header cart button + slide-in drawer. */
export function CartButton() {
  const { itemCount, hydrated } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Cart with ${itemCount} item${itemCount === 1 ? "" : "s"}`}
        className="relative ml-1 grid h-9 w-9 place-items-center rounded-md text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {hydrated && itemCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-ink-950">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
