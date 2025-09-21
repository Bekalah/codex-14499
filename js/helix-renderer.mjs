/*
  helix-renderer.mjs
  ND-safe static renderer for the layered cosmology in Codex 144:99.

  Layer order (back to front):
    1. Vesica field (intersecting circles ground the space).
    2. Tree-of-Life scaffold (ten sephirot linked by twenty-two paths).
    3. Fibonacci curve (static golden spiral polyline).
    4. Double-helix lattice (two phase-shifted strands with steady crossbars).

  ND-safe choices:
    - No animation or timers; render runs once per call to avoid sensory overload.
    - Calm palette handled via normalized options and comments explaining layer order.
    - Small pure helpers make numerology-driven geometry easy to audit offline.
*/

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

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

/*
  Lore tables preserve the cosmology vocabulary. Keeping them inline avoids
  overwriting lineage context while allowing geometry helpers to stay pure.
*/
const MAJOR_ARCANA = [
  { name: 'The Fool', numerology: 0 },
  { name: 'The Magician', numerology: 1 },
  { name: 'High Priestess', numerology: 2 },
  { name: 'The Empress', numerology: 3 },
  { name: 'The Emperor', numerology: 4 },
  { name: 'Hierophant', numerology: 5 },
  { name: 'The Lovers', numerology: 6 },
  { name: 'The Chariot', numerology: 7 },
  { name: 'Strength', numerology: 8 },
  { name: 'Hermit', numerology: 9 },
  { name: 'Wheel of Fortune', numerology: 10 },
  { name: 'Justice', numerology: 11 },
  { name: 'Hanged Man', numerology: 12 },
  { name: 'Death', numerology: 13 },
  { name: 'Temperance', numerology: 14 },
  { name: 'Devil', numerology: 15 },
  { name: 'Tower', numerology: 16 },
  { name: 'Star', numerology: 17 },
  { name: 'Moon', numerology: 18 },
  { name: 'Sun', numerology: 19 },
  { name: 'Judgement', numerology: 20 },
  { name: 'World', numerology: 21 }
];

const SEPHIROT = [
  { key: 'kether', label: 'Kether', yUnits: 9, xShift: 0 },
  { key: 'chokmah', label: 'Chokmah', yUnits: 22, xShift: 1.2 },
  { key: 'binah', label: 'Binah', yUnits: 22, xShift: -1.2 },
  { key: 'chesed', label: 'Chesed', yUnits: 44, xShift: 1.45 },
  { key: 'geburah', label: 'Geburah', yUnits: 44, xShift: -1.45 },
  { key: 'tiphareth', label: 'Tiphareth', yUnits: 55, xShift: 0 },
  { key: 'netzach', label: 'Netzach', yUnits: 77, xShift: 1.1 },
  { key: 'hod', label: 'Hod', yUnits: 77, xShift: -1.1 },
  { key: 'yesod', label: 'Yesod', yUnits: 99, xShift: 0 },
  { key: 'malkuth', label: 'Malkuth', yUnits: 126, xShift: 0 }
];

const TREE_PATHS = [
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

export function renderHelix(ctx, opts = {}) {
  if (!ctx) return;

  const { width, height, palette, NUM } = normalizeOptions(opts);
  const drawWidth = ctx.canvas && typeof ctx.canvas.width === 'number' ? ctx.canvas.width : width;
  const drawHeight = ctx.canvas && typeof ctx.canvas.height === 'number' ? ctx.canvas.height : height;

  ctx.save();
  ctx.clearRect(0, 0, drawWidth, drawHeight);
  paintBackground(ctx, drawWidth, drawHeight, palette.bg);

  drawVesicaField(ctx, drawWidth, drawHeight, palette, NUM);
  drawTreeOfLife(ctx, drawWidth, drawHeight, palette, NUM);
  drawFibonacciCurve(ctx, drawWidth, drawHeight, palette.layers[4] || palette.ink, NUM);
  drawDoubleHelix(ctx, drawWidth, drawHeight, palette, NUM);

  ctx.restore();
}

function normalizeOptions(opts) {
  const width = typeof opts.width === 'number' && opts.width > 0 ? opts.width : DEFAULT_DIMENSIONS.width;
  const height = typeof opts.height === 'number' && opts.height > 0 ? opts.height : DEFAULT_DIMENSIONS.height;
  const palette = ensurePalette(opts.palette);
  const NUM = ensureNumerology(opts.NUM);
  return { width, height, palette, NUM };
}

function ensurePalette(input) {
  if (!input || typeof input !== 'object') {
    return { ...DEFAULT_PALETTE };
  }

  const bg = typeof input.bg === 'string' ? input.bg : DEFAULT_PALETTE.bg;
  const ink = typeof input.ink === 'string' ? input.ink : DEFAULT_PALETTE.ink;
  const providedLayers = Array.isArray(input.layers) ? input.layers.filter((color) => typeof color === 'string') : [];
  const layers = DEFAULT_PALETTE.layers.map((fallbackColor, index) => providedLayers[index] || fallbackColor);

  return { bg, ink, layers };
}

function ensureNumerology(input) {
  const result = { ...DEFAULT_NUM };
  if (!input || typeof input !== 'object') {
    return result;
  }

  for (const key of Object.keys(DEFAULT_NUM)) {
    if (typeof input[key] === 'number' && Number.isFinite(input[key]) && input[key] > 0) {
      result[key] = input[key];
    }
  }

  return result;
}

function paintBackground(ctx, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawVesicaField(ctx, width, height, palette, NUM) {
  const cols = Math.max(3, Math.round(NUM.NINE));
  const rows = Math.max(3, Math.round(NUM.SEVEN));
  const horizontalStep = width / (cols + 1);
  const verticalStep = height / (rows + 1);
  const radius = Math.min(horizontalStep, verticalStep) * (NUM.ELEVEN / (NUM.THIRTYTHREE * 1.2));

  const primary = palette.layers[0] || palette.ink;
  const secondary = palette.layers[1] || palette.ink;

  ctx.save();
  ctx.lineWidth = Math.max(1.5, radius / NUM.THIRTYTHREE);
  ctx.globalAlpha = 0.75;
  ctx.strokeStyle = primary;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = horizontalStep * (col + 1);
      const y = verticalStep * (row + 1);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = secondary;
  const offset = horizontalStep / 2;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols - 1; col += 1) {
      const x = offset + horizontalStep * (col + 1);
      const y = verticalStep * (row + 1);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawTreeOfLife(ctx, width, height, palette, NUM) {
  const layout = computeSephirotPositions(width, height, NUM);
  drawTreePaths(ctx, layout, palette.layers[2] || palette.ink, NUM);
  drawSephirotNodes(ctx, layout, palette.layers[3] || palette.ink, palette.ink, width, height, NUM);
}

function computeSephirotPositions(width, height, NUM) {
  const verticalMargin = height / NUM.NINE;
  const verticalUnit = (height - verticalMargin * 2) / NUM.ONEFORTYFOUR;
  const xScale = width / (NUM.ELEVEN * 2);
  return SEPHIROT.map((node) => {
    return {
      key: node.key,
      label: node.label,
      x: width / 2 + node.xShift * xScale,
      y: verticalMargin + node.yUnits * verticalUnit
    };
  });
}

function drawTreePaths(ctx, layout, strokeColor, NUM) {
  const lookup = new Map();
  layout.forEach((node) => lookup.set(node.key, node));

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = Math.max(1.2, Math.min(layout.length * 0.6, layout.length) / NUM.NINETYNINE * 12);

  TREE_PATHS.forEach((path) => {
    const start = lookup.get(path.from);
    const end = lookup.get(path.to);
    if (!start || !end) return;

    const arcana = MAJOR_ARCANA[path.arcanaIndex];
    const modulation = arcana ? (arcana.numerology % NUM.SEVEN) / NUM.SEVEN : 0.5;
    ctx.globalAlpha = 0.45 + modulation * 0.4;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  });

  ctx.restore();
}

function drawSephirotNodes(ctx, layout, fillColor, inkColor, width, height, NUM) {
  ctx.save();
  const radius = Math.max(8, Math.min(width, height) / NUM.TWENTYTWO);
  ctx.lineWidth = Math.max(1.5, radius / NUM.THIRTYTHREE);
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = inkColor;
  ctx.font = `${Math.round(radius * 0.9)}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  layout.forEach((node) => {
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 0.85;
    ctx.fillStyle = inkColor;
    ctx.fillText(node.label, node.x, node.y);
    ctx.fillStyle = fillColor;
  });

  ctx.restore();
}

function drawFibonacciCurve(ctx, width, height, strokeColor, NUM) {
  const samples = Math.max(NUM.NINETYNINE, 60);
  const maxAngle = (NUM.THIRTYTHREE / NUM.ELEVEN) * Math.PI; // three pi rotations keeps the curve gentle.
  const baseRadius = Math.min(width, height) / NUM.SEVEN;
  const centerX = width * 0.35;
  const centerY = height * 0.55;

  ctx.save();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = Math.max(1.5, Math.min(width, height) / NUM.NINETYNINE * 2);
  ctx.lineCap = 'round';
  ctx.globalAlpha = 0.85;

  ctx.beginPath();
  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    const angle = t * maxAngle;
    const radius = baseRadius * Math.pow(GOLDEN_RATIO, angle / (Math.PI / 2));
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  const markerCount = NUM.THREE + NUM.SEVEN; // ten calm markers along the curve.
  ctx.fillStyle = strokeColor;
  ctx.globalAlpha = 0.7;
  for (let i = 1; i <= markerCount; i += 1) {
    const t = i / (markerCount + 1);
    const angle = t * maxAngle;
    const radius = baseRadius * Math.pow(GOLDEN_RATIO, angle / (Math.PI / 2));
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    const size = Math.max(2, Math.min(width, height) / NUM.ONEFORTYFOUR);
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawDoubleHelix(ctx, width, height, palette, NUM) {
  const strandAColor = palette.layers[5] || palette.ink;
  const strandBColor = palette.layers[4] || palette.ink;
  const rungColor = palette.ink;

  const samples = Math.max(NUM.THIRTYTHREE, 24);
  const verticalMargin = height / NUM.NINE;
  const usableHeight = height - verticalMargin * 2;
  const amplitude = width / (NUM.ELEVEN * 1.5);
  const centerX = width * 0.65;
  const phaseTurns = NUM.NINE / NUM.THREE; // three calm rotations.

  const strandA = [];
  const strandB = [];
  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    const angle = t * phaseTurns * Math.PI * 2;
    const y = verticalMargin + usableHeight * t;
    const xA = centerX + Math.sin(angle) * amplitude;
    const xB = centerX + Math.sin(angle + Math.PI) * amplitude;
    strandA.push({ x: xA, y });
    strandB.push({ x: xB, y });
  }

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(1.5, Math.min(width, height) / NUM.ONEFORTYFOUR * 2);

  ctx.strokeStyle = strandAColor;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  strandA.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();

  ctx.strokeStyle = strandBColor;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  strandB.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();

  ctx.strokeStyle = rungColor;
  ctx.globalAlpha = 0.6;
  const rungStep = Math.max(1, Math.round(samples / NUM.TWENTYTWO));
  for (let i = 0; i <= samples; i += rungStep) {
    const a = strandA[i];
    const b = strandB[i];
    if (!a || !b) continue;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}
