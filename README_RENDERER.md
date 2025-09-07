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

## Geometry Constants

Numerology values (3,7,9,11,22,33,99,144) may be tweaked in `data/geometry.json`. Missing file reverts to the default set encoded in `index.html`.

## ND-safe Design

- No motion or autoplay
- Calming contrast and soft colors
- Pure ES module, no dependencies, no builds
