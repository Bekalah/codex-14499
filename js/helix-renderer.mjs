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
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }
}

