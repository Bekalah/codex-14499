# Cosmic Helix Renderer

Static offline HTML5 canvas renderer for the layered cosmology in Codex 144:99. Double-click `index.html` in any modern browser; no server, workflow, or network call is required.

## Files
- `index.html` - entry document with a 1440x900 canvas, palette loader, and fallback status note.
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
- Colors and spacing reference numerology constants 3, 7, 9, 11, 22, 33, 99, and 144 to keep symbolism traceable.
- Pure drawing helpers keep the geometry transparent so adaptations do not disturb existing lore.

## Local Use
1. Keep the repository folders intact so relative imports resolve (`js/` and `data/`).
2. Optionally adjust `data/palette.json` to fit lineage palettes while honoring WCAG AA contrast.
3. Open `index.html` directly (double-click). Modern Chromium, Firefox, and WebKit builds render the scene offline.
4. If the browser blocks file fetches, the fallback palette ensures the canvas still renders safely and the status note reports the mode.

This renderer stays intentionally lightweight: no workflows, no dependencies, and no background services. Geometry is calculated on demand by small pure functions so the layered cosmology remains legible and trauma-informed.
- `index.html` - Entry document with a 1440x900 canvas, palette loader, and fallback notice.
- `js/helix-renderer.mjs` - ES module exposing `renderHelix` plus pure helpers for each geometric layer.
- `data/palette.json` - Optional ND-safe palette override (background, ink, and six layer hues).
- `README_RENDERER.md` - This usage and safety guide.

## Layered Output
1. **Vesica field** - Intersecting circles establish the grounding grid.
2. **Tree-of-Life scaffold** - Ten sephirot and twenty-two paths mapped with numerology spacing.
3. **Fibonacci curve** - Static golden spiral drawn with calm sampling (no animation).
4. **Double-helix lattice** - Two phase-shifted strands plus steady rungs to preserve depth.

## ND-safe Design Notes
- No motion, autoplay, or flashing effects; geometry renders once when the page loads.
- Palette loads locally; if `data/palette.json` is missing or blocked, a built-in fallback palette renders and the header displays the notice.
- Colors follow a calm contrast hierarchy and comments explain why layer order stays trauma-informed.
- Geometry parameters derive from numerology constants 3, 7, 9, 11, 22, 33, 99, and 144 to honor the cosmology.

## Local Use
1. Keep the repository folders intact so relative imports resolve (`js/` and `data/`).
2. Optionally adjust `data/palette.json` with six gentle hues that meet your contrast needs.
3. Open `index.html` directly (double-click). Chromium, Firefox, and WebKit render it offline without extra steps.
4. If palette loading fails because of local file sandbox rules, the fallback palette still renders safely and the header confirms the mode.

All geometry code is intentionally lightweight: no dependencies, no workflows, and no background services. Pure functions keep the layered cosmology legible for future adaptations.
Static offline canvas renderer for the layered cosmology in Codex 144:99. Double-click `index.html` in any modern browser; no server, workflow, or network access is required.

## Files
- `index.html` — entry document with a 1440x900 canvas, palette loader, and fallback notice.
- `js/helix-renderer.mjs` — ES module exposing `renderHelix` with pure helpers for each layer.
- `data/palette.json` — optional ND-safe palette override (background, ink, and six layer hues).

## Rendered Layers
1. **Vesica field** — intersecting circles establish the foundational grid without motion.
2. **Tree-of-Life scaffold** — ten sephirot and twenty-two paths plotted with numerology spacing.
3. **Fibonacci curve** — static golden spiral polyline sampled gently for calm focus.
4. **Double-helix lattice** — two phase-shifted strands with steady rungs to preserve depth.

## ND-safe Design Notes
- No animation, autoplay, or flashing effects; geometry renders once on load.
- Palette loads locally; when `data/palette.json` is missing the fallback palette renders and the header reports the safe mode.
- Colors and spacing follow a trauma-informed hierarchy using numerology constants 3, 7, 9, 11, 22, 33, 99, and 144.
- Small, well-commented helpers keep the lore intact and easy to audit.

## Local Use
1. Keep the repository folders intact so relative imports resolve (`js/` and `data/`).
2. Optionally adjust `data/palette.json` to match your desired calm palette while preserving six layer colors.
3. Open `index.html` directly (double-click). Chromium, Firefox, and WebKit builds render offline without extra steps.
4. If palette loading fails because of local file sandbox rules, the fallback palette still renders and the status note confirms the safe mode.

This renderer stays intentionally lightweight: no workflows, no dependencies, and no background services. Geometry is calculated by small pure functions so the layered cosmology remains legible and ND-safe.
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
Static offline HTML5 canvas renderer for the layered cosmology in Codex 144:99. Double-click `index.html`; no build steps, workflows, or network access are required.

## Files
- `index.html`: entry document with the 1440x900 canvas, palette loader, and header status note.
- `js/helix-renderer.mjs`: ES module that draws the Vesica grid, Tree-of-Life scaffold, Fibonacci curve, and double-helix lattice.
- `data/palette.json`: optional ND-safe palette override (background, ink, and six layer hues).

## Layered Output
1. **Vesica field**: intersecting circles form a nine by seven vesica matrix for depth.
2. **Tree-of-Life scaffold**: ten nodes and twenty-two connective paths mapped by numerology spacing.
3. **Fibonacci curve**: static golden spiral rendered once with gentle sampling.
4. **Double-helix lattice**: two phase-shifted strands with steady crossbars to maintain layered geometry.

## ND-safe Design
- No animation, timers, or autoplay elements. Every layer renders exactly once for sensory calm.
- Palette loads from `data/palette.json`; missing data triggers a safe fallback palette and an inline status notice.
- Colors and spacing reference the numerology constants 3, 7, 9, 11, 22, 33, 99, and 144 to honor the cosmology.
- Helper functions are small and pure so future adaptations remain reversible and lore-safe.

## Local Use (Offline)
1. Keep the files in their existing folders so the relative module and data imports resolve.
2. Optionally adjust `data/palette.json` to tune the calm palette while keeping six layer colors.
3. Open `index.html` directly in a modern browser (double-click). Chromium, Firefox, and WebKit builds render offline.
4. If the browser blocks local JSON fetches, the fallback palette renders automatically and the header reports the safe mode.

No bundlers, workflows, or external dependencies are introduced; the renderer remains lightweight and trauma-informed.
- `data/palette.json` - optional ND-safe palette override (background, ink, and six layer hues).
- `README_RENDERER.md` - this usage and safety guide.

## Rendered Layers
1. **Vesica field** - intersecting circles establish the base grid and depth.
2. **Tree-of-Life scaffold** - ten sephirot and twenty-two paths mapped with numerology spacing.
3. **Fibonacci curve** - static golden spiral drawn with gentle sampling (no animation).
4. **Double-helix lattice** - two phase-shifted strands plus steady rungs for layered geometry.

## ND-safe Design Notes
- No motion, autoplay, or flashing effects; the scene renders once when the page loads.
- Palette loads locally; if `data/palette.json` is missing or blocked, a built-in fallback palette renders and the header displays a notice.
- Colors follow a calm contrast hierarchy to support trauma-informed use.
- Geometry parameters derive from sacred numerology constants (3, 7, 9, 11, 22, 33, 99, 144) for traceable symbolism.

## Local Use
1. Keep the repository folders intact so relative imports resolve (`js/` and `data/`).
2. Optionally adjust `data/palette.json` with six layer hues that meet your contrast needs.
3. Double-click `index.html`. Modern browsers such as Firefox or Chromium-based builds render it offline without extra steps.
4. If palette loading fails because of local file sandbox rules, the fallback palette still renders and the status note confirms the safe mode.

This renderer stays intentionally lightweight: no bundlers, no workflows, and no external dependencies. All geometry is calculated by small pure functions to honor the project's layered cosmology without disturbing existing lore.
