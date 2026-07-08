/**
 * GET /api/catalog
 *
 * Returns the storefront catalog (optionally filtered by ?category=),
 * sourced directly from src/data/catalog.ts. Reports mock mode so callers can
 * tell live from demo.
 */

import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS, productsByCategory } from "@/data/catalog";
import { isMockMode } from "@/lib/printify";
import type { ProductCategory } from "@/types";

export const runtime = "edge";

const VALID: (ProductCategory | "all")[] = [
  "all",
  "apparel",
  "drinkware",
  "accessories",
  "wall",
];

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const cat: ProductCategory | "all" =
    category && VALID.includes(category as ProductCategory | "all")
      ? (category as ProductCategory | "all")
      : "all";

  const items = cat === "all" ? PRODUCTS : productsByCategory(cat);
  return NextResponse.json({
    mock: isMockMode(),
    category: cat,
    count: items.length,
    items,
  });
}
