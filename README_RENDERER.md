# Cosmic Helix Renderer

Static offline HTML5 canvas renderer for the layered cosmology in Codex 144:99. Double-click `index.html` in any modern browser; no server or network access is required.

## Files
- `index.html` - entry document with 1440x900 canvas, palette loader, and fallback status note.
- `js/helix-renderer.mjs` - ES module exposing `renderHelix` plus pure helpers for each geometric layer.
- `data/palette.json` - optional ND-safe palette override (background, ink, and six layer hues).
- `README_RENDERER.md` - this usage and safety guide.

## Layered Output
1. **Vesica field** - repeating vesica grid grounds the composition.
2. **Tree-of-Life scaffold** - ten nodes and twenty-two paths mapped with numerology spacing.
3. **Fibonacci curve** - static golden spiral drawn with gentle sampling (no animation).
4. **Double-helix lattice** - two phase-shifted strands plus steady rungs to preserve depth.

## ND-safe Design Choices
- No motion, autoplay, or flashing effects; geometry renders once on load.
- Calm palette with readable contrast; fallback palette prevents blank screens if data is missing.
- Helper functions are small and pure so adjustments stay reversible and lore-safe.
- Geometry parameters derive from sacred numerology constants (3, 7, 9, 11, 22, 33, 99, 144) for traceable symbolism.

## Local Use
1. Keep the repository folders intact so relative imports resolve (`js/` and `data/`).
2. Optionally adjust `data/palette.json` to suit your lighting conditions (six layer colors are expected).
3. Open `index.html` directly (double-click). Modern browsers such as Firefox or Chromium-based builds render without additional steps.
4. If palette loading fails due to local file sandboxing, the built-in fallback palette renders and the header reports the safe state.

This renderer is intentionally lightweight: no bundlers, no workflows, and no external dependencies. All geometry is calculated on demand by pure functions to honor the cathedral protocol.
Static offline canvas renderer for layered sacred geometry in Codex 144:99. Open `index.html` directly in any modern browser; no server, workflow, or network call is required.

## Files
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
- `index.html` — entry document with a 1440x900 canvas, palette loader, and fallback notice.
- `js/helix-renderer.mjs` — ES module exposing `renderHelix` plus pure helpers for each layer.
- `data/palette.json` — optional ND-safe palette override (background, ink, and six layer hues).

## Rendered Layers
- `index.html` — entry document with a 1440x900 canvas, palette loader, and fallback notice.
- `js/helix-renderer.mjs` — ES module exposing `renderHelix` plus pure helpers for each layer.
- `data/palette.json` — optional ND-safe palette override (background, ink, and six layer hues).

## Rendered Layers
1. **Vesica field** — intersecting circles establish the base grid and depth.
2. **Tree-of-Life scaffold** — ten sephirot and twenty-two paths mapped to numerology constants.
3. **Fibonacci curve** — static Golden Ratio spiral sampled gently for calm focus.
4. **Double-helix lattice** — two phase-shifted strands with crossbars to preserve layered geometry.

## ND-safe Design Notes
- No motion, autoplay, or flashing effects; the scene renders once on load.
- Palette loads locally; if `data/palette.json` is missing or blocked, a built-in fallback palette renders and the header displays a notice.
- Colors follow a calm contrast hierarchy to support trauma-informed use.
- Geometry parameters derive from sacred numerology constants (3, 7, 9, 11, 22, 33, 99, 144) for traceable symbolism.

## Local Use
1. Keep the three files in their existing folders.
2. Optionally adjust `data/palette.json` with six layer hues that meet your contrast needs.
3. Open `index.html` directly (double-click). Modern browsers such as Firefox or Chromium-based builds render without additional steps.
4. If palette loading fails due to local file sandboxing, the fallback palette still renders safely.

This renderer stays intentionally lightweight: no bundlers, no dependencies, and no workflows. All geometry is calculated by small pure functions to honour the project's layered cosmology without disturbing existing lore.
