# Cosmic Helix Renderer

Static offline canvas renderer for layered sacred geometry in Codex 144:99. Double-click `index.html` in any modern browser—no server or network calls.
Static offline canvas renderer for layered sacred geometry in Codex 144:99.
Double-click `index.html` in any modern browser—no server or network calls.
Static offline canvas renderer for the Codex 144:99 geometry helix. Double-click `index.html` in any modern browser—no server or network calls.

## Files
- `index.html` – entry point with 1440×900 canvas and safe palette fallback.
- `js/helix-renderer.mjs` – ES module with pure drawing functions.
- `data/palette.json` – optional ND-safe color palette.

## Layers
1. Vesica field
2. Tree-of-Life scaffold
3. Fibonacci curve
4. Static double-helix lattice

## ND-safe Design
- No motion or autoplay; static canvas only.
- Calming contrast and soft colors for readability.
- Geometry uses numerology constants 3, 7, 9, 11, 22, 33, 99, 144.
- Palette and constants load from local JSON; if missing, safe defaults are used.

## Customization
- Edit `data/palette.json` to change colors.
- Optionally add `data/constants.json` with numerology values to tweak proportions.
- Geometry uses constants 3, 7, 9, 11, 22, 33, 99, 144.
- Palette loads locally; if missing, a built-in fallback is used.
- Geometry uses constants 3, 7, 9, 11, 22, 33, 99, 144.
- If `data/palette.json` is missing, a built-in fallback palette renders instead.

## Local Use
Open `index.html` directly in any modern browser.

## Tests
Run local checks:

```sh
npm test
npm run contrast
```

## Notes
- ND-safe: calm contrast, no motion, optional palette override.
- Works completely offline; open `index.html` directly.
