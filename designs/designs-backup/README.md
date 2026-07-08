# SarcasmStack — Design Source SVGs

35 approved designs rendered as **print-ready SVG source files** with transparent backgrounds, web-safe fonts, and correct Printify dimensions. Rasterize to PNG (with alpha) before uploading to Printify.

**Shop ID:** `28152719` · **Generated:** 2026-07-07

---

## What's inside

54 SVG files + `manifest.json`:

| Product  | Files | Dimensions          | Notes                                  |
| -------- | ----- | ------------------- | -------------------------------------- |
| tshirts  | 26    | 4500 × 5400 px      | 13 designs × front/back                |
| hoodies  | 6     | 4500 × 5400 px      | 3 designs × front/back                 |
| mugs     | 10    | 4500 × 2100 px      | wrap exterior + interior variants      |
| stickers | 8     | 3000 × 3000 px      | includes a 4-up sheet (#31)            |
| posters  | 3     | 4500 × 5400 px      | stages lists + cloud-journey circle    |
| other    | 1     | 3000 × 3000 px      | coaster 4-pack (#35)                   |

All backgrounds are **transparent** (no `<rect>` fill) unless a design intentionally uses solid color (none do here — every file is transparent for clean apparel printing).

## File naming

```
out/<product>/<NN>-<slug>-<variant>.svg
```

Variants: `front`, `back`, `exterior`, `interior`. Example: `out/tshirts/01-trained-replacement-front.svg`.

## Fonts

All text uses web-safe font stacks so they render identically in any rasterizer without embedding:
- Body/copy: `Arial, Helvetica, sans-serif` (weight 800–900)
- Display/impact: `Impact, Arial Black, sans-serif`

## Rasterize to PNG (with transparency) — required for Printify

Printify's `POST /v1/uploads/images.json` accepts a public URL or base64 PNG. Apparel needs **PNG with an alpha channel, ≥20% transparency**. Pick one:

```bash
# Option A: rsvg-convert (fast, high quality)
rsvg-convert -w 4500 -h 5400 --background-color=transparent \
  out/tshirts/01-trained-replacement-front.svg \
  -o png/tshirts/01-trained-replacement-front.png

# Option B: Inkscape (CLI)
inkscape out/tshirts/01-trained-replacement-front.svg \
  --export-type=png --export-filename=png/tshirts/01-trained-replacement-front.png \
  --export-width=4500 --export-height=5400

# Option C: cairosvg (Python)
pip install cairosvg
python -c "import cairosvg; cairosvg.svg2png(url='out/tshirts/01-trained-replacement-front.svg', write_to='png/tshirts/01-trained-replacement-front.png', output_width=4500, output_height=5400)"
```

Mug wraps rasterize at 4500×2100; stickers/posters at 3000×3000 (or keep poster aspect). The SVGs already carry the correct `width`/`height`/`viewBox`, so most tools infer dimensions automatically.

## Upload to Printify (drafts only — do NOT publish)

```bash
# 1. Upload the PNG (returns an image id)
curl -X POST https://api.printify.com/v1/uploads/images.json \
  -H "Authorization: Bearer $PRINTIFY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"file_name":"01-trained-replacement-front.png","contents":"<base64 png>"}'

# 2. Create the product as a DRAFT referencing the image id in print_areas
curl -X POST https://api.printify.com/v1/shops/28152719/products.json \
  -H "Authorization: Bearer $PRINTIFY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "blueprint_id": <tee blueprint>, "print_provider_id": <provider>, ... }'

# 3. Do NOT call /publish.json — leave as draft for review
```

The upload accepts a public URL instead of base64 too: `{"file_name":"...","url":"https://..."}`.

## Regenerating

```bash
node generate.mjs
```

Edits to copy/dimensions/colors go in `generate.mjs`. The script is deterministic — same input, same output.

## Notes / known rough edges

- The "production outage screenshot" on mug #17 interior is represented as stylized text (a literal screenshot isn't generated programmatically); swap in a real raster before final upload if you want a true screenshot look.
- The cloud-journey circle (#34) uses 7 nodes with arc arrows between them — renders cleanly at full size.
- Sticker #31 and coaster #35 are 4-up sheets; if you'd rather upload each panel as its own sticker, split them at the dashed guidelines.
