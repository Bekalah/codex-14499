Per Texturas Numerorum, Spira Loquitur.  //
# Cosmic Helix Renderer

Static offline canvas renderer for layered sacred geometry in Codex 144:99.
Double-click `index.html` in any modern browser—no server or network calls.

## Files
- `index.html` – entry point with 1440×900 canvas and safe palette fallback.
- `js/helix-renderer.mjs` – ES module with pure drawing functions.
- `data/palette.json` – optional ND-safe color palette.

## Layers
1. Vesica field
2. Tree-of-Life scaffold
3. Fibonacci curve
4. Static double-helix lattice

## ND-safe Design
- No motion or autoplay; static canvas only.
- Calming contrast and soft colors for readability.
- Geometry uses constants 3, 7, 9, 11, 22, 33, 99, 144.
- Palette and constants load from local JSON; if missing, safe defaults are used.

## Numerology as Spiral Grammar
The project's numbers form a Fibonacci-coded scaffold rather than decorative wallpaper:

- **21 pillars** — Fibonacci step (8 + 13) aligned with Tarot majors and the 21 Taras; pillars spiral upward as thresholds.
- **33 spine** — vertebral initiations; not Fibonacci itself but a harmonic 3 × 11 ladder.
- **72 Shem angels/demons** — 8 × 9 lunar decans, a sacred 12-multiple tracing lunar phases.
- **78 archetypes** — Tarot complete (22 + 56), weaving majors and minors into one continuum.
- **99 gates** — triplicity (3 × 33) expanding the spine into recursive gateways.
- **144 lattice** — 12², the eighth Fibonacci number forming the Codex's base grid.
- **243 completion** — 3⁵, quintuple power of the triad sealing the Cathedral.

## Customization
- Edit `data/palette.json` to change colors.
- Optionally add `data/constants.json` with numerology values to tweak proportions.

## Local Use
Open `index.html` directly in any modern browser.
- No motion, autoplay, or external requests.
- Calming contrast and soft colors.
- Geometry uses numerology constants 3,7,9,11,22,33,99,144.

## Tests
Run local checks:

```sh
npm test
```
## Notes
- ND-safe: calm contrast, no motion, optional palette override.
- All geometry uses constants 3, 7, 9, 11, 22, 33, 99, 144.
- If `data/palette.json` is missing, a built-in fallback palette renders instead.
- Works completely offline; open `index.html` directly.
