# Cosmic Helix Renderer

Static offline canvas renderer for layered sacred geometry in Codex 144:99. Double-click `index.html` in any modern browser; no server or network calls are required.

## Files
- `index.html` - entry point with 1440x900 canvas and palette fallback messaging.
- `js/helix-renderer.mjs` - ES module with pure drawing helpers for the four layers.
- `data/palette.json` - optional ND-safe color palette override.

## Layers
1. Vesica field
2. Tree-of-Life scaffold
3. Fibonacci curve
4. Static double-helix lattice

## ND-safe Design
- No motion or autoplay, supporting sensory comfort.
- Calm contrast and soft colors for readability in low-light spaces.
- Geometry uses numerology constants 3, 7, 9, 11, 22, 33, 99, 144 for proportions.
- Palette loads locally; if the data file is missing, a safe fallback palette is used and a notice appears.

## Local Use
Open `index.html` directly in any modern browser.

## Notes
All geometry routines are documented and avoid side effects, making it easy to adapt without disturbing the existing lore.
