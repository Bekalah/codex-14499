/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted strands with crossbars)
*/

function drawVesica(ctx, w, h, color, NUM) {
  // ND-safe: simple repeated Vesica Piscis shapes, no motion
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  const r = Math.min(w, h) / NUM.THREE;
  const offsets = [-1, 0, 1];
  offsets.forEach(ix => {
    offsets.forEach(iy => {
      const cx = w / 2 + ix * r;
      const cy = h / 2 + iy * r;
      ctx.beginPath();
      ctx.arc(cx - r / 2, cy, r, 0, Math.PI * 2);
      ctx.arc(cx + r / 2, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });
  });
  ctx.restore();
}

function drawTree(ctx, w, h, lineColor, nodeColor, NUM) {
  // ND-safe: nodes and straight paths only
  ctx.save();
  const nodes = [
    [w / 2, h * 0.08],
    [w / 4, h * 0.2], [w * 3 / 4, h * 0.2],
    [w / 4, h * 0.4], [w / 2, h * 0.35], [w * 3 / 4, h * 0.4],
    [w / 4, h * 0.6], [w * 3 / 4, h * 0.6],
    [w / 2, h * 0.8],
    [w / 2, h * 0.95]
  ];
  const paths = [
    [0,1],[0,2],[1,2],
    [1,3],[1,4],[2,4],[2,5],
    [3,4],[4,5],
    [3,6],[4,6],[4,7],[5,7],
    [6,7],
    [6,8],[7,8],
    [8,9],
    [3,5],[1,5],[2,3],[0,4],[6,9]
  ]; // 22 paths

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;
  paths.forEach(([a,b]) => {
    const [x1,y1] = nodes[a];
    const [x2,y2] = nodes[b];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const r = w / NUM.NINETYNINE;
  nodes.forEach(([x,y]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawFibonacci(ctx, w, h, palette, NUM) {
  // ND-safe: static logarithmic spiral
  ctx.save();
  ctx.strokeStyle = palette.layers[3];
  ctx.lineWidth = 2;
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  const steps = NUM.TWENTYTWO;
  const scale = Math.min(w, h) / NUM.ONEFORTYFOUR * NUM.THIRTYTHREE;
  let angle = 0;
  let radius = scale;
  const cx = w / 2;
  const cy = h / 2;
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

function drawHelix(ctx, w, h, strandColor, rungColor, NUM) {
  // ND-safe: two static strands with crossbars
  ctx.save();
  ctx.lineWidth = 1;
  const amp = w / NUM.THIRTYTHREE;
  const steps = NUM.NINETYNINE;
  const cx = w / 2;

  [0, Math.PI].forEach(phase => {
    ctx.strokeStyle = strandColor;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = cx + amp * Math.sin(NUM.ELEVEN * t * Math.PI + phase);
      const y = t * h;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });

  ctx.strokeStyle = rungColor;
  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const t = i / NUM.THIRTYTHREE;
    const y = t * h;
    const x1 = cx + amp * Math.sin(NUM.ELEVEN * t * Math.PI);
    const x2 = cx + amp * Math.sin(NUM.ELEVEN * t * Math.PI + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }
  ctx.restore();
}

export function renderHelix(ctx, { width, height, palette, NUM }) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette, NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

export { drawVesica, drawTree, drawFibonacci, drawHelix };
