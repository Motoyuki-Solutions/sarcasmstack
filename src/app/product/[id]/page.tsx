import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, getProduct, productsByCategory, formatPrice } from "@/data/catalog";
import { ProductDetails } from "@/components/product-details";
import { ProductCard } from "@/components/product-card";

interface ProductPageProps {
  params: { id: string };
}

// Pre-render every product at build time.
export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getProduct(params.id);
  if (!product) return { title: "Not found" };
  return {
    title: product.title,
    description: product.tagline,
    openGraph: { images: [product.imageFront] },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = getProduct(params.id);
  if (!product) notFound();

  // Related: same category, exclude self, up to 4.
  const related = productsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <ProductDetails product={product} />

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl tracking-wide text-white">
            MORE {product.category.toUpperCase()}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.id} product={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
