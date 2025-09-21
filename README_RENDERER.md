# Cosmic Helix Renderer

Static offline HTML5 canvas renderer for the layered cosmology in Codex 144:99. Double-click `index.html` in any modern browser; no build steps, workflows, or network access are required.

## Files
- `index.html` — Entry document hosting the 1440×900 canvas, palette loader, and fallback notice.
- `js/helix-renderer.mjs` — ES module exporting `renderHelix` with pure helpers for each geometric layer.
- `data/palette.json` — Optional ND-safe palette override (background, ink, and six layer hues).

## Rendered Layers
1. **Vesica field** — Intersecting circles in a calm grid ground the scene.
2. **Tree-of-Life scaffold** — Ten sephirot nodes and twenty-two paths drawn with numerology spacing.
3. **Fibonacci curve** — Static golden spiral polyline sampled gently (no animation).
4. **Double-helix lattice** — Two phase-shifted strands linked by steady crossbars.

## Numerology Anchors
Geometry parameters derive from the sacred constants 3, 7, 9, 11, 22, 33, 99, and 144. These values set grid counts, spacing units, sampling density, and helix rhythm so symbolism stays traceable.

## ND-safe Design
- No animation, timers, flashing, or autoplay elements; every layer renders once for sensory calm.
- Palette loads from `data/palette.json`; if the file is missing or blocked, an inline status note reports the safe fallback palette.
- Comments in the module explain layer order, color choices, and offline-first behavior for transparent adaptations.
- Helpers remain small pure functions, keeping lore intact and preventing accidental workflow changes.

## Local Use
1. Keep the repository folders intact so the relative module and data imports resolve (`js/` and `data/`).
2. Optionally adjust `data/palette.json` with six gentle hues that meet your contrast needs (WCAG AA or better recommended).
3. Open `index.html` directly (double-click). Chromium, Firefox, and WebKit render the scene offline.
4. If palette loading fails because of local file sandbox rules, the fallback palette renders automatically and the header reports the safe mode.

The renderer stays intentionally lightweight: no dependencies beyond the browser, no workflows, and no background services. Geometry is calculated in pure functions so the layered cosmology remains legible, trauma-informed, and ND-safe.
