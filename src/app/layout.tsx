import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartProvider } from "@/components/cart-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sarcasmstack.io"),
  title: {
    default: "SarcasmStack — Wearable Snark, Print on Demand",
    template: "%s · SarcasmStack",
  },
  description:
    "Print-on-demand apparel, drinkware, and stickers for people whose love language is sarcasm. Designed by the chronically online.",
  keywords: ["sarcasm", "funny shirts", "humor", "print on demand", "mugs", "stickers"],
  openGraph: {
    title: "SarcasmStack — Wearable Snark, Print on Demand",
    description: "Print-on-demand apparel and gear for the chronically sarcastic.",
    url: "https://sarcasmstack.io",
    siteName: "SarcasmStack",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SarcasmStack",
    description: "Wearable snark, print on demand.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${anton.variable} dark`}>
      <body className="min-h-screen bg-ink-950 font-sans text-zinc-100 antialiased">
        <CartProvider>
          <SiteHeader />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
