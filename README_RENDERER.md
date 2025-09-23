# Cosmic Helix Renderer

Static offline HTML5 canvas renderer for the layered cosmology encoded in Codex 144:99. Double-click `index.html` to render the vesica field, Tree-of-Life scaffold, Fibonacci curve, and double-helix lattice once - no workflows, no dependencies, and no background services.

## Files
- `index.html` - ND-safe shell with the 1440x900 canvas, palette loader, and status notice.
- `js/helix-renderer.mjs` - ES module exporting `renderHelix` plus pure helpers for each sacred layer.
- `data/palette.json` - Optional ND-safe palette override (background, ink, and six layer hues).

## Layer Stack
1. **Vesica field** - Intersecting circles form a nine-by-seven vesica lattice that grounds the canvas.
2. **Tree-of-Life scaffold** - Ten sephirot nodes and twenty-two connective paths maintain Kabbalistic structure.
3. **Fibonacci curve** - Static golden spiral polyline sampled once with gentle marker stones.
4. **Double-helix lattice** - Two phase-shifted strands with twenty-two calm crossbars suggest layered depth.

## Numerology Anchors
Geometry settings honor the sacred constants 3, 7, 9, 11, 22, 33, 99, and 144. These values drive circle counts, path totals, spiral sampling density, helix frequency, and lattice spacing so numerological intent stays legible.

## Palette and Fallback
The renderer attempts to read `data/palette.json`. When browsers block local `file://` fetches, the calm fallback palette - background, ink, and six layer colors - activates automatically. Keep hues near WCAG AA contrast for trauma-informed clarity; update the JSON before opening `index.html` to tailor lighting.

## ND-safe Design Choices
- No animation, flashing, or autoplay; the canvas renders once on load.
- Gentle contrast, generous whitespace, and inline comments document sensory intent.
- Pure geometry helpers keep numerology math auditable and reversible for caretakers.

## Offline Use
1. Keep `index.html`, `js/`, and `data/` together so relative imports resolve.
2. Optionally edit `data/palette.json` before viewing.
3. Double-click `index.html`. Chromium, Firefox, and WebKit all render offline without servers.
4. If palette loading fails in `file://` contexts, the header status reports the safe fallback; rendering still completes once.
