/**
 * Stripe server helper.
 *
 * Lazily constructs a Stripe SDK instance from STRIPE_SECRET_KEY. The value
 * SHOULD be a restricted API key (rk_test_... / rk_live_...) per the
 * stripe-best-practices skill — least privilege. The Stripe SDK accepts an
 * rk_ key anywhere it accepts an sk_ key, so no code change is needed.
 *
 * Exported via `getStripe()` so route handlers don't instantiate on module
 * load (keeps mock-mode builds clean when no key is set).
 */

import Stripe from "stripe";

let instance: Stripe | null = null;

export function getStripe(): Stripe {
  if (instance) return instance;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set. Configure it to enable checkout.");
  }
  // Stripe SDK accepts a typed config; pin to the latest API version per the
  // stripe-best-practices skill (2026-06-24.dahlia). Update alongside the SDK.
  instance = new Stripe(key, {
    apiVersion: "2026-06-24" as Stripe.LatestApiVersion,
    typescript: true,
  });
  return instance;
}

export function stripeEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/** The app's origin, used for success/cancel URLs. Override with APP_ORIGIN. */
export function appOrigin(): string {
  return (
    process.env.APP_ORIGIN ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}
