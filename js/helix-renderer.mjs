/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths)
    3) Fibonacci curve (log spiral polyline)
    4) Static double-helix lattice (two phase-shifted strands with rungs)

  Why: no motion, calm contrast, small pure functions.
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  // Fill background first to avoid flashes.
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, opts);
  drawTree(ctx, opts);
  drawFibonacci(ctx, opts);
  drawHelix(ctx, opts);
}

// Layer 1: Vesica field grid
function drawVesica(ctx, { width, height, palette, NUM }) {
  ctx.strokeStyle = palette.layers[0];
  ctx.lineWidth = 2;
  const r = Math.min(width, height) / NUM.THREE;
  const cx = width / 2;
  const cy = height / 2;
  const offsetX = r / 2;
  const offsetY = r / NUM.SEVEN;
  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x += 2) {
      ctx.beginPath();
      ctx.arc(cx + x * offsetX, cy + y * offsetY, r, 0, Math.PI * 2);
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted strands with crossbars)
*/

function drawVesica(ctx, w, h, color, NUM) {
  // ND-safe: simple repeated Vesica Piscis shapes, no motion
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  const r = Math.min(w, h) / NUM.THREE;
  const offsets = [-1, 0, 1];
  offsets.forEach(ix => {
    offsets.forEach(iy => {
      const cx = w / 2 + ix * r;
      const cy = h / 2 + iy * r;
      ctx.beginPath();
      ctx.arc(cx - r / 2, cy, r, 0, Math.PI * 2);
      ctx.arc(cx + r / 2, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });
  });

  ND-safe: no motion, calm contrast, small pure functions.
*/

function drawVesica(ctx, w, h, color, NUM) {
  // ND-safe: simple vesica grid, low contrast lines
  ctx.save();
  ctx.strokeStyle = color;
  const r = Math.min(w, h) / NUM.NINE;
  const step = r;
  const startX = w / 2 - step;
  const startY = h / 2 - step;
  for (let i = 0; i < NUM.THREE; i++) {
    for (let j = 0; j < NUM.THREE; j++) {
      const cx = startX + i * step;
      const cy = startY + j * step;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + step, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// Layer 2: Tree-of-Life scaffold (nodes and paths)
function drawTree(ctx, { width, height, palette, NUM }) {
  ctx.strokeStyle = palette.layers[1];
  ctx.fillStyle = palette.layers[1];
  const hGap = width / NUM.ELEVEN;
  const vGap = (height / NUM.ONEFORTYFOUR) * NUM.THIRTYTHREE;
  const nodes = [
    { x: width / 2, y: vGap * 1 },
    { x: width / 2 - hGap, y: vGap * 3 },
    { x: width / 2 + hGap, y: vGap * 3 },
    { x: width / 2 - hGap, y: vGap * 5 },
    { x: width / 2 + hGap, y: vGap * 5 },
    { x: width / 2, y: vGap * 7 },
    { x: width / 2 - hGap, y: vGap * 9 },
    { x: width / 2 + hGap, y: vGap * 9 },
    { x: width / 2 - hGap, y: vGap * 11 },
    { x: width / 2 + hGap, y: vGap * 11 }
  ];
  const paths = [
    [0, 1], [0, 2], [1, 3], [2, 4], [3, 5],
    [4, 5], [5, 6], [5, 7], [6, 8], [7, 9]
  ];
  ctx.lineWidth = 1;
  for (const [a, b] of paths) {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  }
  const r = (hGap / NUM.TWENTYTWO) * NUM.SEVEN;
  for (const n of nodes) {
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Layer 3: Fibonacci curve as polyline
function drawFibonacci(ctx, { width, height, palette, NUM }) {
  ctx.strokeStyle = palette.layers[2];
  ctx.lineWidth = 2;
  const centerX = width / NUM.THREE;
  const centerY = height / NUM.THREE;
  // Golden Ratio guides the spiral growth.
  const phi = (1 + Math.sqrt(5)) / 2;
  let r = (width / NUM.NINETYNINE) * NUM.NINE;
  ctx.beginPath();
  for (let i = 0; i < NUM.NINETYNINE; i++) {
    const angle = (i / NUM.ELEVEN) * Math.PI * 2;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    r *= phi / (phi - 1);
    if (r > width * 2) break;
  }
  ctx.stroke();
}

// Layer 4: Static double-helix lattice
function drawHelix(ctx, { width, height, palette, NUM }) {
  const steps = NUM.NINETYNINE;
  const amp = width / NUM.NINE;
  const freq = NUM.THREE;
  const center = width / 2;
  ctx.lineWidth = 1;

  // Left strand
  ctx.strokeStyle = palette.layers[3];
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = t * height;
    const x = center - amp * Math.sin(freq * 2 * Math.PI * t);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Right strand
  ctx.strokeStyle = palette.layers[4];
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = t * height;
    const x = center + amp * Math.sin(freq * 2 * Math.PI * t);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Rungs
  ctx.strokeStyle = palette.layers[5];
  for (let i = 0; i <= NUM.TWENTYTWO; i++) {
    const t = i / NUM.TWENTYTWO;
    const y = t * height;
    const x1 = center - amp * Math.sin(freq * 2 * Math.PI * t);
    const x2 = center + amp * Math.sin(freq * 2 * Math.PI * t);
function drawTree(ctx, w, h, lineColor, nodeColor, NUM) {
  // ND-safe: nodes and straight paths only
  ctx.save();
  const nodes = [
    [w / 2, h * 0.08],
  // ND-safe: static nodes and paths only
  ctx.save();
  ctx.strokeStyle = lineColor;
  ctx.fillStyle = nodeColor;
  const nodes = [
    [w / 2, h * 0.05],
    [w / 4, h * 0.2], [w * 3 / 4, h * 0.2],
    [w / 4, h * 0.4], [w / 2, h * 0.35], [w * 3 / 4, h * 0.4],
    [w / 4, h * 0.6], [w * 3 / 4, h * 0.6],
    [w / 2, h * 0.8],
    [w / 2, h * 0.95]
  ];
  const paths = [
    [0,1],[0,2],[1,2],
    [1,3],[1,4],[2,4],[2,5],
    [3,4],[4,5],
    [3,6],[4,6],[4,7],[5,7],
    [6,7],
    [6,8],[7,8],
    [8,9],
    [3,5],[1,5],[2,3],[0,4],[6,9]
  ]; // 22 paths

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;
  paths.forEach(([a,b]) => {
    const [x1,y1] = nodes[a];
    const [x2,y2] = nodes[b];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const r = w / NUM.NINETYNINE;
    [1,3],[2,5],[3,4],[4,5],
    [3,6],[4,6],[5,6],
    [5,7],[6,7],
    [6,8],[7,8],[8,9],
    [1,4],[2,4],[4,7],
    [5,8],[2,3],[4,8],[3,5]
  ]; // 22 paths
  ctx.lineWidth = 1;
  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a][0], nodes[a][1]);
    ctx.lineTo(nodes[b][0], nodes[b][1]);
    ctx.stroke();
  });
  const r = Math.min(w, h) / NUM.ONEFORTYFOUR * NUM.THREE;
  nodes.forEach(([x,y]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawFibonacci(ctx, w, h, palette, NUM) {
  // ND-safe: static logarithmic spiral
function drawFibonacci(ctx, w, h, color, NUM) {
  // ND-safe: static logarithmic spiral, Golden Ratio governs growth
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  const steps = NUM.TWENTYTWO;
  const scale = Math.min(w, h) / NUM.ONEFORTYFOUR * NUM.THIRTYTHREE;
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

function drawHelix(ctx, w, h, strandColor, rungColor, NUM) {
  // ND-safe: two static strands with crossbars
  ctx.save();
  ctx.lineWidth = 1;
  const amp = w / NUM.THIRTYTHREE;
  const steps = NUM.NINETYNINE;
  const cx = w / 2;

  // ND-safe: static double-helix lattice, no oscillation
  ctx.save();
  const amp = w / NUM.THIRTYTHREE;
  const steps = NUM.NINETYNINE;
  const cx = w / 2;
  ctx.lineWidth = 1.5;
  [0, Math.PI].forEach(phase => {
    ctx.strokeStyle = strandColor;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = cx + amp * Math.sin(NUM.ELEVEN * t * Math.PI + phase);
      const y = t * h;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });

  ctx.strokeStyle = rungColor;
  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const t = i / NUM.THIRTYTHREE;
    const y = t * h;
    const x1 = cx + amp * Math.sin(NUM.ELEVEN * t * Math.PI);
    const x2 = cx + amp * Math.sin(NUM.ELEVEN * t * Math.PI + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
    ctx.stroke();
  });
  ctx.strokeStyle = rungColor;
  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const t = i / NUM.THIRTYTHREE;
    const y = t * h;
    const x1 = cx + amp * Math.sin(NUM.ELEVEN * t * Math.PI);
    const x2 = cx + amp * Math.sin(NUM.ELEVEN * t * Math.PI + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }
  ctx.restore();
}

export function renderHelix(ctx, { width, height, palette, NUM }) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette, NUM);
  // ND-safe: layers rendered in fixed order, no motion
  ctx.clearRect(0, 0, width, height);
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

export { drawVesica, drawTree, drawFibonacci, drawHelix };
