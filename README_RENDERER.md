# Cosmic Helix Renderer

Static offline canvas renderer for the layered cosmology in Codex 144:99. Double-click `index.html` in any modern browser; no server, workflow, or network access is required.

## Files
- `index.html` — entry document with a 1440x900 canvas, palette loader, and fallback notice.
- `js/helix-renderer.mjs` — ES module exposing `renderHelix` with pure helpers for each layer.
- `data/palette.json` — optional ND-safe palette override (background, ink, and six layer hues).

## Rendered Layers
1. **Vesica field** — intersecting circles establish the foundational grid without motion.
2. **Tree-of-Life scaffold** — ten sephirot and twenty-two paths plotted with numerology spacing.
3. **Fibonacci curve** — static golden spiral polyline sampled gently for calm focus.
4. **Double-helix lattice** — two phase-shifted strands with steady rungs to preserve depth.

## ND-safe Design Notes
- No animation, autoplay, or flashing effects; geometry renders once on load.
- Palette loads locally; when `data/palette.json` is missing the fallback palette renders and the header reports the safe mode.
- Colors and spacing follow a trauma-informed hierarchy using numerology constants 3, 7, 9, 11, 22, 33, 99, and 144.
- Small, well-commented helpers keep the lore intact and easy to audit.

## Local Use
1. Keep the repository folders intact so relative imports resolve (`js/` and `data/`).
2. Optionally adjust `data/palette.json` to match your desired calm palette while preserving six layer colors.
3. Open `index.html` directly (double-click). Chromium, Firefox, and WebKit builds render offline without extra steps.
4. If palette loading fails because of local file sandbox rules, the fallback palette still renders and the status note confirms the safe mode.

This renderer stays intentionally lightweight: no workflows, no dependencies, and no background services. Geometry is calculated by small pure functions so the layered cosmology remains legible and ND-safe.
