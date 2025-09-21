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
