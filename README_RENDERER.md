# Cosmic Helix Renderer

Static offline canvas renderer for layered sacred geometry in Codex 144:99. Double-click `index.html` in any modern browser; no server or network access is required.

## Files
- `index.html` - entry document with a 1440x900 canvas, palette loader, and fallback status note.
- `js/helix-renderer.mjs` - ES module exposing `renderHelix` plus pure helpers for each layer.
- `data/palette.json` - optional ND-safe palette override (background, ink, and six layer hues).
- `README_RENDERER.md` - this usage and safety guide.

## Rendered Layers
1. **Vesica field** - intersecting circles establish the base grid and depth.
2. **Tree-of-Life scaffold** - ten sephirot and twenty-two paths mapped with numerology spacing.
3. **Fibonacci curve** - static golden spiral drawn with gentle sampling (no animation).
4. **Double-helix lattice** - two phase-shifted strands plus steady rungs for layered geometry.

## ND-safe Design Notes
- No motion, autoplay, or flashing effects; the scene renders once when the page loads.
- Palette loads locally; if `data/palette.json` is missing or blocked, a built-in fallback palette renders and the header displays a notice.
- Colors follow a calm contrast hierarchy to support trauma-informed use.
- Geometry parameters derive from sacred numerology constants (3, 7, 9, 11, 22, 33, 99, 144) for traceable symbolism.

## Local Use
1. Keep the repository folders intact so relative imports resolve (`js/` and `data/`).
2. Optionally adjust `data/palette.json` with six layer hues that meet your contrast needs.
3. Double-click `index.html`. Modern browsers such as Firefox or Chromium-based builds render it offline without extra steps.
4. If palette loading fails because of local file sandbox rules, the fallback palette still renders and the status note confirms the safe mode.

This renderer stays intentionally lightweight: no bundlers, no workflows, and no external dependencies. All geometry is calculated by small pure functions to honor the project's layered cosmology without disturbing existing lore.
