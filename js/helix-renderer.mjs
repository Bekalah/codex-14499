/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted curves with lattice connectors)
*/

export function renderHelix(ctx, cfg) {
  const { width, height, palette, NUM } = cfg;
  // Background fill ensures high-contrast stage
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// --- Layer 1: Vesica field -------------------------------------------------
function drawVesica(ctx, w, h, color, NUM) {
  /* ND-safe: static grid of overlapping circles (vesica piscis);
     no animation or flashing. */
  const r = Math.min(w, h) / NUM.THREE;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let y = r; y < h + r; y += r) {
    for (let x = r; x < w + r; x += r) {
      ctx.beginPath();
      ctx.arc(x - r / 2, y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + r / 2, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// --- Layer 2: Tree-of-Life scaffold ----------------------------------------
function drawTree(ctx, w, h, pathColor, nodeColor, NUM) {
  /* Static sephirot + paths, contrast-aware colors.
     Coordinates scaled by canvas size; numbers reflect canonical layout. */
  const nodes = [
    { x: 0.5, y: 0.1 }, // 1 Kether
    { x: 0.75, y: 0.2 }, // 2 Chokmah
    { x: 0.25, y: 0.2 }, // 3 Binah
    { x: 0.75, y: 0.4 }, // 4 Chesed
    { x: 0.25, y: 0.4 }, // 5 Geburah
    { x: 0.5, y: 0.5 }, // 6 Tiphereth
    { x: 0.75, y: 0.6 }, // 7 Netzach
    { x: 0.25, y: 0.6 }, // 8 Hod
    { x: 0.5, y: 0.75 }, // 9 Yesod
    { x: 0.5, y: 0.9 } // 10 Malkuth
  ];
  const paths = [
    [1,2],[1,3],[1,6],[2,3],[2,4],[2,5],[3,5],[3,4],[4,5],
    [4,6],[5,6],[4,7],[4,8],[5,7],[5,8],[6,7],[6,8],[6,9],
    [7,9],[8,9],[7,10],[8,10]
  ]; // 22 connections
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 2;
  paths.forEach(p => {
    const a = nodes[p[0]-1], b = nodes[p[1]-1];
    ctx.beginPath();
    ctx.moveTo(a.x * w, a.y * h);
    ctx.lineTo(b.x * w, b.y * h);
    ctx.stroke();
  });
  ctx.fillStyle = nodeColor;
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x * w, n.y * h, NUM.NINE, 0, Math.PI * 2);
    ctx.fill();
  });
}

// --- Layer 3: Fibonacci curve ----------------------------------------------
function drawFibonacci(ctx, w, h, color, NUM) {
  /* Log spiral inspired by Fibonacci sequence; static polyline. */
  const cx = w / 2, cy = h / 2;
  const phi = (1 + Math.sqrt(5)) / 2;
  const a = Math.min(w, h) / NUM.ONEFORTYFOUR;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= NUM.NINETYNINE; i++) {
    const t = i / NUM.THREE; // smooth curve, ~33 rotations
    const r = a * Math.pow(phi, t);
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// --- Layer 4: Double-helix lattice -----------------------------------------
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  /* Two phase-shifted sine curves with vertical connectors.
     Static lattice evokes DNA without motion. */
  const amp = h / NUM.THREE;
  ctx.lineWidth = 1;
  ctx.strokeStyle = colorA;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 1) {
    const y = h/2 + amp * Math.sin((2 * Math.PI * x) / NUM.NINETYNINE);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.strokeStyle = colorB;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 1) {
    const y = h/2 + amp * Math.sin((2 * Math.PI * x) / NUM.NINETYNINE + Math.PI);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  // Lattice connectors every 33px
  ctx.strokeStyle = colorA;
  for (let x = 0; x <= w; x += NUM.THIRTYTHREE) {
    const y1 = h/2 + amp * Math.sin((2 * Math.PI * x) / NUM.NINETYNINE);
    const y2 = h/2 + amp * Math.sin((2 * Math.PI * x) / NUM.NINETYNINE + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}

