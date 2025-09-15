/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.
  Each layer draws once; no motion or external dependencies.
*/

// Draw intersecting circles forming a vesica grid
export function drawVesica(ctx, width, height, color, NUM) {
  const r = Math.min(width, height) / NUM.THREE;
  const step = r;
  const cx = width / 2;
  const cy = height / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let ix = -1; ix <= 1; ix++) {
    for (let iy = -1; iy <= 1; iy++) {
      ctx.beginPath();
      ctx.arc(cx + ix * step, cy + iy * step, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// Draw simplified Tree-of-Life nodes and paths
export function drawTree(ctx, width, height, color, NUM) {
  const cx = width / 2;
  const nodes = [
    { x: cx, y: height * 0.08 },
    { x: cx + width * 0.15, y: height * 0.20 },
    { x: cx - width * 0.15, y: height * 0.20 },
    { x: cx + width * 0.25, y: height * 0.35 },
    { x: cx - width * 0.25, y: height * 0.35 },
    { x: cx, y: height * 0.50 },
    { x: cx + width * 0.20, y: height * 0.65 },
    { x: cx - width * 0.20, y: height * 0.65 },
    { x: cx, y: height * 0.75 },
    { x: cx, y: height * 0.90 }
  ];
  const edges = [
    [0,1],[0,2],[1,2],[1,3],[1,5],[2,4],[2,5],
    [3,4],[3,5],[4,5],[3,6],[4,7],[5,6],[5,7],
    [6,7],[6,8],[7,8],[6,9],[7,9],[8,9],[2,3],[1,4]
  ];
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  edges.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });
  ctx.fillStyle = color;
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, NUM.THREE, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Draw logarithmic spiral approximating the Fibonacci curve
export function drawFibonacci(ctx, width, height, color, NUM) {
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  const center = { x: width * 0.75, y: height * 0.55 };
  const points = [];
  const turns = NUM.THREE;
  const scale = Math.min(width, height) / NUM.NINETYNINE;
  for (let t = 0; t < Math.PI * 2 * turns; t += 0.02) {
    const r = scale * Math.pow(PHI, t / (Math.PI / 2));
    points.push({ x: center.x + r * Math.cos(t), y: center.y + r * Math.sin(t) });
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (const p of points) ctx.lineTo(p.x, p.y);
  ctx.stroke();
}

// Draw static double-helix lattice
export function drawHelix(ctx, width, height, colorA, colorB, rung, NUM) {
  const steps = NUM.TWENTYTWO;
  const amp = height / NUM.THIRTYTHREE;
  const freq = (Math.PI * 2) / width * NUM.ELEVEN;
  ctx.lineWidth = 1.5;
  // first strand
  ctx.strokeStyle = colorA;
  ctx.beginPath();
  for (let x = 0; x <= width; x += width / (steps - 1)) {
    const y = height / 2 + amp * Math.sin(freq * x);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  // second strand
  ctx.strokeStyle = colorB;
  ctx.beginPath();
  for (let x = 0; x <= width; x += width / (steps - 1)) {
    const y = height / 2 + amp * Math.sin(freq * x + Math.PI);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  // rungs linking strands
  ctx.strokeStyle = rung;
  for (let x = 0; x <= width; x += width / (steps - 1)) {
    const y1 = height / 2 + amp * Math.sin(freq * x);
    const y2 = height / 2 + amp * Math.sin(freq * x + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}

// Main entry: paint background then all four layers
export function renderHelix(ctx, { width, height, palette, NUM }) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], NUM);
  drawFibonacci(ctx, width, height, palette.layers[2], NUM);
  drawHelix(ctx, width, height, palette.layers[3], palette.layers[4], palette.layers[5], NUM);
}
