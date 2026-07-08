"use client";

import { useState } from "react";
import { useCart } from "./cart-context";
import type { Product, ProductVariant } from "@/types";
import { formatPrice } from "@/data/catalog";

interface AddToCartButtonProps {
  product: Product;
  variant: ProductVariant;
  /** Open the cart drawer after adding (handled by parent via callback). */
  onAdded?: () => void;
}

export function AddToCartButton({ product, variant, onAdded }: AddToCartButtonProps) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    add(product.id, variant.id, 1);
    setJustAdded(true);
    onAdded?.();
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="group inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-8 py-4 font-display text-lg tracking-wide text-ink-950 transition-all hover:bg-accent-soft"
    >
      {justAdded ? "ADDED ✓" : `ADD TO CART · ${formatPrice(variant.priceCents)}`}
    </button>
  );
}
