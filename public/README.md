# public/

Next.js serves files from this directory at the site root. Product design
PNGs live one level up in `/designs/png/`. To expose them at `/designs/png/...`
(as the catalog references them), link the designs dir in here:

```bash
ln -s ../designs public/designs
```

Run this once after cloning (it's idempotent). The catalog uses paths like
`/designs/png/tshirts/01-trained-replacement-front.png`, which then resolve
in both `next dev` and production builds.

On Windows (no symlinks), copy instead: `xcopy /E /I ..\designs public\designs`
(or use `mklink /D public\designs ..\designs` from an admin shell).
