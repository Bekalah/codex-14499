/**
 * NOTE: Test runner detection
 * This repository appears to use a JavaScript testing framework (e.g., Jest or Vitest).
 * The tests below use the common describe/test/expect API supported by both.
 * No external dependencies are introduced.
 */

/**
 * Palette JSON validation tests
 *
 * Test framework note:
 * - This suite is compatible with Jest and Vitest (shared BDD API: describe/test/expect).
 * - No new deps; uses Node's fs/path only.
 *
 * Focus: Validate the palette JSON introduced/modified in the PR diff.
 * Ensures schema, value correctness, uniqueness, and WCAG contrast.
 */

'use strict';

const fs = require('fs');
const path = require('path');

/** Helper: robust file existence check */
function exists(p) {
  try { fs.accessSync(p, fs.constants.F_OK); return true; } catch { return false; }
}

/** Helper: read and parse JSON */
function readJson(jsonPath) {
  return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}

/** Try common candidate locations first; fall back to a shallow repo scan (bounded) */
function findPalettePath() {
  const REPO_ROOT = path.resolve(__dirname, '..');
  const candidates = [
    'palette.json',
    'src/palette.json',
    'config/palette.json',
    'assets/palette.json',
    'theme/palette.json',
    'src/theme/palette.json',
    'public/palette.json',
    'data/palette.json',
    'app/palette.json',
    'client/palette.json',
    'frontend/palette.json',
    'web/palette.json',
    'resources/palette.json',
    'packages/palette.json'
  ].map(p => path.join(REPO_ROOT, p));

  for (const c of candidates) {
    if (exists(c)) return c;
  }

  // Bounded breadth-first scan up to depth 3, skipping heavy dirs
  const skip = new Set(['node_modules', 'dist', 'build', '.git', '.next', '.turbo', '.cache']);
  const queue = [{ dir: REPO_ROOT, depth: 0 }];
  while (queue.length) {
    const { dir, depth } = queue.shift();
    if (depth > 3) continue;
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      if (skip.has(e.name)) continue;
      const full = path.join(dir, e.name);
      if (e.isFile() && e.name === 'palette.json') return full;
      if (e.isDirectory()) queue.push({ dir: full, depth: depth + 1 });
    }
  }

  throw new Error('palette.json not found in common locations; please place it in the repo root or src/');
}

/** Color utilities */
function isHex6(color) {
  return typeof color === 'string' && /^#[0-9a-fA-F]{6}$/.test(color);
}
function hexToRgb(hex) {
  const m = /^#([0-9a-fA-F]{6})$/.exec(hex);
  if (!m) {
    throw new Error('Invalid hex: ' + hex);
  }
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
}
function srgbToLinear(u8) {
  const c = u8 / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function relativeLuminance(rgb) {
  const R = srgbToLinear(rgb.r);
  const G = srgbToLinear(rgb.g);
  const B = srgbToLinear(rgb.b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
function contrastRatio(hex1, hex2) {
  const L1 = relativeLuminance(hexToRgb(hex1));
  const L2 = relativeLuminance(hexToRgb(hex2));
  const [lighter, darker] = L1 >= L2 ? [L1, L2] : [L2, L1];
  return (lighter + 0.05) / (darker + 0.05);
}

/** Expected values from the PR diff focus */
const EXPECTED = {
  bg: '#0b0b12',
  ink: '#e8e8f0',
  layers: ['#b1c7ff', '#89f7fe', '#a0ffa1', '#ffd27f', '#f5a3ff', '#d0d0e6'],
};

describe('palette.json schema and values', () => {
  let palettePath;
  let palette;

  beforeAll(() => {
    palettePath = findPalettePath();
    palette = readJson(palettePath);
  });

  test('file is present and parseable JSON', () => {
    expect(typeof palette).toBe('object');
    expect(palette).not.toBeNull();
  });

  test('has required top-level keys with correct types', () => {
    expect(Object.prototype.hasOwnProperty.call(palette, 'bg')).toBe(true);
    expect(Object.prototype.hasOwnProperty.call(palette, 'ink')).toBe(true);
    expect(Object.prototype.hasOwnProperty.call(palette, 'layers')).toBe(true);

    expect(typeof palette.bg).toBe('string');
    expect(typeof palette.ink).toBe('string');
    expect(Array.isArray(palette.layers)).toBe(true);
  });

  test('bg and ink are valid 6-digit hex colors', () => {
    expect(isHex6(palette.bg)).toBe(true);
    expect(isHex6(palette.ink)).toBe(true);
  });

  test('layers is a non-empty array of valid 6-digit hex colors', () => {
    expect(palette.layers.length).toBeGreaterThan(0);
    for (const c of palette.layers) {
      expect(isHex6(c)).toBe(true);
    }
  });

  test('no duplicates within layers; and bg/ink are not included in layers', () => {
    const set = new Set(palette.layers);
    expect(set.size).toBe(palette.layers.length);
    expect(palette.layers).not.toContain(palette.bg);
    expect(palette.layers).not.toContain(palette.ink);
  });

  test('contrast ratio between bg and ink meets WCAG AA for normal text (>= 4.5:1)', () => {
    const ratio = contrastRatio(palette.bg, palette.ink);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('bg is dark and ink is light (sanity check on luminance ordering)', () => {
    const Lbg = relativeLuminance(hexToRgb(palette.bg));
    const Link = relativeLuminance(hexToRgb(palette.ink));
    expect(Lbg).toBeLessThan(Link);
  });

  test('matches expected values from PR diff (explicit regression lock)', () => {
    expect(palette.bg.toLowerCase()).toBe(EXPECTED.bg);
    expect(palette.ink.toLowerCase()).toBe(EXPECTED.ink);
    // Order-sensitive equality to catch accidental reordering
    expect(palette.layers.map(s => s.toLowerCase())).toEqual(EXPECTED.layers);
  });
});

/** Additional unit tests for helpers to guard against regressions in validation logic */
describe('color helpers', () => {
  test('isHex6 validates correctly', () => {
    expect(isHex6('#000000')).toBe(true);
    expect(isHex6('#fffFFF')).toBe(true);
    expect(isHex6('#abc')).toBe(false);
    expect(isHex6('fff')).toBe(false);
    expect(isHex6('#GGGGGG')).toBe(false);
  });

  test('contrastRatio returns a numeric value >= 1', () => {
    const r = contrastRatio('#000000', '#ffffff');
    expect(typeof r).toBe('number');
    expect(r).toBeGreaterThanOrEqual(1);
  });
});