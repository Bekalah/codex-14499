// Per Texturas Numerorum, Spira Loquitur.  //
/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified)
    3) Fibonacci curve (log spiral polyline)
    4) Double-helix lattice (two phase-shifted strands)
  No motion; calm palette and layer order support readability.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
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
  const r = Math.min(w, h) / NUM.THREE;
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

// Layer 2: Tree-of-Life scaffold
// ND-safe: nodes and paths only, no flashing
export function drawTree(ctx, w, h, lineColor, nodeColor, NUM) {
  const nodes = [
    [w/2, h*0.05],
    [w/4, h*0.2], [w*3/4, h*0.2],
    [w/4, h*0.4], [w/2, h*0.35], [w*3/4, h*0.4],
    [w/4, h*0.6], [w*3/4, h*0.6],
    [w/2, h*0.8],
    [w/2, h*0.95]
  ];
  const paths = [
    [0,1],[0,2],[1,3],[1,4],[2,4],[2,5],
    [3,4],[4,5],[3,6],[4,6],[4,7],[5,7],
    [6,8],[7,8],[8,9],
    [3,5],[1,2],[6,7],[1,3],[2,5],[3,5],[4,8],[5,7]
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
  const rNode = Math.min(w, h) / NUM.NINETYNINE * NUM.SEVEN;
  nodes.forEach(([x,y]) => {
    ctx.beginPath();
    ctx.arc(x, y, rNode, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve
// ND-safe: single log spiral; static
export function drawFibonacci(ctx, w, h, color, NUM) {
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  const steps = NUM.THIRTYTHREE; // 33 points
  const scale = Math.min(w, h) / NUM.ONEFORTYFOUR * NUM.THREE;
  let angle = 0;
  let radius = scale;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  let x = w/2 + radius * Math.cos(angle);
  let y = h/2 + radius * Math.sin(angle);
  ctx.moveTo(x, y);
  for (let i = 1; i <= steps; i++) {
    angle += Math.PI / NUM.SEVEN;
    radius *= PHI;
    x = w/2 + radius * Math.cos(angle);
    y = h/2 + radius * Math.sin(angle);
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// Layer 4: Double-helix lattice
// ND-safe: static lattice, no oscillation
export function drawHelix(ctx, w, h, color1, color2, NUM) {
  const turns = NUM.ELEVEN; // 11 turns
  const amplitude = h / NUM.NINE;
  const step = w / NUM.NINETYNINE;
  ctx.lineWidth = 1.5;

  ctx.strokeStyle = color1;
  ctx.beginPath();
  for (let x = 0; x <= w; x += step) {
    const y = h/2 + amplitude * Math.sin((turns * 2 * Math.PI * x) / w);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = color2;
  ctx.beginPath();
  for (let x = 0; x <= w; x += step) {
    const y = h/2 + amplitude * Math.sin((turns * 2 * Math.PI * x) / w + Math.PI);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}
