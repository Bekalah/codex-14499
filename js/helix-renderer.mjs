/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers (furthest to nearest):
    1. Vesica field (intersecting circles forming the grid)
    2. Tree-of-Life scaffold (ten nodes, twenty-two connective paths)
    3. Fibonacci curve (Golden Ratio spiral rendered once)
    4. Double-helix lattice (twin strands with steady crossbars)

  ND-safe rationale:
    - No animation or flashing; every function runs once per invocation.
    - Calm contrast controlled by palette values so sensory load stays gentle.
    - Pure helper functions make adaptation easy without breaking lore.
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

// Entry point: orchestrates the four layers in the requested order.
export function renderHelix(ctx, opts = {}) {
  if (!ctx) return;
  const width = opts.width || 1440;
  const height = opts.height || 900;
  const palette = ensurePalette(opts.palette);
  const NUM = ensureNumerology(opts.NUM);

  fillBackground(ctx, width, height, palette.bg);
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], palette.ink, NUM);
}

function ensurePalette(palette) {
  if (!palette) return DEFAULT_PALETTE;
  const layers = Array.isArray(palette.layers) ? palette.layers.slice(0, 6) : [];
  if (layers.length < 6) return DEFAULT_PALETTE;
  return {
    bg: palette.bg || DEFAULT_PALETTE.bg,
    ink: palette.ink || DEFAULT_PALETTE.ink,
    layers
  };
}

function ensureNumerology(input) {
  return { ...DEFAULT_NUM, ...(input || {}) };
}

function fillBackground(ctx, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// Layer 1: Vesica field — repeating circles for layered depth with no motion.
export function drawVesica(ctx, width, height, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;

  const radius = Math.min(width, height) / NUM.NINE;
  const offset = radius / NUM.THREE;
  const horizontalStep = radius;
  const verticalStep = radius * (NUM.SEVEN / NUM.NINE);
  const columns = NUM.SEVEN;
  const rows = NUM.NINE;

  for (let r = -Math.floor(rows / 2); r <= Math.floor(rows / 2); r++) {
    for (let c = -Math.floor(columns / 2); c <= Math.floor(columns / 2); c++) {
      const cx = width / 2 + c * horizontalStep;
      const cy = height / 2 + r * verticalStep;
      drawCirclePair(ctx, cx, cy, radius, offset);
    }
  }

  ctx.restore();
}

function drawCirclePair(ctx, cx, cy, radius, offset) {
  ctx.beginPath();
  ctx.arc(cx - offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

// Layer 2: Tree-of-Life scaffold — static nodes and calm paths.
export function drawTree(ctx, width, height, edgeColor, nodeColor, NUM) {
  ctx.save();
  ctx.strokeStyle = edgeColor;
  ctx.lineWidth = 2;

  const baseY = height / NUM.ONEFORTYFOUR;
  const centerX = width / 2;
  const spread = width / NUM.ELEVEN;

  const nodes = [
    { x: centerX, y: baseY * 9 },
    { x: centerX + spread, y: baseY * 22 },
    { x: centerX - spread, y: baseY * 22 },
    { x: centerX + spread * 1.4, y: baseY * 44 },
    { x: centerX - spread * 1.4, y: baseY * 44 },
    { x: centerX, y: baseY * 55 },
    { x: centerX + spread, y: baseY * 77 },
    { x: centerX - spread, y: baseY * 77 },
    { x: centerX, y: baseY * 99 },
    { x: centerX, y: baseY * 126 }
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

  paths.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const radius = Math.max(3, width / NUM.NINETYNINE);
  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

// Layer 3: Fibonacci curve — Golden Ratio spiral rendered once for calm focus.
export function drawFibonacci(ctx, width, height, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  const goldenRatio = (1 + Math.sqrt(5)) / 2; // Golden Ratio keeps sacred proportion stable.
  const centerX = width / NUM.THREE * 2;
  const centerY = height / NUM.THREE;
  const scale = Math.min(width, height) / NUM.NINETYNINE;
  const maxTheta = Math.PI * NUM.SEVEN;
  const thetaStep = Math.PI / NUM.THIRTYTHREE;

  ctx.beginPath();
  for (let theta = 0; theta <= maxTheta; theta += thetaStep) {
    const radius = scale * Math.pow(goldenRatio, theta / (Math.PI / 2));
    const x = centerX + radius * Math.cos(theta);
    const y = centerY + radius * Math.sin(theta);
    if (theta === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.restore();
}

// Layer 4: Double-helix lattice — static strands with crossbars, zero motion.
export function drawHelix(ctx, width, height, strandColorA, strandColorB, rungColor, NUM) {
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
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const x = (width / steps) * i;
    const y = baseline + amplitude * Math.sin(frequency * x + phase);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawHelixRungs(ctx, width, steps, amplitude, frequency, baseline, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let i = 0; i <= steps; i++) {
    const x = (width / steps) * i;
    const yA = baseline + amplitude * Math.sin(frequency * x);
    const yB = baseline + amplitude * Math.sin(frequency * x + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, yA);
    ctx.lineTo(x, yB);
    ctx.stroke();
  }
}
