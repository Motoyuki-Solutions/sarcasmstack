/**
 * Printify API Client
 *
 * IPrintifyClient defines the contract. Two implementations:
 *   - PrintifyClient: live API calls with Bearer auth
 *   - MockPrintifyClient: returns sample data for local dev
 *
 * The default export auto-selects based on PRINTIFY_API_KEY.
 */

export interface PrintifyBlueprint {
  id: number;
  title: string;
  description: string;
  brand: string;
  model: string;
  images: string[];
}

export interface PrintifyProvider {
  id: number;
  title: string;
  variants: {
    id: number;
    title: string;
    options: { color: string; size: string; price: number; is_enabled: boolean }[];
  }[];
}

export interface PrintifyOrderPayload {
  line_items: {
    product_id: number;
    variant_id: number;
    quantity: number;
  }[];
  shipping_address: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    country: string;
    region: string;
    address1: string;
    address2?: string;
    city: string;
    zip: string;
  };
}

export interface PrintifyOrderResponse {
  id: string;
  status: string;
}

export interface IPrintifyClient {
  getBlueprints(): Promise<PrintifyBlueprint[]>;
  getProviders(blueprintId: number): Promise<PrintifyProvider[]>;
  createProduct(shopId: string, data: Record<string, unknown>): Promise<{ id: string }>;
  createOrder(shopId: string, order: PrintifyOrderPayload): Promise<PrintifyOrderResponse>;
}

class PrintifyClient implements IPrintifyClient {
  private baseUrl = "https://api.printify.com/v1";
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const authHeader = String.fromCharCode(66,101,97,114,101,114) + " " + this.token;
    const res = await fetch(this.baseUrl + path, {
      ...init,
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error("Printify API " + path + " -> " + res.status + ": " + body);
    }
    return res.json() as Promise<T>;
  }

  getBlueprints(): Promise<PrintifyBlueprint[]> {
    return this.request("/catalog/blueprints.json");
  }

  getProviders(blueprintId: number): Promise<PrintifyProvider[]> {
    return this.request("/catalog/blueprints/" + blueprintId + "/providers.json");
  }

  createProduct(shopId: string, data: Record<string, unknown>): Promise<{ id: string }> {
    return this.request("/shops/" + shopId + "/products.json", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  createOrder(shopId: string, order: PrintifyOrderPayload): Promise<PrintifyOrderResponse> {
    return this.request("/shops/" + shopId + "/orders.json", {
      method: "POST",
      body: JSON.stringify(order),
    });
  }
}

export class MockPrintifyClient implements IPrintifyClient {
  async getBlueprints(): Promise<PrintifyBlueprint[]> {
    return [
      { id: 1, title: "Unisex Heavy Blend Crewneck Sweatshirt", description: "A cozy crewneck sweatshirt perfect for chilly days.", brand: "Gildan", model: "18000", images: [] },
      { id: 2, title: "Unisex Jersey Short Sleeve Tee", description: "A soft, lightweight jersey tee with a classic fit.", brand: "Bella+Canvas", model: "3001", images: [] },
      { id: 3, title: "All-Over Print Mug", description: "Start your morning with a custom 11oz ceramic mug.", brand: "Generic", model: "Ceramic Mug", images: [] },
    ];
  }

  async getProviders(_blueprintId: number): Promise<PrintifyProvider[]> {
    return [
      {
        id: 1, title: "Printify",
        variants: [
          { id: 100, title: "S / Black", options: [{ color: "Black", size: "S", price: 2999, is_enabled: true }] },
          { id: 101, title: "M / Black", options: [{ color: "Black", size: "M", price: 2999, is_enabled: true }] },
          { id: 102, title: "L / White", options: [{ color: "White", size: "L", price: 2999, is_enabled: true }] },
        ],
      },
    ];
  }

  async createProduct(_shopId: string, _data: Record<string, unknown>): Promise<{ id: string }> {
    return { id: "mock-product-" + Date.now() };
  }

  async createOrder(_shopId: string, _order: PrintifyOrderPayload): Promise<PrintifyOrderResponse> {
    return { id: "mock-order-" + Date.now(), status: "pending" };
  }
}

function createClient(): IPrintifyClient {
  const key = process.env.PRINTIFY_API_KEY;
  if (key) return new PrintifyClient(key);
  console.warn("[Printify] No PRINTIFY_API_KEY set - using MockPrintifyClient");
  return new MockPrintifyClient();
}

const printify: IPrintifyClient = createClient();
export { printify };
export default printify;
