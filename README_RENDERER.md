# Cosmic Helix Renderer

Static offline HTML5 canvas renderer for the layered cosmology in Codex 144:99. Double-click `index.html` in any modern browser; no server, workflow, or network call is required.

## Files
- `index.html` — entry document with a 1440×900 canvas, palette loader, and inline status note.
- `js/helix-renderer.mjs` — ES module exposing `renderHelix` with pure helpers for each sacred geometry layer.
- `data/palette.json` — optional ND-safe palette override (background, ink, and six layer hues).
- `README_RENDERER.md` — this usage and safety guide.

## Layered Output
1. **Vesica field** — intersecting circles form a nine-by-seven vesica matrix that grounds the scene.
2. **Tree-of-Life scaffold** — ten sephirot nodes and twenty-two paths plotted with numerology spacing.
3. **Fibonacci curve** — static golden spiral polyline sampled gently for calm focus.
4. **Double-helix lattice** — two phase-shifted strands with steady crossbars to preserve layered depth.

## Numerology Anchors
Geometry parameters derive from sacred constants: 3, 7, 9, 11, 22, 33, 99, and 144. These values set grid counts, sampling density, spacing units, and strand turns so symbolism stays traceable. Comments in the code call out how each layer uses the constants—this honors the lore without flattening it.

## Palette and Fallback
- On load the page tries to read `data/palette.json` via `fetch`. If the browser blocks local file access, the renderer reports a gentle inline notice and uses the built-in ND-safe palette.
- Adjust `palette.json` to suit lighting conditions; six layer colors are expected. Keep contrast near WCAG AA for trauma-informed clarity.

## ND-safe Design Notes
- No animation, autoplay, or flashing effects. Geometry renders once when the page loads.
- Calm contrast with readable typography and generous spacing keeps the experience trauma-informed.
- Lore tables for the Tree-of-Life and arcana remain in the module, explaining why each link exists.

## Local Use (Offline)
1. Keep the folders intact so relative imports resolve (`js/` and `data/`).
2. Optionally adjust `data/palette.json` before opening the page.
3. Double-click `index.html`. Chromium, Firefox, and WebKit builds render the scene offline with no dependencies.
4. If palette loading fails because of local sandbox rules, the fallback palette renders automatically and the status note confirms the safe mode.

This renderer stays intentionally lightweight: no workflows, no external dependencies, and no motion. Geometry is calculated by small pure functions so the layered cosmology remains legible and ND-safe.
