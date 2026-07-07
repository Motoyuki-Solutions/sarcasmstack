"use client";

import { useState } from "react";
import Link from "next/link";

const products = [
  { id: 1, name: "Sarcasm Level: Expert", price: "$29.99", category: "Tees" },
  { id: 2, name: "I Adulted Today", price: "$34.99", category: "Hoodies" },
  { id: 3, name: "Error 404: Motivation Not Found", price: "$14.99", category: "Mugs" },
  { id: 4, name: "I Miss Pre-Internet Ignorance", price: "$29.99", category: "Tees" },
  { id: 5, name: "Running on Caffeine and Anxiety", price: "$34.99", category: "Hoodies" },
  { id: 6, name: "Professional Overthinker", price: "$14.99", category: "Mugs" },
  { id: 7, name: "Dead Inside But Great at Parties", price: "$29.99", category: "Tees" },
  { id: 8, name: "I Have No Idea What I Am Doing", price: "$34.99", category: "Hoodies" },
];

const categories = ["All", "Tees", "Hoodies", "Mugs"];

export default function ShopPage() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">Shop</h1>
      <div className="flex gap-3 mb-10 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              active === cat
                ? "bg-brand-600 text-white"
                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 hover:border-brand-600 transition-colors"
          >
            <div className="aspect-square rounded-lg bg-neutral-800 mb-4 flex items-center justify-center text-neutral-600">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-sm group-hover:text-brand-400 transition-colors">{product.name}</h3>
            <p className="text-xs text-neutral-500 mt-1">{product.category}</p>
            <p className="text-brand-400 font-bold mt-2">{product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
