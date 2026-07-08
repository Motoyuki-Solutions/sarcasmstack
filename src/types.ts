/**
 * SarcasmStack domain types.
 *
 * Storefront's own model — decoupled from Printify's wire format
 * (src/lib/printify/types.ts) and from Stripe's. The catalog service and
 * cart both speak these types.
 */

export type ProductCategory = "apparel" | "drinkware" | "accessories" | "wall";

export type ProductKind = "tshirt" | "hoodie" | "mug" | "sticker" | "poster";

/** A single purchasable variant of a product (e.g. "2XL" size or "16x20" poster). */
export interface ProductVariant {
  /** Stable slug, e.g. "2xl", "16x20". */
  id: string;
  /** Human label, e.g. "2XL", "16\" x 20\"". */
  label: string;
  /** Price in USD cents. */
  priceCents: number;
  /**
   * The Printify variant id to send when creating an order for this variant.
   * Resolved at sync time (see scripts/sync-printify.mjs) and stored here so
   * the order flow doesn't need a live Printify lookup per checkout.
   * null for variants not yet synced.
   */
  printifyVariantId: number | null;
}

export interface Product {
  /** Stable slug, used in URLs + cart keys, e.g. "trained-replacement-tee". */
  id: string;
  title: string;
  /** Short one-liner shown on cards. */
  tagline: string;
  /** Longer description on the product page. */
  description: string;
  category: ProductCategory;
  kind: ProductKind;
  /** Printify blueprint id this product type maps to. */
  blueprintId: number;
  /** Printify print provider id. */
  printProviderId: number;
  /** Printify product id (the draft created in shop 28152719). */
  printifyProductId: string;
  /** Path (under /public or repo root) to the front design image. */
  imageFront: string;
  /** Path to the back design image, if the product has a back print. */
  imageBack?: string;
  /** Purchasable variants. At least one. */
  variants: ProductVariant[];
  /** Default variant id (selected on the PDP). */
  defaultVariantId: string;
  /** Pithy tags for filtering/search later. */
  tags: string[];
}

/** A cart line references a product + a specific variant + a quantity. */
export interface CartLine {
  productId: string;
  variantId: string;
  quantity: number;
}

/** Cart line hydrated with product info for display + checkout. */
export interface CartLineDetailed extends CartLine {
  product: Product;
  variant: ProductVariant;
  lineTotalCents: number;
}

export interface CategoryFilter {
  slug: ProductCategory | "all";
  label: string;
}
