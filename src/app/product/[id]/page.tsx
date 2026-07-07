import Link from "next/link";

const products: Record<string, { name: string; price: string; category: string; description: string }> = {
  "1": { name: "Sarcasm Level: Expert", price: "$29.99", category: "Tees", description: "Let the world know you have elevated sarcasm to an art form. Premium cotton, sharp wit included." },
  "2": { name: "I Adulted Today", price: "$34.99", category: "Hoodies", description: "For those days when you managed to pay bills AND do laundry. You deserve this hoodie." },
  "3": { name: "Error 404: Motivation Not Found", price: "$14.99", category: "Mugs", description: "Start every morning with a reminder that it is okay to not have it all figured out." },
  "4": { name: "I Miss Pre-Internet Ignorance", price: "$29.99", category: "Tees", description: "A nostalgic tee for those who remember when arguing required leaving the house." },
  "5": { name: "Running on Caffeine and Anxiety", price: "$34.99", category: "Hoodies", description: "The unofficial uniform of anyone who works in tech. Ultra-soft fleece blend." },
  "6": { name: "Professional Overthinker", price: "$14.99", category: "Mugs", description: "Finally, a job title that accurately describes what you do all day." },
};

export function generateStaticParams() {
  return Object.keys(products).map((id) => ({ id }));
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products[params.id];

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-32 text-center">
        <h1 className="text-4xl font-bold">Product Not Found</h1>
        <p className="mt-4 text-neutral-400">This product does not exist or has been removed.</p>
        <Link href="/shop" className="mt-8 inline-block text-brand-400 hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <Link href="/shop" className="text-sm text-neutral-500 hover:text-white transition-colors">
        Back to Shop
      </Link>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square rounded-2xl bg-neutral-800 flex items-center justify-center text-neutral-600">
          <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <div>
          <p className="text-sm text-brand-400 uppercase tracking-wider">{product.category}</p>
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          <p className="mt-2 text-2xl font-bold text-brand-400">{product.price}</p>
          <p className="mt-6 text-neutral-400 leading-relaxed">{product.description}</p>

          <button className="mt-10 w-full rounded-full bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-500 transition-colors">
            Add to Cart
          </button>

          <ul className="mt-8 space-y-2 text-sm text-neutral-500">
            <li>Printed on demand via Printify</li>
            <li>Ships in 3-7 business days</li>
            <li>30-day returns</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
