/*
  Per Texturas Numerorum, Spira Loquitur
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine waves)
  Notes:
    - No motion or animation.
    - All geometry parameterized by numerology constants.
    - Golden Ratio used in Fibonacci curve.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  // Layer order preserves contemplative depth
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// ND-safe: pure functions, minimal state
export function drawVesica(ctx, w, h, color, NUM) {
  const r = Math.min(w, h) / NUM.THREE;
  const cx1 = w / 2 - r / 2;
  const cx2 = w / 2 + r / 2;
  const cy = h / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx1, cy, r, 0, Math.PI * 2);
  ctx.arc(cx2, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

export function drawTree(ctx, w, h, lineColor, nodeColor, NUM) {
  // Simplified Tree-of-Life using 3 columns and 4 rows
  const nodes = [
    [w / 2, h * 0.08],
    [w / 4, h * 0.2], [w * 3 / 4, h * 0.2],
    [w / 4, h * 0.4], [w / 2, h * 0.35], [w * 3 / 4, h * 0.4],
    [w / 4, h * 0.6], [w * 3 / 4, h * 0.6],
    [w / 2, h * 0.8],
    [w / 2, h * 0.95],
  ];
  const paths = [
    [0,1],[0,2],[1,3],[1,4],[2,4],[2,5],
    [3,4],[4,5],[3,6],[4,6],[4,7],[5,7],
    [6,8],[7,8],[8,9],
    [3,5],[1,2],[6,7],[1,3],[2,5],[3,5],[4,8],[5,7]
  ]; // 22 paths
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1.5;
  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a][0], nodes[a][1]);
    ctx.lineTo(nodes[b][0], nodes[b][1]);
    ctx.stroke();
  });
  ctx.fillStyle = nodeColor;
  const rNode = Math.min(w, h) / NUM.NINETYNINE * NUM.SEVEN;
  nodes.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, rNode, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function drawFibonacci(ctx, w, h, color, NUM) {
  // Golden Ratio spiral as polyline
  const phi = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  const steps = NUM.NINETYNINE / NUM.THREE; // 33 points
  const scale = Math.min(w, h) / NUM.ONEFORTYFOUR * NUM.THIRTYTHREE;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  let angle = 0;
  let radius = scale;
  let x = w / 2 + radius * Math.cos(angle);
  let y = h / 2 + radius * Math.sin(angle);
  ctx.moveTo(x, y);
  for (let i = 1; i <= steps; i++) {
    angle += Math.PI / NUM.SEVEN;
    radius *= phi;
    x = w / 2 + radius * Math.cos(angle);
    y = h / 2 + radius * Math.sin(angle);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

export function drawHelix(ctx, w, h, color1, color2, NUM) {
  const turns = NUM.NINETYNINE / NUM.NINE; // 11 turns
  const amplitude = h / 4;
  const step = w / NUM.ONEFORTYFOUR;
  ctx.lineWidth = 1.5;

  ctx.strokeStyle = color1;
  ctx.beginPath();
  for (let x = 0; x <= w; x += step) {
    const y = h / 2 + amplitude * Math.sin((turns * 2 * Math.PI * x) / w);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = color2;
  ctx.beginPath();
  for (let x = 0; x <= w; x += step) {
    const y = h / 2 + amplitude * Math.sin((turns * 2 * Math.PI * x) / w + Math.PI);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
    4) Double-helix lattice (two phase-shifted strands)
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, opts);
  drawTree(ctx, opts);
  drawFibonacci(ctx, opts);
  drawHelix(ctx, opts);
}

// Layer 1: Vesica field
// ND-safe: static intersecting circles, soft lines
function drawVesica(ctx, { width, height, palette, NUM }) {
  ctx.save();
  ctx.strokeStyle = palette.layers[0];
  const radius = Math.min(width, height) / NUM.THREE;
  const offset = radius / NUM.NINE;
  const centerY = height / 2;

  for (let i = -NUM.THREE; i <= NUM.THREE; i++) {
    const cx = width / 2 + i * offset * NUM.SEVEN;
    ctx.beginPath();
    ctx.arc(cx - radius / NUM.THREE, centerY, radius, 0, Math.PI * 2);
    ctx.arc(cx + radius / NUM.THREE, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

// Layer 2: Tree-of-Life scaffold
// ND-safe: nodes and paths only, no flashing
function drawTree(ctx, { width, height, palette, NUM }) {
  ctx.save();
  ctx.strokeStyle = palette.layers[1];
  ctx.fillStyle = palette.layers[2];
  const r = width / NUM.NINETYNINE;
  const nodes = [
    [0.5, 0.05],
    [0.25, 0.2], [0.75, 0.2],
    [0.25, 0.4], [0.75, 0.4],
    [0.5, 0.55],
    [0.25, 0.7], [0.75, 0.7],
    [0.5, 0.85],
    [0.5, 0.95]
  ];
  const paths = [
    [0,1],[0,2],[1,2],[1,3],[2,4],[3,5],[4,5],[3,6],[4,6],[5,6],[5,7],[6,7],[6,8],[7,8],[8,9]
  ];
  ctx.beginPath();
  paths.forEach(([a,b]) => {
    const [x1,y1] = nodes[a];
    const [x2,y2] = nodes[b];
    ctx.moveTo(x1 * width, y1 * height);
    ctx.lineTo(x2 * width, y2 * height);
  });
  ctx.stroke();
  nodes.forEach(([nx,ny]) => {
    ctx.beginPath();
    ctx.arc(nx * width, ny * height, r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

// Layer 3: Fibonacci curve
// ND-safe: single log spiral, uses the Golden Ratio
function drawFibonacci(ctx, { width, height, palette, NUM }) {
  ctx.save();
  ctx.strokeStyle = palette.layers[3];
  ctx.beginPath();
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  const steps = NUM.TWENTYTWO;
  const scale = Math.min(width, height) / NUM.ONEFORTYFOUR;
  let angle = 0;
  let radius = scale;
  const cx = width / 2;
  const cy = height / 2;
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
// ND-safe: static lattice without oscillation
function drawHelix(ctx, { width, height, palette, NUM }) {
  ctx.save();
  ctx.strokeStyle = palette.layers[4];
  const amplitude = width / NUM.THIRTYTHREE;
  const steps = NUM.NINETYNINE;
  const strands = [0, Math.PI];
  strands.forEach(phase => {
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = width / 2 + amplitude * Math.sin(NUM.ELEVEN * t * Math.PI + phase);
      const y = t * height;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });
  ctx.strokeStyle = palette.layers[5];
  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const t = i / NUM.THIRTYTHREE;
    const y = t * height;
    const x1 = width / 2 + amplitude * Math.sin(NUM.ELEVEN * t * Math.PI);
    const x2 = width / 2 + amplitude * Math.sin(NUM.ELEVEN * t * Math.PI + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }
  ctx.restore();
}
