# SarcasmStack 🫦

> Print-on-demand apparel, drinkware, and stickers for people whose love language is sarcasm.

**sarcasmstack.io** — a Next.js storefront backed by the [Printify](https://printify.com) API, designed to deploy on Cloudflare. Built MVP-first: everything runs end-to-end with **zero external credentials** (mock mode), then flips to live Printify data the moment you set an API key.

---

## Stack

| Layer       | Choice                                                |
| ----------- | ----------------------------------------------------- |
| Framework   | Next.js 14 (App Router) + TypeScript + Tailwind CSS   |
| POD backend | Printify REST API (`Bearer` token auth)               |
| Deploy      | Cloudflare (Workers via `@opennextjs/cloudflare`)     |
| Repo        | `Motoyuki-Solutions/sarcasmstack`                     |
| Domain      | `sarcasmstack.io` (Cloudflare DNS)                    |

---

## Quick start

```bash
# 1. Install deps
npm install

# 2. (optional) configure env — works without any of this in mock mode
cp .env.example .env.local
#   edit .env.local only when you have a real Printify key

# 3. Run the dev server
npm run dev
#   → http://localhost:3000
```

That's it. With no env vars set, the storefront runs in **mock mode** — full UI, fake Printify data, demo checkout. The catalog, product pages, and design mockups all render.

---

## Environment variables

All optional for local dev. Copy `.env.example` → `.env.local`.

| Var                    | Required? | Description                                                                     |
| ---------------------- | --------- | ------------------------------------------------------------------------------- |
| `PRINTIFY_API_KEY`     | For live  | Personal Access Token from [Printify](https://printify.com/app/account/api).   |
| `PRINTIFY_SHOP_ID`     | For live  | The shop id orders/products are scoped to. Find via `GET /v1/shops.json`.       |
| `PRINTIFY_BLUEPRINT_IDS` | Optional | Comma list of blueprint ids to surface (defaults to curated set).               |
| `PRINTIFY_FORCE_MOCK`  | Optional  | `true` forces mock mode even when an API key is present.                        |
| `STRIPE_SECRET_KEY`    | For live  | Stripe secret **or restricted** key. Prefer a [restricted API key](https://docs.stripe.com/keys/restricted-api-keys) (`rk_test_…` / `rk_live_…`) over `sk_…` — least privilege. |
| `STRIPE_PUBLISHABLE_KEY` | For live | Stripe publishable key (`pk_test_…` / `pk_live_…`). Not read by the app's code today (checkout redirects via the session URL), but required by Stripe Dashboard tooling and reserved for future client-side use. |
| `STRIPE_WEBHOOK_SECRET` | For live  | Signing secret for the `/api/webhooks/stripe` endpoint (Stripe CLI or Dashboard). |
| `APP_ORIGIN`           | Optional  | Origin for Stripe success/cancel URLs (defaults to `http://localhost:3000`).    |

**Secrets handling:** store Stripe + Printify keys in a secrets vault (HashiCorp Vault) or your platform's secret store — never in the repo. For CI they're GitHub Actions secrets (`STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `PRINTIFY_API_KEY`). `scripts/check-no-secrets.mjs` is a pre-commit/CI guard that fails on `sk_`/`rk_`/`pk_`/`prt_` patterns in source.

**Mock mode** is active whenever `PRINTIFY_API_KEY` is unset OR `PRINTIFY_FORCE_MOCK=true`. The facade (`src/lib/printify/index.ts`) handles the switch — the rest of the app never branches on it. Stripe checkout similarly degrades to a demo flow when `STRIPE_SECRET_KEY` is unset.

---

## Project structure

```
sarcasmstack/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout (fonts, header, footer)
│   │   ├── page.tsx              # Landing page (hero + featured)
│   │   ├── shop/page.tsx         # Product catalog grid + filters
│   │   ├── product/[id]/page.tsx # Product detail + checkout CTA
│   │   ├── about/page.tsx        # "The Bit" brand page
│   │   ├── not-found.tsx         # 404
│   │   ├── globals.css           # Tailwind + theme
│   │   └── api/
│   │       ├── catalog/route.ts          # GET catalog (JSON)
│   │       ├── checkout/route.ts         # POST checkout handoff
│   │       └── design/[id]/svg/route.ts  # GET design as SVG image
│   ├── components/
│   │   ├── site-header.tsx
│   │   ├── site-footer.tsx
│   │   ├── product-card.tsx
│   │   ├── design-mockup.tsx     # SVG product mockups (tee/mug/sticker/tote)
│   │   ├── category-filter.tsx   # client component
│   │   └── checkout-button.tsx   # client component
│   ├── lib/
│   │   ├── printify/
│   │   │   ├── types.ts          # Printify API wire types
│   │   │   ├── client.ts         # live REST client
│   │   │   ├── mock.ts           # mock client (same interface)
│   │   │   ├── interface.ts      # shared IPrintifyClient
│   │   │   └── index.ts          # facade: getPrintifyClient(), isMockMode()
│   │   ├── catalog.ts            # storefront catalog service
│   │   ├── orders.ts             # Printify order flow (custom checkout)
│   │   └── design.ts             # design → SVG generator
│   ├── data/
│   │   └── catalog.ts            # designs + product types (the source of truth)
│   └── types.ts                  # storefront domain types
├── scripts/
│   └── sync-printify.mjs         # push local designs to Printify (scaffolded)
├── .github/workflows/ci.yml      # typecheck + build on push/PR
├── wrangler.jsonc                # OpenNext (primary) deploy config
├── wrangler.pages.toml           # legacy next-on-pages fallback config
├── open-next.config.ts           # OpenNext build config
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## The Printify integration

### Endpoints used

The client (`src/lib/printify/client.ts`) wraps the real Printify REST API. A note on the brief: it referenced `GET /v1/catalog/products`, but the **actual** catalog endpoint is `GET /v1/catalog/blueprints.json` (a "blueprint" is a product *type*). The client uses the correct endpoint.

| Resource      | Endpoint                                                     | Used for                |
| ------------- | ------------------------------------------------------------ | ----------------------- |
| Shops         | `GET /v1/shops.json`                                          | discover shop id        |
| Catalog       | `GET /v1/catalog/blueprints.json`                             | list product types      |
| Catalog       | `GET /v1/catalog/blueprints/{id}.json`                        | blueprint details       |
| Catalog       | `GET /v1/catalog/blueprints/{id}/print_providers.json`        | who can print it        |
| Catalog       | `GET /v1/catalog/blueprints/{id}/print_providers/{pid}/variants.json` | variant options |
| Products      | `POST /v1/shops/{shop_id}/products.json`                      | create a product        |
| Products      | `POST /v1/shops/{shop_id}/products/{pid}/publish.json`        | **publish** (separate!) |
| Orders        | `POST /v1/shops/{shop_id}/orders.json`                        | submit order on checkout|
| Uploads       | `POST /v1/uploads.json`                                       | push design image       |

Auth: `Authorization: Bearer <PRINTIFY_API_KEY>` on every request.

> **Gotcha:** creating a product does **not** publish it. You must call the publish endpoint separately. The sync script and client both account for this.

### Mock fallback

`MockPrintifyClient` (`src/lib/printify/mock.ts`) implements the exact same `IPrintifyClient` interface with canned data. The facade in `src/lib/printify/index.ts` returns the mock client whenever there's no API key. This means:

- The entire UI works with zero setup.
- API routes (`/api/catalog`, `/api/checkout`) respond with mock data.
- Flipping to live is literally one env var — no code changes.

### Getting your Printify shop set up (Dylan's manual step)

1. Create a Printify account at [printify.com](https://printify.com).
2. Create a shop inside Printify (any sales channel — Pop-Up Store is easiest for MVP).
3. Generate a **Personal Access Token**: Printify dashboard → *Connections* → *Personal access tokens*.
4. Put the token + shop id in `.env.local`:
   ```bash
   PRINTIFY_API_KEY=prt_...
   PRINTIFY_SHOP_ID=123456
   ```
5. To find your shop id programmatically: `curl -H "Authorization: Bearer $PRINTIFY_API_KEY" https://api.printify.com/v1/shops.json`

### Syncing designs to Printify

`scripts/sync-printify.mjs` is scaffolded to create one Printify product per design×product type. It's intentionally an outline because real product creation needs the design SVGs hosted at a public URL (Printify uploads accept a URL, not raw bytes). The production path:

1. Deploy the app so `/api/design/[id]/svg` is publicly reachable (e.g. `https://sarcasmstack.io/api/design/deadline/svg`).
2. Run the sync script with `PRINTIFY_API_KEY` + `PRINTIFY_SHOP_ID` set — it uploads each design URL, creates products against the right blueprint/provider/variant, and publishes them.
3. Capture the printed `catalogItemId → printifyProductId` mapping for the order flow.

---

## Checkout flow (Stripe → Printify)

API-only with Stripe — no Etsy, no Shopify. Full margin, full control.

```
Customer → Add to cart → /api/checkout (creates Stripe Checkout Session) → Stripe hosted payment
   → Stripe webhook: checkout.session.completed → /api/webhooks/stripe → Printify order created
```

- **`/api/checkout`** (`src/app/api/checkout/route.ts`, Node runtime): receives the cart `{ lines: [{ productId, variantId, quantity }] }`, resolves each against `src/data/catalog.ts`, creates a Stripe Checkout Session with line items + per-item metadata (productId, variantId, printifyProductId, blueprintId, printProviderId) and the whole cart in session metadata, then returns `{ url }`. The client redirects there.
- **`/api/webhooks/stripe`** (`src/app/api/webhooks/stripe/route.ts`, Node runtime): verifies the Stripe signature with `STRIPE_WEBHOOK_SECRET`, and on `checkout.session.completed` (payment_status `paid`) reads the cart from session metadata, maps Stripe's shipping address to Printify's format, and submits a Printify order via `src/lib/orders.ts` → `POST /v1/shops/{id}/orders.json`. Uses the Stripe session id as Printify `external_id` for reconciliation.
- **Cart** (`src/components/cart-context.tsx`): React context + `localStorage` persistence. Add/remove/quantity, slide-in drawer (`CartDrawer`) + a `/cart` page (`src/components/cart-view.tsx`).
- **Success page** (`/checkout/success`): clears the cart, confirms the order is printing.

### Local Stripe testing

```bash
# 1. Set test keys in .env.local — use the restricted key (rk_test_...) for STRIPE_SECRET_KEY
#    Vault: vault kv get -field=restricted-key secret/sarcasmstack/stripe-test-mode-api-keys
STRIPE_SECRET_KEY=rk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...   # reserved; redirect Checkout doesn't read it
APP_ORIGIN=http://localhost:3000

# 2. Forward webhooks to your local server (separate terminal)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
#   → it prints a whsec_... secret; put that in STRIPE_WEBHOOK_SECRET

# 3. Run the app
npm run dev
#   → add items to cart → checkout → use Stripe test card 4242 4242 4242 4242
#   → the webhook fires and creates a Printify order (mock if PRINTIFY_API_KEY unset)
```

### Production Stripe + webhook setup

1. In the Stripe Dashboard, create a webhook endpoint for `https://sarcasmstack.io/api/webhooks/stripe` listening to `checkout.session.completed`; copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
2. Set `STRIPE_SECRET_KEY` to a **restricted API key** (`rk_test_…` in test mode, `rk_live_…` at launch) — not a secret key (`sk_…`), per the stripe-best-practices skill. The restricted key needs at minimum these permissions: **Write → Checkout Sessions**, **Read → Checkout Sessions**, **Read → Events** (for webhook signature verification). Pull it from Vault at runtime (`vault kv get -field=restricted-key secret/sarcasmstack/stripe-test-mode-api-keys`) or set it as a GitHub Actions secret. Also set `STRIPE_PUBLISHABLE_KEY` (reserved — redirect Checkout doesn't read it, but Dashboard tooling expects it), `STRIPE_WEBHOOK_SECRET`, `PRINTIFY_API_KEY`, `PRINTIFY_SHOP_ID`, and `APP_ORIGIN=https://sarcasmstack.io` in your Cloudflare Pages/Workers environment.
3. Products are created in Printify as drafts (catalog carries the draft product ids). **Publish them in Printify before going live** so orders can be fulfilled. (`printifyVariantId` per size is `null` until the sync script resolves real variant ids — the order flow falls back to the default variant meanwhile.)

> **Checkout surface:** this is Stripe-hosted **redirect Checkout** (the backend creates a Checkout Session with the restricted key and the browser redirects to Stripe's hosted payment page). The publishable key / Stripe.js / embedded Payment Element are **not** used for the MVP — reserved for a later optimization. The restricted key is therefore the only key the app's backend reads.

---

## Deployment — Cloudflare

### Recommended: `@opennextjs/cloudflare` (Workers, Node.js runtime)

`@cloudflare/next-on-pages` is now **deprecated** by Cloudflare in favor of the [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare). OpenNext uses Next.js's Node.js runtime (full feature support: RSC, SSR, ISR, Server Actions, image optimization) rather than the constrained Edge runtime. This project ships **both** configs — OpenNext is the default.

```bash
# one-time: login to Cloudflare
npx wrangler login

# preview locally in the Workers runtime
npm run preview

# deploy to production
npm run deploy
```

`npm run deploy` runs `opennextjs-cloudflare build && opennextjs-cloudflare deploy` (defined in `package.json`). The build config is `open-next.config.ts`; the Worker config is `wrangler.jsonc` (with `nodejs_compat` + compatibility date `2024-09-23`).

### Alternative: `@cloudflare/next-on-pages` (Pages, Edge runtime)

If you prefer the Pages + Git-integration route, the fallback config is `wrangler.pages.toml`. In the Cloudflare dashboard: *Workers & Pages → Create → Pages → Connect to Git* → select the repo → Framework preset **Next.js** → build command `npx @cloudflare/next-on-pages@1` → output `.vercel/output/static` → add `nodejs_compat` compatibility flag.

> The primary `package.json` scripts target OpenNext. The next-on-pages path is kept as a documented fallback.

### GitHub Actions CI

`.github/workflows/ci.yml` runs typecheck + build on every push/PR (in mock mode, so no secrets needed). Add a deploy step (wrangler) once the Cloudflare account + `CLOUDFLARE_API_TOKEN` secret are configured.

### DNS: pointing `sarcasmstack.io` at Cloudflare

Once deployed, in the Cloudflare dashboard:

1. Add `sarcasmstack.io` as a custom domain on the Pages/Workers project.
2. Cloudflare auto-provisions the DNS records (since the domain is on Cloudflare DNS).
3. If the domain's nameservers aren't Cloudflare yet, update them at the registrar to Cloudflare's assigned nameservers first.

---

## Design assets

MVP designs are **text-based** — sarcastic quotes rendered as SVGs by `src/lib/design.ts`. Each design is a solid color plate + bold typography + a small brand mark. The same SVG is:

- embedded inline as product mockups (`DesignMockup` component), and
- served as a real image at `/api/design/[id]/svg` (print-ready, resolution-independent).

To add a design, edit `DESIGNS` in `src/data/catalog.ts` — give it an `id`, `quote`, colors, and tags. It automatically appears across all product types in the catalog. Real raster designs can drop in later by pointing `DesignMockup` at a `printifyMockupUrl`.

---

## Scripts

| Command              | What it does                                   |
| -------------------- | ----------------------------------------------- |
| `npm run dev`        | Next.js dev server                              |
| `npm run build`      | Production build                                |
| `npm run start`      | Serve the production build (Node)               |
| `npm run typecheck`  | `tsc --noEmit`                                  |
| `npm run lint`       | `next lint`                                     |
| `npm run preview`    | OpenNext: build + run locally in Workers runtime|
| `npm run deploy`     | OpenNext: build + deploy to Cloudflare          |
| `npm run cf-typegen` | generate `cloudflare-env.d.ts` from wrangler    |

---

## What's intentionally out of scope (MVP)

- ❌ Payment processing — Printify hosted checkout for MVP; Stripe later
- ❌ User accounts / auth
- ❌ Inventory management — POD has no inventory
- ❌ Analytics — add Plausible/Umami when needed
- ❌ Real design artwork — text/SVG placeholders now, real designs later

---

## License

Proprietary — © SarcasmStack.
