# Cosmic Helix Renderer

A lightweight, offline HTML5 canvas renderer that keeps the Codex 144:99 cosmology calm and breathable. Double-click
`index.html` in any modern browser and the 1440x900 canvas will render once - no server, workflow, or external
dependencies required.

## File Map
- `index.html` - Entry point with the canvas element, palette loader, and inline status note.
- `js/helix-renderer.mjs` - ES module exporting `renderHelix` with small pure helpers for each sacred layer.
- `data/palette.json` - Optional palette override with background, ink, and six layer hues (ND-safe by default).
- `README_RENDERER.md` - This guide.
- `fly.toml` and `deploy/fly/Dockerfile` - Optional Fly.io handoff files for serving the static bundle without Netlify.

## Layered Composition (back to front)
1. **Vesica field** - Nine-by-seven grid of intersecting circles grounds the canvas and mirrors the vesica lattice.
2. **Tree-of-Life scaffold** - Ten sephirot nodes and twenty-two paths derived from the tarot correspondences; lore preserved.
3. **Fibonacci curve** - Static golden spiral polyline with ten quiet marker stones for orientation.
4. **Double-helix lattice** - Two phase-shifted strands with steady rungs, echoing the "Bridge of Circuits" reference image.

## Numerology Anchors
Geometry settings are driven by the requested constants 3, 7, 9, 11, 22, 33, 99, and 144. These values set:
- Vesica grid counts and circle radii.
- Vertical spacing of sephirot levels and path widths.
- Spiral sampling density and angular sweep.
- Helix amplitude, rung cadence, and calm rotations.

## Palette and Mood
The fallback palette mirrors the provided cathedral illustration: deep indigo stone, warm parchment ink, luminous
copper-gold strands, and cool mist blues. If `data/palette.json` is present it is loaded once; when the fetch fails in a
`file://` context the renderer quietly falls back and the header status reports the safe mode. No network calls are made
beyond that local request.

## Offline Use
1. Keep `index.html`, `js/`, and `data/` together.
2. Optionally adjust `data/palette.json` before opening the page.
3. Double-click `index.html` (Chromium, Firefox, and WebKit render offline without extra tooling).
4. Observe the header status for palette feedback; the canvas renders once and stays still.

## Fly.io Transition Notes
Netlify configuration is now considered legacy. To serve the static bundle on Fly.io without automation:
1. Install [`flyctl`](https://fly.io/docs/hands-on/install-flyctl/) locally.
2. Replace `app = "codex-helix-placeholder"` in `fly.toml` with your chosen app name and set an appropriate region.
3. Run `fly launch --no-deploy` once (it will respect the existing `fly.toml`).
4. Deploy manually with `fly deploy --local-only` - the provided `deploy/fly/Dockerfile` uses BusyBox `httpd` so the image
   remains tiny and aligned with the "no workflows" prime law.
5. Keep `netlify.toml` for historical reference only or remove it after migration.

## ND-safe Design Commitments
- No animation, timers, autoplay, flashing, or motion; rendering is a single synchronous pass.
- Calm contrast and generous spacing in the HTML frame keep the environment zen and breathable.
- Lore tables (tree paths, arcana) stay intact with comments explaining why, so heritage is respected.
- Functions remain small, pure, and well commented for offline auditing and gentle adaptation.
Static offline HTML5 canvas renderer for the layered cosmology in Codex 144:99. Double-click `index.html` in any modern browser; no server, workflow, or network access is required.

## Files
- `index.html` - Entry document with the 1440x900 canvas, palette loader, and header status notice.
- `js/helix-renderer.mjs` - ES module exporting `renderHelix` plus pure helpers for each geometric layer.
- `data/palette.json` - Optional ND-safe palette override (background, ink, and six layer hues).
- `README_RENDERER.md` - This usage and safety guide.

## Layer Stack
1. **Vesica field** (Layer 1) - Nine-by-seven grid of intersecting circles anchors the space with vesica overlaps.
2. **Tree-of-Life scaffold** (Layer 2) - Ten sephirot nodes and twenty-two connective paths drawn with numerology spacing.
3. **Fibonacci curve** (Layer 3) - Static golden spiral polyline sampled gently for calm focus.
4. **Double-helix lattice** (Layer 4) - Two phase-shifted strands with steady crossbars for depth, never implying motion.

## Numerology Anchors
Geometry parameters derive from the sacred constants 3, 7, 9, 11, 22, 33, 99, and 144. These values set grid counts, sampling density, spacing units, and strand turns so symbolism stays traceable and lore-safe.

## Palette and Fallback
- On load the page attempts to fetch `data/palette.json`. When the file is missing or the browser blocks file fetches, a calm fallback palette renders automatically and the header reports the safe mode.
- Adjust `palette.json` to suit your lighting conditions (six calm layer colors are expected). Keep contrast near WCAG AA for trauma-informed clarity.

## ND-safe Design Choices
- No animation, flashing, or autoplay; the canvas renders once on load to avoid sensory overload.
- Calm contrast with readable typography and generous spacing is maintained in both the HTML shell and the canvas layers.
- Lore from the cosmology dataset is preserved in the module so node/path names and numerology remain intact for future rituals.
- Pure functions and clear comments explain how each layer is derived, keeping adaptations reversible and offline-friendly.

## Offline Use
1. Keep the repository folders intact so relative imports resolve (`js/` and `data/`).
2. Optionally adjust `data/palette.json` before opening the page; provide background, ink, and six layer colors.
3. Double-click `index.html`. Chromium, Firefox, and WebKit render the canvas offline with no additional tooling.
4. If palette loading fails in file:// contexts, the fallback palette draws immediately and the status note acknowledges the safe mode.

This renderer stays intentionally lightweight: no workflows, no dependencies, and no background services. Geometry is calculated by small pure functions so the layered cosmology remains legible and trauma-informed.
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

## Offline Use
1. Keep the repository folders intact so relative imports resolve (`js/` and `data/`).
2. Optionally adjust `data/palette.json` before opening the page; provide background, ink, and six layer colors.
3. Double-click `index.html`. Chromium, Firefox, and WebKit render the canvas offline with no additional tooling.
4. If palette loading fails in file:// contexts, the fallback palette draws immediately and the status note acknowledges the safe mode.

This renderer stays intentionally lightweight: no workflows, no dependencies, and no background services. Geometry is calculated by small pure functions so the layered cosmology remains legible and trauma-informed.
