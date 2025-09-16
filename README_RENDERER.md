# Cosmic Helix Renderer

Static offline canvas renderer for layered sacred geometry in Codex 144:99. Double-click `index.html` in any modern browser; no server or network calls are required.

## Files
- `index.html` - entry point with 1440x900 canvas and palette fallback messaging.
- `js/helix-renderer.mjs` - ES module with pure drawing helpers for the four layers.
- `data/palette.json` - optional ND-safe color palette override.

## Layers
1. Vesica field
2. Tree-of-Life scaffold
3. Fibonacci curve
4. Static double-helix lattice

## ND-safe Design
- No motion or autoplay, supporting sensory comfort.
- Calm contrast and soft colors for readability in low-light spaces.
- Geometry uses numerology constants 3, 7, 9, 11, 22, 33, 99, 144 for proportions.
- Palette loads locally; if the data file is missing, a safe fallback palette is used and a notice appears.

## Local Use
Open `index.html` directly in any modern browser.

## Notes
All geometry routines are documented and avoid side effects, making it easy to adapt without disturbing the existing lore.
Static offline HTML5 canvas scene encoding the layered cosmology for Codex 144:99. Double-click `index.html` in any modern browser; the renderer does not require a server, workflow, or network access.

## Files
- `index.html` - Entry document with 1440x900 canvas, palette loader, and fallback status note.
- `js/helix-renderer.mjs` - ES module exposing `renderHelix` and pure helpers for each layer.
- `data/palette.json` - Optional ND-safe palette override (background, ink, and six layer hues).

## Rendered Layers
1. **Vesica field** - Nine intersecting circles create the grounding grid.
2. **Tree-of-Life scaffold** - Ten nodes and twenty-two paths mapped to numerology constants.
3. **Fibonacci curve** - Static golden spiral drawn with calm sampling (no animation).
4. **Double-helix lattice** - Two phase-shifted strands plus rungs for layered depth.

## ND-safe Considerations
- No motion, autoplay, or flashing effects; everything renders once on load.
- Palette loads locally; if `data/palette.json` is missing or blocked by the browser, a built-in safe palette renders and a notice appears in the header.
- Colors follow a calm contrast hierarchy to support trauma-informed use.
- Geometry parameters derive from sacred numerology constants (3, 7, 9, 11, 22, 33, 99, 144) for traceable symbolism.

## Local Use
1. Ensure the three files stay in the same relative folders.
2. Optionally adjust `data/palette.json` with six layer hues that meet your contrast needs.
3. Open `index.html` directly (double-click). Modern browsers such as Firefox or Chromium-based builds render without additional steps.
4. If palette loading fails due to local file sandboxing, the fallback palette still renders safely.

This renderer is intentionally lightweight: no bundlers, no dependencies, and no background services. All geometry is calculated on demand by small pure functions for clarity and ease of maintenance.
