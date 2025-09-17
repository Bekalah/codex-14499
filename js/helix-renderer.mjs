/*
  helix-renderer.mjs
  Static offline renderer for layered sacred geometry in Codex 144:99.

  Layer order (rendered back-to-front):
    1. Vesica field (grounding grid)
    2. Tree-of-Life scaffold (ten nodes, twenty-two connective paths)
    3. Fibonacci curve (logarithmic spiral sampled calmly)
    4. Double-helix lattice (paired strands with steady rungs)

  ND-safe rationale:
    - No animation or timed updates; everything paints once per call.
    - Calm palette and line weights prevent harsh contrast or flicker.
    - Small pure helpers keep intent transparent, protecting the lore.
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

// Exported entry point. One pure orchestration pass maintains layer order.
export function renderHelix(ctx, opts = {}) {
  if (!ctx) return;
  const width = opts.width || 1440;
  const height = opts.height || 900;
  const palette = ensurePalette(opts.palette);
  const NUM = ensureNumbers(opts.NUM);

  fillBackground(ctx, width, height, palette.bg);
  drawVesicaField(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacciCurve(ctx, width, height, palette.layers[3], NUM);
  drawHelixLattice(
    ctx,
    width,
    height,
    palette.layers[4],
    palette.layers[5] || palette.ink,
    palette.ink,
    NUM
  );
}

function fillBackground(ctx, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// Validate palette input so missing data never disrupts offline rendering.
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

// Ensure numerology constants are available even if callers omit some keys.
function ensureNumbers(NUM) {
  const safe = { ...DEFAULT_NUM };
  if (NUM) {
    for (const key of Object.keys(DEFAULT_NUM)) {
      if (Number.isFinite(NUM[key])) safe[key] = NUM[key];
    }
  }
  return safe;
}

// Layer 1: Vesica field. Static intersecting circles provide gentle grounding.
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

// Layer 2: Tree-of-Life scaffold with ten sephirot and twenty-two connective paths.
function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, NUM) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 2;

  const columnSpacing = width / NUM.THIRTYTHREE;
  const rowSpacing = (height / NUM.NINETYNINE) * NUM.NINE;
  const centerX = width / 2;
  const topY = height / NUM.ELEVEN;

  const nodes = [
    { x: centerX, y: topY },
    { x: centerX + columnSpacing * 4, y: topY + rowSpacing * 1 },
    { x: centerX - columnSpacing * 4, y: topY + rowSpacing * 1 },
    { x: centerX + columnSpacing * 6, y: topY + rowSpacing * 3 },
    { x: centerX - columnSpacing * 6, y: topY + rowSpacing * 3 },
    { x: centerX, y: topY + rowSpacing * 4.5 },
    { x: centerX + columnSpacing * 3, y: topY + rowSpacing * 6.5 },
    { x: centerX - columnSpacing * 3, y: topY + rowSpacing * 6.5 },
    { x: centerX, y: topY + rowSpacing * 8 },
    { x: centerX, y: topY + rowSpacing * 9.5 }
  ];

  const edges = [
    [0, 1], [0, 2], [1, 2],
    [1, 3], [1, 5], [2, 4], [2, 5],
    [3, 4], [3, 5], [4, 5],
    [3, 6], [4, 7], [5, 6], [5, 7],
    [6, 7], [6, 8], [7, 8],
    [6, 9], [7, 9], [8, 9],
    [2, 3], [1, 4]
  ];

  edges.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const nodeRadius = Math.max(4, columnSpacing / NUM.THREE);
  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

// Layer 3: Fibonacci curve. Static spiral honours the Golden Ratio without motion.
function drawFibonacciCurve(ctx, width, height, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  const goldenRatio = (1 + Math.sqrt(5)) / 2; // Golden Ratio constant keeps the growth soothing.
  const center = {
    x: (width / NUM.THREE) * 2,
    y: height / NUM.THREE
  };
  const turns = NUM.THREE;
  const scale = (Math.min(width, height) / NUM.NINETYNINE) * NUM.SEVEN;
  const step = Math.PI / NUM.TWENTYTWO;

  ctx.beginPath();
  for (let theta = 0; theta <= Math.PI * 2 * turns; theta += step) {
    const radius = scale * Math.pow(goldenRatio, theta / (Math.PI / 2));
    const x = center.x + radius * Math.cos(theta);
    const y = center.y + radius * Math.sin(theta);
    if (theta === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.restore();
}

// Layer 4: Double-helix lattice with calm strands and steady crossbars.
function drawHelixLattice(ctx, width, height, strandColorA, strandColorB, rungColor, NUM) {
  ctx.save();

  const steps = NUM.TWENTYTWO;
  const amplitude = height / NUM.THIRTYTHREE;
  const frequency = (Math.PI * NUM.ELEVEN) / width;
  const baseline = height * 0.65;

  drawHelixStrand(ctx, width, steps, amplitude, frequency, baseline, 0, strandColorA);
  drawHelixStrand(ctx, width, steps, amplitude, frequency, baseline, Math.PI, strandColorB);
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
    const y1 = baseline + amplitude * Math.sin(frequency * x);
    const y2 = baseline + amplitude * Math.sin(frequency * x + Math.PI);
    // Static crossbars maintain the double-helix lattice without introducing motion.
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}
