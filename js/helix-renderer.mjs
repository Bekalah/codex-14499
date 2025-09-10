// Per Texturas Numerorum, Spira Loquitur.
/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted strands)
  Notes:
    - No motion or animation.
    - All geometry parameterized by numerology constants.
    - Golden Ratio used in Fibonacci curve.
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  // ND-safe: fill background first to avoid flashes
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  // Layer order preserves contemplative depth
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
  const cy = height / 2;
  for (let i = -NUM.THREE; i <= NUM.THREE; i++) {
    const cx = width / 2 + i * offset * NUM.SEVEN;
    ctx.beginPath();
    ctx.arc(cx - radius / NUM.THREE, cy, radius, 0, Math.PI * 2);
    ctx.arc(cx + radius / NUM.THREE, cy, radius, 0, Math.PI * 2);
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
  const rNode = Math.min(width, height) / NUM.NINETYNINE * NUM.SEVEN;
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
    [0,1],[0,2],[1,2],[1,3],[2,4],[3,5],[4,5],
    [3,6],[4,6],[5,6],[5,7],[6,7],[6,8],[7,8],[8,9]
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
    ctx.arc(nx * width, ny * height, rNode, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

// Layer 3: Fibonacci curve
// ND-safe: single log spiral, uses the Golden Ratio
function drawFibonacci(ctx, { width, height, palette, NUM }) {
  ctx.save();
  ctx.strokeStyle = palette.layers[3];
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  const steps = NUM.TWENTYTWO;
  const scale = Math.min(width, height) / NUM.ONEFORTYFOUR;
  let angle = 0;
  let radius = scale;
  const cx = width / 2;
  const cy = height / 2;
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
// ND-safe: static lattice without oscillation
function drawHelix(ctx, { width, height, palette, NUM }) {
  ctx.save();
  const amplitude = height / 4;
  const step = width / NUM.ONEFORTYFOUR;
  const turns = NUM.NINETYNINE / NUM.NINE; // 11 turns

  ctx.strokeStyle = palette.layers[4];
  ctx.beginPath();
  for (let x = 0; x <= width; x += step) {
    const y = height / 2 + amplitude * Math.sin((turns * 2 * Math.PI * x) / width);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = palette.layers[5];
  ctx.beginPath();
  for (let x = 0; x <= width; x += step) {
    const y = height / 2 + amplitude * Math.sin((turns * 2 * Math.PI * x) / width + Math.PI);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.restore();
}

export { drawVesica, drawTree, drawFibonacci, drawHelix };
