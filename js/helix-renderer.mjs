/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.
  Why: the project forbids motion and demands layered depth, so every
  drawing step is idempotent, pure, and self-contained.
*/

const DEFAULT_PALETTE = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
};

// Exported entry point. Small pure function that orchestrates the four layers.
export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  const safePalette = ensurePalette(palette);

  ctx.save();
  ctx.fillStyle = safePalette.bg;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  drawVesicaField(ctx, width, height, safePalette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, safePalette.layers[1], safePalette.layers[2], NUM);
  drawFibonacciCurve(ctx, width, height, safePalette.layers[3], NUM);
  drawHelixLattice(ctx, width, height, safePalette.layers[4], safePalette.layers[5], safePalette.ink, NUM);
}

// Validate palette input so missing data never breaks offline rendering.
function ensurePalette(palette) {
  if (!palette) return DEFAULT_PALETTE;
  if (!Array.isArray(palette.layers) || palette.layers.length < 6) {
    return DEFAULT_PALETTE;
  }
  return {
    bg: palette.bg || DEFAULT_PALETTE.bg,
    ink: palette.ink || DEFAULT_PALETTE.ink,
    layers: palette.layers.slice(0, 6)
  };
}

// Layer 1 - Vesica field. Calm grid of intersecting circles, no motion.
function drawVesicaField(ctx, width, height, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  const radius = Math.min(width, height) / NUM.NINE;
  const stepX = radius;
  const stepY = radius / NUM.SEVEN * NUM.THREE; // vertical compression keeps harmony
  const centerX = width / 2;
  const centerY = height / 2;
  for (let row = -1; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      const cx = centerX + col * stepX;
      const cy = centerY + row * stepY;
      drawVesicaPair(ctx, cx, cy, radius);
    }
  }
  ctx.restore();
}

function drawVesicaPair(ctx, cx, cy, radius) {
  ctx.beginPath();
  ctx.arc(cx - radius / 2, cy, radius, 0, Math.PI * 2);
  ctx.arc(cx + radius / 2, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

// Layer 2 - Tree-of-Life scaffold. Nodes and paths stay static, high contrast.
function drawTreeOfLife(ctx, width, height, edgeColor, nodeColor, NUM) {
  const baseY = height / NUM.ONEFORTYFOUR;
  const centerX = width / 2;
  const horizontal = width / NUM.ELEVEN; // gentle spread, avoids overstimulation
  const nodes = [
    { x: centerX, y: baseY * 9 },   // Kether
    { x: centerX + horizontal, y: baseY * 22 }, // Chokmah
    { x: centerX - horizontal, y: baseY * 22 }, // Binah
    { x: centerX + horizontal * 1.4, y: baseY * 44 }, // Chesed
    { x: centerX - horizontal * 1.4, y: baseY * 44 }, // Geburah
    { x: centerX, y: baseY * 55 },  // Tiphareth
    { x: centerX + horizontal, y: baseY * 77 }, // Netzach
    { x: centerX - horizontal, y: baseY * 77 }, // Hod
    { x: centerX, y: baseY * 99 },  // Yesod
    { x: centerX, y: baseY * 126 }  // Malkuth (99 + 27)
  ];

  // 22 paths honour the numerology requirement and classical configuration.
  const paths = [
    [0,1],[0,2],[1,2],
    [1,3],[2,4],[3,4],
    [3,5],[4,5],[1,5],[2,5],
    [3,6],[4,7],[5,6],[5,7],
    [6,7],[6,8],[7,8],
    [6,9],[7,9],[8,9],
    [2,3],[1,4]
  ];

  ctx.save();
  ctx.strokeStyle = edgeColor;
  ctx.lineWidth = 2;
  paths.forEach(([a,b]) => {
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

// Layer 3 - Fibonacci curve. Static golden spiral, sampling tuned with constant 33.
function drawFibonacciCurve(ctx, width, height, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const golden = (1 + Math.sqrt(5)) / 2;
  const center = { x: width / NUM.THREE * 2, y: height / NUM.THREE };
  const scale = Math.min(width, height) / NUM.NINETYNINE;
  const maxTheta = Math.PI * NUM.SEVEN; // seven turns keep density calm
  const thetaStep = Math.PI / NUM.THIRTYTHREE; // smooth without motion

  ctx.beginPath();
  for (let theta = 0; theta <= maxTheta; theta += thetaStep) {
    const radius = scale * Math.pow(golden, theta / (Math.PI / 2));
    const x = center.x + radius * Math.cos(theta);
    const y = center.y + radius * Math.sin(theta);
    if (theta === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}

// Layer 4 - Static double-helix lattice. Two strands plus crossbars, zero animation.
function drawHelixLattice(ctx, width, height, strandColorA, strandColorB, rungColor, NUM) {
  ctx.save();
  const steps = NUM.TWENTYTWO;
  const amplitude = height / NUM.THIRTYTHREE;
  const frequency = (Math.PI * NUM.ELEVEN) / width; // eleven resonant waves
  const baseline = height * 0.65; // sits beneath spiral to preserve depth

  ctx.lineWidth = 1.5;

  drawHelixStrand(ctx, width, steps, amplitude, frequency, baseline, 0, strandColorA);
  drawHelixStrand(ctx, width, steps, amplitude, frequency, baseline, Math.PI, strandColorB);
  drawHelixRungs(ctx, width, steps, amplitude, frequency, baseline, rungColor);

  ctx.restore();
}

function drawHelixStrand(ctx, width, steps, amplitude, frequency, baseline, phase, color) {
  ctx.strokeStyle = color;
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
