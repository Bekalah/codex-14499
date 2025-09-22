/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers (painted back to front):
    1) Vesica field (intersecting circles to ground the canvas depth).
    2) Tree-of-Life nodes and paths (ten sephirot, twenty-two connectors).
    3) Fibonacci curve (gentle golden spiral polyline sampled once).
    4) Double-helix lattice (two calm strands with steady rungs).

  ND-safe choices:
    - No motion or animation; rendering runs synchronously exactly once per call.
    - Comments describe contrast and order so future caretakers keep the layers calm.
    - Pure helpers return derived geometry without mutating shared state.
*/

// Golden Ratio keeps the Fibonacci layer gentle and lore-aligned.
const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

const DEFAULT_DIMENSIONS = { width: 1440, height: 900 };

const DEFAULT_PALETTE = {
  bg: '#0b0b12',
  ink: '#e8e8f0',
  layers: ['#b1c7ff', '#89f7fe', '#a0ffa1', '#ffd27f', '#f5a3ff', '#d0d0e6']
};

const DEFAULT_NUM = Object.freeze({
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  TWENTYTWO: 22,
  THIRTYTHREE: 33,
  NINETYNINE: 99,
  ONEFORTYFOUR: 144
});

const TREE_NODES = [
  { key: 'kether', column: 0, row: 0 },
  { key: 'chokmah', column: 1, row: 1 },
  { key: 'binah', column: -1, row: 1 },
  { key: 'chesed', column: 1, row: 2 },
  { key: 'geburah', column: -1, row: 2 },
  { key: 'tiphareth', column: 0, row: 3 },
  { key: 'netzach', column: 1, row: 4 },
  { key: 'hod', column: -1, row: 4 },
  { key: 'yesod', column: 0, row: 5 },
  { key: 'malkuth', column: 0, row: 6 }
];

const TREE_PATHS = [
  ['kether', 'chokmah'],
  ['kether', 'binah'],
  ['kether', 'tiphareth'],
  ['chokmah', 'binah'],
  ['chokmah', 'tiphareth'],
  ['chokmah', 'chesed'],
  ['binah', 'tiphareth'],
  ['binah', 'geburah'],
  ['chesed', 'geburah'],
  ['chesed', 'tiphareth'],
  ['chesed', 'netzach'],
  ['geburah', 'tiphareth'],
  ['geburah', 'hod'],
  ['tiphareth', 'netzach'],
  ['tiphareth', 'yesod'],
  ['tiphareth', 'hod'],
  ['netzach', 'hod'],
  ['netzach', 'yesod'],
  ['netzach', 'malkuth'],
  ['hod', 'yesod'],
  ['hod', 'malkuth'],
  ['yesod', 'malkuth']
];

/**
 * Render a calm, layered helix scene onto a Canvas 2D context.
 *
 * @param {CanvasRenderingContext2D} ctx - Destination drawing context.
 * @param {object} [opts] - Optional overrides for width, height, palette, and NUM constants.
 */
export function renderHelix(ctx, opts = {}) {
  if (!ctx) return;

  const { width, height, palette, NUM } = normalizeOptions(opts);
  const drawWidth = ctx.canvas && typeof ctx.canvas.width === 'number' ? ctx.canvas.width : width;
  const drawHeight = ctx.canvas && typeof ctx.canvas.height === 'number' ? ctx.canvas.height : height;

  ctx.save();
  ctx.clearRect(0, 0, drawWidth, drawHeight);

  paintBackground(ctx, drawWidth, drawHeight, palette.bg);
  drawVesica(ctx, drawWidth, drawHeight, palette, NUM);
  drawTree(ctx, drawWidth, drawHeight, palette, NUM);
  drawFibonacci(ctx, drawWidth, drawHeight, palette, NUM);
  drawHelix(ctx, drawWidth, drawHeight, palette, NUM);

  ctx.restore();
}

function normalizeOptions(opts) {
  const width = isPositiveNumber(opts.width) ? opts.width : DEFAULT_DIMENSIONS.width;
  const height = isPositiveNumber(opts.height) ? opts.height : DEFAULT_DIMENSIONS.height;
  const palette = ensurePalette(opts.palette);
  const NUM = ensureNumerology(opts.NUM);
  return { width, height, palette, NUM };
}

function isPositiveNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function ensurePalette(candidate) {
  if (!candidate || typeof candidate !== 'object') {
    return DEFAULT_PALETTE;
  }
  const bg = typeof candidate.bg === 'string' ? candidate.bg : DEFAULT_PALETTE.bg;
  const ink = typeof candidate.ink === 'string' ? candidate.ink : DEFAULT_PALETTE.ink;
  const layers = Array.isArray(candidate.layers) && candidate.layers.length >= 6
    ? candidate.layers.slice(0, 6)
    : DEFAULT_PALETTE.layers;
  return { bg, ink, layers };
}

function ensureNumerology(candidate) {
  if (!candidate || typeof candidate !== 'object') {
    return DEFAULT_NUM;
  }
  const merged = { ...DEFAULT_NUM };
  Object.keys(DEFAULT_NUM).forEach((key) => {
    const maybe = candidate[key];
    if (isPositiveNumber(maybe)) {
      merged[key] = maybe;
    }
  });
  return Object.freeze(merged);
}

function paintBackground(ctx, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

function drawVesica(ctx, width, height, palette, NUM) {
  const columns = NUM.SEVEN;
  const rows = NUM.NINE;
  const horizontalStep = width / (columns + 2);
  const verticalStep = height / (rows + 2);
  const radius = Math.min(horizontalStep, verticalStep) * 0.85;
  const lineColor = palette.layers[0] || palette.ink;
  const overlayColor = palette.layers[1] || palette.ink;

  ctx.lineWidth = Math.max(1.25, width / NUM.ONEFORTYFOUR);
  ctx.globalAlpha = 0.45;
  ctx.strokeStyle = lineColor;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const cx = horizontalStep * (col + 1.5);
      const cy = verticalStep * (row + 1.5);
      drawCircle(ctx, cx, cy, radius);
    }
  }

  ctx.strokeStyle = overlayColor;
  ctx.globalAlpha = 0.35;
  for (let row = 0; row < rows - 1; row += 1) {
    for (let col = 0; col < columns - 1; col += 1) {
      const cx = horizontalStep * (col + 2);
      const cy = verticalStep * (row + 2);
      drawCircle(ctx, cx, cy, radius * 0.9);
    }
  }
  ctx.globalAlpha = 1;
}

function drawCircle(ctx, cx, cy, radius) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawTree(ctx, width, height, palette, NUM) {
  const nodeRadius = Math.max(6, Math.min(width, height) / NUM.THREE / 4);
  const verticalSpan = height * 0.72;
  const verticalStep = verticalSpan / (TREE_NODES.length - 1);
  const horizontalStep = width / NUM.THREE;
  const centerX = width / 2;

  const positions = TREE_NODES.reduce((map, node, index) => {
    const x = centerX + node.column * (horizontalStep / NUM.THREE);
    const y = height * 0.12 + index * verticalStep;
    map.set(node.key, { x, y });
    return map;
  }, new Map());

  ctx.lineWidth = Math.max(2, width / NUM.ONEFORTYFOUR);
  ctx.strokeStyle = palette.layers[2] || palette.ink;
  ctx.globalAlpha = 0.75;
  TREE_PATHS.forEach(([fromKey, toKey]) => {
    const from = positions.get(fromKey);
    const to = positions.get(toKey);
    if (!from || !to) return;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  });
  ctx.globalAlpha = 1;

  ctx.fillStyle = palette.ink;
  TREE_NODES.forEach((node) => {
    const pos = positions.get(node.key);
    if (!pos) return;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = palette.layers[3] || palette.ink;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
}

function drawFibonacci(ctx, width, height, palette, NUM) {
  const color = palette.layers[3] || palette.ink;
  const steps = NUM.NINETYNINE;
  const baseRadius = Math.min(width, height) / NUM.TWENTYTWO;
  const centerX = width * 0.35;
  const centerY = height * 0.55;

  const points = [];
  for (let i = 0; i < steps; i += 1) {
    const angle = i / NUM.ELEVEN * Math.PI * 2;
    const radius = baseRadius * Math.pow(GOLDEN_RATIO, angle / Math.PI);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push({ x, y });
  }

  ctx.lineWidth = Math.max(2, width / NUM.ONEFORTYFOUR);
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.fillStyle = palette.layers[4] || palette.ink;
  const markerInterval = Math.max(1, Math.floor(steps / NUM.TWENTYTWO));
  points.forEach((point, index) => {
    if (index % markerInterval !== 0) return;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawHelix(ctx, width, height, palette, NUM) {
  const leftMargin = width * 0.18;
  const rightMargin = width * 0.82;
  const amplitude = height / NUM.THIRTYTHREE;
  const strandColorA = palette.layers[5] || palette.ink;
  const strandColorB = palette.layers[4] || palette.ink;
  const rungColor = palette.layers[2] || palette.ink;
  const strands = NUM.TWENTYTWO;

  const makePoint = (t, phase) => {
    const x = leftMargin + (rightMargin - leftMargin) * t;
    const angle = (t * NUM.THIRTYTHREE + phase) * Math.PI;
    const y = height * 0.2 + (height * 0.6) * t + Math.sin(angle) * amplitude;
    return { x, y };
  };

  const drawStrand = (phase, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    for (let i = 0; i <= NUM.NINETYNINE; i += 1) {
      const t = i / NUM.NINETYNINE;
      const point = makePoint(t, phase);
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  drawStrand(0, strandColorA);
  drawStrand(1, strandColorB);

  ctx.strokeStyle = rungColor;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.6;
  for (let i = 0; i <= strands; i += 1) {
    const t = i / strands;
    const a = makePoint(t, 0);
    const b = makePoint(t, 1);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
