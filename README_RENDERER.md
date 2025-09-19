# Cosmic Helix Renderer

Static offline HTML5 canvas scene for the layered geometry in Codex 144:99.
Double-click `index.html` in any modern browser; no server or workflow is
required.

## Files
- `index.html` — Entry document with a 1440×900 canvas, palette loader, and
  inline status notice.
- `js/helix-renderer.mjs` — ES module exporting `renderHelix` plus small pure
  helpers for each geometric layer.
- `data/palette.json` — Optional ND-safe palette override (background, ink, and
  six layer hues).
- `README_RENDERER.md` — This usage and safety guide.

## Layered Output
1. **Vesica field** (Layer 1) — Nine-by-seven vesica grid anchors the scene.
2. **Tree-of-Life scaffold** (Layer 2) — Ten sephirot nodes and twenty-two major
   arcana paths plotted with numerology spacing.
3. **Fibonacci curve** (Layer 3) — Static golden spiral sampled once with calm
   markers.
4. **Double-helix lattice** (Layer 4) — Two phase-shifted strands with steady
   crossbars for depth.

## Numerology Anchors
Geometry parameters derive from sacred constants: 3, 7, 9, 11, 22, 33, 99, and
144. These values set grid counts, sampling density, spacing units, and strand
turns so symbolism stays traceable.

## Palette and Fallback
- On load the page tries to read `data/palette.json` via `fetch`. If the browser
  blocks local file access, the renderer reports a gentle inline notice and uses
  the built-in ND-safe palette.
- Adjust `palette.json` to suit your lighting conditions (six layer colors are
  expected). Keep contrast near WCAG AA for trauma-informed clarity.

## ND-safe Design
- No animation, flashing, or autoplay; the canvas renders once per page load.
- Calm contrast with readable typography and generous spacing.
- Lore from the cosmology dataset is preserved in the module so node/path names
  and numerology remain intact for future rituals.
- Pure functions and clear comments explain how each layer is derived, keeping
  adaptations reversible.

## Offline Use
1. Keep the repository folders intact so relative imports resolve (`js/` and
   `data/`).
2. Optionally update `data/palette.json` before opening the page.
3. Double-click `index.html`. Chromium, Firefox, and WebKit builds render the
   scene offline without extra tooling.
4. If palette loading fails because of local file sandboxing, the fallback
   palette renders automatically and the header reports the safe mode.
