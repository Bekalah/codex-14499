/*
  helix-renderer.mjs
  ND-safe static renderer for the layered cosmology in Codex 144:99.

  Layer order (back to front):
    1. Vesica field - intersecting circles provide the grounding grid.
    2. Tree-of-Life scaffold - ten sephirot nodes linked by twenty-two paths.
    3. Fibonacci curve - static golden spiral sampled gently with marker stones.
    4. Double-helix lattice - two steady strands connected by calm crossbars.

  ND-safe commitments:
    - No animation or timers; rendering happens once per invocation.
    - Gentle contrast and layered commentary explain sensory choices.
    - Helpers stay pure and parameterized so numerology constants remain traceable offline.
*/

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

const DEFAULT_DIMENSIONS = Object.freeze({ width: 1440, height: 900 });
const DEFAULT_PALETTE = Object.freeze({
  bg: '#0b0b12',
  ink: '#e8e8f0',
  layers: ['#b1c7ff', '#89f7fe', '#a0ffa1', '#ffd27f', '#f5a3ff', '#d0d0e6']
});
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

/*
  Sephirot coordinates use numerology-friendly units (multiples of 3, 7, 22, 33, 99, 144).
  Horizontal placement uses multiples of 3 and 7; vertical placement walks the 22-step ladder.
*/
const TREE_NODES = [
  { key: 'kether', label: 'Kether', xUnits: 0, yUnits: 0 },
  { key: 'chokmah', label: 'Chokmah', xUnits: 3, yUnits: 22 },
  { key: 'binah', label: 'Binah', xUnits: -3, yUnits: 22 },
  { key: 'chesed', label: 'Chesed', xUnits: 7, yUnits: 44 },
  { key: 'geburah', label: 'Geburah', xUnits: -7, yUnits: 44 },
  { key: 'tiphareth', label: 'Tiphareth', xUnits: 0, yUnits: 66 },
  { key: 'netzach', label: 'Netzach', xUnits: 7, yUnits: 99 },
  { key: 'hod', label: 'Hod', xUnits: -7, yUnits: 99 },
  { key: 'yesod', label: 'Yesod', xUnits: 0, yUnits: 121 },
  { key: 'malkuth', label: 'Malkuth', xUnits: 0, yUnits: 144 }
];

/*
  Twenty-two connective paths mirror the tarot correspondences. Each entry references two node keys.
*/
const TREE_PATHS = [
  { from: 'kether', to: 'chokmah' },
  { from: 'kether', to: 'binah' },
  { from: 'kether', to: 'tiphareth' },
  { from: 'chokmah', to: 'binah' },
  { from: 'chokmah', to: 'chesed' },
  { from: 'chokmah', to: 'tiphareth' },
  { from: 'chokmah', to: 'netzach' },
  { from: 'binah', to: 'geburah' },
  { from: 'binah', to: 'tiphareth' },
  { from: 'binah', to: 'hod' },
  { from: 'chesed', to: 'geburah' },
  { from: 'chesed', to: 'tiphareth' },
  { from: 'chesed', to: 'netzach' },
  { from: 'geburah', to: 'tiphareth' },
  { from: 'geburah', to: 'hod' },
  { from: 'netzach', to: 'hod' },
  { from: 'netzach', to: 'yesod' },
  { from: 'netzach', to: 'malkuth' },
  { from: 'hod', to: 'yesod' },
  { from: 'hod', to: 'malkuth' },
  { from: 'yesod', to: 'malkuth' },
  { from: 'tiphareth', to: 'yesod' }
];

/**
 * Render the full static composition onto a CanvasRenderingContext2D.
 *
 * @param {CanvasRenderingContext2D} ctx - Drawing context to paint into.
 * @param {object} [opts] - Optional overrides for width, height, palette, or numerology constants.
 */
export function renderHelix(ctx, opts = {}) {
  if (!ctx) {
    return;
  }

  const { width, height, palette, NUM } = normalizeOptions(opts);
  const drawWidth = ctx.canvas && isFiniteNumber(ctx.canvas.width) ? ctx.canvas.width : width;
  const drawHeight = ctx.canvas && isFiniteNumber(ctx.canvas.height) ? ctx.canvas.height : height;

  ctx.save();
  ctx.clearRect(0, 0, drawWidth, drawHeight);

  paintBackground(ctx, drawWidth, drawHeight, palette.bg);
  drawVesicaField(ctx, drawWidth, drawHeight, palette, NUM);
  drawTreeOfLife(ctx, drawWidth, drawHeight, palette, NUM);
  drawFibonacciCurve(ctx, drawWidth, drawHeight, palette, NUM);
  drawDoubleHelix(ctx, drawWidth, drawHeight, palette, NUM);

  ctx.restore();
}

function normalizeOptions(opts) {
  const width = isFiniteNumber(opts.width) ? opts.width : DEFAULT_DIMENSIONS.width;
  const height = isFiniteNumber(opts.height) ? opts.height : DEFAULT_DIMENSIONS.height;
  const palette = ensurePalette(opts.palette);
  const NUM = ensureNumerology(opts.NUM);
  return { width, height, palette, NUM };
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function ensurePalette(palette) {
  if (!palette || typeof palette !== 'object') {
    return DEFAULT_PALETTE;
  }
  const layers = Array.isArray(palette.layers) && palette.layers.length >= 6 ? palette.layers : DEFAULT_PALETTE.layers;
  return {
    bg: typeof palette.bg === 'string' ? palette.bg : DEFAULT_PALETTE.bg,
    ink: typeof palette.ink === 'string' ? palette.ink : DEFAULT_PALETTE.ink,
    layers
  };
}

function ensureNumerology(overrides) {
  if (!overrides || typeof overrides !== 'object') {
    return DEFAULT_NUM;
  }

  const merged = { ...DEFAULT_NUM };
  for (const [key, value] of Object.entries(overrides)) {
    if (key in merged && isFiniteNumber(value)) {
      merged[key] = value;
    }
  }
  return merged;
}

function paintBackground(ctx, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawVesicaField(ctx, width, height, palette, NUM) {
  const cols = NUM.SEVEN;
  const rows = NUM.NINE;
  const marginX = width / NUM.ELEVEN;
  const marginY = height / NUM.ELEVEN;
  const gridWidth = width - marginX * 2;
  const gridHeight = height - marginY * 2;
  const columnStep = cols > 1 ? gridWidth / (cols - 1) : gridWidth;
  const rowStep = rows > 1 ? gridHeight / (rows - 1) : gridHeight;
  const radius = Math.min(columnStep, rowStep) * (NUM.SEVEN / NUM.ELEVEN);

  ctx.save();
  ctx.strokeStyle = palette.layers[0] || palette.ink;
  ctx.globalAlpha = 0.45;
  ctx.lineWidth = Math.max(radius / NUM.THIRTYTHREE, radius / NUM.ONEFORTYFOUR);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cx = marginX + columnStep * col;
      const cy = marginY + rowStep * row;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawTreeOfLife(ctx, width, height, palette, NUM) {
  const nodes = projectTreeNodes(width, height, NUM);
  const nodeRadius = Math.min(width, height) / NUM.THIRTYTHREE;

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = palette.layers[1] || palette.ink;
  ctx.lineWidth = Math.max(width / (NUM.ONEFORTYFOUR * NUM.THREE), width / (NUM.NINETYNINE * NUM.SEVEN));
  ctx.globalAlpha = 0.7;

  for (const path of TREE_PATHS) {
    const from = nodes.get(path.from);
    const to = nodes.get(path.to);
    if (!from || !to) {
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.fillStyle = palette.layers[2] || palette.ink;
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = Math.max(nodeRadius / NUM.ELEVEN, nodeRadius / NUM.ONEFORTYFOUR);

  for (const node of nodes.values()) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function projectTreeNodes(width, height, NUM) {
  const verticalRange = height * 0.72;
  const topMargin = (height - verticalRange) / 2;
  const unitY = verticalRange / NUM.ONEFORTYFOUR;
  const horizontalUnit = width / NUM.TWENTYTWO;

  const map = new Map();
  for (const node of TREE_NODES) {
    const x = width / 2 + node.xUnits * horizontalUnit;
    const y = topMargin + node.yUnits * unitY;
    map.set(node.key, { x, y, label: node.label });
  }
  return map;
}

function drawFibonacciCurve(ctx, width, height, palette, NUM) {
  const steps = NUM.NINETYNINE;
  const curveColor = palette.layers[3] || palette.ink;
  const markerColor = palette.ink;
  const centerX = width * 0.65;
  const centerY = height * 0.58;
  const baseRadius = Math.min(width, height) / NUM.NINE;
  const totalAngle = Math.PI * (NUM.THREE + NUM.SEVEN / NUM.TWENTYTWO);
  const angleStep = totalAngle / steps;
  const growth = Math.pow(GOLDEN_RATIO, 1 / NUM.SEVEN);

  const points = [];
  let angle = -Math.PI / NUM.THREE;
  for (let i = 0; i < steps; i += 1) {
    const radius = baseRadius * Math.pow(growth, i / NUM.THREE);
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    points.push({ x, y });
    angle += angleStep;
  }

  ctx.save();
  ctx.lineWidth = Math.max(width / (NUM.ONEFORTYFOUR * NUM.THREE), width / (NUM.NINETYNINE * NUM.SEVEN));
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = 0.85;
  strokePath(ctx, points, curveColor);

  ctx.globalAlpha = 0.6;
  const markerCount = NUM.ELEVEN;
  const markerRadius = Math.max(width, height) / (NUM.ONEFORTYFOUR * NUM.THREE);
  for (let i = 0; i < markerCount; i += 1) {
    const t = i / (markerCount - 1);
    const index = Math.min(points.length - 1, Math.round(t * (points.length - 1)));
    const point = points[index];
    ctx.beginPath();
    ctx.fillStyle = markerColor;
    ctx.arc(point.x, point.y, markerRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawDoubleHelix(ctx, width, height, palette, NUM) {
  const marginX = width / NUM.NINE;
  const centerY = height / 2;
  const amplitude = Math.min(width, height) / NUM.ELEVEN;
  const segments = NUM.NINETYNINE;
  const crossbars = NUM.TWENTYTWO;
  const strandAColor = palette.layers[4] || palette.ink;
  const strandBColor = palette.layers[5] || palette.ink;
  const crossbarColor = palette.layers[2] || palette.ink;

  const strandA = [];
  const strandB = [];

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const x = marginX + t * (width - marginX * 2);
    const angle = t * Math.PI * NUM.THREE;
    const offset = Math.sin(angle) * amplitude;
    strandA.push({ x, y: centerY + offset });
    strandB.push({ x, y: centerY - offset });
  }

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = 0.9;
  ctx.lineWidth = Math.max(width / (NUM.NINETYNINE * NUM.THREE), width / (NUM.ONEFORTYFOUR * NUM.THREE));
  strokePath(ctx, strandA, strandAColor);
  strokePath(ctx, strandB, strandBColor);

  ctx.globalAlpha = 0.6;
  ctx.strokeStyle = crossbarColor;
  ctx.lineWidth = Math.max(width / (NUM.ONEFORTYFOUR * NUM.THREE), width / (NUM.NINETYNINE * NUM.SEVEN));
  for (let i = 0; i < crossbars; i += 1) {
    const t = i / (crossbars - 1);
    const index = Math.round(t * segments);
    const a = strandA[index];
    const b = strandB[index];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}

function strokePath(ctx, points, color) {
  if (!points.length) {
    return;
  }
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}
