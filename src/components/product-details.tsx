"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product, ProductVariant } from "@/types";
import { formatPrice } from "@/data/catalog";
import { AddToCartButton } from "./add-to-cart-button";

/**
 * Client-side product detail: variant picker, image (front/back toggle),
 * add-to-cart, and "view cart / checkout" affordance. The parent server
 * component fetches the Product and passes it down.
 */
export function ProductDetails({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.defaultVariantId);
  const [showBack, setShowBack] = useState(false);
  const variant: ProductVariant =
    product.variants.find((v) => v.id === variantId) ?? product.variants[0];

  const hasMultipleVariants = product.variants.length > 1;
  const isApparel = product.kind === "tshirt" || product.kind === "hoodie";

  return (
    <div className="grid gap-10 md:grid-cols-2">
      {/* Image */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
        <div className="relative aspect-square">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={showBack && product.imageBack ? product.imageBack : product.imageFront}
            alt={`${product.title} — ${showBack ? "back" : "front"} design`}
            className="h-full w-full object-contain"
          />
        </div>
        {product.imageBack && (
          <div className="absolute bottom-3 right-3 flex gap-1 rounded-lg bg-ink-950/80 p-1 backdrop-blur">
            <ToggleButton active={!showBack} onClick={() => setShowBack(false)}>
              Front
            </ToggleButton>
            <ToggleButton active={showBack} onClick={() => setShowBack(true)}>
              Back
            </ToggleButton>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">
          {kindLabel(product.kind)}
        </span>
        <h1 className="mt-2 font-display text-3xl leading-tight tracking-tight text-white sm:text-4xl">
          {product.title}
        </h1>
        <p className="mt-3 text-zinc-400">{product.tagline}</p>

        <p className="mt-4 font-mono text-2xl font-bold text-white">
          {formatPrice(variant.priceCents)}
        </p>

        <p className="mt-4 text-sm leading-relaxed text-zinc-400">{product.description}</p>

        {hasMultipleVariants && (
          <div className="mt-6">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              {isApparel ? "Size" : "Variant"}
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariantId(v.id)}
                  aria-pressed={v.id === variantId}
                  className={
                    "min-w-11 rounded-md border px-3 py-2 text-sm font-bold transition-all " +
                    (v.id === variantId
                      ? "border-accent bg-accent text-ink-950"
                      : "border-white/15 bg-ink-900 text-zinc-300 hover:border-white/40 hover:text-white")
                  }
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <AddToCartButton product={product} variant={variant} />
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-zinc-500">Fulfilled by</dt>
            <dd className="mt-1 font-medium text-white">Printify network</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Made to order</dt>
            <dd className="mt-1 font-medium text-white">Ships in 3–7 days</dd>
          </div>
        </dl>

        <p className="mt-4 text-xs text-zinc-600">
          Printed on demand. No inventory, no waste, no refunds on hurt feelings.
        </p>

        <Link
          href="/shop"
          className="mt-6 text-sm font-bold text-accent hover:text-accent-soft"
        >
          ← Back to shop
        </Link>
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-md px-3 py-1 text-xs font-bold transition-colors " +
        (active ? "bg-white text-ink-950" : "text-zinc-400 hover:text-white")
      }
    >
      {children}
    </button>
  );
}

function kindLabel(kind: Product["kind"]): string {
  switch (kind) {
    case "tshirt":
      return "T-Shirt";
    case "hoodie":
      return "Hoodie";
    case "mug":
      return "Mug";
    case "sticker":
      return "Sticker";
    case "poster":
      return "Poster";
  }
}
