/**
 * Test suite for index.html inline module:
 * Framework & environment note:
 * - This test is written for a Node-based test runner with a JSDOM-like environment.
 * - It should run under either:
 *   - Jest with testEnvironment: 'jsdom' (common), using expect/describe/it semantics, or
 *   - Vitest with environment jsdom (vi is optional; we avoid framework-specific spies).
 * We avoid new dependencies and rely on global fetch (Node >=18) and DOM globals from the runner.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Minimal runner-agnostic helpers for describe/it if needed (in case 'node:test' or other):
const hasGlobal = (n) => typeof globalThis[n] !== 'undefined';
const d = hasGlobal('describe') ? globalThis.describe : (name, fn) => { console.log('Suite:', name); fn(); };
const i = hasGlobal('it') ? globalThis.it : (name, fn) => { try { fn(); console.log('  ✓', name);} catch (e) { console.error('  ✗', name, e); throw e; } };
const b = hasGlobal('beforeEach') ? globalThis.beforeEach : (fn) => fn();
const a = hasGlobal('afterEach') ? globalThis.afterEach : (fn) => fn();

// Expect polyfill: use global expect if present, otherwise provide a minimal implementation.
const expectFn = hasGlobal('expect') ? globalThis.expect : function (val) {
  return {
    toBe: function (exp) {
      if (val !== exp) throw new Error(`Expected ${val} toBe ${exp}`);
    },
    toEqual: function (exp) {
      const sv = JSON.stringify(val);
      const se = JSON.stringify(exp);
      if (sv !== se) throw new Error(`Expected ${sv} toEqual ${se}`);
    },
    toBeTruthy: function () {
      if (!val) throw new Error(`Expected value to be truthy`);
    },
    toContain: function (exp) {
      if (!Array.isArray(val) && typeof val !== 'string') throw new Error('toContain expects array or string');
      if (!val.includes(exp)) throw new Error(`Expected ${JSON.stringify(val)} to contain ${JSON.stringify(exp)}`);
    },
    toHaveBeenCalledTimes: function (n) {
      if (val !== n) throw new Error(`Expected calls ${val} to equal ${n}`);
    }
  };
};

// Locate index.html (primary) by looking for the "Cosmic Helix Renderer" marker
function findIndexHtml() {
  const candidatePaths = [
    'index.html',
    'public/index.html',
    'docs/index.html',
    'site/index.html'
  ];
  for (const p of candidatePaths) {
    try {
      const txt = readFileSync(p, 'utf8');
      if (txt.includes('Cosmic Helix Renderer')) return { path: p, html: txt };
    } catch {}
  }
  // Fallback heuristic: search near repo root candidates
  // (Keep lightweight to avoid heavy traversal in constrained environments)
  // If not found, throw with guidance.
  throw new Error('index.html not found. Ensure the Cosmic Helix Renderer HTML is present at repo root or common locations.');
}

// Extract inline module script
function extractModuleSource(html) {
  const startTag = '<script type="module">';
  const endTag = '</script>';
  const i0 = html.indexOf(startTag);
  if (i0 === -1) throw new Error('No <script type="module"> found in index.html');
  const i1 = html.indexOf(endTag, i0);
  if (i1 === -1) throw new Error('Unterminated module script in index.html');
  return html.slice(i0 + startTag.length, i1).trim();
}

// Prepare a unique runtime module that rewrites the import to our mock
function writeRuntimeModule(originalSource, variantSuffix = '') {
  // Replace: import { renderHelix } from "./js/helix-renderer.mjs";
  const rewritten = originalSource.replace(
    /import\s+\{\s*renderHelix\s*\}\s+from\s+["']\.\/js\/helix-renderer\.mjs["'];?/,
    'import { renderHelix } from "./helix-renderer.mock.mjs";'
  );
  const runtimeDir = mkdtempSync(join(tmpdir(), 'helix-runtime-'));
  const runtimePath = join(runtimeDir, `index.module${variantSuffix}.mjs`);
  const mockPath = join(runtimeDir, 'helix-renderer.mock.mjs');

  // Copy our mock from fixtures into the runtime dir (to keep relative import local)
  const fixtureMock = resolve('test/fixtures/runtime/helix-renderer.mock.mjs');
  const mockCode = readFileSync(fixtureMock, 'utf8');
  writeFileSync(mockPath, mockCode, 'utf8');

  writeFileSync(runtimePath, rewritten, 'utf8');
  return { runtimePath, runtimeDir };
}

// DOM helpers
function setupDom({ statusText = 'Loading palette...' } = {}) {
  // Ensure document exists (JSDOM or similar). If not, create minimal stubs.
  if (typeof document === 'undefined') {
    // Very minimal DOM shim (last resort). Prefer jsdom environment provided by Jest/Vitest.
    globalThis.document = {
      _nodes: new Map(),
      getElementById(id) { return this._nodes.get(id) || null; },
      createElement(tag) {
        const el = { tagName: tag.toUpperCase(), style:{}, setAttribute(){}, getContext: undefined };
        return el;
      },
      body: { appendChild: () => {} },
    };
  }
  // Status element
  let statusEl = document.getElementById('status');
  if (!statusEl) {
    statusEl = document.createElement('div');
    statusEl.id = 'status';
    if (document.body && document.body.appendChild) document.body.appendChild(statusEl);
    if (document._nodes) document._nodes.set('status', statusEl);
  }
  statusEl.textContent = statusText;

  // Canvas element
  let canvas = document.getElementById('stage');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'stage';
    if (document.body && document.body.appendChild) document.body.appendChild(canvas);
    if (document._nodes) document._nodes.set('stage', canvas);
  }
  canvas.width = 1440;
  canvas.height = 900;
  // Stub getContext to return a stable object
  const ctxStub = { __type: '2d-ctx-stub' };
  canvas.getContext = () => ctxStub;

  return { statusEl, canvas, ctxStub };
}

// Reset globals between tests
function resetGlobals() {
  globalThis.__renderHelixCalls = [];
}

d('Cosmic Helix Renderer inline module', () => {
  let moduleSource;

  b(() => {
    const { html } = findIndexHtml();
    moduleSource = extractModuleSource(html);
    resetGlobals();
  });

  a(() => {
    // Cleanup fetch stub
    if (globalThis.__savedFetch) {
      globalThis.fetch = globalThis.__savedFetch;
      delete globalThis.__savedFetch;
    }
  });

  i('loads remote palette successfully and updates status to "Palette loaded."', async () => {
    const { statusEl, canvas, ctxStub } = setupDom();

    // Mock fetch success
    globalThis.__savedFetch = globalThis.fetch;
    const palette = { bg: '#010203', ink: '#0f0f0f', layers: ['#111111', '#222222', '#333333'] };
    let calledWith;
    globalThis.fetch = async (path, opts) => {
      calledWith = { path, opts };
      return {
        ok: true,
        async json() { return palette; }
      };
    };

    const { runtimePath } = writeRuntimeModule(moduleSource, '.ok');
    await import(pathToFileURL(runtimePath).href);

    expectFn(calledWith.path).toContain('./data/palette.json');
    expectFn(calledWith.opts.cache).toBe('no-store');

    // Assert status updated
    expectFn(statusEl.textContent).toBe('Palette loaded.');

    // Assert renderHelix call
    const calls = globalThis.__renderHelixCalls || [];
    expectFn(calls.length).toBe(1);
    const call = calls[0];
    expectFn(call.ctx).toEqual(ctxStub);
    expectFn(call.opts.width).toBe(canvas.width);
    expectFn(call.opts.height).toBe(canvas.height);
    expectFn(call.opts.palette).toEqual(palette);

    // NUM constants presence and values
    expectFn(call.opts.NUM).toEqual({
      THREE:3, SEVEN:7, NINE:9, ELEVEN:11, TWENTYTWO:22, THIRTYTHREE:33, NINETYNINE:99, ONEFORTYFOUR:144
    });
  });

  i('falls back to safe defaults when fetch fails (network error) and updates status accordingly', async () => {
    const { statusEl } = setupDom();

    // Mock fetch failure (throw)
    globalThis.__savedFetch = globalThis.fetch;
    globalThis.fetch = async () => { throw new Error('network'); };

    const { runtimePath } = writeRuntimeModule(moduleSource, '.fail-throw');
    await import(pathToFileURL(runtimePath).href);

    // Assert status shows fallback
    expectFn(statusEl.textContent).toBe('Palette missing; using safe fallback.');

    // Assert renderHelix called with default palette colors from diff
    const calls = globalThis.__renderHelixCalls || [];
    expectFn(calls.length).toBe(1);
    const { opts } = calls[0];
    expectFn(opts.palette).toEqual({
      bg: '#0b0b12',
      ink: '#e8e8f0',
      layers: ['#b1c7ff', '#89f7fe', '#a0ffa1', '#ffd27f', '#f5a3ff', '#d0d0e6']
    });
  });

  i('falls back when HTTP error (res.ok false) and still sets status to fallback message', async () => {
    const { statusEl } = setupDom();

    // Mock fetch HTTP error
    globalThis.__savedFetch = globalThis.fetch;
    globalThis.fetch = async () => ({ ok: false, async json(){ return {}; } });

    const { runtimePath } = writeRuntimeModule(moduleSource, '.fail-http');
    await import(pathToFileURL(runtimePath).href);

    expectFn(statusEl.textContent).toBe('Palette missing; using safe fallback.');
    const calls = globalThis.__renderHelixCalls || [];
    expectFn(calls.length).toBe(1);
    const { opts } = calls[0];
    expectFn(opts.palette.bg).toBe('#0b0b12');
  });

  i('falls back when JSON parsing throws and still renders once', async () => {
    setupDom();

    // Mock fetch ok but invalid JSON
    globalThis.__savedFetch = globalThis.fetch;
    globalThis.fetch = async () => ({ ok: true, async json(){ throw new Error('invalid json'); } });

    const { runtimePath } = writeRuntimeModule(moduleSource, '.fail-json');
    await import(pathToFileURL(runtimePath).href);

    const calls = globalThis.__renderHelixCalls || [];
    expectFn(calls.length).toBe(1);
  });
});