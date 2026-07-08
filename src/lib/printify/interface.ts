/**
 * Shared Printify client interface.
 *
 * Both `PrintifyClient` (live) and `MockPrintifyClient` (mock) implement this.
 * The facade (./index.ts) returns whichever is appropriate so the rest of the
 * app depends only on this interface — never a concrete client.
 */

import type {
  PrintifyBlueprint,
  PrintifyCreateOrderPayload,
  PrintifyCreateProductPayload,
  PrintifyOrder,
  PrintifyProduct,
  PrintifyShop,
  PrintifyShippingInfo,
  PrintifyUpload,
  PrintifyUploadRequest,
  PrintifyVariant,
  PrintifyPrintProvider,
} from "./types";

export interface IPrintifyClient {
  readonly isMock?: boolean;

  // Shops
  listShops(): Promise<PrintifyShop[]>;

  // Catalog
  listBlueprints(): Promise<PrintifyBlueprint[]>;
  getBlueprint(blueprintId: number): Promise<PrintifyBlueprint>;
  listBlueprintProviders(blueprintId: number): Promise<PrintifyPrintProvider[]>;
  listVariants(
    blueprintId: number,
    printProviderId: number,
  ): Promise<PrintifyVariant[]>;
  getShippingInfo(
    blueprintId: number,
    printProviderId: number,
  ): Promise<PrintifyShippingInfo>;

  // Shop products
  listProducts(): Promise<PrintifyProduct[]>;
  createProduct(payload: PrintifyCreateProductPayload): Promise<PrintifyProduct>;
  publishProduct(productId: string): Promise<void>;

  // Orders
  listOrders(): Promise<PrintifyOrder[]>;
  createOrder(payload: PrintifyCreateOrderPayload): Promise<PrintifyOrder>;

  // Uploads
  upload(payload: PrintifyUploadRequest): Promise<PrintifyUpload>;
}
