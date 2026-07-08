"use client";

import { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart-context";

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const { clear } = useCart();

  // Clear the cart once we've landed on success (order is in Printify now).
  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <span className="font-mono text-sm text-accent">ORDER CONFIRMED</span>
      <h1 className="mt-4 font-display text-5xl leading-tight tracking-tight text-white sm:text-7xl">
        YOU PAID.
        <br />
        WE&apos;RE PRINTING.
      </h1>
      <p className="mt-6 max-w-md text-zinc-400">
        Your order is headed to a Printify print provider near you. You&apos;ll get
        a shipping notification when it&apos;s on the way. Until then: be patient.
        Snark takes time.
      </p>

      {sessionId && (
        <p className="mt-6 font-mono text-xs text-zinc-600">
          Session: {sessionId}
        </p>
      )}

      <Link
        href="/shop"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-4 font-display text-lg tracking-wide text-ink-950 transition-all hover:bg-accent-soft"
      >
        BACK TO THE GOODS →
      </Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-zinc-500">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
