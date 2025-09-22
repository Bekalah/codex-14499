# Cosmic Helix Renderer

Static, offline HTML5 canvas scene that preserves the layered cosmology of Codex 144:99. Double-click `index.html` in any
modern browser and the 1440x900 canvas renders once--no build steps, no automation, and no network access are required.

## Quick Start (Offline)
1. Keep the repository folders together so relative imports resolve (`js/` and `data/`).
2. Optionally adjust `data/palette.json` to tune background, ink, and six layer hues before opening the page.
3. Double-click `index.html`. Chromium, Firefox, and WebKit engines render the composition fully offline.
4. Watch the header status: it reports whether the custom palette loaded or a calm fallback activated.

## Layer Stack (Back -> Front)
1. **Vesica field** - Seven-by-nine lattice of overlapping circles grounds the scene. Radii and spacing rely on the constants
   3, 7, 9, 11, and 33.
2. **Tree-of-Life scaffold** - Ten sephirot nodes spaced with 22-step vertical units and horizontal multiples of 3 and 7.
   Twenty-two connective paths trace the tarot correspondences.
3. **Fibonacci curve** - Static golden spiral sampled with 99 points. Marker stones placed along the curve provide quiet wayfinding.
4. **Double-helix lattice** - Two steady strands oscillate with sine geometry derived from the 3x99 cadence, joined by 22 crossbars.

## Numerology Map
- **3 / 7 / 9** - Determine vesica overlaps, helix oscillation cadence, and base radius for the Fibonacci spiral.
- **11 / 22 / 33** - Set margins, Tree-of-Life level spacing, and sephirot sizing.
- **99** - Controls sampling density for both the spiral and helix strands, ensuring the render stays smooth without motion.
- **144** - Provides the vertical unit grid and base canvas dimensions, keeping the cosmology anchored to the Codex number.

## Palette and Safety
- The module attempts to read `data/palette.json` once. When browsers block the request in `file://` contexts the renderer falls
  back to a bundled ND-safe palette and posts a gentle inline notice.
- CSS custom properties sync with the active palette so the HTML frame and canvas share the same contrast profile.
- No external fonts, scripts, or analytics are loaded; everything stays local for offline auditing.

## File Map
- `index.html` - Entry point with the canvas element, palette loader, and ND-safe status copy.
- `js/helix-renderer.mjs` - Pure ES module exporting `renderHelix` plus helpers for each geometric layer.
- `data/palette.json` - Optional palette override (background, ink, six layer colors).
- `deploy/fly/Dockerfile` - BusyBox server image for Fly.io handoff.
- `fly.toml` - Sample Fly.io app definition; update the `app` name before deploying.

## Fly.io Notes (Manual Deployment)
1. Install [`flyctl`](https://fly.io/docs/hands-on/install-flyctl/) locally.
2. Edit `fly.toml` to set the final app name and preferred region.
3. Run `fly launch --no-deploy` once so Fly registers the project without generating new files.
4. Deploy with `fly deploy --local-only` to build the included BusyBox image. It serves everything from `/srv/cosmic` with no
   runtimes or workflows.

## ND-safe Design Commitments
- No animation, timers, video, or autoplay. The scene renders once and stays still.
- Comments explain sensory choices and numerology mapping for future caretakers.
- Functions remain small and pure so geometry can be adapted offline without new tooling.
- Color palette favors calm contrast and large text to reduce sensory load.
