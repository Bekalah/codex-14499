```
0     1     0     1     0     1     0
 \   / \   / \   / \   / \   / \   /
  \ /   \ /   \ /   \ /   \ /   \ /
  / \   / \   / \   / \   / \   / \
 /   \ /   \ /   \ /   \ /   \ /   \
1     0     1     0     1     0     1
```

# Cosmic Helix Renderer
*Per Texturas Numerorum, Spira Loquitur*

Static offline canvas renderer for layered sacred geometry.

## Usage

1. Double-click `index.html` in any modern browser.
2. The 1440x900 canvas will draw without network access or libraries.

## Layers

1. Vesica field — establishes a harmonic grid of intersecting circles.
2. Tree-of-Life scaffold — 10 sephirot with 22 connecting paths.
3. Fibonacci curve — static growth spiral based on the golden ratio.
4. Double-helix lattice — two phase-shifted waves joined by rungs.

## Palette

Colors come from `data/palette.json`. If the file is missing the renderer falls back to a safe default and notes this inline.


## Geometry Constants

Proportions are derived from numerology values (3,7,9,11,22,33,99,144). To experiment, create `data/constants.json`:

```json
{
  "THREE": 3,
  "SEVEN": 7,
  "NINE": 9,
  "ELEVEN": 11,
  "TWENTYTWO": 22,
  "THIRTYTHREE": 33,
  "NINETYNINE": 99,
  "ONEFORTYFOUR": 144
}
```

If absent, defaults are used and a notice appears in the header.


Numerology constants (3,7,9,11,22,33,99,144) may be tweaked via `data/constants.json`. Delete the file to restore defaults.

To check color contrast ratios against the background, run:

```sh
npm run contrast
```

## ND-safe Design

- No motion, autoplay, or external requests.
- Calming contrast and soft colors for readability.
- Geometry uses numerology constants (3,7,9,11,22,33,99,144) for proportions.
- Pure ES module; no dependencies or build tools.

## References

Bibliography entries live in `data/citations.json`, including:

- W3C Web Accessibility Initiative, "Audio and Video: Accessible Alternatives," 2019.

## Tests

Offline reassurance without workflow pipes:

```sh
npm test
```

This uses Node's script runner to call `pytest -q`, keeping everything local and dependency-free.

## Duplicate Line Cleaner

Accidental double pushes can create duplicate lines. Scan the repo:

```sh
npm run dedup
```

Remove duplicates in-place (edit with care):

```sh
npm run dedup:fix
```
