/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry in Codex 144:99.

  Layers (rendered back-to-front):
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (ten sephirot, twenty-two paths)
    3) Fibonacci curve (golden spiral polyline)
    4) Double-helix lattice (two strands plus crossbars)

  ND-safe commitments:
    - No animation or timers; everything renders once per call.
    - Calm palette with readable contrast to avoid sensory overload.
    - Small, pure helpers so future adaptations stay lore-safe.
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

// Entry point: orchestrates the four calm layers without animation.
export function renderHelix(ctx, opts = {}) {
  if (!ctx) return;

  const width = typeof opts.width === "number" ? opts.width : 1440;
  const height = typeof opts.height === "number" ? opts.height : 900;
  const palette = ensurePalette(opts.palette);
  const NUM = ensureNumerology(opts.NUM);

  fillBackground(ctx, width, height, palette.bg);
  drawVesicaField(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacciCurve(ctx, width, height, palette.layers[3], NUM);
  drawHelixLattice(ctx, width, height, palette.layers[4], palette.layers[5], palette.ink, NUM);
}

// Ensure palette input always returns calm colors.
function ensurePalette(palette) {
  if (!palette || typeof palette !== "object") return { ...DEFAULT_PALETTE };

  const safe = {
    bg: typeof palette.bg === "string" ? palette.bg : DEFAULT_PALETTE.bg,
    ink: typeof palette.ink === "string" ? palette.ink : DEFAULT_PALETTE.ink,
    layers: []
  };

  const sourceLayers = Array.isArray(palette.layers) ? palette.layers : [];
  for (let i = 0; i < DEFAULT_PALETTE.layers.length; i += 1) {
    const candidate = sourceLayers[i];
    safe.layers.push(typeof candidate === "string" ? candidate : DEFAULT_PALETTE.layers[i]);
  }

  return safe;
}

// Ensure numerology constants stay available even if callers omit some values.
function ensureNumerology(input) {
  const safe = { ...DEFAULT_NUM };
  if (!input || typeof input !== "object") return safe;

  for (const key of Object.keys(safe)) {
    const value = Number(input[key]);
    if (Number.isFinite(value) && value !== 0) {
      safe[key] = value;
    }
  }

  return safe;
}

// Layer 0: fill background to anchor the other layers.
function fillBackground(ctx, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// Layer 1: Vesica field. Static intersecting circles provide depth without motion.
function drawVesicaField(ctx, width, height, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;

  const radius = Math.min(width, height) / NUM.NINE;
  const horizontalStep = radius;
  const verticalStep = radius * (NUM.SEVEN / NUM.NINE);
  const offset = radius / NUM.THREE;
  const columns = NUM.SEVEN;
  const rows = NUM.NINE;

  for (let row = -Math.floor(rows / 2); row <= Math.floor(rows / 2); row += 1) {
    for (let col = -Math.floor(columns / 2); col <= Math.floor(columns / 2); col += 1) {
      const cx = width / 2 + col * horizontalStep;
      const cy = height / 2 + row * verticalStep;
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

// Layer 2: Tree-of-Life scaffold. Nodes and paths stay static for ND safety.
function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, NUM) {
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

  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

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

// Layer 3: Fibonacci curve. Golden spiral samples remain static and calm.
function drawFibonacciCurve(ctx, width, height, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const centerX = (width / NUM.THREE) * 2;
  const centerY = height / NUM.THREE;
  const scale = (Math.min(width, height) / NUM.NINETYNINE) * NUM.SEVEN;
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

// Layer 4: Double-helix lattice. Paired strands remain static to avoid motion triggers.
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
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  ctx.beginPath();
  for (let i = 0; i <= steps; i += 1) {
    const x = (width / steps) * i;
    const y = baseline + amplitude * Math.sin(frequency * x + phase);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawHelixRungs(ctx, width, steps, amplitude, frequency, baseline, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";

  for (let i = 0; i <= steps; i += 2) {
    const x = (width / steps) * i;
    const yA = baseline + amplitude * Math.sin(frequency * x);
    const yB = baseline + amplitude * Math.sin(frequency * x + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, yA);
    ctx.lineTo(x, yB);
    ctx.stroke();
  }
}
