Per Texturas Numerorum, Spira Loquitur.  //
# Cosmic Helix Renderer

Static offline renderer for the Codex 144:99 geometry helix. Double-click `index.html` to open in any modern browser.
No server, no network.

## Files
- `index.html` – HTML entry point with 1440x900 canvas and numerology constants.
- `js/helix-renderer.mjs` – ES module with pure drawing functions.
- `data/palette.json` – customizable ND-safe color palette.

## Layers
1. Vesica field
2. Tree-of-Life scaffold
3. Fibonacci curve
4. Static double-helix lattice

## Notes
- ND-safe: calm contrast, no motion, optional palette override.
- All geometry uses constants 3, 7, 9, 11, 22, 33, 99, 144.
- If `data/palette.json` is missing, a built-in fallback palette renders instead.
- Works completely offline; open `index.html` directly.
