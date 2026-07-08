import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Bit",
  description: "What SarcasmStack is and why it exists.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <span className="text-xs font-bold uppercase tracking-widest text-accent">
        The Bit
      </span>
      <h1 className="mt-3 font-display text-5xl leading-tight tracking-tight text-white sm:text-6xl">
        WE&apos;RE NOT
        <br />
        THAT DEEP.
      </h1>

      <div className="prose-invert mt-10 space-y-6 text-lg leading-relaxed text-zinc-300">
        <p>
          SarcasmStack is a print-on-demand store for people who communicate
          primarily through irony. You think it, we print it on a shirt, and
          then you wear it to the grocery store like a normal person.
        </p>
        <p>
          There&apos;s no warehouse. There&apos;s no inventory. There&apos;s a
          stack of sarcastic designs and a network of print providers who make
          your order the moment you click buy. That&apos;s the whole operation.
        </p>
        <p className="text-zinc-400">
          Every design is survivorship-biased through exactly one filter: does
          it make us exhale slightly harder than usual through our nose. If yes,
          it ships. If no, we think about it for too long and ship it anyway.
        </p>
      </div>

      <div className="mt-12 rounded-xl border border-white/10 bg-ink-900 p-8">
        <h2 className="font-display text-2xl tracking-wide text-white">
          THE BORING PART
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-zinc-400">
          <li>• Products are printed and shipped by Printify&apos;s partner network.</li>
          <li>• Orders are made-to-order — typically shipped within 3–7 business days.</li>
          <li>• Shipping is calculated at checkout based on your location.</li>
          <li>• If something arrives broken or misprinted, we&apos;ll fix it. Sarcasm, not malice.</li>
        </ul>
      </div>

      <div className="mt-12">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-4 font-display text-lg tracking-wide text-ink-950 transition-all hover:bg-accent-soft"
        >
          OK, SHOW ME THE GOODS →
        </Link>
      </div>
    </div>
  );
}
