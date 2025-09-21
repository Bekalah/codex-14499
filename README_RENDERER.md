# Cosmic Helix Renderer

Static offline HTML5 canvas renderer for the layered cosmology in Codex 144:99. Double-click `index.html` in any modern browser; no server, workflow, or network access is required.

## Files
- `index.html` - Entry document with the 1440x900 canvas, palette loader, and header status note.
- `js/helix-renderer.mjs` - ES module exporting `renderHelix` plus pure helpers for each geometric layer.
- `data/palette.json` - Optional ND-safe palette override (background, ink, and six layer hues).

## Layered Output
1. **Vesica field** - Intersecting circles form a seven-by-nine vesica grid for grounded depth.
2. **Tree-of-Life scaffold** - Ten sephirot nodes and twenty-two major-arcana paths plotted with numerology spacing.
3. **Fibonacci curve** - Static golden spiral sampled once with ninety-nine gentle steps (no animation).
4. **Double-helix lattice** - Two phase-shifted strands with twenty-two steady crossbars to preserve layered geometry.

## Numerology Anchors
Geometry parameters derive from sacred constants: 3, 7, 9, 11, 22, 33, 99, and 144. These values govern grid counts, spacing units, spiral sampling, and helix cadence so symbolism stays traceable.

## Palette and Fallback
- On load the page tries to read `data/palette.json` via `fetch`. If the browser blocks local file access, the renderer posts a calm inline notice and uses the built-in ND-safe palette.
- Adjust `palette.json` to suit your lighting conditions (six layer colors are expected). Keep contrast near WCAG AA for trauma-informed clarity.

## ND-safe Design
- No animation, flashing, or autoplay; the canvas renders once when the page loads.
- Calm contrast with readable typography and generous spacing, documented in comments for future caretakers.
- Pure functions and clear comments explain how each layer uses the numerology constants, keeping adaptations reversible.

## Offline Use
1. Keep the repository folders intact so relative imports resolve (`js/` and `data/`).
2. Optionally update `data/palette.json` before opening the page.
3. Double-click `index.html`. Chromium, Firefox, and WebKit builds render the scene offline without extra tooling.
4. If palette loading fails because of local file sandboxing, the fallback palette renders automatically and the header reports the safe mode.

No bundlers, workflows, or external dependencies are introduced; the renderer remains lightweight, trauma-informed, and lore-aligned.
