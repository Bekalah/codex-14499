/*
  helix-renderer.mjs
  ND-safe static renderer for the layered cosmology in Codex 144:99.

  Layer order (back to front):
    1. Vesica field - intersecting circles ground the space.
    2. Tree-of-Life scaffold - ten sephirot with twenty-two connective paths.
    3. Fibonacci curve - static golden spiral polyline for gentle motion memory.
    4. Double-helix lattice - paired strands with steady crossbars for depth.

  ND-safe commitments:
    - No animation or timers; everything renders once per invocation.
    - Calm palette with readable contrast; comments explain sensory choices.
    - Small, pure helpers keep cosmology parameters auditable and lore-safe.
*/

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

const TREE_PATHS = [
  { from: 'kether', to: 'chokmah' },
  { from: 'kether', to: 'binah' },
  { from: 'kether', to: 'tiphareth' },
  { from: 'chokmah', to: 'binah' },
  { from: 'chokmah', to: 'tiphareth' },
  { from: 'chokmah', to: 'chesed' },
  { from: 'binah', to: 'tiphareth' },
  { from: 'binah', to: 'geburah' },
  { from: 'chesed', to: 'geburah' },
  { from: 'chesed', to: 'tiphareth' },
  { from: 'chesed', to: 'netzach' },
  { from: 'geburah', to: 'tiphareth' },
  { from: 'geburah', to: 'hod' },
  { from: 'tiphareth', to: 'netzach' },
  { from: 'tiphareth', to: 'yesod' },
  { from: 'tiphareth', to: 'hod' },
  { from: 'netzach', to: 'hod' },
  { from: 'netzach', to: 'yesod' },
  { from: 'netzach', to: 'malkuth' },
  { from: 'hod', to: 'yesod' },
  { from: 'hod', to: 'malkuth' },
  { from: 'yesod', to: 'malkuth' }
];

/**
 * Render the calm, layered helix scene onto a canvas context.
 *
 * @param {CanvasRenderingContext2D} ctx - Destination 2D context.
 * @param {object} [opts] - Optional configuration overrides.
 * @param {number} [opts.width] - Canvas width in pixels.
 * @param {number} [opts.height] - Canvas height in pixels.
 * @param {object} [opts.palette] - Optional palette with bg, ink, and six layer colors.
 * @param {object} [opts.NUM] - Optional numerology overrides for sacred constants.
 */
export function renderHelix(ctx, opts = {}) {
  if (!ctx) return;

  const { width, height, palette, NUM } = normalizeOptions(opts);

  fillBackground(ctx, width, height, palette.bg);
  drawVesicaField(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], palette.ink, NUM);
  drawFibonacciCurve(ctx, width, height, palette.layers[3], NUM);
  drawHelixLattice(ctx, width, height, palette.layers[4], palette.layers[5], palette.ink, NUM);
}

function normalizeOptions(opts = {}) {
  const width = Number.isFinite(opts.width) ? opts.width : DEFAULT_DIMENSIONS.width;
  const height = Number.isFinite(opts.height) ? opts.height : DEFAULT_DIMENSIONS.height;
  const palette = ensurePalette(opts.palette);
  const NUM = ensureNumerology(opts.NUM);
  return { width, height, palette, NUM };
}

function ensurePalette(input) {
  if (!input || typeof input !== 'object') {
    return {
      bg: DEFAULT_PALETTE.bg,
      ink: DEFAULT_PALETTE.ink,
      layers: [...DEFAULT_PALETTE.layers]
    };
  }

  const safe = {
    bg: typeof input.bg === 'string' ? input.bg : DEFAULT_PALETTE.bg,
    ink: typeof input.ink === 'string' ? input.ink : DEFAULT_PALETTE.ink,
    layers: []
  };

  const sourceLayers = Array.isArray(input.layers) ? input.layers : [];
  for (let i = 0; i < DEFAULT_PALETTE.layers.length; i += 1) {
    const candidate = sourceLayers[i];
    safe.layers.push(typeof candidate === 'string' ? candidate : DEFAULT_PALETTE.layers[i]);
  }

  return safe;
}

function ensureNumerology(input) {
  const safe = { ...DEFAULT_NUM };
  if (!input || typeof input !== 'object') return safe;

  for (const key of Object.keys(safe)) {
    const value = Number(input[key]);
    if (Number.isFinite(value) && value !== 0) {
      safe[key] = value;
    }
  }
  return safe;
}

function fillBackground(ctx, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawVesicaField(ctx, width, height, color, NUM) {
  const columns = NUM.SEVEN;
  const rows = NUM.NINE;
  const marginX = width / NUM.ELEVEN;
  const marginY = height / NUM.NINE;
  const cellW = (width - marginX * 2) / (columns - 1);
  const cellH = (height - marginY * 2) / (rows - 1);
  const scale = NUM.SEVEN / NUM.NINE; // gentle overlap ratio derived from sacred numbers.
  const radius = Math.min(cellW, cellH) * 0.5 * scale;
  const lineWidth = Math.max(1, Math.min(width, height) / NUM.NINETYNINE);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.globalAlpha = 0.45;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const x = marginX + col * cellW;
      const y = marginY + row * cellH;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, inkColor, NUM) {
  const verticalUnit = height / NUM.ONEFORTYFOUR;
  const horizontalUnit = width / (NUM.NINE + NUM.THREE); // uses 3 and 9 to set gentle spread.
  const centerX = width / 2;
  const one = NUM.ELEVEN / NUM.ELEVEN;
  const two = NUM.THREE - one;
  const three = NUM.THREE;
  const four = NUM.SEVEN - three;

  const nodes = [
    { key: 'kether', offset: 0, unitsY: NUM.NINE },
    { key: 'chokmah', offset: two, unitsY: NUM.TWENTYTWO },
    { key: 'binah', offset: -two, unitsY: NUM.TWENTYTWO },
    { key: 'chesed', offset: three, unitsY: NUM.THIRTYTHREE + NUM.ELEVEN },
    { key: 'geburah', offset: -three, unitsY: NUM.THIRTYTHREE + NUM.ELEVEN },
    { key: 'tiphareth', offset: 0, unitsY: NUM.THIRTYTHREE + NUM.THIRTYTHREE },
    { key: 'netzach', offset: four, unitsY: NUM.TWENTYTWO + NUM.THIRTYTHREE + NUM.THIRTYTHREE },
    { key: 'hod', offset: -four, unitsY: NUM.TWENTYTWO + NUM.THIRTYTHREE + NUM.THIRTYTHREE },
    { key: 'yesod', offset: 0, unitsY: NUM.NINETYNINE + NUM.ELEVEN },
    { key: 'malkuth', offset: 0, unitsY: NUM.ONEFORTYFOUR - NUM.ELEVEN }
  ];

  const positions = new Map();
  for (const node of nodes) {
    const x = centerX + node.offset * horizontalUnit;
    const y = node.unitsY * verticalUnit;
    positions.set(node.key, { x, y });
  }

  const pathWidth = Math.max(1.5, Math.min(width, height) / NUM.ONEFORTYFOUR);
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = pathWidth;
  ctx.globalAlpha = 0.65;
  for (const path of TREE_PATHS) {
    const start = positions.get(path.from);
    const end = positions.get(path.to);
    if (!start || !end) continue;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }
  ctx.restore();

  const nodeRadius = Math.max(6, Math.min(width, height) / NUM.THIRTYTHREE);
  const outlineWidth = Math.max(1, Math.min(width, height) / NUM.ONEFORTYFOUR);
  ctx.save();
  ctx.fillStyle = nodeColor;
  ctx.strokeStyle = inkColor;
  ctx.lineWidth = outlineWidth;
  for (const node of nodes) {
    const pos = positions.get(node.key);
    if (!pos) continue;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawFibonacciCurve(ctx, width, height, color, NUM) {
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const steps = NUM.NINETYNINE;
  const turns = NUM.THREE - (NUM.ELEVEN / NUM.TWENTYTWO); // 2.5 pi sweep keeps curve contained.
  const maxTheta = turns * Math.PI;
  const baseRadius = Math.min(width, height) / (NUM.THREE + (NUM.ELEVEN / NUM.ELEVEN));
  const centerX = width * (NUM.THIRTYTHREE + NUM.ELEVEN) / NUM.ONEFORTYFOUR;
  const centerY = height * NUM.NINETYNINE / NUM.ONEFORTYFOUR;
  const strokeWidth = Math.max(1.5, Math.min(width, height) / NUM.ONEFORTYFOUR);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = strokeWidth;
  ctx.globalAlpha = 0.75;
  ctx.beginPath();
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const theta = t * maxTheta;
    const radius = baseRadius * Math.pow(goldenRatio, theta / (Math.PI * 2));
    const x = centerX + Math.cos(theta) * radius;
    const y = centerY - Math.sin(theta) * radius;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();
}

function drawHelixLattice(ctx, width, height, strandColorA, strandColorB, rungColor, NUM) {
  const segmentCount = NUM.ONEFORTYFOUR;
  const baseline = height / 2;
  const amplitude = height / (NUM.THREE + (NUM.ELEVEN / NUM.ELEVEN));
  const offsetScale = NUM.THIRTYTHREE / NUM.NINETYNINE; // one-third amplitude keeps lattice calm.
  const frequency = NUM.TWENTYTWO / NUM.ELEVEN; // two full waves across the canvas.
  const strandWidth = Math.max(1.5, Math.min(width, height) / NUM.ONEFORTYFOUR);
  const rungWidth = Math.max(1, Math.min(width, height) / NUM.ONEFORTYFOUR);

  const pointsA = [];
  const pointsB = [];
  for (let i = 0; i <= segmentCount; i += 1) {
    const t = i / segmentCount;
    const pointA = helixPoint(t, 0);
    const pointB = helixPoint(t, Math.PI);
    pointsA.push(pointA);
    pointsB.push(pointB);
  }

  ctx.save();
  ctx.lineWidth = strandWidth;
  ctx.strokeStyle = strandColorA;
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  for (let i = 0; i < pointsA.length; i += 1) {
    const p = pointsA[i];
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();

  ctx.strokeStyle = strandColorB;
  ctx.beginPath();
  for (let i = 0; i < pointsB.length; i += 1) {
    const p = pointsB[i];
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();

  ctx.strokeStyle = rungColor;
  ctx.lineWidth = rungWidth;
  ctx.globalAlpha = 0.55;
  const rungCount = NUM.TWENTYTWO;
  for (let i = 0; i <= rungCount; i += 1) {
    const t = i / rungCount;
    const a = helixPoint(t, 0);
    const b = helixPoint(t, Math.PI);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  ctx.restore();

  function helixPoint(t, phase) {
    const angle = t * frequency * Math.PI + phase;
    const x = width * t;
    const y = baseline + Math.sin(angle) * amplitude * offsetScale;
    return { x, y };
  }
}
