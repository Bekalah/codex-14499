# Cosmic Helix Renderer

Static offline canvas renderer for layered sacred geometry in Codex 144:99. Open `index.html` directly in any modern browser; no server, workflow, or network call is required.

## Files
- `index.html` - Entry point with 1440x900 canvas, status notice, and palette fallback logic.
- `js/helix-renderer.mjs` - ES module that draws the four layers using small pure helpers.
- `data/palette.json` - Optional ND-safe palette override (background, ink, and six layer hues).

## Rendered Layers
1. **Vesica field** - Nine intersecting circles form the grounding grid.
2. **Tree-of-Life scaffold** - Ten nodes and twenty-two paths plotted with numerology spacing.
3. **Fibonacci curve** - Static golden spiral using calm sampling (no animation).
4. **Double-helix lattice** - Two phase-shifted strands plus steady rungs for depth.

## ND-safe Design Notes
- No motion, autoplay, or flashing effects; everything renders once when the page loads.
- Palette loads from local data; if `data/palette.json` is missing, a safe fallback palette renders and a notice appears in the header.
- Colors and spacing follow a trauma-informed hierarchy to support gentle contrast.
- Geometry parameters derive from numerology constants 3, 7, 9, 11, 22, 33, 99, and 144 to honor the cosmology.

## Local Use
1. Keep the three files in the same relative folders.
2. Optionally adjust `data/palette.json` to match your desired calm palette.
3. Double-click `index.html`. Modern browsers such as Firefox or Chromium-based builds render it offline without extra steps.
4. If palette loading fails because of local file sandbox rules, the fallback palette still renders and the status note confirms the safe mode.

All geometry code is heavily commented so future integrations can extend the lattice without disturbing existing lore.
