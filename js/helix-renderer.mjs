/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layer order (furthest to nearest):
    1) Vesica field (intersecting circles form the grounding grid)
    2) Tree-of-Life scaffold (ten sephirot nodes with twenty-two connective paths)
    3) Fibonacci curve (logarithmic spiral polyline)
    4) Double-helix lattice (twin strands with steady crossbars)

  ND-safe rationale:
    - No motion or timers; each layer renders once when invoked.
    - Calm palette with readable contrast to avoid sensory overload.
    - Small, pure helper functions keep the cosmology legible and lore-safe.
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

// Public entry point: orchestrates the four calm layers.
export function renderHelix(ctx, config = {}) {
  if (!ctx) return;
  const { width, height, palette, NUM } = normalizeOptions(config);

  fillBackground(ctx, width, height, palette.bg);
  drawVesicaField(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacciCurve(ctx, width, height, palette.layers[3], NUM);
  drawHelixLattice(ctx, width, height, palette.layers[4], palette.layers[5], palette.ink, NUM);
}

function normalizeOptions(config) {
  const width = Number.isFinite(config.width) ? config.width : 1440;
  const height = Number.isFinite(config.height) ? config.height : 900;
  const palette = ensurePalette(config.palette);
  const NUM = ensureNumerology(config.NUM);
  return { width, height, palette, NUM };
}

// Calm fallback palette keeps offline rendering predictable.
function ensurePalette(input) {
  if (!input) return { ...DEFAULT_PALETTE };
  const safe = {
    bg: typeof input.bg === "string" ? input.bg : DEFAULT_PALETTE.bg,
    ink: typeof input.ink === "string" ? input.ink : DEFAULT_PALETTE.ink,
    layers: []
  };
  if (Array.isArray(input.layers)) {
    for (let i = 0; i < Math.min(input.layers.length, DEFAULT_PALETTE.layers.length); i += 1) {
      if (typeof input.layers[i] === "string") safe.layers.push(input.layers[i]);
    }
  }
  while (safe.layers.length < DEFAULT_PALETTE.layers.length) {
    safe.layers.push(DEFAULT_PALETTE.layers[safe.layers.length]);
  }
  return safe;
}

function ensureNumerology(rawNUM) {
  const safe = { ...DEFAULT_NUM };
  if (!rawNUM || typeof rawNUM !== "object") return safe;
  for (const key of Object.keys(DEFAULT_NUM)) {
    if (Number.isFinite(rawNUM[key])) {
      safe[key] = rawNUM[key];
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

// Layer 1: Vesica field - intersecting circles provide depth without motion.
function drawVesicaField(ctx, width, height, color, NUM) {
  const cols = NUM.NINE;
  const rows = NUM.SEVEN;
  const marginX = width / NUM.NINE;
  const marginY = height / NUM.NINE;
  const fieldWidth = width - marginX * 2;
  const fieldHeight = height - marginY * 2;
  const horizontalStep = fieldWidth / (cols - 1);
  const verticalStep = fieldHeight / (rows - 1);
  const radius = Math.min(horizontalStep, verticalStep) * 0.6;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4;
  ctx.globalAlpha = 0.28;

  for (let row = 0; row < rows; row += 1) {
    const y = marginY + row * verticalStep;
    const shift = (row % 2 === 0) ? 0 : horizontalStep / 2;
    for (let col = 0; col < cols; col += 1) {
      const x = marginX + shift + col * horizontalStep;
      if (x < marginX * 0.5 || x > width - marginX * 0.5) continue;
      ctx.beginPath();
      ctx.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Second pass: vertical vesica strands reinforce the lattice.
  const verticalCols = NUM.SEVEN;
  const verticalRows = NUM.NINE;
  const verticalStepX = fieldWidth / (verticalCols - 1);
  const verticalStepY = fieldHeight / (verticalRows - 1);
  for (let col = 0; col < verticalCols; col += 1) {
    const x = marginX + col * verticalStepX;
    const shiftY = (col % 2 === 0) ? 0 : verticalStepY / 2;
    for (let row = 0; row < verticalRows; row += 1) {
      const y = marginY + shiftY + row * verticalStepY;
      if (y < marginY * 0.5 || y > height - marginY * 0.5) continue;
      ctx.beginPath();
      ctx.ellipse(x, y, radius * 0.85, radius * 0.85, Math.PI / 2, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

// Layer 2: Tree-of-Life scaffold - ten sephirot nodes plus twenty-two connective paths.
function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, NUM) {
  const centerX = width / 2;
  const marginY = height / NUM.NINE;
  const verticalStep = (height - marginY * 2) / NUM.TWENTYTWO;
  const horizontalUnit = width / NUM.ELEVEN;

  const levelY = (multiplier) => marginY + multiplier * verticalStep;
  const lane = (offset) => centerX + offset * horizontalUnit;

  const nodes = [
    { id: 0, x: lane(0), y: levelY(0) },
    { id: 1, x: lane(1.8), y: levelY(NUM.THREE) },
    { id: 2, x: lane(-1.8), y: levelY(NUM.THREE) },
    { id: 3, x: lane(1.4), y: levelY(NUM.SEVEN) },
    { id: 4, x: lane(-1.4), y: levelY(NUM.SEVEN) },
    { id: 5, x: lane(0), y: levelY(NUM.ELEVEN) },
    { id: 6, x: lane(1.4), y: levelY(NUM.ELEVEN + NUM.THREE) },
    { id: 7, x: lane(-1.4), y: levelY(NUM.ELEVEN + NUM.THREE) },
    { id: 8, x: lane(0), y: levelY(NUM.ELEVEN + NUM.SEVEN) },
    { id: 9, x: lane(0), y: levelY(NUM.TWENTYTWO) }
  ];

  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  const paths = [
    [0, 1], [0, 2], [0, 5],
    [1, 2], [1, 3], [1, 5],
    [2, 4], [2, 5],
    [3, 4], [3, 5], [3, 6],
    [4, 5], [4, 7],
    [5, 6], [5, 7], [5, 8],
    [6, 7], [6, 8], [6, 9],
    [7, 8], [7, 9],
    [8, 9]
  ];

  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.6;
  for (const [a, b] of paths) {
    const start = nodeById.get(a);
    const end = nodeById.get(b);
    if (!start || !end) continue;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.fillStyle = nodeColor;
  const nodeRadius = Math.min(width, height) / NUM.ONEFORTYFOUR * NUM.THREE;
  for (const node of nodes) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Layer 3: Fibonacci curve - calm logarithmic spiral referencing golden ratio.
function drawFibonacciCurve(ctx, width, height, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const centerX = width * 0.32;
  const centerY = height * 0.68;
  const totalSteps = NUM.THIRTYTHREE;
  const thetaMax = Math.PI * NUM.THREE; // three half-turns keep the curve gentle.
  const growthRate = Math.log(phi) / (Math.PI / 2);
  const baseRadius = Math.min(width, height) / NUM.NINETYNINE * NUM.THIRTYTHREE;

  const points = [];
  for (let i = 0; i <= totalSteps; i += 1) {
    const t = i / totalSteps;
    const theta = t * thetaMax;
    const radius = baseRadius * Math.exp(growthRate * theta);
    const x = centerX + Math.cos(theta) * radius;
    const y = centerY + Math.sin(theta) * radius;
    points.push({ x, y });
  }

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.75;
  strokePolyline(ctx, points);
  ctx.restore();
}

// Layer 4: Double-helix lattice - two static strands with steady crossbars.
function drawHelixLattice(ctx, width, height, strandAColor, strandBColor, rungColor, NUM) {
  const steps = NUM.NINETYNINE;
  const rotations = NUM.THREE; // three gentle twists.
  const marginY = height / NUM.NINE;
  const spanY = height - marginY * 2;
  const midX = width * 0.68;
  const amplitude = width / NUM.ELEVEN;

  const strandA = [];
  const strandB = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const y = marginY + t * spanY;
    const phase = t * Math.PI * rotations;
    const offset = Math.sin(phase) * amplitude;
    strandA.push({ x: midX - offset, y });
    strandB.push({ x: midX + offset, y });
  }

  ctx.save();
  ctx.lineWidth = 2.4;
  ctx.globalAlpha = 0.85;
  ctx.strokeStyle = strandAColor;
  strokePolyline(ctx, strandA);
  ctx.strokeStyle = strandBColor;
  strokePolyline(ctx, strandB);

  // Crossbars anchor the strands; count references twenty-two paths.
  ctx.strokeStyle = rungColor;
  ctx.lineWidth = 1.6;
  ctx.globalAlpha = 0.5;
  const rungCount = NUM.TWENTYTWO;
  for (let i = 0; i <= rungCount; i += 1) {
    const t = i / rungCount;
    const y = marginY + t * spanY;
    const phase = t * Math.PI * rotations;
    const offset = Math.sin(phase) * amplitude;
    ctx.beginPath();
    ctx.moveTo(midX - offset, y);
    ctx.lineTo(midX + offset, y);
    ctx.stroke();
  }
  ctx.restore();
}

// Shared helper: stroke a sequence of points without animation.
function strokePolyline(ctx, points) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}
