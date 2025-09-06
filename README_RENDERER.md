# Cosmic Helix Renderer

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
