/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layer order (furthest to nearest):
    1. Vesica field (intersecting circles form the foundation)
    2. Tree-of-Life scaffold (ten sephirot plus twenty-two calm paths)
    3. Fibonacci curve (static golden spiral polyline)
    4. Double-helix lattice (two phase-shifted strands with steady crossbars)

  ND-safe design:
    - No animation; geometry paints once to keep sensory load gentle.
    - Muted contrast with readable ink values avoids harsh flashing.
    - Pure helpers make it easy to audit how lore-specific numbers are used.
*/

const DEFAULT_PALETTE = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
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

// Exported entry point. Small pure function that renders all four layers back-to-front.
export function renderHelix(ctx, opts = {}) {
  if (!ctx) return;
  const { width, height, palette, NUM } = normalizeOptions(opts);

  fillBackground(ctx, width, height, palette.bg);
  drawVesicaField(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacciCurve(ctx, width, height, palette.layers[3], NUM);
  drawHelixLattice(ctx, width, height, palette.layers[4], palette.layers[5], palette.ink, NUM);
}

function normalizeOptions(opts) {
  const width = Number.isFinite(opts.width) ? opts.width : 1440;
  const height = Number.isFinite(opts.height) ? opts.height : 900;
  const palette = ensurePalette(opts.palette);
  const NUM = ensureNumerology(opts.NUM);
  return { width, height, palette, NUM };
}

// Palette validation keeps offline fallback gentle.
function ensurePalette(palette) {
  if (!palette) return { ...DEFAULT_PALETTE };
  const bg = palette.bg || DEFAULT_PALETTE.bg;
  const ink = palette.ink || DEFAULT_PALETTE.ink;
  const layers = Array.isArray(palette.layers) ? palette.layers.slice(0, 6) : [];
  while (layers.length < 6) {
    layers.push(DEFAULT_PALETTE.layers[layers.length]);
  }
  return { bg, ink, layers };
}

// Numerology constants stay configurable but always fall back to lore values.
function ensureNumerology(input) {
  const safe = { ...DEFAULT_NUM };
  if (!input) return safe;
  for (const key of Object.keys(safe)) {
    if (Number.isFinite(input[key])) {
      safe[key] = input[key];
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

// Layer 1: Vesica field. Static intersecting circles preserve depth with no motion.
function drawVesicaField(ctx, width, height, color, NUM) {
  const centers = createVesicaCenters(width, height, NUM);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.7;

  centers.forEach(({ cx, cy, radius, offset }) => {
    drawCirclePair(ctx, cx, cy, radius, offset);
  });

  ctx.restore();
}

function createVesicaCenters(width, height, NUM) {
  const radius = Math.min(width, height) / NUM.NINE;
  const offset = radius / NUM.THREE;
  const horizontalStep = radius;
  const verticalStep = radius * (NUM.SEVEN / NUM.NINE);
  const columns = NUM.SEVEN;
  const rows = NUM.NINE;
  const centers = [];

  for (let r = -Math.floor(rows / 2); r <= Math.floor(rows / 2); r++) {
    for (let c = -Math.floor(columns / 2); c <= Math.floor(columns / 2); c++) {
      centers.push({
        cx: width / 2 + c * horizontalStep,
        cy: height / 2 + r * verticalStep,
        radius,
        offset
      });
    }
  }

  return centers;
}

function drawCirclePair(ctx, cx, cy, radius, offset) {
  ctx.beginPath();
  ctx.arc(cx - offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

// Layer 2: Tree-of-Life scaffold. Nodes glow softly; paths keep steady width.
function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, NUM) {
  const nodes = createTreeNodes(width, height, NUM);
  const paths = createTreePaths();
  const radius = Math.max(3, width / NUM.NINETYNINE);

  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";

  paths.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function createTreeNodes(width, height, NUM) {
  const unitY = height / NUM.ONEFORTYFOUR;
  const centerX = width / 2;
  const spread = width / NUM.ELEVEN;
  return [
    { x: centerX, y: unitY * 9 },
    { x: centerX + spread, y: unitY * 22 },
    { x: centerX - spread, y: unitY * 22 },
    { x: centerX + spread * 1.4, y: unitY * 44 },
    { x: centerX - spread * 1.4, y: unitY * 44 },
    { x: centerX, y: unitY * 55 },
    { x: centerX + spread, y: unitY * 77 },
    { x: centerX - spread, y: unitY * 77 },
    { x: centerX, y: unitY * 99 },
    { x: centerX, y: unitY * 126 }
  ];
}

function createTreePaths() {
  return [
    [0, 1], [0, 2], [1, 2],
    [1, 3], [2, 4], [3, 4],
    [3, 5], [4, 5], [1, 5], [2, 5],
    [3, 6], [4, 7], [5, 6], [5, 7],
    [6, 7], [6, 8], [7, 8],
    [6, 9], [7, 9], [8, 9],
    [2, 3], [1, 4]
  ];
}

// Layer 3: Fibonacci curve. Static polyline approximates the golden spiral.
function drawFibonacciCurve(ctx, width, height, color, NUM) {
  const points = createFibonacciPoints(width, height, NUM);
  if (points.length < 2) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  ctx.restore();
}

function createFibonacciPoints(width, height, NUM) {
  const centerX = width / 2;
  const centerY = height / 2;
  const phi = (1 + Math.sqrt(5)) / 2;
  const baseRadius = Math.min(width, height) / NUM.NINE;
  const maxTheta = Math.PI * (NUM.THREE + NUM.SEVEN / NUM.TWENTYTWO);
  const steps = NUM.NINETYNINE;
  const scaleDivisor = Math.PI * (NUM.TWENTYTWO / NUM.SEVEN);
  const points = [];

  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * maxTheta;
    const growth = Math.pow(phi, theta / scaleDivisor);
    const radius = baseRadius * growth;
    const x = centerX + radius * Math.cos(theta);
    const y = centerY - radius * Math.sin(theta);
    points.push({ x, y });
  }

  return points;
}

// Layer 4: Double-helix lattice. Two strands plus rungs preserve layered depth without motion.
function drawHelixLattice(ctx, width, height, strandColorA, strandColorB, rungColor, NUM) {
  const geometry = createHelixGeometry(width, height, NUM);

  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.strokeStyle = strandColorA;
  ctx.lineWidth = 2;
  drawPolyline(ctx, geometry.strandA);

  ctx.strokeStyle = strandColorB;
  ctx.lineWidth = 2;
  drawPolyline(ctx, geometry.strandB);

  ctx.strokeStyle = rungColor;
  ctx.lineWidth = 1.2;
  geometry.rungs.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  });

  ctx.restore();
}

function createHelixGeometry(width, height, NUM) {
  const segmentCount = NUM.THIRTYTHREE;
  const rungCount = NUM.TWENTYTWO;
  const top = height / NUM.NINE;
  const bottom = height - top;
  const amplitude = (width / NUM.THIRTYTHREE) * (NUM.SEVEN / NUM.NINE);
  const strandA = [];
  const strandB = [];
  const rungs = [];

  for (let i = 0; i <= segmentCount; i++) {
    const t = i / segmentCount;
    strandA.push(calcHelixPoint(t, 0, width, top, bottom, amplitude, NUM));
    strandB.push(calcHelixPoint(t, Math.PI, width, top, bottom, amplitude, NUM));
  }

  for (let i = 0; i <= rungCount; i++) {
    const t = i / rungCount;
    const a = calcHelixPoint(t, 0, width, top, bottom, amplitude, NUM);
    const b = calcHelixPoint(t, Math.PI, width, top, bottom, amplitude, NUM);
    rungs.push([a, b]);
  }

  return { strandA, strandB, rungs };
}

function calcHelixPoint(t, phase, width, top, bottom, amplitude, NUM) {
  const y = top + (bottom - top) * t;
  const oscillations = NUM.THREE;
  const angle = t * Math.PI * oscillations + phase;
  const x = width / 2 + Math.sin(angle) * amplitude;
  return { x, y };
}

function drawPolyline(ctx, points) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}
