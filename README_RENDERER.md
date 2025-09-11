Per Texturas Numerorum, Spira Loquitur.  //
# Cosmic Helix Renderer

Static offline canvas renderer for layered sacred geometry in Codex 144:99. Double-click `index.html` in any modern browser—no server or network calls.

## Files
- `index.html` – 1440×900 canvas with palette fallback.
- `js/helix-renderer.mjs` – pure ES module drawing functions.
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
- If `data/palette.json` is missing, a built-in palette is used.

## Local Use
Open `index.html` directly in any modern browser.

## Tests
Run local checks:

```sh
npm test
```
