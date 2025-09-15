/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layer order (furthest to nearest):
    1. Vesica field (repeating vesica piscis grid)
    2. Tree-of-Life scaffold (10 nodes, 22 connecting paths)
    3. Fibonacci curve (log spiral polyline, static)
    4. Double-helix lattice (two strands with crossbars)

  ND-safe rationale:
    - No animation; everything renders once.
    - Calm contrast using palette-provided tones.
    - Small, pure helper functions so the flow is easy to audit.
*/

export function renderHelix(ctx, opts) {
  if (!ctx || !opts) return;
  const { width, height, palette, NUM } = opts;

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

// Layer 1: Vesica field
// ND-safe: repeating vesica shapes, modest stroke weight, no motion.
function drawVesicaField(ctx, width, height, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;

  const radius = Math.min(width, height) / NUM.NINE;
  const horizontalStep = radius;
  const verticalStep = radius * 0.85;
  const offset = radius / NUM.THREE;
  const columns = NUM.SEVEN; // 7 columns keeps the field centered
  const rows = NUM.NINE; // 9 rows referencing numerology constant

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

// Layer 2: Tree-of-Life scaffold
// ND-safe: balanced symmetry, soft stroke, no flashing nodes.
function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, NUM) {
  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 2;

  const columnSpacing = width / NUM.THIRTYTHREE;
  const rowSpacing = height / NUM.NINETYNINE * NUM.NINE;
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

// Layer 3: Fibonacci curve
// ND-safe: static log spiral, gentle stroke.
function drawFibonacciCurve(ctx, width, height, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const center = {
    x: width / NUM.THREE * 2,
    y: height / NUM.THREE
  };
  const turns = NUM.THREE;
  const scale = Math.min(width, height) / NUM.NINETYNINE * NUM.SEVEN;

  ctx.beginPath();
  for (let t = 0; t <= Math.PI * 2 * turns; t += Math.PI / NUM.TWENTYTWO) {
    const radius = scale * Math.pow(goldenRatio, t / (Math.PI / 2));
    const px = center.x + radius * Math.cos(t);
    const py = center.y + radius * Math.sin(t);
    if (t === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();

  ctx.restore();
}

// Layer 4: Double-helix lattice
// ND-safe: static sinusoidal strands anchored by steady rungs.
function drawHelixLattice(ctx, width, height, strandColorA, strandColorB, rungColor, NUM) {
  ctx.save();
  const steps = NUM.TWENTYTWO;
  const amplitude = height / NUM.THIRTYTHREE;
  const frequency = (Math.PI * NUM.ELEVEN) / width;
  const baseline = height * 0.65;

  ctx.lineWidth = 1.5;

  ctx.strokeStyle = strandColorA;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const x = (width / steps) * i;
    const y = baseline + amplitude * Math.sin(frequency * x);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = strandColorB;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const x = (width / steps) * i;
    const y = baseline + amplitude * Math.sin(frequency * x + Math.PI);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = rungColor;
  for (let i = 0; i <= steps; i += 1) {
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
