# Cosmic Helix Renderer


Static HTML+Canvas renderer for layered sacred geometry. ND-safe and offline-first.

## Layers
1. Vesica field
2. Tree-of-Life scaffold
3. Fibonacci curve
4. Double-helix lattice

## Usage
1. Double-click `index.html`.
2. If `data/palette.json` is missing, the renderer falls back to a safe palette.

No network, build, or runtime dependencies.
=======
Static, offline HTML + Canvas module that draws layered sacred geometry.

## Files
- `index.html` – entry point; open directly in a browser.
- `js/helix-renderer.mjs` – ES module with pure draw functions.
- `data/palette.json` – optional palette override; delete to use defaults.

## Usage
1. Double-click `index.html` (no server needed).
2. A 1440x900 canvas renders four layers:
   - Vesica field
   - Tree-of-Life nodes and paths
   - Fibonacci curve
   - Static double-helix lattice
3. If `data/palette.json` is missing, a fallback palette is used and a note appears.

## ND-Safe Notes
- No motion, autoplay, or external requests.
- Soft contrast palette with readable text.
- Geometry uses numerology constants (3,7,9,11,22,33,99,144) for proportions.
- Code is plain ES modules; no build tools or dependencies.

