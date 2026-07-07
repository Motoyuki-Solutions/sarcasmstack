#!/usr/bin/env node

/**
 * sync-printify.mjs
 *
 * Fetches your Printify catalog (blueprints + providers) and writes
 * the result to data/catalog.json for local development or static builds.
 *
 * Usage:
 *   PRINTIFY_API_KEY=xxx node sync-printify.mjs
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_BASE = "https://api.printify.com/v1";
const API_KEY = process.env.PRINTIFY_API_KEY;

if (!API_KEY) {
  console.error("PRINTIFY_API_KEY is not set. Export it and try again.");
  process.exit(1);
}

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`Printify ${path} -> ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function main() {
  console.log("Fetching Printify blueprints...");
  const blueprints = await apiFetch("/catalog/blueprints.json");

  console.log(`   Found ${blueprints.length} blueprints. Fetching providers...`);
  const enriched = [];

  for (const bp of blueprints) {
    try {
      const providers = await apiFetch(
        `/catalog/blueprints/${bp.id}/providers.json`
      );
      enriched.push({ ...bp, providers });
    } catch (err) {
      console.warn(`   Skipping blueprint ${bp.id}: ${err.message}`);
      enriched.push({ ...bp, providers: [] });
    }
  }

  const outDir = join(__dirname, "data");
  const outFile = join(outDir, "catalog.json");

  await mkdir(outDir, { recursive: true });
  await writeFile(outFile, JSON.stringify(enriched, null, 2));

  console.log(`Wrote ${enriched.length} blueprints -> ${outFile}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
