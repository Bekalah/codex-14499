/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layer order (furthest to nearest):
    1. Vesica field (repeating vesica piscis grid)
    2. Tree-of-Life scaffold (ten sephirot, twenty-two paths)
    3. Fibonacci curve (static golden spiral polyline)
    4. Double-helix lattice (two strands with steady crossbars)

  ND-safe commitments:
    - No animation or timers; every layer renders once.
    - Calm contrast pulled from an ND-safe palette.
    - Small, pure helpers so the geometry remains transparent to audit.
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

// Exported entry point. Accepts a 2d context, dimensions, palette, and numerology constants.
export function renderHelix(ctx, opts = {}) {
  if (!ctx) return;

  const width = Number(opts.width) || 1440;
  const height = Number(opts.height) || 900;
  const safePalette = ensurePalette(opts.palette);
  const safeNUM = ensureNumerology(opts.NUM);

  fillBackground(ctx, width, height, safePalette.bg);
  drawVesicaField(ctx, width, height, safePalette.layers[0], safeNUM);
  drawTreeOfLife(ctx, width, height, safePalette.layers[1], safePalette.layers[2], safeNUM);
  drawFibonacciCurve(ctx, width, height, safePalette.layers[3], safeNUM);
  drawHelixLattice(ctx, width, height, safePalette.layers[4], safePalette.layers[5], safePalette.ink, safeNUM);
}

function ensurePalette(palette) {
  if (!palette) return { ...DEFAULT_PALETTE };
  const layers = Array.isArray(palette.layers) ? palette.layers.slice(0, 6) : [];
  while (layers.length < 6) layers.push(DEFAULT_PALETTE.layers[layers.length]);
  return {
    bg: palette.bg || DEFAULT_PALETTE.bg,
    ink: palette.ink || DEFAULT_PALETTE.ink,
    layers
  };
}

function ensureNumerology(num) {
  const safe = { ...DEFAULT_NUM };
  if (!num) return safe;
  for (const key of Object.keys(safe)) {
    const value = Number(num[key]);
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

// Layer 1: Vesica field. Calm repetition anchors the scene without motion.
function drawVesicaField(ctx, width, height, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;

  const radius = Math.min(width, height) / NUM.NINE;
  const horizontalStep = radius;
  const verticalStep = radius * (NUM.NINE / NUM.ELEVEN);
  const offset = radius / NUM.THREE;
  const columns = NUM.SEVEN;
  const rows = NUM.NINE;

  const startCol = -Math.floor(columns / 2);
  const endCol = Math.floor(columns / 2);
  const startRow = -Math.floor(rows / 2);
  const endRow = Math.floor(rows / 2);

  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const cx = width / 2 + col * horizontalStep;
      const cy = height / 2 + row * verticalStep;
      drawVesicaPair(ctx, cx, cy, radius, offset);
    }
  }

  ctx.restore();
}

function drawVesicaPair(ctx, cx, cy, radius, offset) {
  ctx.beginPath();
  ctx.arc(cx - offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

// Layer 2: Tree-of-Life scaffold. Nodes glow softly; paths keep steady width.
function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, NUM) {
  const verticalUnit = height / NUM.ONEFORTYFOUR;
  const horizontalUnit = width / NUM.ELEVEN;
  const centerX = width / 2;

  const nodes = [
    { x: centerX, y: verticalUnit * 9 },
    { x: centerX + horizontalUnit, y: verticalUnit * 22 },
    { x: centerX - horizontalUnit, y: verticalUnit * 22 },
    { x: centerX + horizontalUnit * 1.4, y: verticalUnit * 44 },
    { x: centerX - horizontalUnit * 1.4, y: verticalUnit * 44 },
    { x: centerX, y: verticalUnit * 55 },
    { x: centerX + horizontalUnit, y: verticalUnit * 77 },
    { x: centerX - horizontalUnit, y: verticalUnit * 77 },
    { x: centerX, y: verticalUnit * 99 },
    { x: centerX, y: verticalUnit * 126 }
  ];

  const paths = [
    [0, 1], [0, 2], [1, 2],
    [1, 3], [2, 4], [3, 4],
    [3, 5], [4, 5], [1, 5], [2, 5],
    [3, 6], [4, 7], [5, 6], [5, 7],
    [6, 7], [6, 8], [7, 8],
    [6, 9], [7, 9], [8, 9],
    [2, 3], [1, 4]
  ];

  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 2;
  paths.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = Math.max(3, width / NUM.NINETYNINE);
  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

// Layer 3: Fibonacci curve. Static golden spiral expresses growth without motion.
function drawFibonacciCurve(ctx, width, height, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  // Golden Ratio ensures the spiral honours lineage growth while remaining static.
  const golden = (1 + Math.sqrt(5)) / 2;
  const center = { x: (width / NUM.THREE) * 2, y: height / NUM.THREE };
  const baseScale = Math.min(width, height) / NUM.NINETYNINE * NUM.SEVEN;
  const maxTheta = Math.PI * NUM.SEVEN;
  const thetaStep = Math.PI / NUM.THIRTYTHREE;

  ctx.beginPath();
  for (let theta = 0; theta <= maxTheta; theta += thetaStep) {
    const radius = baseScale * Math.pow(golden, theta / (Math.PI / 2));
    const x = center.x + radius * Math.cos(theta);
    const y = center.y + radius * Math.sin(theta);
    if (theta === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.restore();
}

// Layer 4: Double-helix lattice. Static strands echo DNA symbolism without animation.
function drawHelixLattice(ctx, width, height, strandColorA, strandColorB, rungColor, NUM) {
  ctx.save();

  const steps = NUM.TWENTYTWO;
  const amplitude = height / NUM.THIRTYTHREE;
  const frequency = (Math.PI * NUM.ELEVEN) / width;
  const baseline = height * 0.65;

  drawHelixStrand(ctx, width, steps, amplitude, frequency, baseline, 0, strandColorA);
  drawHelixStrand(ctx, width, steps, amplitude, frequency, baseline, Math.PI, strandColorB || strandColorA);
  drawHelixRungs(ctx, width, steps, amplitude, frequency, baseline, rungColor);

  ctx.restore();
}

function drawHelixStrand(ctx, width, steps, amplitude, frequency, baseline, phase, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const x = (width / steps) * i;
    const y = baseline + amplitude * Math.sin(frequency * x + phase);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawHelixRungs(ctx, width, steps, amplitude, frequency, baseline, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let i = 0; i <= steps; i++) {
    const x = (width / steps) * i;
    const y1 = baseline + amplitude * Math.sin(frequency * x);
    const y2 = baseline + amplitude * Math.sin(frequency * x + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
  ctx.restore();
}
