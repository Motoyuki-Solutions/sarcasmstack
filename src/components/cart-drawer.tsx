"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDetailedCart, useCart } from "./cart-context";
import { formatPrice } from "@/data/catalog";
import { CheckoutButton } from "./checkout-button";

/** Slide-in cart drawer with line items, quantity steppers, and checkout. */
export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, subtotalCents, hydrated } = useDetailedCart();
  const { setQuantity, remove, clear } = useCart();
  const [redirecting, setRedirecting] = useState(false);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-ink-900 shadow-2xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="font-display text-xl tracking-wide text-white">YOUR CART</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="grid h-8 w-8 place-items-center rounded-md text-zinc-400 hover:bg-white/5 hover:text-white"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!hydrated ? (
            <p className="py-12 text-center text-sm text-zinc-500">Loading cart…</p>
          ) : lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-display text-2xl text-white">CART&apos;S EMPTY.</p>
              <p className="mt-2 text-sm text-zinc-500">
                Tragic. Go fix that.
              </p>
              <Link
                href="/shop"
                onClick={onClose}
                className="mt-6 rounded-lg bg-accent px-6 py-3 font-display text-sm tracking-wide text-ink-950 transition-colors hover:bg-accent-soft"
              >
                SHOP THE SNARK →
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => (
                <li
                  key={`${line.productId}-${line.variantId}`}
                  className="flex gap-3 rounded-lg border border-white/5 bg-ink-800/50 p-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={line.product.imageFront}
                    alt={line.product.title}
                    className="h-20 w-20 flex-none rounded-md object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${line.product.id}`}
                        onClick={onClose}
                        className="font-display text-sm leading-tight tracking-wide text-white hover:text-accent"
                      >
                        {line.product.title}
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(line.productId, line.variantId)}
                        aria-label="Remove item"
                        className="text-zinc-600 hover:text-accent"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-500">{line.variant.label}</p>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1">
                        <StepperButton
                          onClick={() =>
                            setQuantity(line.productId, line.variantId, line.quantity - 1)
                          }
                          label="decrease"
                        >
                          −
                        </StepperButton>
                        <span className="w-8 text-center font-mono text-sm text-white">
                          {line.quantity}
                        </span>
                        <StepperButton
                          onClick={() =>
                            setQuantity(line.productId, line.variantId, line.quantity + 1)
                          }
                          label="increase"
                        >
                          +
                        </StepperButton>
                      </div>
                      <span className="font-mono text-sm font-bold text-white">
                        {formatPrice(line.lineTotalCents)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {hydrated && lines.length > 0 && (
          <footer className="border-t border-white/10 px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-zinc-400">Subtotal</span>
              <span className="font-mono text-lg font-bold text-white">
                {formatPrice(subtotalCents)}
              </span>
            </div>
            <p className="mb-3 text-xs text-zinc-500">
              Shipping + tax calculated at checkout. Printed on demand via Printify.
            </p>
            <CheckoutButton
              lines={lines}
              onRedirecting={setRedirecting}
              disabled={redirecting}
              label={redirecting ? "REDIRECTING…" : "CHECKOUT →"}
            />
            <button
              type="button"
              onClick={clear}
              className="mt-2 w-full rounded-md py-2 text-xs text-zinc-600 hover:text-accent"
            >
              Clear cart
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}

function StepperButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-7 w-7 place-items-center rounded-md border border-white/10 text-zinc-300 hover:border-white/30 hover:text-white"
    >
      {children}
    </button>
  );
}
