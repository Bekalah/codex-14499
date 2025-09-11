Per Texturas Numerorum, Spira Loquitur.  //
# Cosmic Helix Renderer

Static offline canvas renderer for layered sacred geometry in Codex 144:99.

## Files
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
- Palette loaded locally; missing file triggers a safe fallback notice.

## Local Use
Open `index.html` directly in a modern browser. No server or network needed.

## Tests
Run local checks:

```sh
npm test
```
