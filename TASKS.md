## Working

- [x] Replaced broken helix renderer with a static HTML+Canvas version using layered sacred geometry.
- [x] Palette loads from `data/palette.json` with a safe fallback if the file is missing.

## To Do


- [ ] Provide contrast ratio verification for palette to ensure ND-safe readability.

- [x] Provide contrast ratio verification for palette to ensure ND-safe readability.

- [x] Allow geometry constants (e.g., 3,7,9,11,22,33,99,144) to be adjusted via a small JSON config for experimentation.
- [ ] Document layer math in greater depth in `README_RENDERER.md` to aid future contributors.
- [ ] Add optional screenshot of rendered canvas to `README_RENDERER.md` for quick preview.
- [ ] Test renderer across additional browsers to confirm offline fetch behavior and color rendering.
- [ ] Introduce style toggles to adapt visuals for book, learning, or music modes without breaking ND-safe rules.
