# Cosmic Helix Renderer

Static offline renderer for the Codex 144:99 geometry helix. Double-click `index.html` to open in any modern browser. No server and no network needed.

## Files
- `index.html` – HTML entry point with 1440x900 canvas and numerology constants.
- `js/helix-renderer.mjs` – ES module with pure drawing functions.
- `data/palette.json` – customizable ND-safe color palette.

## Layers
1. Vesica field
2. Tree-of-Life scaffold
3. Fibonacci curve
4. Static double-helix lattice

## ND-safe Design
- No motion or autoplay; static canvas only.
- Calming contrast and soft colors for readability.
- Geometry uses constants 3, 7, 9, 11, 22, 33, 99, 144.
- Palette and constants load from local JSON; if missing, safe defaults are used.

## Customization
- Edit `data/palette.json` to change colors.
- Optionally add `data/constants.json` with numerology values to tweak proportions.

## Local Use
Open `index.html` directly in any modern browser.
