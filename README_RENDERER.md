# Cosmic Helix Renderer

Static offline canvas renderer for layered sacred geometry.

## Usage

1. Double-click `index.html` in any modern browser.
2. The 1440x900 canvas will draw without network access or libraries.

## Layers

1. Vesica field
2. Tree-of-Life scaffold
3. Fibonacci curve
4. Static double-helix lattice

## Palette

Colors come from `data/palette.json`. If the file is missing the renderer falls back to a safe default and notes this inline.

## ND-safe Design

- No motion or autoplay
- Calming contrast and soft colors
- Pure ES module, no dependencies, no builds

## Tests

Offline reassurance without workflow pipes:

```sh
npm test
```

This uses Node's script runner to call `pytest -q`, keeping everything local and dependency-free.
