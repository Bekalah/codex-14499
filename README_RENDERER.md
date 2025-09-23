# Cosmic Helix Renderer

Static offline HTML5 canvas renderer for the layered cosmology encoded in Codex 144:99. Double-click `index.html` to render the vesica field, Tree-of-Life scaffold, Fibonacci curve, and double-helix lattice once: no workflows, no dependencies, and no background services.

## Files
- `index.html` &mdash; ND-safe shell with the 1440x900 canvas, palette loader, and status notice.
- `js/helix-renderer.mjs` &mdash; ES module exporting `renderHelix` plus pure helpers for each sacred layer.
- `data/palette.json` &mdash; Optional ND-safe palette override (background, ink, and six layer hues).
- `dist/codex.min.json` &mdash; Minified data export consumed by sibling codex viewers.
- `README_RENDERER.md` &mdash; This usage and safety guide.

## Layer Stack
1. **Vesica field** &mdash; Intersecting circles form a nine-by-seven vesica lattice that grounds the canvas.
2. **Tree-of-Life scaffold** &mdash; Ten sephirot nodes and twenty-two connective paths maintain Kabbalistic structure.
3. **Fibonacci curve** &mdash; Static golden spiral polyline sampled once with gentle marker stones.
4. **Double-helix lattice** &mdash; Two phase-shifted strands with twenty-two calm crossbars suggest layered depth.

## Numerology Anchors
Geometry settings honor the sacred constants 3, 7, 9, 11, 22, 33, 99, and 144. These values drive circle counts, path totals, spiral sampling density, helix frequency, and lattice spacing so numerological intent stays legible.

## Palette and Fallback
The renderer attempts to read `data/palette.json`. When browsers block local `file://` fetches, the calm fallback palette (background, ink, and six layer colors) activates automatically. Keep hues near WCAG AA contrast for trauma-informed clarity; update the JSON before opening `index.html` to tailor lighting.

## ND-safe Design Choices
- No animation, flashing, or autoplay; the canvas renders once on load.
- Calm contrast, generous whitespace, and layer comments document sensory intent.
- Pure functions keep geometry math auditable and reversible for caretakers.
- Trauma-informed pacing: any optional motion work elsewhere in the codex keeps a 14 s minimum sweep to respect consent.

## Offline Use
1. Keep `index.html`, `js/`, and `data/` together so relative imports resolve.
2. Optionally edit `data/palette.json` before viewing.
3. Double-click `index.html`. Chromium, Firefox, and WebKit all render offline without servers.
4. If palette loading fails in `file://` contexts, the header status reports the safe fallback; rendering still completes once.

## Data Export
Run `node scripts/build-codex.mjs` to regenerate `dist/codex.min.json`. The bundle includes constants, nodes 0..10, citations, and the palette snapshot. `python scripts/validate_codex.py` checks the JSON against the ND-safe schema and ensures any `motionOptIn` node keeps `minSweepSec >= 14`.
