/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
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
    const x1 = cx + amp * Math.sin(NUM.ELEVEN * t * Math.PI);
    const x2 = cx + amp * Math.sin(NUM.ELEVEN * t * Math.PI + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }

  ctx.restore();
}

export { drawVesica, drawTree, drawFibonacci, drawHelix };
