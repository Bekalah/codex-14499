/**
 * Tests for helix-renderer.mjs
 * Framework: Node's built-in test runner (node:test) + node:assert/strict
 * Run: node --test test/helix-renderer.test.mjs
 */
import test from "node:test";
import assert from "node:assert/strict";

// Resolve implementation from common locations in this repo.
// Detected path via repository scan: "../js/helix-renderer.mjs"
let renderHelix;
await (async () => {
  const candidates = [
    "../js/helix-renderer.mjs",
    "./helix-renderer.mjs",
    "../helix-renderer.mjs",
    "../src/helix-renderer.mjs",
    "../lib/helix-renderer.mjs",
    "../modules/helix-renderer.mjs",
  ];
  let lastErr;
  for (const p of candidates) {
    try {
      const mod = await import(p);
      if (typeof mod.renderHelix === "function") {
        renderHelix = mod.renderHelix;
        return;
      }
    } catch (e) {
      lastErr = e;
    }
  }
  throw new Error("Could not resolve renderHelix from helix-renderer.mjs; update import path in this test. Last error: " + (lastErr && lastErr.message));
})();

// Canvas-like mock context that records state mutations and draw calls.
class MockCtx {
  constructor() {
    this._log = [];
    this._strokeStyle = null;
    this._fillStyle = null;
    this._lineWidth = null;
    this._lineJoin = null;
    this._lineCap = null;
    this._globalAlpha = null;
    this._stackDepth = 0;
  }
  get log() { return this._log; }

  get strokeStyle() { return this._strokeStyle; }
  set strokeStyle(v) { this._strokeStyle = v; this._log.push({ type: "set", prop: "strokeStyle", value: v }); }

  get fillStyle() { return this._fillStyle; }
  set fillStyle(v) { this._fillStyle = v; this._log.push({ type: "set", prop: "fillStyle", value: v }); }

  get lineWidth() { return this._lineWidth; }
  set lineWidth(v) { this._lineWidth = v; this._log.push({ type: "set", prop: "lineWidth", value: v }); }

  get lineJoin() { return this._lineJoin; }
  set lineJoin(v) { this._lineJoin = v; this._log.push({ type: "set", prop: "lineJoin", value: v }); }

  get lineCap() { return this._lineCap; }
  set lineCap(v) { this._lineCap = v; this._log.push({ type: "set", prop: "lineCap", value: v }); }

  get globalAlpha() { return this._globalAlpha; }
  set globalAlpha(v) { this._globalAlpha = v; this._log.push({ type: "set", prop: "globalAlpha", value: v }); }

  save() { this._stackDepth++; this._log.push({ type: "call", fn: "save", depth: this._stackDepth }); }
  restore() { this._log.push({ type: "call", fn: "restore", depth: this._stackDepth }); this._stackDepth = Math.max(0, this._stackDepth - 1); }

  fillRect(x, y, w, h) { this._log.push({ type: "call", fn: "fillRect", args: [x, y, w, h] }); }
  beginPath() { this._log.push({ type: "call", fn: "beginPath" }); }
  moveTo(x, y) { this._log.push({ type: "call", fn: "moveTo", args: [x, y] }); }
  lineTo(x, y) { this._log.push({ type: "call", fn: "lineTo", args: [x, y] }); }
  arc(x, y, r, a0, a1) { this._log.push({ type: "call", fn: "arc", args: [x, y, r, a0, a1] }); }
  stroke() { this._log.push({ type: "call", fn: "stroke" }); }
  fill() { this._log.push({ type: "call", fn: "fill" }); }
}

// Helpers to analyze the draw log.
function splitBySaveRestore(log) {
  const segments = [];
  let current = [];
  let depth = 0;
  for (const entry of log) {
    if (entry.type === "call" && entry.fn === "save") {
      if (depth === 0 && current.length) {
        segments.push(current);
        current = [];
      }
      depth++;
      current.push(entry);
    } else if (entry.type === "call" && entry.fn === "restore") {
      current.push(entry);
      depth = Math.max(0, depth - 1);
      if (depth === 0) {
        segments.push(current);
        current = [];
      }
    } else {
      current.push(entry);
    }
  }
  if (current.length) segments.push(current);
  return segments.filter(seg => seg.some(e => e.type === "call" && (e.fn === "save" || e.fn === "restore")));
}
function countCalls(seg, fnName) {
  return seg.filter(e => e.type === "call" && e.fn === fnName).length;
}
function hasSet(seg, prop, value) {
  return seg.some(e => e.type === "set" && e.prop === prop && (value === undefined || e.value === value));
}
function getFillRectArgs(seg) {
  const e = seg.find(x => x.type === "call" && x.fn === "fillRect");
  return e ? e.args : null;
}

// Mirror default palette for assertions.
const DEFAULT_PALETTE = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
};

test("renderHelix: handles falsy ctx gracefully (no throw, no ops)", () => {
  assert.doesNotThrow(() => renderHelix(null));
  assert.doesNotThrow(() => renderHelix(undefined));
});

test("renderHelix: default options produce expected layer structure and counts", () => {
  const ctx = new MockCtx();
  renderHelix(ctx); // defaults width=1440, height=900
  const segments = splitBySaveRestore(ctx.log);
  assert.equal(segments.length, 5, "Expected 5 segments (background + 4 layers)");

  // Background
  {
    const s0 = segments[0];
    assert.ok(hasSet(s0, "fillStyle", DEFAULT_PALETTE.bg));
    assert.deepEqual(getFillRectArgs(s0), [0, 0, 1440, 900]);
  }

  // Vesica
  {
    const s1 = segments[1];
    assert.ok(hasSet(s1, "strokeStyle", DEFAULT_PALETTE.layers[0]));
    assert.ok(hasSet(s1, "lineWidth", 1.5));
    assert.ok(hasSet(s1, "globalAlpha", 0.7));
    assert.equal(countCalls(s1, "arc"), 126, "63 centers × 2 circles");
    assert.equal(countCalls(s1, "stroke"), 126);
  }

  // Tree-of-Life
  {
    const s2 = segments[2];
    assert.ok(hasSet(s2, "strokeStyle", DEFAULT_PALETTE.layers[1]));
    assert.ok(hasSet(s2, "lineWidth", 2));
    assert.ok(hasSet(s2, "lineJoin", "round"));
    assert.ok(hasSet(s2, "fillStyle", DEFAULT_PALETTE.layers[2]));
    assert.equal(countCalls(s2, "stroke"), 22, "22 path segments");
    assert.equal(countCalls(s2, "fill"), 10, "10 nodes");
    assert.equal(countCalls(s2, "arc"), 10, "10 node circles");
  }

  // Fibonacci
  {
    const s3 = segments[3];
    assert.ok(hasSet(s3, "strokeStyle", DEFAULT_PALETTE.layers[3]));
    assert.ok(hasSet(s3, "lineWidth", 2));
    assert.ok(hasSet(s3, "lineJoin", "round"));
    assert.ok(hasSet(s3, "lineCap", "round"));
    assert.equal(countCalls(s3, "stroke"), 1);
    assert.equal(countCalls(s3, "lineTo"), 99, "steps=99 -> 100 points -> 99 segments");
  }

  // Helix lattice
  {
    const s4 = segments[4];
    assert.ok(hasSet(s4, "strokeStyle", DEFAULT_PALETTE.layers[4]));
    assert.ok(hasSet(s4, "strokeStyle", DEFAULT_PALETTE.layers[5]));
    assert.ok(hasSet(s4, "strokeStyle", DEFAULT_PALETTE.ink));
    assert.equal(countCalls(s4, "stroke"), 25, "2 strands + 23 rungs");
    assert.equal(countCalls(s4, "lineTo"), 33 + 33 + 23);
  }
});

test("renderHelix: palette fallback fills missing values and caps layers to 6", () => {
  const ctx = new MockCtx();
  renderHelix(ctx, { palette: { layers: ["#123456"] } });
  const segments = splitBySaveRestore(ctx.log);
  assert.equal(segments.length, 5);

  const s0 = segments[0];
  assert.ok(hasSet(s0, "fillStyle", DEFAULT_PALETTE.bg), "bg falls back");

  const s1 = segments[1];
  assert.ok(hasSet(s1, "strokeStyle", "#123456"), "first provided layer is used");

  const s2 = segments[2];
  assert.ok(hasSet(s2, "strokeStyle", DEFAULT_PALETTE.layers[1]));
  assert.ok(hasSet(s2, "fillStyle", DEFAULT_PALETTE.layers[2]));

  const s3 = segments[3];
  assert.ok(hasSet(s3, "strokeStyle", DEFAULT_PALETTE.layers[3]));

  const s4 = segments[4];
  assert.ok(hasSet(s4, "strokeStyle", DEFAULT_PALETTE.layers[4]));
  assert.ok(hasSet(s4, "strokeStyle", DEFAULT_PALETTE.layers[5]));
  assert.ok(hasSet(s4, "strokeStyle", DEFAULT_PALETTE.ink), "ink falls back");
});

test("renderHelix: non-finite width/height default to 1440x900", () => {
  const ctx = new MockCtx();
  renderHelix(ctx, { width: NaN, height: null });
  const segments = splitBySaveRestore(ctx.log);
  assert.deepEqual(getFillRectArgs(segments[0]), [0, 0, 1440, 900]);
});

test("renderHelix: numerology overrides adjust geometry counts deterministically", () => {
  const NUM = {
    NINETYNINE: 9,  // Fibonacci steps -> 10 points -> 9 segments
    THIRTYTHREE: 3, // Helix segments -> 4 points/strand -> 3 segments each
    TWENTYTWO: 2,   // Helix rungs -> 3 rungs
    NINE: 5,        // Vesica rows -> 5
    SEVEN: 5        // Vesica columns -> 5
  };
  const ctx = new MockCtx();
  renderHelix(ctx, { NUM, width: 1000, height: 800 });

  const segments = splitBySaveRestore(ctx.log);

  // Vesica: 5x5 = 25 centers => 50 arcs/strokes
  const s1 = segments[1];
  assert.equal(countCalls(s1, "arc"), 50);
  assert.equal(countCalls(s1, "stroke"), 50);

  // Fibonacci: 9 line segments, 1 stroke
  const s3 = segments[3];
  assert.equal(countCalls(s3, "lineTo"), 9);
  assert.equal(countCalls(s3, "stroke"), 1);

  // Helix: 3+3+3 lineTo; 1+1+3 strokes
  const s4 = segments[4];
  assert.equal(countCalls(s4, "lineTo"), 3 + 3 + 3);
  assert.equal(countCalls(s4, "stroke"), 1 + 1 + 3);
});

test("renderHelix: Fibonacci curve gracefully skips when steps=0 (points.length < 2)", () => {
  const ctx = new MockCtx();
  renderHelix(ctx, { NUM: { NINETYNINE: 0 } }); // steps=0 -> only 1 point -> skip entire layer
  const segments = splitBySaveRestore(ctx.log);
  // Expect 4 segments: background, vesica, tree-of-life, helix (no fibonacci)
  assert.equal(segments.length, 4);

  // No segment should look like Fibonacci (single stroke with rounded caps)
  const fibLike = segments.find(seg => hasSet(seg, "lineCap", "round") && countCalls(seg, "stroke") === 1);
  assert.equal(fibLike, undefined, "Fibonacci segment should be absent");
});