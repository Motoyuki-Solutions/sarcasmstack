#!/usr/bin/env node
/**
 * Printify sync script — creates one Printify product per design×productType.
 *
 * Run after setting PRINTIFY_API_KEY and PRINTIFY_SHOP_ID:
 *
 *   node scripts/sync-printify.mjs
 *
 * NOTE: This is intentionally scaffolded, not fully wired. Real wiring needs:
 *   - A live PRINTIFY_API_KEY + shop id
 *   - The design SVGs hosted at a public URL (Printify uploads require a URL,
 *     not raw bytes). In production, serve them from sarcasmstack.io/api/design
 *     or push to an object store.
 *   - Resolved print_provider_id + variant ids per blueprint.
 *
 * The script is safe to run without env vars (it logs that it's a no-op).
 */

// Curated counts mirror src/data/catalog.ts. Kept inline (not imported) so this
// script runs under plain `node` without a TypeScript loader.
const DESIGN_COUNT = 6;
const PRODUCT_TYPE_COUNT = 4;

async function main() {
  const apiKey = process.env.PRINTIFY_API_KEY;
  const shopId = process.env.PRINTIFY_SHOP_ID;

  if (!apiKey || !shopId) {
    console.log(
      "⚠️  PRINTIFY_API_KEY / PRINTIFY_SHOP_ID not set. Sync is a no-op in mock mode.\n" +
        "   Set them in .env (see .env.example) and re-run to push designs to Printify.",
    );
    return;
  }

  const total = DESIGN_COUNT * PRODUCT_TYPE_COUNT;
  console.log("→ Syncing SarcasmStack catalog to Printify shop", shopId);
  console.log(`  designs: ${DESIGN_COUNT}  product types: ${PRODUCT_TYPE_COUNT}`);
  console.log(`  planned products: ${total}`);
  console.log("");

  // Pseudocode of the real flow — kept as a clear outline so wiring is trivial.
  // When implementing, use fetch against https://api.printify.com/v1 with the
  // Bearer token. See src/lib/printify/client.ts for the exact endpoint shapes.
  console.log("  [scaffold] For each design × product type:");
  console.log("        - upload design svg to /v1/uploads.json (needs public URL)");
  console.log("        - GET blueprints/{id}/print_providers.json → pick provider");
  console.log("        - GET .../variants.json → pick variant + set price");
  console.log("        - POST shops/{id}/products.json → create (draft)");
  console.log("        - POST shops/{id}/products/{pid}/publish.json → publish");
  console.log("");

  console.log("ℹ️  Full live wiring requires design SVGs hosted at a public URL.");
  console.log("   See README → Printify → Syncing products for the production setup.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
