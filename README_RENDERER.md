# Cosmic Helix Renderer

Static offline HTML5 canvas renderer for the layered cosmology of Codex 144:99. Double-click `index.html` and the 1440x900 scene paints once—no dependencies, no workflows, no background services.

## Files
- `index.html` — Entry shell with the 1440x900 canvas, palette loader, status note, and inline guidance about the palette fallback.
- `js/helix-renderer.mjs` — ES module exporting `renderHelix` plus small pure helpers for each layer; relies on relative imports so the bundle stays portable.
- `data/palette.json` — Optional palette override (background, ink, six layer colors) read via relative imports; safe to customize before opening the page.
- `README_RENDERER.md` — usage and safety guide detailing offline steps and ND-safe choices.

## Layer Stack
1. **Vesica field** — intersecting circles arranged in a seven-by-nine grid ground the canvas depth.
2. **Tree-of-Life scaffold** — ten sephirot nodes connected by twenty-two paths maintain lineage context.
3. **Fibonacci curve** — static golden spiral polyline sampled once for gentle orientation.
4. **Double-helix lattice** — two calm strands with steady crossbars reinforce layered geometry without implying motion.

## Numerology Anchors
Sacred constants guide all geometry: 3, 7, 9, 11, 22, 33, 99, and 144 determine grid counts, path spacing, spiral sampling, and helix cadence so symbolism stays traceable.

## Palette and Fallback
- `data/palette.json` may define background, ink, and six layer colors; when unavailable the fallback palette mirrors deep indigo stone.
- The header status reports when the fallback palette activates so caretakers know they remain in a safe mode.
- Keep adjustments within WCAG AA contrast targets to protect trauma-informed clarity.

## ND-safe Design Choices
- No animation, flashing, or autoplay; the renderer renders once on load.
- Calm contrast and readable typography are preserved across the shell and canvas.
- Pure functions structure each layer so adaptations remain gentle and auditable.
- Documentation remains trauma-informed, highlighting ND-safe rationale for every layer.

## Offline Use
1. Keep the folder structure intact so relative imports resolve (`js/` and `data/`).
2. Optionally update `data/palette.json` (background, ink, six layer colors) before opening the file.
3. Double-click `index.html` in Chromium, Firefox, or WebKit—no server required.
4. In file:// contexts where JSON fetches are blocked, the fallback palette loads automatically and the status note explains the safe mode.

This renderer stays intentionally lightweight: ND-safe colors, no motion, no workflows, no dependencies, no background services.
