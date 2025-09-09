// Per Texturas Numerorum, Spira Loquitur.  //
/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.
  Layer order: Vesica → Tree → Fibonacci → Helix.
  All geometry uses constants 3,7,9,11,22,33,99,144.
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette } = opts;
  // ND-safe: fill background first to avoid flashes
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, opts);
  drawTree(ctx, opts);
  drawFibonacci(ctx, opts);
  drawHelix(ctx, opts);
}

// Layer 1: Vesica field
// ND-safe: static intersecting circles, soft lines
export function drawVesica(ctx, { width, height, palette, NUM }) {
  ctx.save();
  ctx.strokeStyle = palette.layers[0];
  ctx.lineWidth = 1;
  const r = Math.min(width, height) / NUM.THREE;
  const step = r / NUM.NINE;
  const cy = height / 2;
  for (let i = -NUM.THREE; i <= NUM.THREE; i++) {
    const cx = width / 2 + i * step;
    ctx.beginPath();
    ctx.arc(cx - r / NUM.THREE, cy, r, 0, Math.PI * 2);
    ctx.arc(cx + r / NUM.THREE, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

// Layer 2: Tree-of-Life scaffold
// ND-safe: 10 sephirot and 22 paths; no flashing
export function drawTree(ctx, { width, height, palette, NUM }) {
  ctx.save();
  ctx.strokeStyle = palette.layers[1];
  ctx.fillStyle = palette.layers[2];
  const r = Math.min(width, height) / NUM.NINETYNINE * NUM.SEVEN;
  const nodes = [
    [0.5, 0.05],
    [0.25, 0.2], [0.75, 0.2],
    [0.25, 0.4], [0.5, 0.35], [0.75, 0.4],
    [0.25, 0.6], [0.75, 0.6],
    [0.5, 0.8],
    [0.5, 0.95]
  ];
  const paths = [
    [0,1],[0,2],[1,2],[1,3],[2,4],[3,5],[4,5],
    [3,6],[4,6],[5,6],[5,7],[6,7],
    [6,8],[7,8],[8,9],
    [1,4],[2,5],[3,4],[4,7],[2,3],[4,8],[5,8]
  ]; // 22 paths
  ctx.lineWidth = 1;
  paths.forEach(([a,b]) => {
    const [x1,y1] = nodes[a];
    const [x2,y2] = nodes[b];
    ctx.beginPath();
    ctx.moveTo(x1 * width, y1 * height);
    ctx.lineTo(x2 * width, y2 * height);
    ctx.stroke();
  });
  nodes.forEach(([x,y]) => {
    ctx.beginPath();
    ctx.arc(x * width, y * height, r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

// Layer 3: Fibonacci curve
// ND-safe: single log spiral; no motion
export function drawFibonacci(ctx, { width, height, palette, NUM }) {
  ctx.save();
  ctx.strokeStyle = palette.layers[3];
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  const steps = NUM.THIRTYTHREE;
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
// ND-safe: two static strands and cross-bars
export function drawHelix(ctx, { width, height, palette, NUM }) {
  ctx.save();
  const amp = width / NUM.THIRTYTHREE;
  const steps = NUM.NINETYNINE;
  ctx.strokeStyle = palette.layers[4];
  [0, Math.PI].forEach(phase => {
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = width / 2 + amp * Math.sin(NUM.ELEVEN * t * Math.PI + phase);
      const y = t * height;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });
  ctx.strokeStyle = palette.layers[5];
  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const t = i / NUM.THIRTYTHREE;
    const y = t * height;
    const x1 = width / 2 + amp * Math.sin(NUM.ELEVEN * t * Math.PI);
    const x2 = width / 2 + amp * Math.sin(NUM.ELEVEN * t * Math.PI + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }
  ctx.restore();
}
