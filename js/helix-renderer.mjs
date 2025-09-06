/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sin curves with rungs)

  All geometry is static and drawn once; no animation, no network.
  Colors come from provided palette; if palette missing, caller falls back safely.
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// L1 Vesica field: two intersecting circles — symbol of birth and duality.
function drawVesica(ctx, w, h, color, NUM) {
  const r = w / NUM.THREE; // radius uses numerology constant 3
  const cx1 = w / 2 - r / 2;
  const cx2 = w / 2 + r / 2;
  const cy = h / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx1, cy, r, 0, Math.PI * 2);
  ctx.arc(cx2, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

// L2 Tree-of-Life: nodes and paths. Simplified, deterministic layout.
function drawTree(ctx, w, h, pathColor, nodeColor, NUM) {
  const nodeRadius = Math.min(w, h) / NUM.NINETYNINE * 3; // small ND-safe nodes
  // normalized positions for 10 sephirot
  const nodes = [
    [0.5, 0.05], [0.25, 0.15], [0.75, 0.15],
    [0.25, 0.35], [0.75, 0.35], [0.5, 0.5],
    [0.25, 0.65], [0.75, 0.65], [0.5, 0.8],
    [0.5, 0.95]
  ].map(([x, y]) => [x * w, y * h]);
  // 22 paths (indices into nodes array)
  const paths = [
    [0,1],[0,2],[1,2],[1,3],[1,5],[2,4],[2,5],
    [3,4],[3,5],[3,6],[4,5],[4,7],[5,6],[5,7],
    [5,8],[6,8],[7,8],[6,9],[7,9],[8,9],[3,7],[4,6]
  ];
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 1.5;
  for (const [a,b] of paths) {
    ctx.beginPath();
    ctx.moveTo(nodes[a][0], nodes[a][1]);
    ctx.lineTo(nodes[b][0], nodes[b][1]);
    ctx.stroke();
  }
  ctx.fillStyle = nodeColor;
  for (const [x,y] of nodes) {
    ctx.beginPath();
    ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// L3 Fibonacci curve: static polyline approximating golden spiral.
function drawFibonacci(ctx, w, h, color, NUM) {
  const cx = w * 0.75; // placed gently to right to avoid clutter
  const cy = h * 0.6;
  const phi = (1 + Math.sqrt(5)) / 2;
  const steps = NUM.TWENTYTWO; // number of polyline points
  const scale = Math.min(w, h) / NUM.THREE;
  const pts = [];
  for (let i = 0; i < steps; i++) {
    const angle = i / NUM.SEVEN * Math.PI * 2; // slow curve
    const radius = scale * Math.pow(phi, i / NUM.ELEVEN);
    pts.push([
      cx + radius * Math.cos(angle),
      cy + radius * Math.sin(angle)
    ]);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (const [x,y] of pts.slice(1)) ctx.lineTo(x,y);
  ctx.stroke();
}

// L4 Double-helix lattice: two phase-shifted sine curves with straight rungs.
function drawHelix(ctx, w, h, curveColor, rungColor, NUM) {
  const amp = h / NUM.ELEVEN;
  const steps = NUM.NINETYNINE; // smoothness
  const rungs = NUM.THIRTYTHREE; // number of connectors
  const yMid = h / 2;

  ctx.strokeStyle = curveColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const x = (w / steps) * i;
    const y = yMid + amp * Math.sin((i / steps) * NUM.THREE * Math.PI);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const x = (w / steps) * i;
    const y = yMid + amp * Math.sin((i / steps) * NUM.THREE * Math.PI + Math.PI);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = rungColor;
  ctx.lineWidth = 1;
  for (let i = 0; i <= rungs; i++) {
    const x = (w / rungs) * i;
    const y1 = yMid + amp * Math.sin((i / rungs) * NUM.THREE * Math.PI);
    const y2 = yMid + amp * Math.sin((i / rungs) * NUM.THREE * Math.PI + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}
