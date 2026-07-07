export const runtime = "edge";

import { NextResponse } from "next/server";

const mockCatalog = [
  { id: 1, title: "Sarcasm Level: Expert", category: "Tees", price: 2999, description: "Premium cotton tee with sharp wit included." },
  { id: 2, title: "I Adulted Today", category: "Hoodies", price: 3499, description: "Ultra-soft fleece blend for accomplished adults." },
  { id: 3, title: "Error 404: Motivation Not Found", category: "Mugs", price: 1499, description: "11oz ceramic mug for Monday mornings." },
  { id: 4, title: "I Miss Pre-Internet Ignorance", category: "Tees", price: 2999, description: "Nostalgia on premium cotton." },
  { id: 5, title: "Running on Caffeine and Anxiety", category: "Hoodies", price: 3499, description: "Tech industry uniform." },
  { id: 6, title: "Professional Overthinker", category: "Mugs", price: 1499, description: "Your official job title mug." },
];

export async function GET() {
  const apiKey = process.env.PRINTIFY_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch("https://api.printify.com/v1/catalog/blueprints.json", {
        headers: {
          Authorization: "Bearer " + apiKey,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Printify API error: " + res.status);
      }

      const blueprints = await res.json();
      return NextResponse.json({ source: "printify", data: blueprints });
    } catch {
      // Fall through to mock
    }
  }

  return NextResponse.json({ source: "mock", data: mockCatalog });
}
