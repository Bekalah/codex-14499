/*
  helix-renderer.mjs
  Static offline renderer for the Cosmic Helix scene.

  Layer order (back to front):
    1. Vesica field (intersecting circles)
    2. Tree-of-Life scaffold (ten nodes, twenty-two paths)
    3. Fibonacci curve (golden spiral)
    4. Double-helix lattice (two strands plus crossbars)

  ND-safe commitments:
    - No animation or timers; every layer renders once per call.
    - Calm contrast drawn from a six-color palette with background and ink.
    - Small pure helpers make each symbolic layer auditable and lore-safe.
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

export function renderHelix(ctx, config = {}) {
  if (!ctx) return;

  const width = sanitizeDimension(config.width, 1440);
  const height = sanitizeDimension(config.height, 900);
  const palette = sanitizePalette(config.palette);
  const NUM = sanitizeNumerology(config.NUM);

  fillBackground(ctx, width, height, palette.bg);
  drawVesicaField(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacciCurve(ctx, width, height, palette.layers[3], NUM);
  drawHelixLattice(ctx, width, height, palette.layers[4], palette.layers[5], palette.ink, NUM);
}

function sanitizeDimension(value, fallback) {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function sanitizePalette(input) {
  if (!input) return { ...DEFAULT_PALETTE };
  const layers = Array.isArray(input.layers) ? input.layers.slice(0, 6) : [];
  while (layers.length < 6) layers.push(DEFAULT_PALETTE.layers[layers.length]);
  return {
    bg: typeof input.bg === "string" ? input.bg : DEFAULT_PALETTE.bg,
    ink: typeof input.ink === "string" ? input.ink : DEFAULT_PALETTE.ink,
    layers
  };
}

function sanitizeNumerology(input) {
  const safe = { ...DEFAULT_NUM };
  if (!input) return safe;
  for (const key of Object.keys(DEFAULT_NUM)) {
    if (Number.isFinite(input[key]) && input[key] !== 0) {
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

  for (let row = -Math.floor(rows / 2); row <= Math.floor(rows / 2); row++) {
    for (let col = -Math.floor(columns / 2); col <= Math.floor(columns / 2); col++) {
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

function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, NUM) {
  const nodes = createTreeNodes(width, height, NUM);
  const paths = createTreePaths();

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
  const radius = Math.max(3, width / NUM.NINETYNINE);
  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function createTreeNodes(width, height, NUM) {
  const baseY = height / NUM.ONEFORTYFOUR;
  const centerX = width / 2;
  const spread = width / NUM.ELEVEN;
  return [
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

function drawFibonacciCurve(ctx, width, height, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  const goldenRatio = (1 + Math.sqrt(5)) / 2; // Golden Ratio keeps sacred growth steady.
  const centerX = (width / NUM.THREE) * 2;
  const centerY = height / NUM.THREE;
  const scale = (Math.min(width, height) / NUM.NINETYNINE) * NUM.SEVEN;
  const maxTheta = Math.PI * NUM.SEVEN;
  const thetaStep = Math.PI / NUM.TWENTYTWO;

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

function drawHelixLattice(ctx, width, height, strandColorA, strandColorB, rungColor, NUM) {
  ctx.save();

  const steps = NUM.TWENTYTWO;
  const amplitude = height / NUM.THIRTYTHREE;
  const baseline = height * 0.65;
  const frequency = (Math.PI * NUM.ELEVEN) / width;
  const stepWidth = width / steps;

  const strandA = [];
  const strandB = [];
  for (let i = 0; i <= steps; i++) {
    const x = stepWidth * i;
    const yA = baseline + amplitude * Math.sin(frequency * x);
    const yB = baseline + amplitude * Math.sin(frequency * x + Math.PI);
    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  tracePolyline(ctx, strandA, strandColorA, 2);
  tracePolyline(ctx, strandB, strandColorB || strandColorA, 2);
  drawHelixRungs(ctx, strandA, strandB, rungColor, NUM);

  ctx.restore();
}

function tracePolyline(ctx, points, color, lineWidth) {
  if (!points.length) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawHelixRungs(ctx, strandA, strandB, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  const rungInterval = Math.max(1, Math.floor(strandA.length / NUM.ELEVEN));
  for (let i = 0; i < strandA.length && i < strandB.length; i += rungInterval) {
    ctx.beginPath();
    ctx.moveTo(strandA[i].x, strandA[i].y);
    ctx.lineTo(strandB[i].x, strandB[i].y);
    ctx.stroke();
  }
  ctx.restore();
}
