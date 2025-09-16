/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layer order (furthest to nearest):
    1. Vesica field
    2. Tree-of-Life scaffold
    3. Fibonacci curve
    4. Double-helix lattice

  ND-safe rationale:
    - No animation; geometry renders once with calm contrast.
    - Pure helper functions keep the symbolic layers easy to audit.
    - Palette fallback avoids harsh failure states when data is absent.
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

// Exported entry point. Small pure function that orchestrates the four layers.
export function renderHelix(ctx, options) {
  if (!ctx || !options) return;
  const settings = normalizeOptions(options);
  const { width, height, palette, NUM } = settings;

  fillBackground(ctx, width, height, palette.bg);
  drawVesicaField(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacciCurve(ctx, width, height, palette.layers[3], NUM);
  drawHelixLattice(ctx, width, height, palette.layers[4], palette.layers[5], palette.ink, NUM);
}

function normalizeOptions(options) {
  const width = typeof options.width === "number" ? options.width : 1440;
  const height = typeof options.height === "number" ? options.height : 900;
  const palette = ensurePalette(options.palette);
  const NUM = { ...DEFAULT_NUM, ...(options.NUM || {}) };
  return { width, height, palette, NUM };
}

// Validate palette input so missing data never breaks offline rendering.
function ensurePalette(palette) {
  if (!palette) return { ...DEFAULT_PALETTE };
  const layers = Array.isArray(palette.layers) ? palette.layers.slice(0, 6) : [];
  while (layers.length < 6) {
    layers.push(DEFAULT_PALETTE.layers[layers.length]);
  }
  return {
    bg: palette.bg || DEFAULT_PALETTE.bg,
    ink: palette.ink || DEFAULT_PALETTE.ink,
    layers
  };
}

function fillBackground(ctx, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// Layer 1: Vesica field. Gentle grid keeps depth without motion.
function drawVesicaField(ctx, width, height, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;

  const radius = Math.min(width, height) / NUM.NINE;
  const horizontalStep = radius;
  const verticalStep = radius * 0.85;
  const offset = radius / NUM.THREE;
  const columns = NUM.SEVEN;
  const rows = NUM.NINE;

  for (let row = -Math.floor(rows / 2); row <= Math.floor(rows / 2); row++) {
    for (let col = -Math.floor(columns / 2); col <= Math.floor(columns / 2); col++) {
      const cx = width / 2 + col * horizontalStep;
      const cy = height / 2 + row * verticalStep;

      ctx.beginPath();
      ctx.arc(cx - offset, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx + offset, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

// Layer 2: Tree-of-Life scaffold. Symmetric layout, no flashing.
function drawTreeOfLife(ctx, width, height, edgeColor, nodeColor, NUM) {
  const nodes = createTreeNodes(width, height, NUM);
  const paths = createTreePaths();

  ctx.save();
  ctx.strokeStyle = edgeColor;
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

function createTreeNodes(width, height, NUM) {
  const baseY = height / NUM.ONEFORTYFOUR;
  const centerX = width / 2;
  const horizontal = width / NUM.ELEVEN;
  return [
    { x: centerX, y: baseY * 9 },
    { x: centerX + horizontal, y: baseY * 22 },
    { x: centerX - horizontal, y: baseY * 22 },
    { x: centerX + horizontal * 1.4, y: baseY * 44 },
    { x: centerX - horizontal * 1.4, y: baseY * 44 },
    { x: centerX, y: baseY * 55 },
    { x: centerX + horizontal, y: baseY * 77 },
    { x: centerX - horizontal, y: baseY * 77 },
    { x: centerX, y: baseY * 99 },
    { x: centerX, y: baseY * 126 }
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

// Layer 3: Fibonacci curve. Static golden spiral with gentle sampling.
function drawFibonacciCurve(ctx, width, height, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  // Golden Ratio constant keeps the spiral grounded in sacred proportion.
  const golden = (1 + Math.sqrt(5)) / 2;
  const center = { x: (width / NUM.THREE) * 2, y: height / NUM.THREE };
  const scale = Math.min(width, height) / NUM.NINETYNINE;
  const maxTheta = Math.PI * NUM.SEVEN;
  const thetaStep = Math.PI / NUM.THIRTYTHREE;

  ctx.beginPath();
  for (let theta = 0; theta <= maxTheta; theta += thetaStep) {
    const radius = scale * Math.pow(golden, theta / (Math.PI / 2));
    const x = center.x + radius * Math.cos(theta);
    const y = center.y + radius * Math.sin(theta);
    if (theta === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  ctx.restore();
}

// Layer 4: Double-helix lattice. Static strands avoid motion triggers.
function drawHelixLattice(ctx, width, height, strandColorA, strandColorB, rungColor, NUM) {
  ctx.save();
  const steps = NUM.TWENTYTWO;
  const amplitude = height / NUM.THIRTYTHREE;
  const frequency = (Math.PI * NUM.ELEVEN) / width;
  const baseline = height * 0.65;

  drawHelixStrand(ctx, width, steps, amplitude, frequency, baseline, 0, strandColorA);
  drawHelixStrand(ctx, width, steps, amplitude, frequency, baseline, Math.PI, strandColorB || strandColorA);
  drawHelixRungs(ctx, width, steps, amplitude, frequency, baseline, rungColor || strandColorA);

  ctx.restore();
}

function drawHelixStrand(ctx, width, steps, amplitude, frequency, baseline, phase, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const x = (width / steps) * i;
    const y = baseline + amplitude * Math.sin(frequency * x + phase);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

function drawHelixRungs(ctx, width, steps, amplitude, frequency, baseline, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let i = 0; i <= steps; i++) {
    const x = (width / steps) * i;
    const y1 = baseline + amplitude * Math.sin(frequency * x);
    const y2 = baseline + amplitude * Math.sin(frequency * x + Math.PI);
    // Static crossbars anchor the strands; light tone keeps depth without glare.
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}
