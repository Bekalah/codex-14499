# Cosmic Helix Renderer

Static offline HTML5 canvas renderer for the layered cosmology in Codex 144:99. Double-click `index.html` in any modern browser; no server, workflow, or network access is required.

## Files
- `index.html` - Entry document with the 1440x900 canvas, palette loader, and header status notice.
- `js/helix-renderer.mjs` - ES module exporting `renderHelix` with pure helpers for each geometric layer.
- `data/palette.json` - Optional ND-safe palette override (background, ink, and six layer hues).
- `README_RENDERER.md` - This usage and safety guide.

## Layered Output
1. **Vesica field** (Layer 1) - Nine-by-seven vesica grid anchors the scene and grounds the depth perception.
2. **Tree-of-Life scaffold** (Layer 2) - Ten sephirot nodes and twenty-two major arcana paths plotted with numerology spacing.
3. **Fibonacci curve** (Layer 3) - Static golden spiral sampled once with gentle markers for growth waypoints.
4. **Double-helix lattice** (Layer 4) - Two phase-shifted strands with steady crossbars to preserve layered geometry.

## Numerology Anchors
Geometry parameters derive from sacred constants: 3, 7, 9, 11, 22, 33, 99, and 144. These values set grid counts, sampling density, spacing units, and strand turns so symbolism stays traceable and lore-safe.

## Palette and Fallback
- On load the page tries to read `data/palette.json` via `fetch`. If the browser blocks local file access, the renderer reports a gentle inline notice and uses the built-in ND-safe palette.
- Adjust `palette.json` to suit your lighting conditions (six calm layer colors are expected). Keep contrast near WCAG AA for trauma-informed clarity.

## ND-safe Design
- No animation, flashing, or autoplay; the canvas renders once on load to avoid sensory overload.
- Calm contrast with readable typography and generous spacing is maintained in both the HTML shell and the canvas layers.
- Lore from the cosmology dataset is preserved in the module so node/path names and numerology remain intact for future rituals.
- Pure functions and clear comments explain how each layer is derived, keeping adaptations reversible.

## Offline Use
1. Keep the repository folders intact so relative imports resolve (`js/` and `data/`).
2. Optionally update `data/palette.json` before opening the page.
3. Double-click `index.html`. Chromium, Firefox, and WebKit builds render the scene offline without extra tooling.
4. If palette loading fails because of local file sandboxing, the fallback palette renders automatically and the header reports the safe mode.

This renderer stays intentionally lightweight: no workflows, no dependencies, and no background services. Geometry is calculated by small pure functions so the layered cosmology remains legible and trauma-informed.
- `index.html` &mdash; entry document with a 1440&times;900 canvas, palette loader, and inline status notice.
- `js/helix-renderer.mjs` &mdash; ES module exporting `renderHelix` plus pure helpers for each geometric layer.
- `data/palette.json` &mdash; optional ND-safe palette override (background, ink, and six layer hues).
- `README_RENDERER.md` &mdash; this usage and safety guide.

## Layer Stack
1. **Vesica field** (Layer&nbsp;1) &mdash; nine-by-seven grid of intersecting circles anchors the space with vesica overlaps.
2. **Tree-of-Life scaffold** (Layer&nbsp;2) &mdash; ten sephirot nodes and twenty-two connective paths drawn with numerology spacing.
3. **Fibonacci curve** (Layer&nbsp;3) &mdash; static golden spiral polyline sampled gently for calm focus.
4. **Double-helix lattice** (Layer&nbsp;4) &mdash; two phase-shifted strands with steady crossbars for depth, never implying motion.

## Geometry and Numerology
The renderer relies on the sacred constants 3, 7, 9, 11, 22, 33, 99, and 144 to size and position geometry:
- Vesica grid counts nine columns by seven rows; circle radii derive from `3 / (9 - 7)` to keep gentle overlap.
- Tree-of-Life spacing uses `144` units as the vertical baseline, six intervals (`3 + 3`) to form seven levels, and offsets scaled by `7/11`, `9/22`, and `1/3` factors of the canvas width.
- The Fibonacci spiral samples `99` points over a `33/22` turn sweep to echo golden growth while staying static.
- The double helix traces three twists with amplitude `width / 7`, phase shift `π / (9 - 7)`, and eleven rungs to honor the arcana paths.

## Palette and Fallback
- On load the page attempts to fetch `data/palette.json`. When the file is missing or the browser blocks file fetches, a calm fallback palette renders automatically and the header reports the safe mode.
- Colors maintain high contrast between background, ink, and layer hues to remain ND-safe. Comments in the module explain each choice so future changes stay trauma-informed.

## Offline Use
1. Keep the repository folders intact so relative imports resolve (`js/` and `data/`).
2. Optionally adjust `data/palette.json` before opening the page; provide background, ink, and six layer colors.
3. Double-click `index.html`. Chromium, Firefox, and WebKit render the canvas offline with no additional tooling.
4. If palette loading fails in file:// contexts, the fallback palette draws immediately and the status note acknowledges the mode.

No animation, flashing, or workflows are introduced. Each layer renders once via small pure functions to keep the cosmology legible, ND-safe, and ready for future expansions.
