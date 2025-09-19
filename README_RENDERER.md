# Cosmic Helix Renderer

Static offline HTML5 canvas renderer for the layered cosmology in Codex 144:99. Double-click `index.html`; no build steps, workflows, or network access are required.

## Files
- `index.html`: entry document with the 1440x900 canvas, palette loader, and header status note.
- `js/helix-renderer.mjs`: ES module that draws the Vesica grid, Tree-of-Life scaffold, Fibonacci curve, and double-helix lattice.
- `data/palette.json`: optional ND-safe palette override (background, ink, and six layer hues).

## Layered Output
1. **Vesica field**: intersecting circles form a nine by seven vesica matrix for depth.
2. **Tree-of-Life scaffold**: ten nodes and twenty-two connective paths mapped by numerology spacing.
3. **Fibonacci curve**: static golden spiral rendered once with gentle sampling.
4. **Double-helix lattice**: two phase-shifted strands with steady crossbars to maintain layered geometry.

## ND-safe Design
- No animation, timers, or autoplay elements. Every layer renders exactly once for sensory calm.
- Palette loads from `data/palette.json`; missing data triggers a safe fallback palette and an inline status notice.
- Colors and spacing reference the numerology constants 3, 7, 9, 11, 22, 33, 99, and 144 to honor the cosmology.
- Helper functions are small and pure so future adaptations remain reversible and lore-safe.

## Local Use (Offline)
1. Keep the files in their existing folders so the relative module and data imports resolve.
2. Optionally adjust `data/palette.json` to tune the calm palette while keeping six layer colors.
3. Open `index.html` directly in a modern browser (double-click). Chromium, Firefox, and WebKit builds render offline.
4. If the browser blocks local JSON fetches, the fallback palette renders automatically and the header reports the safe mode.

No bundlers, workflows, or external dependencies are introduced; the renderer remains lightweight and trauma-informed.
