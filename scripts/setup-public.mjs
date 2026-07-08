#!/usr/bin/env node
/**
 * Ensures public/designs points at the repo's /designs directory so the
 * catalog's /designs/png/... image paths resolve in dev + production.
 * Safe to run repeatedly. Uses a symlink when possible, copies as a fallback.
 */
import { existsSync, symlinkSync, lstatSync, mkdirSync, cpSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const publicDir = resolve(root, "public");
const target = resolve(root, "designs");
const link = resolve(publicDir, "designs");

mkdirSync(publicDir, { recursive: true });

if (!existsSync(target)) {
  console.warn("[setup-public] /designs not found — skipping (no designs to link).");
  process.exit(0);
}

// Already exists (link or dir)?
if (existsSync(link) || lstatSync(link + "").isSymbolicLink?.()) {
  // Replace a stale link/dir if it's not pointing at target.
  try {
    if (lstatSync(link).isSymbolicLink()) {
      // Good enough — leave it.
      process.exit(0);
    }
  } catch {
    // not a symlink; fall through to (re)create
  }
}

try {
  symlinkSync(target, link, "dir");
  console.log("[setup-public] linked public/designs -> ../designs");
} catch {
  // Symlinks unavailable (Windows non-admin, restricted fs): copy instead.
  cpSync(target, link, { recursive: true });
  console.log("[setup-public] copied designs/ -> public/designs/ (symlink unavailable)");
}
