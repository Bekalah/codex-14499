// Per Texturas Numerorum, Spira Loquitur.  //
/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths)
    3) Fibonacci curve (log spiral)
    4) Double-helix lattice (two phase-shifted strands)

  No motion. Palette supplied externally for ND-safe contrast.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  // ND-safe: paint background first to avoid flashes
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  // Layer order preserves contemplative depth
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// Layer 1: Vesica field — static intersecting circles
function drawVesica(ctx, w, h, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const r = Math.min(w, h) / NUM.THREE;
  const cx = w / 2;
  const cy = h / 2;
  ctx.beginPath();
  ctx.arc(cx - r / 2, cy, r, 0, Math.PI * 2);
  ctx.arc(cx + r / 2, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// Layer 2: Tree-of-Life scaffold — 10 nodes, 22 paths
function drawTree(ctx, w, h, lineColor, nodeColor, NUM) {
  ctx.save();
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
    [0,1],[0,2],[1,3],[1,4],[2,4],[2,5],
    [3,4],[4,5],[3,6],[4,6],[4,7],[5,7],
    [6,8],[7,8],[8,9],
    [1,2],[3,5],[6,7],[1,3],[2,5],[4,8],[5,7]
  ]; // 22 paths
  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a][0]*w, nodes[a][1]*h);
    ctx.lineTo(nodes[b][0]*w, nodes[b][1]*h);
    ctx.stroke();
  });
  const r = Math.min(w, h) / NUM.NINETYNINE * NUM.SEVEN;
  nodes.forEach(([x,y]) => {
    ctx.beginPath();
    ctx.arc(x*w, y*h, r, 0, Math.PI*2);
    ctx.fill();
  });
  ctx.restore();
}

// Layer 3: Fibonacci curve — static log spiral
function drawFibonacci(ctx, w, h, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  const steps = NUM.THIRTYTHREE; // 33 points
  let angle = 0;
  let radius = Math.min(w, h) / NUM.ONEFORTYFOUR;
  const cx = w / 2;
  const cy = h / 2;
  ctx.beginPath();
  for (let i = 0; i < steps; i++) {
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    radius *= PHI;
    angle += Math.PI / NUM.SEVEN;
  }
  ctx.stroke();
  ctx.restore();
}

// Layer 4: Double-helix lattice — two phase-shifted strands
function drawHelix(ctx, w, h, color1, color2, NUM) {
  ctx.save();
  const turns = NUM.ELEVEN;
  const amp = w / NUM.THIRTYTHREE;
  const steps = NUM.NINETYNINE;
  ctx.lineWidth = 1.5;
  [0, Math.PI].forEach((phase, idx) => {
    ctx.strokeStyle = idx === 0 ? color1 : color2;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = w/2 + amp * Math.sin(turns * t * Math.PI * 2 + phase);
      const y = t * h;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });
  ctx.strokeStyle = color2;
  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const t = i / NUM.THIRTYTHREE;
    const y = t * h;
    const x1 = w/2 + amp * Math.sin(turns * t * Math.PI * 2);
    const x2 = w/2 + amp * Math.sin(turns * t * Math.PI * 2 + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }
  ctx.restore();
}

export { drawVesica, drawTree, drawFibonacci, drawHelix };
