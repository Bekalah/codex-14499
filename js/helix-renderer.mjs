/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted strands with crossbars)
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);
  drawVesica(ctx, { width, height, palette, NUM });
  drawTree(ctx, { width, height, palette, NUM });
  drawFibonacci(ctx, { width, height, palette, NUM });
  drawHelix(ctx, { width, height, palette, NUM });
}

// Layer 1: Vesica field
// ND-safe: subtle grid of overlapping circles, no motion
function drawVesica(ctx, { width, height, palette, NUM }) {
  ctx.save();
  ctx.strokeStyle = palette.layers[0];
  const r = Math.min(width, height) / NUM.NINE;
  const step = r;
  for (let y = r; y < height + r; y += step) {
    for (let x = r; x < width + r; x += step) {
      ctx.beginPath();
      ctx.arc(x - r / 2, y, r, 0, Math.PI * 2);
      ctx.arc(x + r / 2, y, r, 0, Math.PI * 2);
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
  ctx.restore();
}

// Layer 2: Tree-of-Life scaffold
// ND-safe: simple nodes and 22 paths, no animation
function drawTree(ctx, { width, height, palette, NUM }) {
  ctx.save();
  const lineColor = palette.layers[1];
  const nodeColor = palette.layers[2];
  ctx.strokeStyle = lineColor;
  ctx.fillStyle = nodeColor;

  const nodes = [
    [0.5, 0.08],
    [0.25, 0.2], [0.75, 0.2],
    [0.25, 0.4], [0.5, 0.35], [0.75, 0.4],
    [0.25, 0.6], [0.75, 0.6],
    [0.5, 0.8],
    [0.5, 0.95]
  ];

  const paths = [
    [0,1],[0,2],[1,2],
    [1,3],[2,4],[3,4],
    [3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],
    [6,8],[7,8],
    [8,9],
    [3,8],[4,8],[5,8],
    [5,9],[6,9],[7,9]
  ]; // 22 paths

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
    ctx.moveTo(x1 * width, y1 * height);
    ctx.lineTo(x2 * width, y2 * height);
    ctx.stroke();
  });

  const r = Math.min(width, height) / NUM.THIRTYTHREE;
  nodes.forEach(([x,y]) => {
    ctx.beginPath();
    ctx.arc(x * width, y * height, r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

// Layer 3: Fibonacci curve
// ND-safe: single logarithmic spiral; no motion, uses the Golden Ratio
function drawFibonacci(ctx, { width, height, palette, NUM }) {
  ctx.save();
  ctx.strokeStyle = palette.layers[3];
  ctx.lineWidth = 2;
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  const steps = NUM.TWENTYTWO;
  const scale = Math.min(width, height) / NUM.ONEFORTYFOUR * NUM.THIRTYTHREE;
  let angle = 0;
  let radius = scale;
  const cx = width / 2;
  const cy = height / 2;
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

// Layer 4: Double-helix lattice
// ND-safe: static phase-shifted strands with crossbars, no oscillation
function drawHelix(ctx, { width, height, palette, NUM }) {
  ctx.save();
  const strandColor = palette.layers[4];
  const rungColor = palette.layers[5];
  const amp = width / NUM.THIRTYTHREE;
  const steps = NUM.NINETYNINE;
  const cx = width / 2;
  ctx.lineWidth = 1;

  const strands = [0, Math.PI].map(phase => {
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = cx + amp * Math.sin(NUM.ELEVEN * t * Math.PI + phase);
      const y = t * height;
      pts.push([x, y]);
    }
    return pts;
  });

  ctx.strokeStyle = strandColor;
  strands.forEach(pts => {
    ctx.beginPath();
    pts.forEach(([x,y], i) => {
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });

  ctx.strokeStyle = rungColor;
  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const t = i / NUM.THIRTYTHREE;
    const y = t * height;
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
