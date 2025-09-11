// Per Texturas Numerorum, Spira Loquitur.  //
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
function drawVesica(ctx, width, height, color, NUM) {
  const r = Math.min(width, height) / NUM.THREE;
  const step = r / NUM.NINE;
  const cy = height / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  for (let i = -NUM.THREE; i <= NUM.THREE; i++) {
    const cx = width / 2 + i * step * NUM.SEVEN;
    ctx.beginPath();
    ctx.arc(cx - r / NUM.THREE, cy, r, 0, Math.PI * 2);
    ctx.arc(cx + r / NUM.THREE, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// Layer 2: Tree-of-Life scaffold
// ND-safe: nodes and paths only, no flashing
function drawTree(ctx, width, height, pathColor, nodeColor, NUM) {
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
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  paths.forEach(([a,b]) => {
    const [x1,y1] = nodes[a];
    const [x2,y2] = nodes[b];
    ctx.moveTo(x1 * width, y1 * height);
    ctx.lineTo(x2 * width, y2 * height);
  });
  ctx.stroke();

  ctx.fillStyle = nodeColor;
  nodes.forEach(([nx,ny]) => {
    ctx.beginPath();
    ctx.arc(nx * width, ny * height, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve
// ND-safe: static logarithmic spiral, no motion
function drawFibonacci(ctx, width, height, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const turns = NUM.THREE;
  const steps = NUM.THIRTYTHREE;
  const cx = width / NUM.THREE;
  const cy = height - height / NUM.THREE;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * Math.PI * 2;
    const r = (Math.min(width, height) / NUM.ONEFORTYFOUR) * Math.pow(phi, t / (Math.PI * 2));
    const x = cx + r * Math.cos(t);
    const y = cy - r * Math.sin(t);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// Layer 4: Double-helix lattice
// ND-safe: two static sine strands with gentle lattice rungs
function drawHelix(ctx, width, height, colorA, colorB, NUM) {
  const steps = NUM.NINETYNINE;
  const amp = height / NUM.ELEVEN;
  ctx.lineWidth = 2;

  // Strand A
  ctx.strokeStyle = colorA;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const y = height / 2 + Math.sin((i / steps) * NUM.THREE * Math.PI * 2) * amp;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Strand B (phase-shifted)
  ctx.strokeStyle = colorB;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const y = height / 2 + Math.sin((i / steps) * NUM.THREE * Math.PI * 2 + Math.PI) * amp;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Lattice rungs
  ctx.strokeStyle = colorA;
  for (let i = 0; i <= steps; i += NUM.SEVEN) {
    const x = (i / steps) * width;
    const y1 = height / 2 + Math.sin((i / steps) * NUM.THREE * Math.PI * 2) * amp;
    const y2 = height / 2 + Math.sin((i / steps) * NUM.THREE * Math.PI * 2 + Math.PI) * amp;
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}
