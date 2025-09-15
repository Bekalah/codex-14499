# Cosmic Helix Renderer

Static offline canvas renderer for layered sacred geometry in Codex 144:99. Double-click `index.html` in any modern browser; no server or network calls.

## Files
- `index.html` — entry point with 1440×900 canvas and palette fallback.
Static offline canvas renderer for layered sacred geometry in Codex 144:99. Double-click `index.html` in any modern browser—no server or network needed.

## Files
- `index.html` – entry point with 1440×900 canvas and palette fallback.
- `js/helix-renderer.mjs` – ES module drawing the four layers.
- `data/palette.json` – optional ND-safe color palette.
Static offline canvas renderer for layered sacred geometry in Codex 144:99. Double-click `index.html` in any modern browser—no server or network calls.

## Files
- `index.html` – 1440×900 canvas with palette fallback.
- `js/helix-renderer.mjs` – pure ES module drawing functions.
- `data/palette.json` – optional ND-safe color palette.
- `index.html` — entry point with 1440×900 canvas and safe palette fallback.
- `js/helix-renderer.mjs` — ES module drawing the four layers.
- `data/palette.json` — optional ND-safe color palette.

## Layers
1. Vesica field
2. Tree-of-Life scaffold
3. Fibonacci curve
4. Static double-helix lattice

## ND-safe Design
- No motion or autoplay.
- Calm contrast and soft colors for readability.
- Geometry uses numerology constants 3, 7, 9, 11, 22, 33, 99, 144.
- Palette loads locally; if missing, safe defaults render instead.
- Palette loads locally; missing file triggers a safe fallback notice.

## Local Use
Open `index.html` directly in any modern browser.

## Tests
Run local checks:

```
npm test
npm run contrast
```

## Notes
ND-safe: calm contrast, no motion, optional palette override. Works completely offline; if `data/palette.json` is missing, a built-in fallback palette renders instead.
- Palette loads from `data/palette.json`; if missing, a safe fallback is used.

## Local Use
Open `index.html` directly in any modern browser.
