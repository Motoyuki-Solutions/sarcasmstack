"use client";

import { useState } from "react";
import type { CartLineDetailed } from "@/types";
import { isMockMode } from "@/lib/printify";

interface CheckoutButtonProps {
  /** Cart lines (detailed) to check out. Pass [] to disable. */
  lines: CartLineDetailed[];
  onRedirecting?: (v: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

/**
 * Initiates Stripe Checkout. Posts the cart to /api/checkout, which creates a
 * Stripe Checkout Session and returns its URL; the browser redirects there.
 *
 * In mock mode (no Stripe secret key) it short-circuits to a demo message so
 * the storefront is fully clickable without credentials.
 */
export function CheckoutButton({
  lines,
  onRedirecting,
  disabled,
  label = "CHECKOUT →",
  className,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mock = isMockMode();

  const handleCheckout = async () => {
    if (lines.length === 0 || disabled) return;
    setLoading(true);
    onRedirecting?.(true);
    setError(null);
    try {
      if (mock) {
        await new Promise((r) => setTimeout(r, 500));
        alert(
          `Demo mode!\n\nCheckout for ${lines.length} line(s) would redirect to Stripe here.\n\nSet STRIPE_SECRET_KEY to enable real checkout.`,
        );
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({
            productId: l.productId,
            variantId: l.variantId,
            quantity: l.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "checkout failed");
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("no checkout url returned");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
      onRedirecting?.(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading || disabled || lines.length === 0}
        className={
          className ??
          "group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-4 font-display text-lg tracking-wide text-ink-950 transition-all hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
        }
      >
        {loading ? "ONE SEC…" : label}
      </button>
      {error && <p className="mt-2 text-xs text-accent">{error}</p>}
      {mock && (
        <p className="mt-2 text-center text-xs text-zinc-600">Demo mode — no real payment.</p>
      )}
    </div>
  );
}
