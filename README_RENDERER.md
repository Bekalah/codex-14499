# Cosmic Helix Renderer

Offline, ND-safe canvas study of layered sacred geometry.

## What it draws
- Vesica grid (interlocking circles) — establishes harmonic field.
- Tree-of-Life nodes and 22 paths — central scaffold.
- Fibonacci curve — growth spiral, static.
- Double-helix lattice — two phase-shifted waves with rungs.

Palette is read from `data/palette.json`; missing file falls back to built-in safe colors.
No animation, no audio, no network requests.

## Usage
1. Keep `index.html`, `js/helix-renderer.mjs`, and `data/palette.json` together.
2. Double-click `index.html` (no server required).
3. If the palette file is absent, a notice appears and defaults are used.

## ND-Safe Notes
- No motion, autoplay, or external requests.
- Soft contrast palette with readable text.
- Geometry uses numerology constants (3,7,9,11,22,33,99,144) for proportions.
- Code is plain ES modules; no build tools or dependencies.
