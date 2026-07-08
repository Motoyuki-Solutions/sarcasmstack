/**
 * Printify facade — resolves which client to use.
 *
 * Export a single `getPrintifyClient()` that returns:
 *   - the live `PrintifyClient` when PRINTIFY_API_KEY is set and not in forced
 *     mock mode, OR
 *   - the `MockPrintifyClient` otherwise.
 *
 * This is the ONLY import the rest of the app should use to reach Printify:
 *
 *   import { getPrintifyClient, isMockMode } from "@/lib/printify";
 */

import { PrintifyClient } from "./client";
import { MockPrintifyClient } from "./mock";
import type { IPrintifyClient } from "./interface";

/** True when the app should serve mock data instead of calling Printify. */
export function isMockMode(): boolean {
  const forceMock = readEnv("PRINTIFY_FORCE_MOCK");
  if (forceMock && forceMock.toLowerCase() === "true") return true;
  return !readEnv("PRINTIFY_API_KEY");
}

export function getPrintifyClient(): IPrintifyClient {
  if (isMockMode()) {
    return new MockPrintifyClient();
  }
  return new PrintifyClient({
    apiKey: readEnv("PRINTIFY_API_KEY") ?? "",
    shopId: readEnv("PRINTIFY_SHOP_ID"),
  });
}

/**
 * Read an env var in a way that works in both Node (process.env) and the
 * Cloudflare Workers runtime (where env is bound, not global). Next.js
 * surfaces server env via process.env on OpenNext, so this is enough for MVP.
 */
function readEnv(name: string): string | undefined {
  // process.env is populated for server components / route handlers.
  if (typeof process !== "undefined" && process.env) {
    return process.env[name];
  }
  return undefined;
}

export { PrintifyClient } from "./client";
export { MockPrintifyClient } from "./mock";
export type { IPrintifyClient } from "./interface";
export { PrintifyError } from "./client";
export type * from "./types";
