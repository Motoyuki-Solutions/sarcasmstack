import Link from "next/link";

const featured = [
  { id: 1, name: "Sarcasm Level: Expert", price: "$29.99", category: "Tees" },
  { id: 2, name: "I Adulted Today", price: "$34.99", category: "Hoodies" },
  { id: 3, name: "Error 404: Motivation Not Found", price: "$14.99", category: "Mugs" },
  { id: 4, name: "I Miss Pre-Internet Ignorance", price: "$29.99", category: "Tees" },
  { id: 5, name: "Running on Caffeine and Anxiety", price: "$34.99", category: "Hoodies" },
  { id: 6, name: "Professional Overthinker", price: "$14.99", category: "Mugs" },
];

const marqueeItems = [
  "FREE SHIPPING ON ORDERS OVER $75",
  "WEAR THE ATTITUDE",
  "SARCASM IS MY LOVE LANGUAGE",
  "NEW DROPS EVERY FRIDAY",
  "LIMITED EDITION DESIGNS",
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden py-32 px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950/80 via-neutral-950 to-neutral-950" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
            SarcasmStack
          </h1>
          <p className="mt-6 text-xl text-neutral-400">
            Wear the attitude. Bold designs for people who do not take themselves too seriously.
          </p>
          <Link
            href="/shop"
            className="mt-10 inline-block rounded-full bg-brand-600 px-8 py-3 text-sm font-semibold text-white hover:bg-brand-500 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <div className="border-y border-neutral-800 py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="mx-8 text-sm font-medium text-neutral-500 uppercase tracking-widest">
              {item}
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-2xl font-bold mb-8">Featured Picks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 hover:border-brand-600 transition-colors"
            >
              <div className="aspect-square rounded-lg bg-neutral-800 mb-4 flex items-center justify-center text-neutral-600">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold group-hover:text-brand-400 transition-colors">{product.name}</h3>
              <p className="text-sm text-neutral-500 mt-1">{product.category}</p>
              <p className="text-brand-400 font-bold mt-2">{product.price}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
