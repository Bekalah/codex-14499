/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.
  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 nodes + 22 paths)
    3) Fibonacci curve (log spiral polyline)
    4) Double-helix lattice (two phase-shifted strands)
  All routines are pure, static, and offline.
*/

const TAU = Math.PI * 2;

export function renderHelix(ctx, opts) {
  if (!ctx) return;
  const { width, height, palette, NUM } = opts;
  // Calm background to reduce visual load.
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, { width, height, color: palette.layers[0], NUM });
  drawTree(ctx, { width, height, colors: [palette.layers[1], palette.layers[2]], NUM });
  drawFibonacci(ctx, { width, height, color: palette.layers[3], NUM });
  drawHelix(ctx, { width, height, colors: [palette.layers[4], palette.layers[5]], NUM });
}

// --- Layer 1: Vesica field ---------------------------------------------------
function drawVesica(ctx, { width, height, color, NUM }) {
  /* ND-safe: static grid of overlapping circles; no motion or fill flashes. */
  const r = Math.min(width, height) / NUM.THREE;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let y = r; y < height + r; y += r) {
    for (let x = r; x < width + r; x += r) {
      ctx.beginPath();
      ctx.arc(x - r / 2, y, r, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + r / 2, y, r, 0, TAU);
      ctx.stroke();
    }
  }
}

// --- Layer 2: Tree-of-Life scaffold ------------------------------------------
function drawTree(ctx, { width, height, colors, NUM }) {
  /* ND-safe: simple nodes and paths with readable contrast. */
  const nodes = [
    [0.5, 0.1],   // 1 Kether
    [0.75, 0.2],  [0.25, 0.2],  // 2 Chokmah, 3 Binah
    [0.75, 0.4],  [0.25, 0.4],  // 4 Chesed, 5 Geburah
    [0.5, 0.5],   // 6 Tiphereth
    [0.75, 0.6],  [0.25, 0.6],  // 7 Netzach, 8 Hod
    [0.5, 0.75],  // 9 Yesod
    [0.5, 0.9]    //10 Malkuth
  ];
  const paths = [
    [0,1],[0,2],[0,5],
    [1,2],[1,3],[1,4],
    [2,4],[2,5],[3,4],
    [3,5],[4,5],[3,6],[3,7],
    [4,6],[4,7],[5,6],[5,7],[5,8],
    [6,8],[7,8],[6,9],[7,9]
  ]; // 22 connections
  // draw paths first
  ctx.strokeStyle = colors[0];
  ctx.lineWidth = 1;
  for (const [a,b] of paths) {
    const ax = nodes[a][0] * width, ay = nodes[a][1] * height;
    const bx = nodes[b][0] * width, by = nodes[b][1] * height;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }
  // draw nodes
  ctx.fillStyle = colors[1];
  const rad = Math.min(width, height) / NUM.NINETYNINE * NUM.THREE;
  for (const [x,y] of nodes) {
    ctx.beginPath();
    ctx.arc(x * width, y * height, rad, 0, TAU);
    ctx.fill();
  }
}

// --- Layer 3: Fibonacci curve -------------------------------------------------
function drawFibonacci(ctx, { width, height, color, NUM }) {
  /* ND-safe: static logarithmic spiral built from 99 points. */
  const cx = width / 2;
  const cy = height / 2;
  const phi = (1 + Math.sqrt(5)) / 2;
  const a = Math.min(width, height) / NUM.ONEFORTYFOUR;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= NUM.NINETYNINE; i++) {
    const t = i / NUM.THIRTYTHREE; // uses 33 for gentle growth
    const r = a * Math.pow(phi, t);
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// --- Layer 4: Double-helix lattice -------------------------------------------
function drawHelix(ctx, { width, height, colors, NUM }) {
  /* ND-safe: static double helix; evokes DNA without motion. */
  const steps = NUM.NINETYNINE;
  const amp = height / NUM.SEVEN;
  const mid = height / 2;
  const freq = NUM.TWENTYTWO;
  // strands
  for (let s = 0; s < 2; s++) {
    ctx.strokeStyle = colors[s];
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      const y = mid + amp * Math.sin((i / steps) * freq + s * Math.PI);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // vertical connectors every 11 steps
  ctx.strokeStyle = colors[0];
  ctx.lineWidth = 1;
  for (let i = 0; i <= steps; i += NUM.ELEVEN) {
    const x = (i / steps) * width;
    const y1 = mid + amp * Math.sin((i / steps) * freq);
    const y2 = mid + amp * Math.sin((i / steps) * freq + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}
