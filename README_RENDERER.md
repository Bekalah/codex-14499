# Cosmic Helix Renderer

Static offline HTML5 canvas renderer for the layered cosmology in Codex 144:99. Double-click `index.html` in any modern browser; no server, workflow, or network call is required.

## Files
- `index.html` - Entry document with a 1440x900 canvas, palette loader, and fallback status note.
- `js/helix-renderer.mjs` - ES module exposing `renderHelix` plus pure helpers for each layer.
- `data/palette.json` - Optional ND-safe palette override (background, ink, and six layer hues).

## Rendered Layers
1. **Vesica field** - Nine-by-seven vesica grid grounds the scene.
2. **Tree-of-Life scaffold** - Ten sephirot and twenty-two paths mapped with numerology spacing.
3. **Fibonacci curve** - Static golden spiral drawn with steady sampling (no animation).
4. **Double-helix lattice** - Two phase-shifted strands with calm crossbars to maintain depth.

## ND-safe Design
- No motion, autoplay, or flashing effects; each layer renders once for sensory calm.
- Palette loads from `data/palette.json`; when unavailable the fallback palette renders and a notice appears in the header.
- Colors and spacing reference numerology constants 3, 7, 9, 11, 22, 33, 99, and 144 to keep symbolism traceable.
- Pure drawing helpers keep the geometry transparent so adaptations do not disturb existing lore.

## Local Use
1. Keep the repository folders intact so relative imports resolve (`js/` and `data/`).
2. Optionally adjust `data/palette.json` to fit lineage palettes while honoring WCAG AA contrast.
3. Open `index.html` directly (double-click). Modern Chromium, Firefox, and WebKit builds render the scene offline.
4. If the browser blocks file fetches, the fallback palette ensures the canvas still renders safely and the status note reports the mode.

This renderer stays intentionally lightweight: no workflows, no dependencies, and no background services. Geometry is calculated on demand by small pure functions so the layered cosmology remains legible and trauma-informed.
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
