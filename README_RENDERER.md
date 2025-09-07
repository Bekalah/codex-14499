# Cosmic Helix Renderer

Static HTML+Canvas demo rendering layered sacred geometry.

## Layers
1. **Vesica Field** – two intersecting circles form the base harmony.
2. **Tree-of-Life** – ten nodes and twenty-two paths drawn over the vesica.
3. **Fibonacci Curve** – logarithmic spiral referencing the Golden Ratio.
4. **Double-Helix Lattice** – two sine waves locked in phase opposition.

All layers are drawn in this order to avoid visual overload and to keep the image ND-safe (no motion, soft palette, high contrast).

## Usage
Open `index.html` directly in any modern browser. The script loads `data/palette.json` and `data/constants.json` if present and also reads `assets/data/registry.json` for cross-repo lookup. Missing files fall back to safe defaults.

An interface snapshot combining local and remote layers is exposed at `window.__CATHEDRAL_VIEW__` after validation against `assets/data/interface.schema.json`.

## Geometry Constants
Numerology values such as 3,7,9,11,22,33,99,144 can be tweaked via `data/constants.json`:
```json
{
  "THREE":3,
  "SEVEN":7,
  "NINE":9,
  "ELEVEN":11,
  "TWENTYTWO":22,
  "THIRTYTHREE":33,
  "NINETYNINE":99,
  "ONEFORTYFOUR":144
}
```

## Palette Contrast
At start the script verifies contrast between `bg` and `ink` colors and reports the ratio in the header. Ratios under 4.5:1 are flagged for readability.

## Preview
An optional screenshot of the rendered canvas can be placed at `docs/preview.png` and linked here:

![preview](docs/preview.png)

## Layer Math
- Vesica radius = min(width, height) / 3.
- Tree-of-Life node positions are simple fractions of width/height to keep arithmetic transparent.
- Fibonacci spiral uses `r = scale * phi^(theta/(π/2))` where `phi` is the Golden Ratio.
- Helix strands sample `sin()` across `ONEFORTYFOUR` points with a symbolic turn count of `THIRTYTHREE / ELEVEN`.

## ND-Safe Considerations
- No animation, autoplay, or flashing.
- Gentle colors with contrast checked at load time.
- Canvas is the only rendering target; works offline.
