# Cosmic Helix Renderer

Static offline HTML5 canvas renderer for the layered cosmology in Codex 144:99. Double-click `index.html` in any modern browser; no server or network access is required.

## Files
- `index.html` - entry document with 1440x900 canvas, palette loader, and fallback status note.
- `js/helix-renderer.mjs` - ES module exposing `renderHelix` plus pure helpers for each geometric layer.
- `data/palette.json` - optional ND-safe palette override (background, ink, and six layer hues).
- `README_RENDERER.md` - this usage and safety guide.

## Layered Output
1. **Vesica field** - repeating vesica grid grounds the composition.
2. **Tree-of-Life scaffold** - ten nodes and twenty-two paths mapped with numerology spacing.
3. **Fibonacci curve** - static golden spiral drawn with gentle sampling (no animation).
4. **Double-helix lattice** - two phase-shifted strands plus steady rungs to preserve depth.

## ND-safe Design Choices
- No motion, autoplay, or flashing effects; geometry renders once on load.
- Calm palette with readable contrast; fallback palette prevents blank screens if data is missing.
- Helper functions are small and pure so adjustments stay reversible and lore-safe.
- Geometry parameters derive from sacred numerology constants (3, 7, 9, 11, 22, 33, 99, 144) for traceable symbolism.

## Local Use
1. Keep the repository folders intact so relative imports resolve (`js/` and `data/`).
2. Optionally adjust `data/palette.json` to suit your lighting conditions (six layer colors are expected).
3. Open `index.html` directly (double-click). Modern browsers such as Firefox or Chromium-based builds render without additional steps.
4. If palette loading fails due to local file sandboxing, the built-in fallback palette renders and the header reports the safe state.

This renderer is intentionally lightweight: no bundlers, no workflows, and no external dependencies. All geometry is calculated on demand by pure functions to honor the cathedral protocol.
