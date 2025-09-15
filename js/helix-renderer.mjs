/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths)
    3) Fibonacci curve (log spiral polyline)
    4) Double-helix lattice (two phase-shifted strands)

  All functions are small and pure. Colors are pulled from the palette.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  // Fill background first
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// Layer 1: Vesica field
// ND-safe: simple intersecting circles for calm geometry
function drawVesica(ctx, w, h, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const r = Math.min(w, h) / NUM.THREE;
  const cx1 = w / 2 - r / 2;
  const cx2 = w / 2 + r / 2;
  const cy = h / 2;
  ctx.beginPath();
  ctx.arc(cx1, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx2, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// Layer 2: Tree-of-Life scaffold
// ND-safe: static nodes and paths only, no motion
function drawTree(ctx, w, h, lineColor, nodeColor, NUM) {
  ctx.save();
  ctx.strokeStyle = lineColor;
  ctx.fillStyle = nodeColor;
  const nodes = [
    [w / 2, h * 0.08],
    [w / 4, h * 0.2], [w * 3 / 4, h * 0.2],
    [w / 4, h * 0.4], [w / 2, h * 0.35], [w * 3 / 4, h * 0.4],
    [w / 4, h * 0.6], [w * 3 / 4, h * 0.6],
    [w / 2, h * 0.8],
    [w / 2, h * 0.92]
  ];
  const paths = [
    [0,1],[0,2],
    [1,2],
    [1,3],[1,4],
    [2,4],[2,5],
    [3,4],[4,5],
    [3,6],[4,6],[4,7],[5,7],
    [6,7],
    [3,8],[4,8],[5,8],
    [6,8],[7,8],
    [6,9],[7,9],
    [8,9]
  ]; // 22 paths
  paths.forEach(([a,b]) => {
    const [ax, ay] = nodes[a];
    const [bx, by] = nodes[b];
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  });
  const r = w / NUM.NINETYNINE;
  nodes.forEach(([x,y]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

// Layer 3: Fibonacci curve
// ND-safe: static logarithmic spiral using numerology
function drawFibonacci(ctx, w, h, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  const steps = NUM.TWENTYTWO;
  const scale = Math.min(w, h) / NUM.ONEFORTYFOUR;
  let angle = 0;
  let radius = scale;
  const cx = w / 2;
  const cy = h / 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  for (let i = 0; i < steps; i++) {
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    ctx.lineTo(x, y);
    radius *= PHI;
    angle += Math.PI / NUM.SEVEN;
  }
  ctx.stroke();
  ctx.restore();
}

// Layer 4: Double-helix lattice
// ND-safe: two static strands with cross-links, no animation
function drawHelix(ctx, w, h, strandColor, rungColor, NUM) {
  ctx.save();
  const amp = w / NUM.THIRTYTHREE;
  const steps = NUM.NINETYNINE;
  const turns = NUM.ELEVEN;
  ctx.lineWidth = 1.5;

  ctx.strokeStyle = strandColor;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = w / 2 + amp * Math.sin(t * turns * 2 * Math.PI);
    const y = t * h;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = w / 2 + amp * Math.sin(t * turns * 2 * Math.PI + Math.PI);
    const y = t * h;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = rungColor;
  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const t = i / NUM.THIRTYTHREE;
    const y = t * h;
    const x1 = w / 2 + amp * Math.sin(t * turns * 2 * Math.PI);
    const x2 = w / 2 + amp * Math.sin(t * turns * 2 * Math.PI + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }
  ctx.restore();
}

export { drawVesica, drawTree, drawFibonacci, drawHelix };
