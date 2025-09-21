# Cosmic Helix Renderer

Static offline HTML5 canvas renderer for the layered cosmology in Codex 144:99. Double-click `index.html` in any modern browser; no server, workflow, or network access is required.

## Files
- `index.html` - Entry document with the 1440x900 canvas, palette loader, and header status notice.
- `js/helix-renderer.mjs` - ES module exporting `renderHelix` plus pure helpers for each geometric layer.
- `data/palette.json` - Optional ND-safe palette override (background, ink, and six layer hues).
- `README_RENDERER.md` - This usage and safety guide.

## Layer Stack
1. **Vesica field** (Layer 1) - Nine-by-seven grid of intersecting circles anchors the space with vesica overlaps.
2. **Tree-of-Life scaffold** (Layer 2) - Ten sephirot nodes and twenty-two connective paths drawn with numerology spacing.
3. **Fibonacci curve** (Layer 3) - Static golden spiral polyline sampled gently for calm focus.
4. **Double-helix lattice** (Layer 4) - Two phase-shifted strands with steady crossbars for depth, never implying motion.

## Numerology Anchors
Geometry parameters derive from the sacred constants 3, 7, 9, 11, 22, 33, 99, and 144. These values set grid counts, sampling density, spacing units, and strand turns so symbolism stays traceable and lore-safe.

## Palette and Fallback
- On load the page attempts to fetch `data/palette.json`. When the file is missing or the browser blocks file fetches, a calm fallback palette renders automatically and the header reports the safe mode.
- Adjust `palette.json` to suit your lighting conditions (six calm layer colors are expected). Keep contrast near WCAG AA for trauma-informed clarity.

## ND-safe Design Choices
- No animation, flashing, or autoplay; the canvas renders once on load to avoid sensory overload.
- Calm contrast with readable typography and generous spacing is maintained in both the HTML shell and the canvas layers.
- Lore from the cosmology dataset is preserved in the module so node/path names and numerology remain intact for future rituals.
- Pure functions and clear comments explain how each layer is derived, keeping adaptations reversible and offline-friendly.

## Offline Use
1. Keep the repository folders intact so relative imports resolve (`js/` and `data/`).
2. Optionally adjust `data/palette.json` before opening the page; provide background, ink, and six layer colors.
3. Double-click `index.html`. Chromium, Firefox, and WebKit render the canvas offline with no additional tooling.
4. If palette loading fails in file:// contexts, the fallback palette draws immediately and the status note acknowledges the safe mode.

This renderer stays intentionally lightweight: no workflows, no dependencies, and no background services. Geometry is calculated by small pure functions so the layered cosmology remains legible and trauma-informed.
