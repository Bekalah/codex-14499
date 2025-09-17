# Cosmic Helix Renderer

Static offline canvas renderer for layered sacred geometry in Codex 144:99. Double-click `index.html` in any modern browser; no server or network access is required.

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
- Colors and spacing maintain readable contrast while referencing numerology constants 3, 7, 9, 11, 22, 33, 99, and 144.
- Pure drawing helpers keep the geometry transparent so adaptations do not disturb existing lore.

## Local Use
1. Keep the three files in their current folders.
2. Optionally adjust `data/palette.json` to fit lineage palettes while honoring WCAG AA contrast.
3. Open `index.html` directly (double-click). Modern Chromium, Firefox, and WebKit builds render the scene offline.
4. If the browser blocks file fetches, the fallback palette ensures the canvas still renders safely.

This renderer is intentionally lightweight: no workflows, no dependencies, and no background services. Geometry is calculated on demand by small pure functions so the layered cosmology stays legible and trauma-informed.
