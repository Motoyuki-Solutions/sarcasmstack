/**
 * Mock Printify client.
 *
 * Implements the same method surface as `PrintifyClient` but returns canned
 * data so the storefront can render end-to-end with zero external deps and
 * no API key. This is what runs in MOCK mode.
 *
 * The mock is intentionally small and realistic enough to exercise the UI
 * and the API route handlers. When you wire up a real Printify token, the
 * facade (src/lib/printify/index.ts) swaps this out for the live client
 * automatically.
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
import type { IPrintifyClient } from "./interface";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const MOCK_SHOPS: PrintifyShop[] = [
  {
    id: 101010,
    title: "SarcasmStack (mock)",
    sales_channel: "API",
    currency: "USD",
  },
];

const MOCK_BLUEPRINTS: PrintifyBlueprint[] = [
  {
    id: 145,
    title: "Unisex Heavyweight T-Shirt",
    description: "A durable, classic-fit heavyweight t-shirt.",
    brand: "Cotton Transcontinental",
    model: "Men's Crew Neck",
    images: [],
  },
  {
    id: 7,
    title: "Ceramic Mug",
    description: "11oz ceramic mug, dishwasher and microwave safe.",
    brand: "MyDream",
    model: "11oz",
    images: [],
  },
  {
    id: 1130,
    title: "Die-Cut Sticker",
    description: "Durable vinyl die-cut sticker.",
    brand: "Sticker Mule",
    model: "3x3",
    images: [],
  },
  {
    id: 244,
    title: "Heavy Cotton Tote Bag",
    description: "Natural canvas tote bag.",
    brand: "Axis",
    model: "15x16",
    images: [],
  },
];

export class MockPrintifyClient implements IPrintifyClient {
  readonly isMock = true as const;

  async listShops(): Promise<PrintifyShop[]> {
    await delay(60);
    return MOCK_SHOPS;
  }

  async listBlueprints(): Promise<PrintifyBlueprint[]> {
    await delay(80);
    return MOCK_BLUEPRINTS;
  }

  async getBlueprint(id: number): Promise<PrintifyBlueprint> {
    await delay(50);
    const bp = MOCK_BLUEPRINTS.find((b) => b.id === id);
    if (!bp) throw new Error(`Mock: blueprint ${id} not found`);
    return bp;
  }

  async listBlueprintProviders(blueprintId: number): Promise<PrintifyPrintProvider[]> {
    await delay(50);
    return [{ id: 2, title: "Mock Provider" }];
  }

  async listVariants(
    blueprintId: number,
    printProviderId: number,
  ): Promise<PrintifyVariant[]> {
    await delay(50);
    return [
      {
        id: blueprintId * 1000 + 1,
        title: "Default",
        options: { color: "Black", size: "M" },
        price: 1200,
        is_enabled: true,
      },
    ];
  }

  async getShippingInfo(
    blueprintId: number,
    printProviderId: number,
  ): Promise<PrintifyShippingInfo> {
    await delay(50);
    return {
      blueprint_id: blueprintId,
      print_provider_id: printProviderId,
      shipping_options: [
        {
          id: 1,
          title: "Standard Shipping",
          countries: ["US"],
          first_item: { cost: 399, currency: "USD" },
          additional_item: { cost: 99, currency: "USD" },
        },
      ],
    };
  }

  async listProducts(): Promise<PrintifyProduct[]> {
    await delay(80);
    return [];
  }

  async createProduct(
    payload: PrintifyCreateProductPayload,
  ): Promise<PrintifyProduct> {
    await delay(100);
    const now = new Date().toISOString();
    return {
      id: `mock_prod_${Date.now()}`,
      title: payload.title ?? "Untitled Mock Product",
      description: payload.description ?? "",
      blueprint_id: payload.blueprint_id,
      print_provider_id: payload.print_provider_id,
      variants: [],
      images: [],
      status: "draft",
      created_at: now,
      updated_at: now,
    };
  }

  async publishProduct(_productId: string): Promise<void> {
    await delay(60);
    // no-op in mock
  }

  async listOrders(): Promise<PrintifyOrder[]> {
    await delay(80);
    return [];
  }

  async createOrder(payload: PrintifyCreateOrderPayload): Promise<PrintifyOrder> {
    await delay(120);
    const now = new Date().toISOString();
    return {
      id: `mock_order_${Date.now()}`,
      status: "pending",
      total_price: payload.line_items.reduce((s, i) => s + i.quantity * 2400, 0),
      total_shipping: 399,
      total_tax: 0,
      currency: "USD",
      line_items: payload.line_items,
      address_to: payload.address_to,
      created_at: now,
    };
  }

  async upload(payload: PrintifyUploadRequest): Promise<PrintifyUpload> {
    await delay(80);
    return {
      id: Math.floor(Math.random() * 1_000_000),
      file_name: payload.file_name,
      url: payload.url,
      created_at: new Date().toISOString(),
      mime_type: "image/png",
      dimensions: { width: 4500, height: 5400 },
    };
  }
}
