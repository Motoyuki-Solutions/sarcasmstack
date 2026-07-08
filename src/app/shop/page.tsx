import type { Metadata } from "next";
import { productsByCategory, CATEGORY_FILTERS } from "@/data/catalog";
import { ProductCard } from "@/components/product-card";
import { CategoryFilter } from "@/components/category-filter";
import type { ProductCategory } from "@/types";

export const metadata: Metadata = {
  title: "Shop the Snark",
  description:
    "Browse every SarcasmStack design on tees, hoodies, mugs, stickers, and posters. Printed on demand.",
};

const VALID: (ProductCategory | "all")[] = ["all", "apparel", "drinkware", "accessories", "wall"];

interface ShopPageProps {
  searchParams: { category?: string };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const requested = searchParams?.category;
  const category: ProductCategory | "all" =
    requested && VALID.includes(requested as ProductCategory | "all")
      ? (requested as ProductCategory | "all")
      : "all";

  const items = productsByCategory(category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="font-display text-5xl tracking-tight text-white sm:text-6xl">
          THE COLLECTION
        </h1>
        <p className="mt-3 max-w-xl text-zinc-400">
          {items.length} {items.length === 1 ? "item" : "items"} of wearable
          commentary. Filter freely.
        </p>
      </header>

      <div className="mb-8">
        <CategoryFilter active={category} />
      </div>

      {items.length === 0 ? (
        <div className="grid place-items-center rounded-xl border border-dashed border-white/10 bg-ink-900/50 py-24 text-center">
          <p className="font-display text-2xl text-white">No snark here.</p>
          <p className="mt-2 text-sm text-zinc-500">
            Try a different category. Or lower your standards.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}
