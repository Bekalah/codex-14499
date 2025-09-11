/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted strands)

  ND-safe:
    - No motion or animation.
    - Soft palette passed from palette.json or default.
    - Drawing order preserves contemplative depth.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  // Fill background first to avoid flashes
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
  const offset = r / NUM.THREE;
  const cy = h / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  for (let i = -NUM.THREE; i <= NUM.THREE; i++) {
    const cx = w / 2 + i * offset * NUM.SEVEN;
    ctx.beginPath();
    ctx.arc(cx - r / NUM.THREE, cy, r, 0, Math.PI * 2);
    ctx.arc(cx + r / NUM.THREE, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// Layer 2: Tree-of-Life scaffold
// ND-safe: nodes and paths only, no flashing
export function drawTree(ctx, w, h, lineColor, nodeColor, NUM) {
  const nodes = [
    [w / 2, h * 0.05],
    [w / 4, h * 0.2], [w * 3 / 4, h * 0.2],
    [w / 4, h * 0.4], [w / 2, h * 0.35], [w * 3 / 4, h * 0.4],
    [w / 4, h * 0.6], [w * 3 / 4, h * 0.6],
    [w / 2, h * 0.8],
    [w / 2, h * 0.95],
  ];
  const paths = [
    [0,1],[0,2],[1,3],[1,4],[2,4],[2,5],
    [3,4],[4,5],[3,6],[4,6],[4,7],[5,7],
    [6,8],[7,8],[8,9],
    [1,2],[3,5],[6,7],[1,3],[2,5],[4,8],[5,7]
  ]; // 22 paths

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1.5;
  paths.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a][0], nodes[a][1]);
    ctx.lineTo(nodes[b][0], nodes[b][1]);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const rNode = Math.min(w, h) / NUM.NINETYNINE * NUM.SEVEN;
  nodes.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, rNode, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve
// ND-safe: single log spiral, uses the Golden Ratio
export function drawFibonacci(ctx, w, h, color, NUM) {
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  const steps = NUM.THIRTYTHREE;
  const scale = Math.min(w, h) / NUM.ONEFORTYFOUR;
  const cx = w / 2;
  const cy = h / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  let angle = 0;
  let radius = scale;
  ctx.moveTo(cx, cy);
  for (let i = 0; i < steps; i++) {
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    ctx.lineTo(x, y);
    radius *= PHI;
    angle += Math.PI / NUM.SEVEN;
  }
  ctx.stroke();
}

// Layer 4: Double-helix lattice
// ND-safe: static lattice without oscillation
export function drawHelix(ctx, w, h, color1, color2, NUM) {
  const amplitude = w / NUM.THIRTYTHREE;
  const steps = NUM.NINETYNINE;
  const cx = w / 2;

  ctx.lineWidth = 1.5;
  [0, Math.PI].forEach(phase => {
    ctx.strokeStyle = color1;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = cx + amplitude * Math.sin(NUM.ELEVEN * t * Math.PI + phase);
      const y = t * h;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });

  ctx.strokeStyle = color2;
  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const t = i / NUM.THIRTYTHREE;
    const y = t * h;
    const x1 = cx + amplitude * Math.sin(NUM.ELEVEN * t * Math.PI);
    const x2 = cx + amplitude * Math.sin(NUM.ELEVEN * t * Math.PI + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }
}

