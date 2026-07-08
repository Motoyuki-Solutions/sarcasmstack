import Link from "next/link";
import { PRODUCTS } from "@/data/catalog";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-static";

const MARQUEE = [
  "FREE SHIPPING OVER $50*",
  "NEW DROPS WEEKLY",
  "SARCASM INCLUDED",
  "0% SINCERITY",
  "PRINTED ON DEMAND",
  "OFFEND YOUR FAMILY",
];

export default async function HomePage() {
  // Featured = first 8 products (tees first — highest margin per the brief).
  const featured = PRODUCTS.slice(0, 8);

  return (
    <div>
      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="grain relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-accent/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-highlight/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="flex flex-col items-start">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-zinc-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              Now printing
            </span>

            <h1 className="max-w-4xl font-display text-5xl leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
              WEAR YOUR
              <br />
              <span className="text-accent">SARCASM</span>
              <br />
              ON YOUR CHEST.
            </h1>

            <p className="mt-8 max-w-xl text-lg text-zinc-400">
              Print-on-demand apparel, drinkware, and stickers for people whose
              love language is being a little much. Designed by the chronically
              online. Printed only when you click buy — zero inventory, maximum
              spite.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-4 font-display text-lg tracking-wide text-ink-950 transition-all hover:bg-accent-soft hover:shadow-[0_0_40px_-8px_rgba(255,59,107,0.6)]"
              >
                SHOP THE SNARK
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-8 py-4 font-display text-lg tracking-wide text-white transition-colors hover:border-white/40"
              >
                THE BIT
              </Link>
            </div>
          </div>
        </div>

        {/* marquee */}
        <div className="relative overflow-hidden border-t border-white/5 bg-ink-900/50 py-3">
          <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
            {[...MARQUEE, ...MARQUEE].map((t, i) => (
              <span
                key={i}
                className="flex items-center gap-8 font-mono text-xs font-bold uppercase tracking-widest text-zinc-500"
              >
                {t} <span className="text-accent">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── Featured ─────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-4xl tracking-wide text-white sm:text-5xl">
              FRESH SNARK
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              The lineup. Click anything. We dare you.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden whitespace-nowrap text-sm font-bold text-accent hover:text-accent-soft sm:block"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      {/* ─────────────────────── Pitch ───────────────────────── */}
      <section className="border-t border-white/5 bg-ink-900/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            {
              k: "01",
              h: "Printed on demand",
              b: "Nothing sits in a warehouse. We print it when you buy it. Eco-flexible, zero dead stock, and your shirt is genuinely fresh.",
            },
            {
              k: "02",
              h: "Snark, curated",
              b: "Every design survives a panel of one (1) judgmental inner voice. If it doesn’t make us exhale from our nose, it doesn’t ship.",
            },
            {
              k: "03",
              h: "Ships worldwide",
              b: "Printify’s network of print providers means your order is made close to you and on its way in days, not weeks.",
            },
          ].map((f) => (
            <div key={f.k} className="border-l-2 border-accent/30 pl-6">
              <span className="font-mono text-sm text-accent">{f.k}</span>
              <h3 className="mt-2 font-display text-2xl tracking-wide text-white">
                {f.h}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{f.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────── CTA ─────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-ink-800 to-ink-950 p-10 text-center sm:p-16">
          <div className="pointer-events-none absolute inset-0 bg-accent/5" />
          <h2 className="relative font-display text-4xl tracking-wide text-white sm:text-6xl">
            LIFE&apos;S TOO SHORT
            <br />
            FOR BORING SHIRTS.
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-zinc-400">
            Go on. Treat yourself to something that says exactly what you&apos;re thinking.
          </p>
          <Link
            href="/shop"
            className="relative mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-4 font-display text-lg tracking-wide text-ink-950 transition-all hover:bg-accent-soft"
          >
            BROWSE THE COLLECTION →
          </Link>
        </div>
      </section>
    </div>
  );
}
