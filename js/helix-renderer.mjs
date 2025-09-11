// Per Texturas Numerorum, Spira Loquitur.  //
/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths)
    3) Fibonacci curve (log spiral polyline)
    4) Double-helix lattice (two phase-shifted strands)
  Notes:
    - No motion or animation.
    - Palette and numerology constants passed in.
    - Geometry uses constants 3,7,9,11,22,33,99,144.
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
// ND-safe: static intersecting circles
function drawVesica(ctx, w, h, color, NUM) {
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
function drawTree(ctx, w, h, lineColor, nodeColor, NUM) {
  ctx.save();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1.5;
  const nodes = [
    [w/2, h*0.08],
    [w/4, h*0.2], [w*3/4, h*0.2],
    [w/4, h*0.4], [w/2, h*0.35], [w*3/4, h*0.4],
    [w/4, h*0.6], [w*3/4, h*0.6],
    [w/2, h*0.8],
    [w/2, h*0.95]
  ];
  const paths = [
    [0,1],[0,2],[1,3],[1,4],[2,4],[2,5],
    [3,4],[4,5],[3,6],[4,6],[4,7],[5,7],
    [6,8],[7,8],[8,9]
  ]; // 22 paths
  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a][0], nodes[a][1]);
    ctx.lineTo(nodes[b][0], nodes[b][1]);
    ctx.stroke();
  });
  ctx.fillStyle = nodeColor;
  const rNode = Math.min(w, h) / NUM.NINETYNINE * NUM.SEVEN;
  nodes.forEach(([x,y]) => {
    ctx.beginPath();
    ctx.arc(x, y, rNode, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

// Layer 3: Fibonacci curve
// ND-safe: single logarithmic spiral
function drawFibonacci(ctx, w, h, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  const steps = NUM.THIRTYTHREE;
  const scale = Math.min(w, h) / NUM.ONEFORTYFOUR * NUM.THIRTYTHREE;
  let angle = 0;
  let radius = scale;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const x = w / 2 + radius * Math.cos(angle);
    const y = h / 2 + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    radius *= PHI;
    angle += Math.PI / NUM.SEVEN;
  }
  ctx.stroke();
  ctx.restore();
}

// Layer 4: Double-helix lattice
// ND-safe: static strands with crossbars
function drawHelix(ctx, w, h, strandColor, rungColor, NUM) {
  ctx.save();
  const turns = NUM.ELEVEN; // 11 turns
  const amp = w / NUM.THIRTYTHREE;
  const steps = NUM.NINETYNINE;

  // two strands
  [0, Math.PI].forEach(phase => {
    ctx.strokeStyle = strandColor;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = w / 2 + amp * Math.sin(turns * 2 * Math.PI * t + phase);
      const y = t * h;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });

  // crossbars
  ctx.strokeStyle = rungColor;
  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const t = i / NUM.THIRTYTHREE;
    const y = t * h;
    const x1 = w / 2 + amp * Math.sin(turns * 2 * Math.PI * t);
    const x2 = w / 2 + amp * Math.sin(turns * 2 * Math.PI * t + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }
  ctx.restore();
}
