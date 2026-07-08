import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your SarcasmStack cart.",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-display text-5xl tracking-tight text-white">CART</h1>
      <CartView />
    </div>
  );
}
