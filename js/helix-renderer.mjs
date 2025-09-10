/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths)
    3) Fibonacci curve (log spiral polyline)
    4) Double-helix lattice (two phase-shifted strands)

  Why: visualizes cosmology with calm static geometry; no motion.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  // ND-safe: fill background immediately to avoid flash
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
  ctx.restore();
}

// Layer 2: Tree-of-Life scaffold
// ND-safe: nodes and paths only, no flashing
export function drawTree(ctx, w, h, lineColor, nodeColor, NUM) {
  ctx.save();
  ctx.strokeStyle = lineColor;
  ctx.fillStyle = nodeColor;

  const nodes = [
    [w/2, h*0.08],
    [w/4, h*0.2], [w*3/4, h*0.2],
    [w/4, h*0.4], [w/2, h*0.35], [w*3/4, h*0.4],
    [w/4, h*0.6], [w*3/4, h*0.6],
    [w/2, h*0.8],
    [w/2, h*0.95],
  ];

  const paths = [
    [0,1],[0,2],[1,3],[1,4],[2,4],[2,5],
    [3,4],[4,5],[3,6],[4,6],[4,7],[5,7],
    [6,8],[7,8],[8,9],
    [3,5],[1,2],[6,7],[1,3],[2,5],[4,8],[5,7]
  ]; // 22 paths

  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a][0], nodes[a][1]);
    ctx.lineTo(nodes[b][0], nodes[b][1]);
    ctx.stroke();
  });

  const rNode = Math.min(w, h) / NUM.NINETYNINE * NUM.SEVEN;
  nodes.forEach(([x,y]) => {
    ctx.beginPath();
    ctx.arc(x, y, rNode, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

// Layer 3: Fibonacci curve
// ND-safe: single log spiral using Golden Ratio
export function drawFibonacci(ctx, w, h, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  const PHI = (1 + Math.sqrt(5)) / 2;
  const steps = NUM.NINETYNINE / NUM.THREE; // 33 points
  const scale = Math.min(w, h) / NUM.ONEFORTYFOUR * NUM.THIRTYTHREE;
  let angle = 0;
  let radius = scale;
  let x = w / 2 + radius * Math.cos(angle);
  let y = h / 2 + radius * Math.sin(angle);
  ctx.beginPath();
  ctx.moveTo(x, y);

  for (let i = 1; i <= steps; i++) {
    angle += Math.PI / NUM.SEVEN;
    radius *= PHI;
    x = w / 2 + radius * Math.cos(angle);
    y = h / 2 + radius * Math.sin(angle);
    ctx.lineTo(x, y);
  }

  ctx.stroke();
  ctx.restore();
}

// Layer 4: Double-helix lattice
// ND-safe: static sine-wave strands with crossbars
export function drawHelix(ctx, w, h, color1, color2, NUM) {
  ctx.save();
  const turns = NUM.NINETYNINE / NUM.NINE; // 11 turns
  const amp = h / 4;
  const step = w / NUM.ONEFORTYFOUR;

  ctx.lineWidth = 1.5;

  // Strand A
  ctx.strokeStyle = color1;
  ctx.beginPath();
  for (let x = 0; x <= w; x += step) {
    const y = h / 2 + amp * Math.sin((turns * 2 * Math.PI * x) / w);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Strand B
  ctx.strokeStyle = color2;
  ctx.beginPath();
  for (let x = 0; x <= w; x += step) {
    const y = h / 2 + amp * Math.sin((turns * 2 * Math.PI * x) / w + Math.PI);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Crossbars for lattice
  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const x = (w / NUM.THIRTYTHREE) * i;
    const y1 = h / 2 + amp * Math.sin((turns * 2 * Math.PI * x) / w);
    const y2 = h / 2 + amp * Math.sin((turns * 2 * Math.PI * x) / w + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }

  ctx.restore();
}
