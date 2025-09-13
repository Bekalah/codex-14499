// Per Texturas Numerorum, Spira Loquitur.  //
/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted strands)

  Notes:
    - No motion or animation.
    - All geometry parameterized by numerology constants.
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
  const r = Math.min(w, h) / NUM.THREE;
  const cx1 = w / 2 - r / 2;
  const cx2 = w / 2 + r / 2;
  const cy = h / 2;
  ctx.beginPath();
  ctx.arc(cx1, cy, r, 0, Math.PI * 2);
  ctx.arc(cx2, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// Layer 2: Tree-of-Life scaffold
// ND-safe: nodes and paths only, no flashing
export function drawTree(ctx, w, h, lineColor, nodeColor, NUM) {
  const nodes = [
    [w / 2, h * 0.05],
    [w / 4, h * 0.2], [w * 3 / 4, h * 0.2],
    [w / 4, h * 0.4], [w / 2, h * 0.55], [w * 3 / 4, h * 0.4],
    [w / 4, h * 0.7], [w * 3 / 4, h * 0.7],
    [w / 2, h * 0.85],
    [w / 2, h * 0.95]
  ];
  const paths = [
    [0,1],[0,2],[1,2],[1,3],[2,4],[3,4],[3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],[6,8],[7,8],
    [6,9],[7,9],[8,9],[1,6],[1,7],[2,6],[2,7]
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
  const r = Math.min(w, h) / NUM.NINETYNINE * NUM.SEVEN;
  nodes.forEach(([x,y]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve
// ND-safe: single log spiral; uses the Golden Ratio
export function drawFibonacci(ctx, w, h, color, NUM) {
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  const steps = NUM.TWENTYTWO;
  const scale = Math.min(w, h) / NUM.ONEFORTYFOUR;
  const cx = w / 2;
  const cy = h / 2;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  let angle = 0;
  let radius = scale;
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
}
