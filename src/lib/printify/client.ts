/**
 * Printify REST API client.
 *
 * Wraps the endpoints documented at https://developers.printify.com/ that the
 * SarcasmStack storefront needs:
 *
 *   Shops:
 *     GET /v1/shops.json
 *
 *   Catalog (read-only product catalog of *types* Printify can print):
 *     GET /v1/catalog/blueprints.json
 *     GET /v1/catalog/blueprints/{id}.json
 *     GET /v1/catalog/blueprints/{id}/print_providers.json
 *     GET /v1/catalog/blueprints/{id}/print_providers/{pid}/variants.json
 *     GET /v1/catalog/blueprints/{id}/print_providers/{pid}/shipping.json
 *
 *   Shop products (products created in *this* shop):
 *     GET    /v1/shops/{shop_id}/products.json
 *     POST   /v1/shops/{shop_id}/products.json            (create)
 *     POST   /v1/shops/{shop_id}/products/{pid}/publish.json (publish — separate step!)
 *
 *   Orders:
 *     GET  /v1/shops/{shop_id}/orders.json
 *     POST /v1/shops/{shop_id}/orders.json                (create order on checkout)
 *
 *   Uploads:
 *     POST /v1/uploads.json                               (push a design image)
 *
 * Auth: Personal Access Token sent as `Authorization: Bearer <token>`.
 *
 * NOTE on the brief: the brief references `GET /v1/catalog/products`, but the
 * real endpoint is `GET /v1/catalog/blueprints.json` (a "blueprint" is a
 * product *type*). The client uses the correct endpoint.
 */

import type {
  PrintifyBlueprint,
  PrintifyCreateOrderPayload,
  PrintifyCreateProductPayload,
  PrintifyOrder,
  PrintifyPrintProvider,
  PrintifyProduct,
  PrintifyShop,
  PrintifyShippingInfo,
  PrintifyUpload,
  PrintifyUploadRequest,
  PrintifyVariant,
} from "./types";
import type { IPrintifyClient } from "./interface";

const PRINTIFY_BASE = "https://api.printify.com/v1";

export class PrintifyError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(message);
    this.name = "PrintifyError";
  }
}

export interface PrintifyClientOptions {
  apiKey: string;
  shopId?: string;
  /** Override base URL (testing). */
  baseUrl?: string;
  /** Fetch implementation (testing / edge injection). */
  fetchImpl?: typeof fetch;
}

export class PrintifyClient implements IPrintifyClient {
  private readonly apiKey: string;
  private readonly shopId?: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: PrintifyClientOptions) {
    if (!options.apiKey) {
      throw new PrintifyError("PrintifyClient requires an apiKey", 0, null);
    }
    this.apiKey = options.apiKey;
    this.shopId = options.shopId;
    this.baseUrl = options.baseUrl ?? PRINTIFY_BASE;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  /* -------------------------------------------------------------- */
  /* Internal request helper                                        */
  /* -------------------------------------------------------------- */

  private async request<T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      ...(init.headers as Record<string, string> | undefined),
    };

    const res = await this.fetchImpl(url, { ...init, headers });

    if (!res.ok) {
      let body: unknown = null;
      try {
        body = await res.json();
      } catch {
        try {
          body = await res.text();
        } catch {
          /* ignore */
        }
      }
      throw new PrintifyError(
        `Printify API ${init.method ?? "GET"} ${path} failed: ${res.status} ${res.statusText}`,
        res.status,
        body,
      );
    }

    // Some endpoints (publish) return 200 with empty body.
    if (res.status === 204) return undefined as T;
    const text = await res.text();
    if (!text) return undefined as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  }

  private requireShopId(): string {
    if (!this.shopId) {
      throw new PrintifyError(
        "This call requires a shopId. Set PRINTIFY_SHOP_ID or pass shopId to the client.",
        0,
        null,
      );
    }
    return this.shopId;
  }

  /* -------------------------------------------------------------- */
  /* Shops                                                          */
  /* -------------------------------------------------------------- */

  /** List shops available to this token. Use this to discover your shopId. */
  listShops(): Promise<PrintifyShop[]> {
    return this.request<PrintifyShop[]>("/shops.json");
  }

  /* -------------------------------------------------------------- */
  /* Catalog (read-only blueprints / providers / variants)          */
  /* -------------------------------------------------------------- */

  listBlueprints(): Promise<PrintifyBlueprint[]> {
    return this.request<PrintifyBlueprint[]>("/catalog/blueprints.json");
  }

  getBlueprint(blueprintId: number): Promise<PrintifyBlueprint> {
    return this.request<PrintifyBlueprint>(
      `/catalog/blueprints/${blueprintId}.json`,
    );
  }

  listBlueprintProviders(blueprintId: number): Promise<PrintifyPrintProvider[]> {
    return this.request<PrintifyPrintProvider[]>(
      `/catalog/blueprints/${blueprintId}/print_providers.json`,
    );
  }

  listVariants(
    blueprintId: number,
    printProviderId: number,
  ): Promise<PrintifyVariant[]> {
    return this.request<PrintifyVariant[]>(
      `/catalog/blueprints/${blueprintId}/print_providers/${printProviderId}/variants.json`,
    );
  }

  getShippingInfo(
    blueprintId: number,
    printProviderId: number,
  ): Promise<PrintifyShippingInfo> {
    return this.request<PrintifyShippingInfo>(
      `/catalog/blueprints/${blueprintId}/print_providers/${printProviderId}/shipping.json`,
    );
  }

  /* -------------------------------------------------------------- */
  /* Shop products                                                  */
  /* -------------------------------------------------------------- */

  listProducts(): Promise<PrintifyProduct[]> {
    return this.request<PrintifyProduct[]>(
      `/shops/${this.requireShopId()}/products.json`,
    );
  }

  /** Create a product in the shop. Remember: creation does NOT publish it. */
  createProduct(payload: PrintifyCreateProductPayload): Promise<PrintifyProduct> {
    return this.request<PrintifyProduct>(
      `/shops/${this.requireShopId()}/products.json`,
      { method: "POST", body: JSON.stringify(payload) },
    );
  }

  /**
   * Publish a previously-created product so it appears in connected sales
   * channels. Must be called AFTER createProduct.
   */
  publishProduct(productId: string): Promise<void> {
    return this.request<void>(
      `/shops/${this.requireShopId()}/products/${productId}/publish.json`,
      { method: "POST", body: JSON.stringify({}) },
    );
  }

  /* -------------------------------------------------------------- */
  /* Orders                                                         */
  /* -------------------------------------------------------------- */

  listOrders(): Promise<PrintifyOrder[]> {
    return this.request<PrintifyOrder[]>(
      `/shops/${this.requireShopId()}/orders.json`,
    );
  }

  /** Submit an order to Printify for fulfilment (custom checkout flow). */
  createOrder(payload: PrintifyCreateOrderPayload): Promise<PrintifyOrder> {
    return this.request<PrintifyOrder>(
      `/shops/${this.requireShopId()}/orders.json`,
      { method: "POST", body: JSON.stringify(payload) },
    );
  }

  /* -------------------------------------------------------------- */
  /* Uploads (design images)                                        */
  /* -------------------------------------------------------------- */

  /** Upload a design image (by URL) to the merchant's media library. */
  upload(payload: PrintifyUploadRequest): Promise<PrintifyUpload> {
    return this.request<PrintifyUpload>("/uploads.json", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}
