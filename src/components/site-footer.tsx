import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-ink-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="col-span-1 sm:col-span-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-ink-950">
                <span className="font-display text-base leading-none">S</span>
              </span>
              <span className="font-display text-lg tracking-wide text-white">
                SARCASM<span className="text-accent">STACK</span>
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-zinc-500">
              Print-on-demand wearable snark. We print it, we ship it, you offend
              your relatives at Thanksgiving. No refunds on dignity.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Shop
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/shop" className="text-zinc-500 hover:text-white">All Products</Link></li>
              <li><Link href="/shop?category=apparel" className="text-zinc-500 hover:text-white">Apparel</Link></li>
              <li><Link href="/shop?category=drinkware" className="text-zinc-500 hover:text-white">Drinkware</Link></li>
              <li><Link href="/shop?category=accessories" className="text-zinc-500 hover:text-white">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Fine Print
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/about" className="text-zinc-500 hover:text-white">The Bit</Link></li>
              <li><span className="text-zinc-500">Shipping &amp; Returns</span></li>
              <li><span className="text-zinc-500">Privacy</span></li>
              <li><span className="text-zinc-500">Terms</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/5 pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} SarcasmStack. Snark printed on demand.</p>
          <p className="font-mono">sarcasmstack.io</p>
        </div>
      </div>
    </footer>
  );
}
