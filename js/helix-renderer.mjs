/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted strands)

  No animation, no network, calm palette.
*/

const TAU = Math.PI * 2;

export function drawVesica(ctx, { width, height, palette }) {
  const r = Math.min(width, height) / 3;
  const cx1 = width / 2 - r / 2;
  const cx2 = width / 2 + r / 2;
  const cy = height / 2;
  ctx.strokeStyle = palette.layers[0];
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx1, cy, r, 0, TAU);
  ctx.arc(cx2, cy, r, 0, TAU);
  ctx.stroke();
}

export function drawTree(ctx, { width, height, palette }) {
  const w = width;
  const h = height;
  const x0 = w / 2;
  const dx = w / 6;
  const dy = h / 10;
  // ten sephirot positions
  const nodes = [
    [x0, dy],
    [x0 + dx, dy * 2],
    [x0 - dx, dy * 2],
    [x0 + dx, dy * 4],
    [x0 - dx, dy * 4],
    [x0, dy * 5],
    [x0 + dx, dy * 7],
    [x0 - dx, dy * 7],
    [x0, dy * 8.5],
    [x0, dy * 10],
  ];
  // 22 paths connecting nodes
  const paths = [
    [0,1],[0,2],[1,2],
    [1,3],[2,4],[3,4],
    [3,5],[4,5],[3,6],[4,7],
    [6,7],[6,8],[7,8],[8,9],
    [5,6],[5,7],[5,8],
    [1,5],[2,5],[1,4],[2,3],[0,5]
  ];
  ctx.strokeStyle = palette.layers[1];
  ctx.lineWidth = 2;
  for (const [a,b] of paths) {
    const [x1,y1] = nodes[a];
    const [x2,y2] = nodes[b];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.fillStyle = palette.layers[2];
  for (const [x,y] of nodes) {
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, TAU);
    ctx.fill();
  }
}

export function drawFibonacci(ctx, { width, height, palette }) {
  const phi = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  const cx = width / 4;
  const cy = height / 2;
  const scale = Math.min(width, height) / 20;
  const points = [];
  for (let i = 0; i < 33; i++) {
    const theta = i / 5;
    const r = scale * Math.pow(phi, theta);
    points.push([
      cx + r * Math.cos(theta),
      cy + r * Math.sin(theta)
    ]);
  }
  ctx.strokeStyle = palette.layers[3];
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach(([x,y], i) => {
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

export function drawHelix(ctx, { width, height, palette, NUM }) {
  const turns = NUM.NINE; // static lattice referencing numerology
  const steps = NUM.ONEFORTYFOUR;
  const amp = width / 8;
  const mid = width * 0.75;
  const strand = phase => {
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = turns * TAU * t + phase;
      const x = mid + amp * Math.sin(angle);
      const y = height * t;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };
  ctx.strokeStyle = palette.layers[4];
  ctx.lineWidth = 1.5;
  strand(0);
  ctx.strokeStyle = palette.layers[5];
  strand(Math.PI);
}

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);
  drawVesica(ctx, { width, height, palette });
  drawTree(ctx, { width, height, palette });
  drawFibonacci(ctx, { width, height, palette });
  drawHelix(ctx, { width, height, palette, NUM });
}
