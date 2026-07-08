#!/usr/bin/env node
/**
 * Pre-commit / CI guard against accidentally committed Stripe (and Printify)
 * secret keys. Fails if it finds a live-looking key pattern in staged source.
 *
 * Wire as a git pre-commit hook:
 *   cp scripts/check-no-secrets.mjs .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
 * Or run in CI: `node scripts/check-no-secrets.mjs`.
 *
 * Scans for: sk_live_*, sk_test_*, rk_live_*, rk_test_*, pk_live_*, prt_* (Printify PAT).
 * Allows .env.example placeholders (empty values) and obviously-fake sample strings.
 */
import { execSync } from "node:child_process";

const PATTERNS = [
  { re: /sk_(live|test)_[A-Za-z0-9]{20,}/, label: "Stripe secret key" },
  { re: /rk_(live|test)_[A-Za-z0-9]{20,}/, label: "Stripe restricted key" },
  { re: /pk_(live|test)_[A-Za-z0-9]{20,}/, label: "Stripe publishable key" },
  { re: /prt_[A-Za-z0-9]{30,}/, label: "Printify personal access token" },
];

// Get staged files (CI mode: scan tracked files instead).
let files;
try {
  files = execSync("git diff --cached --name-only --diff-filter=ACM", { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
} catch {
  files = execSync("git ls-files", { encoding: "utf8" }).split("\n").filter(Boolean);
}

// Only scan source-ish files; skip lockfiles, the hook itself, .env.example.
const scanable = files.filter(
  (f) =>
    /\.(ts|tsx|js|mjs|json|md|yml|yaml|toml|env)$/i.test(f) &&
    !f.endsWith(".env.example") &&
    !f.endsWith("package-lock.json") &&
    !f.endsWith("check-no-secrets.mjs"),
);

let hits = 0;
for (const f of scanable) {
  let content;
  try {
    content = require("node:fs").readFileSync(f, "utf8");
  } catch {
    continue;
  }
  for (const { re, label } of PATTERNS) {
    const m = content.match(re);
    if (m) {
      console.error(`✗ ${f}: possible ${label} found (${m[0].slice(0, 12)}…)`);
      hits++;
    }
  }
}

if (hits > 0) {
  console.error(`\n✗ Refusing commit: ${hits} potential secret(s) detected.`);
  console.error("  Store keys in Vault / GitHub Actions secrets, not the repo.");
  process.exit(1);
}
console.log("✓ no secret keys detected in staged source");
