// Test framework: uses the repository's configured JS test runner (e.g., Jest/Vitest) with ESM (.mjs) tests.
// Note on framework: Jest-style assertions (expect/describe/test) with ESM test files.
// If repository uses Vitest, these tests also run unmodified (vi is not required here).

import { createCtxSpy } from './__canvasMock__.mjs';

// Resolve module path by trying common locations; replace with actual path if available in repo.
const CANDIDATE_PATHS = [
  './helix-renderer.mjs',
  './src/helix-renderer.mjs',
  './lib/helix-renderer.mjs',
  '../helix-renderer.mjs',
  '../src/helix-renderer.mjs',
  '../lib/helix-renderer.mjs'
];

async function loadModule() {
  let lastErr;
  for (const p of CANDIDATE_PATHS) {
    try {
      const mod = await import(p);
      if (mod && typeof mod.renderHelix === 'function') return mod;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('helix-renderer.mjs not found in candidate paths');
}

describe('helix-renderer.mjs core helpers', () => {
  let mod;
  beforeAll(async () => {
    mod = await loadModule();
  });

  test('normalizeOptions: defaults applied when opts empty', () => {
    const { width, height, palette, NUM } = mod.__proto__.constructor === Function ? mod.normalizeOptions({}) : mod.normalizeOptions({});
    // Note: normalizeOptions is not exported in the snippet; if it is not exported in the repo,
    // access via mod.normalizeOptions will fail. In that case, skip these helper tests gracefully.
    expect(typeof width).toBe('number');
    expect(typeof height).toBe('number');
    expect(palette).toBeDefined();
    expect(Array.isArray(palette.layers)).toBe(true);
    expect(palette.layers).toHaveLength(6);
    // NUM constants
    expect(NUM.THREE).toBeGreaterThan(0);
    expect(NUM.SEVEN).toBeGreaterThan(0);
    expect(NUM.NINETYNINE).toBeGreaterThan(0);
  });

  test('ensurePalette: pads/truncates layers and defaults bg/ink', () => {
    if (!(mod && mod.ensurePalette)) return; // skip if not exported
    const partial = { layers: ['#111', '#222'], bg: 123, ink: null };
    const pal = mod.ensurePalette(partial);
    expect(pal.bg).toBeDefined();
    expect(typeof pal.bg).toBe('string');
    expect(typeof pal.ink).toBe('string');
    expect(pal.layers).toHaveLength(6);
    expect(pal.layers[0]).toBe('#111');
    expect(pal.layers[1]).toBe('#222');
  });

  test('ensurePalette: uses defaults when input invalid', () => {
    if (!(mod && mod.ensurePalette)) return;
    const pal = mod.ensurePalette(null);
    expect(pal).toHaveProperty('bg');
    expect(pal).toHaveProperty('ink');
    expect(pal.layers).toHaveLength(6);
  });

  test('ensureNumerology: accepts finite non-zero values; falls back otherwise', () => {
    if (!(mod && mod.ensureNumerology)) return;
    const custom = { THREE: 4, SEVEN: 0, ELEVEN: 'not-a-number' };
    const num = mod.ensureNumerology(custom);
    expect(num.THREE).toBe(4);
    // 0 and NaN should fall back to defaults (not 0 or NaN)
    expect(num.SEVEN).not.toBe(0);
    expect(Number.isFinite(num.ELEVEN)).toBe(true);
    expect(num.ELEVEN).not.toBe(0);
  });

  test('helixPoint: returns expected coordinates for t=0 and t=1', () => {
    if (!(mod && mod.helixPoint)) return;
    const width = 1000;
    const verticalMargin = 10;
    const usableHeight = 500;
    const amplitude = 200;
    const waveFrequency = 3;
    const phase = Math.PI / 2;

    const p0 = mod.helixPoint(0, phase, width, verticalMargin, usableHeight, amplitude, waveFrequency);
    const centerX = width / 2;
    // sin(phase) = 1 at PI/2
    expect(p0.x).toBeCloseTo(centerX + amplitude, 5);
    expect(p0.y).toBeCloseTo(verticalMargin, 5);

    const p1 = mod.helixPoint(1, phase, width, verticalMargin, usableHeight, amplitude, waveFrequency);
    // sin(3*pi + phase) = sin(3*pi + PI/2) = sin(7*PI/2) = 1
    expect(p1.x).toBeCloseTo(centerX + amplitude, 5);
    expect(p1.y).toBeCloseTo(verticalMargin + usableHeight, 5);
  });
});

describe('renderHelix integration with mocked 2D context', () => {
  let mod;
  beforeAll(async () => {
    mod = await loadModule();
  });

  test('renderHelix: returns early when ctx is falsy', () => {
    expect(() => mod.renderHelix(null)).not.toThrow();
    expect(() => mod.renderHelix(undefined)).not.toThrow();
  });

  test('renderHelix: paints without throwing with default options', () => {
    const { ctx, calls } = createCtxSpy();
    expect(() => mod.renderHelix(ctx, {})).not.toThrow();
    // Expect background preparation: setTransform, clearRect, fillStyle set, fillRect
    const names = calls.map(c => c.name);
    expect(names).toContain('setTransform');
    expect(names).toContain('clearRect');
    expect(names).toContain('set:fillStyle');
    expect(names).toContain('fillRect');
    // Expect some drawing operations occurred
    expect(names.filter(n => n === 'arc' || n === 'moveTo' || n === 'lineTo' || n === 'stroke').length).toBeGreaterThan(0);
  });

  test('renderHelix: respects custom dimensions and palette', () => {
    const { ctx, calls } = createCtxSpy();
    const palette = { bg: '#101010', ink: '#eeeeee', layers: ['#1', '#2', '#3', '#4', '#5', '#6', '#extra'] };
    mod.renderHelix(ctx, { width: 800, height: 600, palette });
    // Should set background color we provided
    const bgSets = calls.filter(c => c.name === 'set:fillStyle').map(c => c.args[0]);
    expect(bgSets).toContain('#101010');
  });
});

// drawCircle is file-internal in snippet; if exported, exercise it.
describe('drawCircle primitive', () => {
  test('drawCircle: stroke only when fill=false', async () => {
    const mod = await loadModule();
    if (!(mod && mod.drawCircle)) return; // skip if not exported
    const { ctx, calls } = createCtxSpy();
    mod.drawCircle(ctx, 10, 20, 5, false);
    const names = calls.map(c => c.name);
    expect(names.slice(0, 2)).toEqual(['beginPath', 'arc']);
    expect(names).toContain('stroke');
    expect(names).not.toContain('fill');
  });

  test('drawCircle: fill then stroke when fill=true', async () => {
    const mod = await loadModule();
    if (!(mod && mod.drawCircle)) return; // skip if not exported
    const { ctx, calls } = createCtxSpy();
    mod.drawCircle(ctx, 10, 20, 5, true);
    const names = calls.map(c => c.name);
    // fill then stroke order after arc
    const arcIndex = names.indexOf('arc');
    const fillIndex = names.indexOf('fill');
    const strokeIndex = names.indexOf('stroke');
    expect(arcIndex).toBeGreaterThan(-1);
    expect(fillIndex).toBeGreaterThan(arcIndex);
    expect(strokeIndex).toBeGreaterThan(fillIndex);
  });
});
// Notes: This suite is compatible with Jest or Vitest in ESM mode. It avoids framework-specific matchers beyond expect/describe/test.