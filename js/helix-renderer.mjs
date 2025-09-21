/*
  helix-renderer.mjs
  ND-safe static renderer for the layered cosmology in Codex 144:99.

  Layer order (furthest to nearest):
    1. Vesica field - intersecting circles ground the space.
    2. Tree-of-Life scaffold - ten sephirot connected by twenty-two paths.
    3. Fibonacci curve - calm golden spiral polyline, sampled once.
    4. Double-helix lattice - paired strands with steady crossbars.

  ND-safe commitments:
    - No animation or timers; everything draws once per call.
    - Calm palette with readable contrast; background and ink values guard sensory comfort.
    - Pure helper functions keep the lineage data intact and auditable (no workflow side-effects).
*/

const DEFAULT_DIMENSIONS = { width: 1440, height: 900 };

const DEFAULT_PALETTE = {
  bg: '#0b0b12',
  ink: '#e8e8f0',
  layers: ['#b1c7ff', '#89f7fe', '#a0ffa1', '#ffd27f', '#f5a3ff', '#d0d0e6']
};

const DEFAULT_NUM = {
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  TWENTYTWO: 22,
  THIRTYTHREE: 33,
  NINETYNINE: 99,
  ONEFORTYFOUR: 144
};

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

/*
  Canonical lore: major arcana names stay present so path numerology remains traceable.
  This data is read-only and used to weight Tree-of-Life path opacity by numerology value.
*/
const MAJOR_ARCANA = [
  { name: 'The Fool', numerology: 0 },
  { name: 'The Magician', numerology: 1 },
  { name: 'The High Priestess', numerology: 2 },
  { name: 'The Empress', numerology: 3 },
  { name: 'The Emperor', numerology: 4 },
  { name: 'The Hierophant', numerology: 5 },
  { name: 'The Lovers', numerology: 6 },
  { name: 'The Chariot', numerology: 7 },
  { name: 'Strength', numerology: 8 },
  { name: 'The Hermit', numerology: 9 },
  { name: 'Wheel of Fortune', numerology: 10 },
  { name: 'Justice', numerology: 11 },
  { name: 'The Hanged Man', numerology: 12 },
  { name: 'Death', numerology: 13 },
  { name: 'Temperance', numerology: 14 },
  { name: 'The Devil', numerology: 15 },
  { name: 'The Tower', numerology: 16 },
  { name: 'The Star', numerology: 17 },
  { name: 'The Moon', numerology: 18 },
  { name: 'The Sun', numerology: 19 },
  { name: 'Judgement', numerology: 20 },
  { name: 'The World', numerology: 21 }
];

/*
  Sephirot layout is encoded with numerology-weighted offsets so we keep the tradition intact.
  xShift values are scaled against width/NUM.ELEVEN; yUnits scale against height/NUM.ONEFORTYFOUR.
*/
const SEPHIROT_TEMPLATE = [
  { key: 'kether', name: 'Kether', yUnits: 9, xShift: 0 },
  { key: 'chokmah', name: 'Chokmah', yUnits: 22, xShift: 1.2 },
  { key: 'binah', name: 'Binah', yUnits: 22, xShift: -1.2 },
  { key: 'chesed', name: 'Chesed', yUnits: 44, xShift: 1.45 },
  { key: 'geburah', name: 'Geburah', yUnits: 44, xShift: -1.45 },
  { key: 'tiphareth', name: 'Tiphareth', yUnits: 55, xShift: 0 },
  { key: 'netzach', name: 'Netzach', yUnits: 77, xShift: 1.1 },
  { key: 'hod', name: 'Hod', yUnits: 77, xShift: -1.1 },
  { key: 'yesod', name: 'Yesod', yUnits: 99, xShift: 0 },
  { key: 'malkuth', name: 'Malkuth', yUnits: 126, xShift: 0 }
];

const TREE_PATH_DEFINITIONS = [
  { from: 'kether', to: 'chokmah', arcanaIndex: 0 },
  { from: 'kether', to: 'binah', arcanaIndex: 1 },
  { from: 'kether', to: 'tiphareth', arcanaIndex: 2 },
  { from: 'chokmah', to: 'binah', arcanaIndex: 3 },
  { from: 'chokmah', to: 'tiphareth', arcanaIndex: 4 },
  { from: 'chokmah', to: 'chesed', arcanaIndex: 5 },
  { from: 'binah', to: 'tiphareth', arcanaIndex: 6 },
  { from: 'binah', to: 'geburah', arcanaIndex: 7 },
  { from: 'chesed', to: 'geburah', arcanaIndex: 8 },
  { from: 'chesed', to: 'tiphareth', arcanaIndex: 9 },
  { from: 'chesed', to: 'netzach', arcanaIndex: 10 },
  { from: 'geburah', to: 'tiphareth', arcanaIndex: 11 },
  { from: 'geburah', to: 'hod', arcanaIndex: 12 },
  { from: 'tiphareth', to: 'netzach', arcanaIndex: 13 },
  { from: 'tiphareth', to: 'yesod', arcanaIndex: 14 },
  { from: 'tiphareth', to: 'hod', arcanaIndex: 15 },
  { from: 'netzach', to: 'hod', arcanaIndex: 16 },
  { from: 'netzach', to: 'yesod', arcanaIndex: 17 },
  { from: 'netzach', to: 'malkuth', arcanaIndex: 18 },
  { from: 'hod', to: 'yesod', arcanaIndex: 19 },
  { from: 'hod', to: 'malkuth', arcanaIndex: 20 },
  { from: 'yesod', to: 'malkuth', arcanaIndex: 21 }
];

/**
 * Render the four-layer helix cosmology onto a 2D canvas context.
 * One synchronous call keeps the scene static (no animation, no timers).
 *
 * @param {CanvasRenderingContext2D} ctx - Target 2D context; function exits quietly when missing.
 * @param {Object} [opts] - Optional settings (width, height, palette, NUM numerology constants).
 */
export function renderHelix(ctx, opts = {}) {
  if (!ctx) return;

  const { width, height, palette, NUM } = normalizeOptions(opts);
  const canvas = ctx.canvas;
  if (canvas && (canvas.width !== width || canvas.height !== height)) {
    canvas.width = width;
    canvas.height = height;
  }

  drawBackground(ctx, width, height, palette.bg);
  drawVesicaField(ctx, { width, height }, palette, NUM);
  drawTreeOfLife(ctx, { width, height }, palette, NUM);
  drawFibonacciCurve(ctx, { width, height }, palette, NUM);
  drawDoubleHelix(ctx, { width, height }, palette, NUM);
}

function normalizeOptions(opts) {
  const width = isPositiveNumber(opts.width) ? opts.width : DEFAULT_DIMENSIONS.width;
  const height = isPositiveNumber(opts.height) ? opts.height : DEFAULT_DIMENSIONS.height;
  const palette = ensurePalette(opts.palette);
  const numerology = ensureNumerology(opts.NUM);
  return { width, height, palette, NUM: numerology };
}

function isPositiveNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function ensurePalette(candidate) {
  if (!candidate || typeof candidate !== 'object') return DEFAULT_PALETTE;
  const bg = typeof candidate.bg === 'string' ? candidate.bg : DEFAULT_PALETTE.bg;
  const ink = typeof candidate.ink === 'string' ? candidate.ink : DEFAULT_PALETTE.ink;
  const layers = buildLayerPalette(candidate.layers, DEFAULT_PALETTE.layers);
  return { bg, ink, layers };
}

function buildLayerPalette(candidate, fallbackLayers) {
  const fallback = Array.isArray(fallbackLayers) ? fallbackLayers : DEFAULT_PALETTE.layers;
  if (!Array.isArray(candidate) || candidate.length === 0) return fallback.slice();
  const limit = Math.max(candidate.length, fallback.length);
  const result = [];
  for (let index = 0; index < limit; index += 1) {
    const color = typeof candidate[index] === 'string' ? candidate[index] : fallback[index % fallback.length];
    result.push(color);
  }
  return result;
}

function ensureNumerology(candidate) {
  if (!candidate || typeof candidate !== 'object') return DEFAULT_NUM;
  const numerology = {};
  for (const key of Object.keys(DEFAULT_NUM)) {
    numerology[key] = isPositiveNumber(candidate[key]) ? candidate[key] : DEFAULT_NUM[key];
  }
  return numerology;
}

function drawBackground(ctx, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawVesicaField(ctx, dims, palette, NUM) {
  ctx.save();
  const columns = NUM.NINE;
  const rows = NUM.SEVEN;
  const marginX = dims.width / NUM.TWENTYTWO;
  const marginY = dims.height / NUM.TWENTYTWO;
  const stepX = (dims.width - marginX * 2) / (columns - 1);
  const stepY = (dims.height - marginY * 2) / (rows - 1);
  const radius = Math.min(stepX, stepY) / 1.9;

  ctx.lineWidth = Math.max(1.25, radius / NUM.THIRTYTHREE);
  ctx.strokeStyle = palette.layers[0] ?? DEFAULT_PALETTE.layers[0];
  ctx.globalAlpha = 0.35;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const cx = marginX + col * stepX;
      const cy = marginY + row * stepY;
      drawCircle(ctx, cx, cy, radius);
    }
  }

  ctx.strokeStyle = palette.layers[5] ?? DEFAULT_PALETTE.layers[5];
  ctx.globalAlpha = 0.2;
  const offsetX = stepX / 2;
  const offsetY = stepY / 2;
  for (let row = 0; row < rows - 1; row += 1) {
    for (let col = 0; col < columns - 1; col += 1) {
      const cx = marginX + col * stepX + offsetX;
      const cy = marginY + row * stepY + offsetY;
      drawCircle(ctx, cx, cy, radius);
    }
  }
  ctx.restore();
}

function drawTreeOfLife(ctx, dims, palette, NUM) {
  ctx.save();
  const nodes = mapSephirotPositions(dims.width, dims.height, NUM);
  const nodeByKey = new Map(nodes.map((node) => [node.key, node]));

  // Paths first to keep nodes legible on top.
  ctx.strokeStyle = palette.layers[1] ?? DEFAULT_PALETTE.layers[1];
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(1.5, dims.width / NUM.ONEFORTYFOUR);

  for (const path of TREE_PATH_DEFINITIONS) {
    const start = nodeByKey.get(path.from);
    const end = nodeByKey.get(path.to);
    if (!start || !end) continue;

    const arcana = MAJOR_ARCANA[path.arcanaIndex] ?? MAJOR_ARCANA[0];
    const weight = 0.35 + (arcana.numerology % NUM.ELEVEN) / (NUM.THIRTYTHREE);
    ctx.globalAlpha = clamp(weight, 0.35, 0.85);

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  // Sephirot nodes - calm fill with ink outline for readability.
  const nodeRadius = Math.max(8, Math.min(dims.width, dims.height) / NUM.THIRTYTHREE);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = palette.ink ?? DEFAULT_PALETTE.ink;
  ctx.lineWidth = Math.max(1, nodeRadius / NUM.TWENTYTWO);

  for (const node of nodes) {
    ctx.fillStyle = palette.layers[2] ?? DEFAULT_PALETTE.layers[2];
    drawFilledCircle(ctx, node.x, node.y, nodeRadius);
    // ND-safe annotation: gentle, centered labels keep lore legible without overwhelming the eye.
    ctx.font = `${Math.round(nodeRadius * 0.9)}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = palette.ink ?? DEFAULT_PALETTE.ink;
    ctx.fillText(node.name, node.x, node.y - nodeRadius * 1.6);
  }

  ctx.restore();
}

function mapSephirotPositions(width, height, NUM) {
  const unitY = height / NUM.ONEFORTYFOUR;
  const unitX = width / NUM.ELEVEN;
  return SEPHIROT_TEMPLATE.map((entry) => ({
    key: entry.key,
    name: entry.name,
    x: width / 2 + entry.xShift * unitX,
    y: entry.yUnits * unitY,
  }));
}

function drawFibonacciCurve(ctx, dims, palette, NUM) {
  ctx.save();
  const points = generateFibonacciPoints(dims, NUM);
  if (points.length < 2) {
    ctx.restore();
    return;
  }

  ctx.strokeStyle = palette.layers[3] ?? DEFAULT_PALETTE.layers[3];
  ctx.lineWidth = Math.max(2, dims.width / NUM.ONEFORTYFOUR);
  ctx.globalAlpha = 0.85;
  drawPolyline(ctx, points);

  // Gentle markers highlight growth points without motion.
  ctx.fillStyle = palette.layers[3] ?? DEFAULT_PALETTE.layers[3];
  ctx.globalAlpha = 0.9;
  const markerRadius = Math.max(3, Math.min(dims.width, dims.height) / (NUM.NINETYNINE));
  for (let i = 0; i < points.length; i += Math.floor(NUM.NINETYNINE / NUM.ELEVEN)) {
    const point = points[i];
    drawFilledCircle(ctx, point.x, point.y, markerRadius);
  }

  ctx.restore();
}

function generateFibonacciPoints(dims, NUM) {
  const sampleCount = NUM.NINETYNINE;
  const points = [];
  const baseRadius = Math.min(dims.width, dims.height) / NUM.TWENTYTWO;
  const centerX = dims.width * (NUM.THREE / NUM.NINE);
  const centerY = dims.height * (NUM.NINETYNINE / NUM.ONEFORTYFOUR);
  const thetaMax = (NUM.THREE + NUM.SEVEN / NUM.TWENTYTWO) * Math.PI;
  for (let index = 0; index < sampleCount; index += 1) {
    const t = index / (sampleCount - 1);
    const theta = t * thetaMax;
    const radius = baseRadius * Math.pow(GOLDEN_RATIO, theta / (Math.PI / 2));
    const x = centerX + radius * Math.cos(theta);
    const y = centerY - radius * Math.sin(theta);
    points.push({ x, y });
  }
  return points;
}

function drawDoubleHelix(ctx, dims, palette, NUM) {
  ctx.save();
  const strandPoints = generateHelixStrands(dims, NUM);
  const strandA = strandPoints.strandA;
  const strandB = strandPoints.strandB;

  ctx.strokeStyle = palette.layers[4] ?? DEFAULT_PALETTE.layers[4];
  ctx.lineWidth = Math.max(2, dims.width / NUM.ONEFORTYFOUR);
  ctx.globalAlpha = 0.8;
  drawPolyline(ctx, strandA);
  drawPolyline(ctx, strandB);

  // Crossbars keep the lattice stable; drawn with the most muted layer color.
  ctx.strokeStyle = palette.layers[5] ?? DEFAULT_PALETTE.layers[5];
  ctx.lineWidth = Math.max(1.25, dims.width / (NUM.ONEFORTYFOUR * 1.5));
  const crossStep = Math.max(2, Math.floor(strandA.length / NUM.TWENTYTWO));
  for (let i = 0; i < strandA.length && i < strandB.length; i += crossStep) {
    const a = strandA[i];
    const b = strandB[i];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}

function generateHelixStrands(dims, NUM) {
  const sampleCount = NUM.ONEFORTYFOUR;
  const strandA = [];
  const strandB = [];
  const amplitude = dims.width / NUM.TWENTYTWO;
  const centerX = dims.width * (NUM.TWENTYTWO / NUM.THIRTYTHREE);
  const stepY = dims.height / (sampleCount - 1);
  const phaseShift = Math.PI;
  const totalTurns = NUM.THREE; // Three calm turns encode 3-7-9 layering without motion.

  for (let index = 0; index < sampleCount; index += 1) {
    const y = index * stepY;
    const progress = index / (sampleCount - 1);
    const angle = progress * totalTurns * Math.PI;
    const xA = centerX + Math.sin(angle) * amplitude;
    const xB = centerX + Math.sin(angle + phaseShift) * amplitude;
    strandA.push({ x: xA, y });
    strandB.push({ x: xB, y });
  }

  return { strandA, strandB };
}

function drawCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawFilledCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawPolyline(ctx, points) {
  if (points.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    ctx.lineTo(point.x, point.y);
  }
  ctx.stroke();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
