# SarcasmStack

A satirical print-on-demand storefront built with **Next.js 14 (App Router)**, **Tailwind CSS**, and the **Printify API**. Designed for deployment on **Cloudflare Pages** via `@opennextjs/cloudflare`.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in your Printify credentials
cp .env.example .env.local

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PRINTIFY_API_KEY` | No | Your Printify API access token |
| `PRINTIFY_SHOP_ID` | No | Your Printify shop ID |

When `PRINTIFY_API_KEY` is not set the app automatically uses a mock client that returns sample data - perfect for local development.

## Printify Sync

Fetch your Printify catalog into a local JSON file:

```bash
npm run sync-printify
```

This writes `data/catalog.json` with blueprints and providers.

## Cloudflare Deployment

```bash
# Build for Cloudflare
npm run pages:build

# Deploy to Cloudflare Pages
npm run pages:deploy
```

Set `PRINTIFY_API_KEY` and `PRINTIFY_SHOP_ID` as encrypted environment variables in your Cloudflare Pages project settings.

## Project Structure

```
src/
  app/
    layout.tsx          # Root layout (dark theme)
    page.tsx            # Landing page (hero, marquee, featured grid)
    shop/page.tsx       # Product grid with category filters
    product/[id]/       # SSG product detail + checkout CTA
    about/page.tsx      # Brand story
    not-found.tsx       # 404 page
    api/
      catalog/route.ts       # List products (edge)
      checkout/route.ts      # Create Printify order (edge)
      design/[id]/svg/       # Serve print-ready SVGs (edge)
  lib/
    printify/client.ts  # Printify API client (live + mock)
  globals.css           # Tailwind directives
```

## API Routes

All API routes run on the Edge Runtime.

| Endpoint | Method | Description |
|---|---|---|
| `/api/catalog` | GET | Returns the product catalog |
| `/api/checkout` | POST | Creates a Printify order |
| `/api/design/[id]/svg` | GET | Serves a design as print-ready SVG |

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **API**: Printify REST API v1
- **Deployment**: Cloudflare Pages via `@opennextjs/cloudflare`
- **CI**: GitHub Actions

## License

MIT
