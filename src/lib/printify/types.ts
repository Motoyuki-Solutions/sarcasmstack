/**
 * Printify API type definitions.
 *
 * These mirror the shapes documented at https://developers.printify.com/
 * for the resources the SarcasmStack storefront uses:
 *   - Shop
 *   - Catalog blueprints + print providers + variants
 *   - Shop products
 *   - Orders
 *
 * Only the fields the storefront actually reads/writes are typed; the live
 * API returns additional metadata that we intentionally ignore.
 */

/* ------------------------------------------------------------------ */
/* Catalog                                                            */
/* ------------------------------------------------------------------ */

/** A blueprint = a product *type* in the Printify catalog (e.g. "Unisex T-Shirt"). */
export interface PrintifyBlueprint {
  id: number;
  title: string;
  description: string;
  brand: string;
  model: string;
  images?: string[];
}

/** A manufacturer that can fulfil a given blueprint. */
export interface PrintifyPrintProvider {
  id: number;
  title: string;
}

/** A single variant option row for a blueprint+provider combination. */
export interface PrintifyVariant {
  id: number;
  title: string;
  options: {
    color?: string;
    size?: string;
    [key: string]: string | undefined;
  };
  // Printify returns prices as integer cents in USD by default.
  price: number;
  is_enabled: boolean;
  image_url?: string;
}

export interface PrintifyShippingInfo {
  blueprint_id: number;
  print_provider_id: number;
  shipping_options: PrintifyShippingOption[];
}

export interface PrintifyShippingOption {
  id: number;
  title: string;
  countries: string[];
  first_item: { cost: number; currency: string };
  additional_item: { cost: number; currency: string };
}

/* ------------------------------------------------------------------ */
/* Shops                                                              */
/* ------------------------------------------------------------------ */

export interface PrintifyShop {
  id: number;
  title: string;
  sales_channel: string;
  currency: string;
}

/* ------------------------------------------------------------------ */
/* Shop products                                                      */
/* ------------------------------------------------------------------ */

export interface PrintifyProductImage {
  src: string;
  variant_ids?: number[];
  position?: string;
  is_default?: boolean;
}

export interface PrintifyProductVariant {
  id: number;
  title: string;
  options: {
    color?: string;
    size?: string;
    [key: string]: string | undefined;
  };
  sku?: string;
  cost: number;
  price: number;
  is_enabled: boolean;
  is_default?: boolean;
}

export interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  blueprint_id: number;
  print_provider_id: number;
  variants: PrintifyProductVariant[];
  images: PrintifyProductImage[];
  status: string;
  created_at: string;
  updated_at: string;
}

/** Payload to create a product in a Printify shop. */
export interface PrintifyCreateProductPayload {
  blueprint_id: number;
  print_provider_id: number;
  variants: Array<{ id: number; price: number }>;
  print_areas: Array<{
    variant_ids: number[];
    placeholders: Array<{
      position: string;
      images: Array<{
        src: string;
        scale: string;
        angle: number;
        x: number;
        y: number;
      }>;
    }>;
  }>;
  title?: string;
  description?: string;
  marketing_type?: "internal" | "external";
}

/* ------------------------------------------------------------------ */
/* Orders                                                             */
/* ------------------------------------------------------------------ */

export interface PrintifyOrderLineItem {
  product_id: string;
  variant_id: number;
  quantity: number;
  print_provider_id?: number;
  blueprint_id?: number;
}

export interface PrintifyOrderAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string;
  region: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
}

export interface PrintifyCreateOrderPayload {
  line_items: PrintifyOrderLineItem[];
  shipping_method?: string;
  send_shipping_notification?: boolean;
  address_to: PrintifyOrderAddress;
  is_printify_self_billing?: boolean;
  /** Optional external id (e.g. Stripe session id) for reconciliation. */
  external_id?: string;
}

export interface PrintifyOrder {
  id: string;
  status: string;
  total_price: number;
  total_shipping: number;
  total_tax: number;
  currency: string;
  line_items: PrintifyOrderLineItem[];
  address_to: PrintifyOrderAddress;
  created_at: string;
}

/* ------------------------------------------------------------------ */
/* Uploads                                                            */
/* ------------------------------------------------------------------ */

export interface PrintifyUploadRequest {
  file_name: string;
  url: string;
  type?: string;
}

export interface PrintifyUpload {
  id: number;
  file_name: string;
  url: string;
  created_at: string;
  mime_type: string;
  dimensions: { width: number; height: number };
}
