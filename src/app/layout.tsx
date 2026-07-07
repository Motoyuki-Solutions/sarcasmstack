import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SarcasmStack — Wear the Attitude",
  description:
    "A satirical print-on-demand store. Bold designs. Zero chill.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        <header className="border-b border-neutral-800">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <a href="/" className="text-xl font-bold tracking-tight text-brand-400">
              SarcasmStack
            </a>
            <ul className="flex gap-6 text-sm text-neutral-400">
              <li>
                <a href="/shop" className="hover:text-white transition-colors">
                  Shop
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
            </ul>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="border-t border-neutral-800 mt-20">
          <div className="mx-auto max-w-7xl px-6 py-8 text-center text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} SarcasmStack. All rights reserved.
            Powered by Printify.
          </div>
        </footer>
      </body>
    </html>
  );
}
