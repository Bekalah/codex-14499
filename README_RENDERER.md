# Cosmic Helix Renderer

Static offline canvas renderer for layered sacred geometry in Codex 144:99. Double-click `index.html` in any modern browser; no server or network calls are required.

## Files
- `index.html` — entry document with a 1440x900 canvas, palette loader, and fallback notice.
- `js/helix-renderer.mjs` — ES module exposing `renderHelix` plus pure helpers for each layer.
- `data/palette.json` — optional ND-safe palette override (background, ink, and six layer hues).

## Rendered Layers
1. **Vesica field** — intersecting circles establish the base grid and depth.
2. **Tree-of-Life scaffold** — ten sephirot and twenty-two paths mapped to numerology constants.
3. **Fibonacci curve** — static Golden Ratio spiral sampled gently for calm focus.
4. **Double-helix lattice** — two phase-shifted strands with crossbars to preserve layered geometry.

## ND-safe Design Notes
- No motion, autoplay, or flashing effects; the scene renders once on load.
- Palette loads locally; if `data/palette.json` is missing or blocked, a built-in fallback palette renders and the header displays a notice.
- Colors follow a calm contrast hierarchy to support trauma-informed use.
- Geometry parameters derive from sacred numerology constants (3, 7, 9, 11, 22, 33, 99, 144) for traceable symbolism.

## Local Use
1. Keep the three files in their existing folders.
2. Optionally adjust `data/palette.json` with six layer hues that meet your contrast needs.
3. Open `index.html` directly (double-click). Modern browsers such as Firefox or Chromium-based builds render without additional steps.
4. If palette loading fails due to local file sandboxing, the fallback palette still renders safely.

This renderer stays intentionally lightweight: no bundlers, no dependencies, and no workflows. All geometry is calculated by small pure functions to honour the project's layered cosmology without disturbing existing lore.
