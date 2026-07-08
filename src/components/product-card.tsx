import Link from "next/link";
import { formatPrice } from "@/data/catalog";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const defaultVariant =
    product.variants.find((v) => v.id === product.defaultVariantId) ?? product.variants[0];
  const fromPrice = Math.min(...product.variants.map((v) => v.priceCents));
  const hasPriceRange = fromPrice !== defaultVariant.priceCents;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-ink-900 transition-all hover:border-accent/40 hover:shadow-[0_0_40px_-12px_rgba(255,59,107,0.4)]"
    >
      <div className="relative aspect-square overflow-hidden bg-ink-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageFront}
          alt={product.title}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-ink-950/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-300 backdrop-blur">
          {kindLabel(product.kind)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base leading-tight tracking-wide text-white">
          {product.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{product.tagline}</p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-mono text-sm font-bold text-white">
            {hasPriceRange ? "from " : ""}
            {formatPrice(fromPrice)}
          </span>
          <span className="rounded-md bg-accent px-3 py-1.5 text-xs font-bold text-ink-950 opacity-0 transition-opacity group-hover:opacity-100">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}

function kindLabel(kind: Product["kind"]): string {
  switch (kind) {
    case "tshirt":
      return "Tee";
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
