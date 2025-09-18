# Cosmic Helix Renderer

Static offline HTML5 canvas renderer for the layered cosmology in Codex 144:99. Double-click `index.html` in any modern browser; no server, workflow, or network call is required.

## Files
- `index.html` - Entry document with a 1440x900 canvas, palette loader, and fallback notice.
- `js/helix-renderer.mjs` - ES module exposing `renderHelix` plus pure helpers for each geometric layer.
- `data/palette.json` - Optional ND-safe palette override (background, ink, and six layer hues).
- `README_RENDERER.md` - This usage and safety guide.

## Layered Output
1. **Vesica field** - Intersecting circles establish the grounding grid.
2. **Tree-of-Life scaffold** - Ten sephirot and twenty-two paths mapped with numerology spacing.
3. **Fibonacci curve** - Static golden spiral drawn with calm sampling (no animation).
4. **Double-helix lattice** - Two phase-shifted strands plus steady rungs to preserve depth.

## ND-safe Design Notes
- No motion, autoplay, or flashing effects; geometry renders once when the page loads.
- Palette loads locally; if `data/palette.json` is missing or blocked, a built-in fallback palette renders and the header displays the notice.
- Colors follow a calm contrast hierarchy and comments explain why layer order stays trauma-informed.
- Geometry parameters derive from numerology constants 3, 7, 9, 11, 22, 33, 99, and 144 to honor the cosmology.

## Local Use
1. Keep the repository folders intact so relative imports resolve (`js/` and `data/`).
2. Optionally adjust `data/palette.json` with six gentle hues that meet your contrast needs.
3. Open `index.html` directly (double-click). Chromium, Firefox, and WebKit render it offline without extra steps.
4. If palette loading fails because of local file sandbox rules, the fallback palette still renders safely and the header confirms the mode.

All geometry code is intentionally lightweight: no dependencies, no workflows, and no background services. Pure functions keep the layered cosmology legible for future adaptations.
