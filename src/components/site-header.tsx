import Link from "next/link";
import { CartButton } from "./cart-button";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "The Bit" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2" aria-label="SarcasmStack home">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-accent text-ink-950 transition-transform group-hover:rotate-12">
            <span className="font-display text-lg leading-none">S</span>
          </span>
          <span className="font-display text-xl tracking-wide text-white">
            SARCASM<span className="text-accent">STACK</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/shop"
            className="ml-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-ink-950 transition-colors hover:bg-accent hover:text-ink-950"
          >
            Buy Something
          </Link>
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
