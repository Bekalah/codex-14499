import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

import { createCtxSpy } from './__canvasMock__.mjs';

const CANDIDATE_PATHS = [
  './helix-renderer.mjs',
  './src/helix-renderer.mjs',
  './lib/helix-renderer.mjs',
  '../helix-renderer.mjs',
  '../js/helix-renderer.mjs',
  '../src/helix-renderer.mjs',
  '../lib/helix-renderer.mjs'
];

async function loadModule() {
  let lastErr;
  for (const p of CANDIDATE_PATHS) {
    try {
      const mod = await import(p);
      if (mod && typeof mod.renderHelix === 'function') {
        return mod;
      }
    } catch (error) {
      lastErr = error;
    }
  }
  throw lastErr || new Error('helix-renderer.mjs not found in candidate paths');
}

describe('helix-renderer.mjs core helpers', () => {
  let mod;

  before(async () => {
    mod = await loadModule();
  });

  it('normalizeOptions returns defaults', () => {
    assert.ok(mod.normalizeOptions, 'normalizeOptions export missing');
    const options = mod.normalizeOptions({});
    assert.strictEqual(options.width, 1440);
    assert.strictEqual(options.height, 900);
    assert.ok(Array.isArray(options.palette.layers));
    assert.strictEqual(options.palette.layers.length, 6);
    assert.strictEqual(options.NUM.THREE, 3);
  });

  it('ensurePalette pads layer list', () => {
    if (!mod.ensurePalette) return;
    const palette = mod.ensurePalette({ bg: '#000', layers: ['#111'] });
    assert.strictEqual(palette.bg, '#000');
    assert.strictEqual(palette.layers.length, 6);
    assert.strictEqual(palette.layers[0], '#111');
  });

  it('ensureNumerology falls back for invalid numbers', () => {
    if (!mod.ensureNumerology) return;
    const num = mod.ensureNumerology({ THREE: 4, SEVEN: 0, ELEVEN: 'bad' });
    assert.strictEqual(num.THREE, 4);
    assert.notStrictEqual(num.SEVEN, 0);
    assert.ok(Number.isFinite(num.ELEVEN));
    assert.notStrictEqual(num.ELEVEN, 0);
  });

  it('helixPoint computes consistent endpoints', () => {
    if (!mod.helixPoint) return;
    const width = 1000;
    const verticalMargin = 10;
    const usableHeight = 500;
    const amplitude = 200;
    const waveFrequency = 3;
    const phase = Math.PI / 2;

    const start = mod.helixPoint(0, phase, width, verticalMargin, usableHeight, amplitude, waveFrequency);
    const end = mod.helixPoint(1, phase, width, verticalMargin, usableHeight, amplitude, waveFrequency);
    const centerX = width / 2;
    assert.ok(Math.abs(start.x - (centerX + amplitude)) < 1e-6);
    assert.ok(Math.abs(start.y - verticalMargin) < 1e-6);
    assert.ok(Math.abs(Math.abs(end.x - centerX) - amplitude) < 1e-6);
    assert.ok(Math.abs(end.y - (verticalMargin + usableHeight)) < 1e-6);
  });
});

describe('renderHelix integration', () => {
  let mod;

  before(async () => {
    mod = await loadModule();
  });

  it('handles falsy context gracefully', () => {
    assert.doesNotThrow(() => mod.renderHelix(null));
    assert.doesNotThrow(() => mod.renderHelix(undefined));
  });

  it('paints expected primitives on mocked context', () => {
    const { ctx, calls } = createCtxSpy();
    assert.doesNotThrow(() => mod.renderHelix(ctx, {}));
    const names = calls.map((entry) => entry.name);
    assert.ok(names.includes('setTransform'));
    assert.ok(names.includes('clearRect'));
    assert.ok(names.includes('set:fillStyle'));
    assert.ok(names.includes('fillRect'));
    assert.ok(names.some((name) => ['arc', 'moveTo', 'lineTo', 'stroke'].includes(name)));
  });

  it('respects custom palette background', () => {
    const { ctx, calls } = createCtxSpy();
    const palette = { bg: '#101010', ink: '#eeeeee', layers: ['#1', '#2', '#3', '#4', '#5', '#6', '#extra'] };
    mod.renderHelix(ctx, { width: 800, height: 600, palette });
    const bgSets = calls.filter((c) => c.name === 'set:fillStyle').map((c) => c.args[0]);
    assert.ok(bgSets.includes('#101010'));
  });
});

describe('drawCircle primitive', () => {
  it('strokes only when fill flag false', async () => {
    const mod = await loadModule();
    if (!mod.drawCircle) return;
    const { ctx, calls } = createCtxSpy();
    mod.drawCircle(ctx, 10, 20, 5, false);
    const names = calls.map((c) => c.name);
    assert.deepStrictEqual(names.slice(0, 2), ['beginPath', 'arc']);
    assert.ok(names.includes('stroke'));
    assert.ok(!names.includes('fill'));
  });

  it('fills then strokes when fill flag true', async () => {
    const mod = await loadModule();
    if (!mod.drawCircle) return;
    const { ctx, calls } = createCtxSpy();
    mod.drawCircle(ctx, 10, 20, 5, true);
    const names = calls.map((c) => c.name);
    const arcIndex = names.indexOf('arc');
    const fillIndex = names.indexOf('fill');
    const strokeIndex = names.indexOf('stroke');
    assert.ok(arcIndex >= 0);
    assert.ok(fillIndex > arcIndex);
    assert.ok(strokeIndex > fillIndex);
  });
});
