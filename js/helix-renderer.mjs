/*
  helix-renderer.mjs
  ND-safe static renderer for the layered cosmology in Codex 144:99.

  Layer order (furthest to nearest):
    1. Vesica field (intersecting circles anchor the stage)
    2. Tree-of-Life scaffold (ten sephirot plus twenty-two connective paths)
    3. Fibonacci curve (static golden spiral polyline)
    4. Double-helix lattice (two strands with steady crossbars)

  All helpers are small pure functions that run once per invocation to honor the
  trauma-informed, offline-first requirement: no motion, readable contrast, and
  comments that explain why each choice stays ND-safe.
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

// Blueprint for the Tree-of-Life layout. Column offsets keep the geometry layered.
const TREE_BLUEPRINT = [
  { key: 'kether', label: 'Kether', column: 0, level: 0, offset: 0 },
  { key: 'chokmah', label: 'Chokmah', column: 1, level: 1, offset: -0.12 },
  { key: 'binah', label: 'Binah', column: -1, level: 1, offset: 0.12 },
  { key: 'chesed', label: 'Chesed', column: 1, level: 2, offset: -0.08 },
  { key: 'geburah', label: 'Geburah', column: -1, level: 2, offset: 0.08 },
  { key: 'tiphareth', label: 'Tiphareth', column: 0, level: 3, offset: 0 },
  { key: 'netzach', label: 'Netzach', column: 1, level: 4, offset: -0.18 },
  { key: 'hod', label: 'Hod', column: -1, level: 4, offset: 0.18 },
  { key: 'yesod', label: 'Yesod', column: 0, level: 5, offset: 0 },
  { key: 'malkuth', label: 'Malkuth', column: 0, level: 6, offset: 0 }
];

// Twenty-two connective paths honoring the major arcana mapping.
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
 * Render the full static helix visualization onto a canvas context.
 *
 * Draws four non-animated layers (vesica field, Tree-of-Life scaffold, Fibonacci
 * curve, and double-helix lattice) in back-to-front order using normalized
 * options. All helpers are pure and return early when inputs are missing to
 * keep the flow predictable and ND-safe.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D drawing context; exits quietly when falsy.
 * @param {Object} [opts] - Optional rendering settings.
 */
export function renderHelix(ctx, opts = {}) {
  if (!ctx) return;

  const { width, height, palette, NUM } = normalizeOptions(opts);
  if (ctx.canvas) {
    if (ctx.canvas.width !== width) ctx.canvas.width = width;
    if (ctx.canvas.height !== height) ctx.canvas.height = height;
  }

  fillBackground(ctx, width, height, palette.bg);
  drawVesicaField(ctx, width, height, palette, NUM);
  drawTreeOfLife(ctx, width, height, palette, NUM);
  drawFibonacciCurve(ctx, width, height, palette, NUM);
  drawHelixLattice(ctx, width, height, palette, NUM);
}

function normalizeOptions(opts) {
  const width = isFiniteNumber(opts.width) ? opts.width : DEFAULT_DIMENSIONS.width;
  const height = isFiniteNumber(opts.height) ? opts.height : DEFAULT_DIMENSIONS.height;
  return {
    width,
    height,
    palette: ensurePalette(opts.palette),
    NUM: ensureNumerology(opts.NUM)
  };
}

function ensurePalette(input) {
  if (!isPlainObject(input)) return { ...DEFAULT_PALETTE };
  const bg = isColorString(input.bg) ? input.bg : DEFAULT_PALETTE.bg;
  const ink = isColorString(input.ink) ? input.ink : DEFAULT_PALETTE.ink;
  const sourceLayers = Array.isArray(input.layers) ? input.layers.filter(isColorString) : [];
  const layers = [];
  const needed = Math.max(DEFAULT_PALETTE.layers.length, sourceLayers.length, 4);
  for (let i = 0; i < needed; i += 1) {
    layers.push(sourceLayers[i] || DEFAULT_PALETTE.layers[i % DEFAULT_PALETTE.layers.length]);
  }
  return { bg, ink, layers };
}

function ensureNumerology(input) {
  const result = {};
  const source = isPlainObject(input) ? input : {};
  for (const key of Object.keys(DEFAULT_NUM)) {
    result[key] = isFiniteNumber(source[key]) ? source[key] : DEFAULT_NUM[key];
  }
  return result;
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function isColorString(value) {
  return typeof value === 'string' && /^#([0-9a-f]{6})$/i.test(value.trim());
}

function clamp01(value) {
  if (!isFiniteNumber(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function withAlpha(hex, alpha) {
  if (!isColorString(hex)) return `rgba(232, 232, 240, ${clamp01(alpha)})`;
  const value = hex.trim().slice(1);
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${clamp01(alpha)})`;
}

function fillBackground(ctx, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawVesicaField(ctx, width, height, palette, NUM) {
  const rowCount = Math.max(NUM.SEVEN, 6);
  const columnCount = Math.max(NUM.THREE + 1, 4);
  const radius = Math.min(width / (columnCount * 1.6), height / (rowCount * 1.8));
  const horizontalSpacing = radius * (2 - 2 / NUM.TWENTYTWO);
  const verticalSpacing = radius * (1 + 1 / NUM.NINE);
  const offsetX = width / 2 - (columnCount - 1) * horizontalSpacing / 2;
  const offsetY = height / 2 - (rowCount - 1) * verticalSpacing / 2;

  ctx.save();
  ctx.strokeStyle = withAlpha(palette.layers[0] || palette.ink, 0.35);
  ctx.lineWidth = Math.max(1, radius / NUM.THIRTYTHREE);

  for (let row = 0; row < rowCount; row += 1) {
    const y = offsetY + row * verticalSpacing;
    const shift = row % 2 === 0 ? 0 : horizontalSpacing / 2;
    for (let col = 0; col < columnCount + 1; col += 1) {
      const x = offsetX + col * horizontalSpacing + shift;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawTreeOfLife(ctx, width, height, palette, NUM) {
  const nodes = computeSephirotPositions(width, height, NUM);
  const nodeMap = new Map(nodes.map((node) => [node.key, node]));
  const pathColor = withAlpha(palette.layers[1] || palette.ink, 0.55);

  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = Math.max(1.2, Math.min(width, height) / NUM.NINETYNINE);
  ctx.lineCap = 'round';

  for (const [fromKey, toKey] of TREE_PATHS) {
    const from = nodeMap.get(fromKey);
    const to = nodeMap.get(toKey);
    if (!from || !to) continue;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  ctx.restore();

  ctx.save();
  const nodeRadius = Math.min(width, height) / NUM.TWENTYTWO;
  const labelFont = `${Math.max(12, Math.round(nodeRadius * 0.5))}px system-ui`;
  const indexFont = `${Math.max(10, Math.round(nodeRadius * 0.35))}px system-ui`;
  ctx.lineWidth = Math.max(1.5, nodeRadius / NUM.THIRTYTHREE * 4);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (const node of nodes) {
    ctx.fillStyle = withAlpha(palette.bg, 0.85);
    ctx.strokeStyle = withAlpha(palette.layers[1] || palette.ink, 0.85);
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = withAlpha(palette.layers[1] || palette.ink, 0.7);
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius / NUM.THREE, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = withAlpha(palette.ink, 0.9);
    ctx.font = labelFont;
    ctx.fillText(node.label, node.x, node.y - nodeRadius - nodeRadius / NUM.ELEVEN);

    ctx.font = indexFont;
    ctx.fillStyle = withAlpha(palette.ink, 0.75);
    ctx.fillText(String(node.order), node.x, node.y);
  }

  ctx.restore();
}

function computeSephirotPositions(width, height, NUM) {
  const verticalSpacing = height / (NUM.SEVEN + 1);
  const horizontalSpacing = width / (NUM.THREE + 1);
  const centerX = width / 2;

  return TREE_BLUEPRINT.map((node, index) => {
    const x = centerX + node.column * horizontalSpacing + node.offset * horizontalSpacing;
    const y = verticalSpacing * (node.level + 1);
    return { ...node, x, y, order: index + 1 };
  });
}

function drawFibonacciCurve(ctx, width, height, palette, NUM) {
  const segments = NUM.TWENTYTWO + NUM.ELEVEN; // 33 calm segments along the spiral.
  const totalAngle = Math.PI * (NUM.THREE - NUM.ELEVEN / NUM.TWENTYTWO);
  const baseRadius = Math.min(width, height) / NUM.NINE;
  const centerX = width * (NUM.SEVEN / NUM.TWENTYTWO);
  const centerY = height * (NUM.NINE / NUM.TWENTYTWO);
  const points = [];

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const angle = t * totalAngle;
    const radius = baseRadius * Math.pow(GOLDEN_RATIO, angle / Math.PI);
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    points.push({ x, y });
  }

  if (points.length < 2) return;

  ctx.save();
  ctx.strokeStyle = withAlpha(palette.layers[2] || palette.ink, 0.75);
  ctx.lineWidth = Math.max(1.5, Math.min(width, height) / NUM.ONEFORTYFOUR * 3);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  ctx.fillStyle = withAlpha(palette.layers[2] || palette.ink, 0.5);
  const markerStep = Math.max(1, Math.round(segments / NUM.ELEVEN));
  const markerRadius = Math.max(2, baseRadius / NUM.THIRTYTHREE);
  for (let i = 0; i < points.length; i += markerStep) {
    const point = points[i];
    ctx.beginPath();
    ctx.arc(point.x, point.y, markerRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawHelixLattice(ctx, width, height, palette, NUM) {
  const segments = NUM.ONEFORTYFOUR;
  const amplitude = width / (NUM.THREE + NUM.SEVEN);
  const centerX = width * (NUM.TWENTYTWO - NUM.SEVEN) / NUM.TWENTYTWO;
  const verticalMargin = height / NUM.ELEVEN;
  const startY = verticalMargin;
  const endY = height - verticalMargin;
  const totalY = endY - startY;
  const phase = Math.PI / NUM.THREE;

  const strandA = [];
  const strandB = [];

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const angle = t * Math.PI * (NUM.THIRTYTHREE / NUM.ELEVEN);
    const y = startY + totalY * t;
    const xA = centerX + Math.sin(angle) * amplitude;
    const xB = centerX + Math.sin(angle + phase) * amplitude * 0.9;
    strandA.push({ x: xA, y });
    strandB.push({ x: xB, y });
  }

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const strandColorA = withAlpha(palette.layers[3] || palette.ink, 0.85);
  const strandColorB = withAlpha(palette.layers[4] || palette.layers[3] || palette.ink, 0.75);
  const rungColor = withAlpha(palette.layers[5] || palette.ink, 0.5);

  ctx.lineWidth = Math.max(1.2, Math.min(width, height) / NUM.ONEFORTYFOUR * 4);
  ctx.strokeStyle = strandColorA;
  ctx.beginPath();
  ctx.moveTo(strandA[0].x, strandA[0].y);
  for (let i = 1; i < strandA.length; i += 1) {
    ctx.lineTo(strandA[i].x, strandA[i].y);
  }
  ctx.stroke();

  ctx.strokeStyle = strandColorB;
  ctx.beginPath();
  ctx.moveTo(strandB[0].x, strandB[0].y);
  for (let i = 1; i < strandB.length; i += 1) {
    ctx.lineTo(strandB[i].x, strandB[i].y);
  }
  ctx.stroke();

  ctx.strokeStyle = rungColor;
  ctx.lineWidth = Math.max(1, Math.min(width, height) / NUM.NINETYNINE * 2);
  const rungStep = Math.max(2, Math.round(segments / NUM.TWENTYTWO));
  for (let i = 0; i < strandA.length; i += rungStep) {
    const a = strandA[i];
    const b = strandB[i];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}
