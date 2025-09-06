# Cosmic Helix Renderer

Offline HTML+Canvas sketch encoding layered sacred geometry.

## Layers
1. **Vesica field** – two intersecting circles framing the space.
2. **Tree of Life** – ten sephirot nodes with twenty‑two connecting paths.
3. **Fibonacci curve** – logarithmic spiral built from the Golden Ratio.
4. **Double helix** – two phase‑shifted strands forming a static lattice.

The order above is the rendering order; later layers overlay earlier ones to maintain legibility.

## Numerology
Geometry is parameterised with constants `3, 7, 9, 11, 22, 33, 99, 144` exposed in `index.html` as `NUM`.
Values can be tuned by editing the script; no rebuild step is required.

## ND‑Safe Choices
- No motion or autoplay; a single frame is drawn on load.
- Palette offers high contrast (~12:1 between `bg` and `ink`).
- All code is plain ES modules without external network requests.
- Touch/keyboard safe: canvas has a descriptive `aria-label`.

## Running
Double‑click `index.html` in any modern browser. If `data/palette.json` is missing the renderer uses a built‑in fallback palette and displays a small notice.

## Future Work
- Verify palette contrast ratio automatically.
- Allow runtime configuration of numerology constants from JSON.
- Include optional static screenshot for quick preview.
- Cross‑browser offline testing of color rendering.
