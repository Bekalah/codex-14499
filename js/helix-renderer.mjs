// Per Texturas Numerorum, Spira Loquitur.
/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 nodes, 22 paths)
    3) Fibonacci curve (log spiral polyline)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted strands)

  Notes:
    - No motion or animation.
    - All geometry parameterized by numerology constants.
    - Golden Ratio used for Fibonacci curve.
  ND-safe notes:
    - No motion or animation
    - Soft contrast palette provided externally
    - Layer order preserves contemplative depth
    - Golden Ratio used in Fibonacci curve.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  // ND-safe: fill background first to avoid flashes
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  // Layer order preserves contemplative depth
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// Layer 1: Vesica field
// ND-safe: static intersecting circles, soft lines
export function drawVesica(ctx, w, h, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
export function drawVesica(ctx, w, h, color, NUM) {
  // ND-safe: static intersecting circles, soft lines
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  const r = Math.min(w, h) / NUM.THREE;
  const offset = r / NUM.SEVEN;
  const cy = h / 2;

  ctx.beginPath();
  ctx.arc(cx1, cy, r, 0, Math.PI * 2);
  ctx.arc(cx2, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  for (let i = -NUM.THREE; i <= NUM.THREE; i++) {
    const cx = w / 2 + i * offset * NUM.NINE;
    ctx.beginPath();
    ctx.arc(cx - r / 2, cy, r, 0, Math.PI * 2);
    ctx.arc(cx + r / 2, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// Layer 2: Tree-of-Life scaffold
// ND-safe: nodes and paths only, no flashing
export function drawTree(ctx, w, h, lineColor, nodeColor, NUM) {
  ctx.save();
  ctx.strokeStyle = lineColor;
  ctx.fillStyle = nodeColor;
  ctx.lineWidth = 1;

  // simplified relative node layout (10 sephirot)
  const nodes = [
    [0.5, 0.05],
    [0.25, 0.2], [0.75, 0.2],
    [0.25, 0.4], [0.75, 0.4],
    [0.5, 0.55],
    [0.25, 0.7], [0.75, 0.7],
    [0.5, 0.85],
    [0.5, 0.95]
  ].map(([x, y]) => [x * w, y * h]);

  // 22 connecting paths
  const paths = [
    [0,1],[0,2],[1,3],[1,5],[2,4],[2,5],
    [3,4],[3,5],[4,5],[3,6],[4,7],[5,6],
    [5,7],[6,8],[7,8],[8,9],[1,2],[3,7],
    [4,6],[1,4],[2,3],[6,7]
  ];

  paths.forEach(([a,b]) => {
export function drawTree(ctx, w, h, lineColor, nodeColor, NUM) {
  // ND-safe: nodes and paths only, no flashing
  ctx.save();
  ctx.strokeStyle = lineColor;
  ctx.fillStyle = nodeColor;
  ctx.lineWidth = 1.5;

  const nodes = [
    [w / 2, h * 0.08],
    [w / 4, h * 0.2], [w * 3 / 4, h * 0.2],
    [w / 4, h * 0.4], [w / 2, h * 0.35], [w * 3 / 4, h * 0.4],
    [w / 4, h * 0.6], [w * 3 / 4, h * 0.6],
    [w / 2, h * 0.8],
    [w / 2, h * 0.95]
  ];

  const paths = [
    [0,1],[0,2],
    [1,2],
    [0,1],[0,2],[1,2],
    [1,3],[1,4],[2,4],[2,5],
    [3,4],[4,5],
    [3,6],[4,6],[4,7],[5,7],
    [6,7],
    [6,8],[7,8],
    [8,9],
    [3,5],[5,6],[5,8],
    [2,3],[1,5]
    [3,5],[2,3],[2,6],[5,6],[4,8]
  ]; // 22 paths

  paths.forEach(([a, b]) => {
    const [x1, y1] = nodes[a];
    const [x2, y2] = nodes[b];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  const r = Math.min(w, h) / NUM.NINETYNINE;
  nodes.forEach(([x,y]) => {
  const rNode = Math.min(w, h) / NUM.NINETYNINE * NUM.SEVEN;
  nodes.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

// Layer 3: Fibonacci curve
// ND-safe: single log spiral, uses the Golden Ratio
export function drawFibonacci(ctx, w, h, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio
export function drawFibonacci(ctx, w, h, color, NUM) {
  // ND-safe: single log spiral using the Golden Ratio
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  const PHI = (1 + Math.sqrt(5)) / 2;
  const steps = NUM.THIRTYTHREE; // 33 points
  const scale = Math.min(w, h) / NUM.ONEFORTYFOUR * NUM.THIRTYTHREE;
  let angle = 0;
  let radius = scale;
  let x = w / 2 + radius * Math.cos(angle);
  let y = h / 2 + radius * Math.sin(angle);
  let x = w / 2;
  let y = h / 2;

  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let i = 0; i < steps; i++) {
    x = w / 2 + radius * Math.cos(angle);
    y = h / 2 + radius * Math.sin(angle);
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  const steps = NUM.THIRTYTHREE; // 33 points
  const scale = Math.min(w, h) / NUM.ONEFORTYFOUR;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  let angle = 0;
  let radius = scale;
  const cx = w / 2;
  const cy = h / 2;
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
export function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  ctx.save();
  const turns = NUM.ELEVEN; // 11 gentle turns
  const amp = h / 4;
  const step = w / NUM.ONEFORTYFOUR;
export function drawHelix(ctx, w, h, color1, color2, NUM) {
  const turns = NUM.ELEVEN;
  const amp = w / NUM.NINE;
  const steps = NUM.ONEFORTYFOUR;
  ctx.lineWidth = 1.5;

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = colorA;
  ctx.beginPath();
  for (let x = 0; x <= w; x += step) {
    const y = h / 2 + amp * Math.sin((turns * 2 * Math.PI * x) / w);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
export function drawHelix(ctx, w, h, color1, color2, NUM) {
  // ND-safe: static lattice, no oscillation
  ctx.save();
  const turns = NUM.ELEVEN;
  const amplitude = w / NUM.THIRTYTHREE;
  const steps = NUM.NINETYNINE;

  ctx.strokeStyle = color1;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = w / 2 + amplitude * Math.sin(turns * 2 * Math.PI * t);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = w / 2 + amp * Math.sin(turns * 2 * Math.PI * t);
    const y = t * h;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = colorB;
  ctx.beginPath();
  for (let x = 0; x <= w; x += step) {
    const y = h / 2 + amp * Math.sin((turns * 2 * Math.PI * x) / w + Math.PI);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = w / 2 + amplitude * Math.sin(turns * 2 * Math.PI * t + Math.PI);
    const y = t * h;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const t = i / NUM.THIRTYTHREE;
    const y = t * h;
    const x1 = w / 2 + amplitude * Math.sin(turns * 2 * Math.PI * t);
    const x2 = w / 2 + amplitude * Math.sin(turns * 2 * Math.PI * t + Math.PI);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = w / 2 + amp * Math.sin(turns * 2 * Math.PI * t + Math.PI);
    const y = t * h;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const t = i / NUM.THIRTYTHREE;
    const y = t * h;
    const x1 = w / 2 + amp * Math.sin(turns * 2 * Math.PI * t);
    const x2 = w / 2 + amp * Math.sin(turns * 2 * Math.PI * t + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }

  ctx.restore();
}

