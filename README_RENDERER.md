Per Texturas Numerorum, Spira Loquitur.  //
# Cosmic Helix Renderer

Static offline canvas renderer for layered sacred geometry in Codex 144:99. Double-click `index.html` in any modern browser—no server or network calls.

## Files
- `index.html` – entry point with 1440×900 canvas and safe palette fallback.
- `js/helix-renderer.mjs` – ES module with pure drawing functions.
- `data/palette.json` – optional ND-safe color palette.

## Layer Math
1. **Vesica field** – two circles radius `min(w,h)/3` forming a vesica piscis.
2. **Tree-of-Life scaffold** – ten sephirot positioned proportionally with twenty-two connecting paths.
3. **Fibonacci curve** – 33-point logarithmic spiral using the Golden Ratio.
4. **Static double-helix lattice** – two phase-shifted sine waves with 11 turns.

All geometry constants come from the set {3, 7, 9, 11, 22, 33, 99, 144}.

## ND-safe Design
- No motion or autoplay; static canvas only.
- Calming contrast and soft colors for readability.
- Palette loads from `data/palette.json`; missing file triggers a safe fallback notice.

## Local Use
Open `index.html` directly in any modern browser.

## Tests
Run local checks:

```sh
npm test
npm run contrast
npm run dedup
```

These verify palette structure, contrast ratios, and duplicate lines.

## Notes
- Works completely offline.
- All code uses ASCII quotes, UTF-8, and LF newlines.
