/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.
  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine waves)
  No animation, no external dependencies.
*/

export function renderHelix(ctx, opts){
  const {width, height, palette, NUM} = opts;
  ctx.save();
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  drawVesica(ctx, width, height, palette.layers[0]);
  drawTree(ctx, width, height, palette.layers[1], palette.ink);
  drawFibonacci(ctx, width, height, palette.layers[2]);
  drawHelix(ctx, width, height, palette.layers[3], NUM);
}

export function drawVesica(ctx, w, h, color){
  // Two circles intersecting form the Vesica Piscis
  const r = Math.min(w, h) / 3;
  const cx1 = w/2 - r/2;
  const cx2 = w/2 + r/2;
  const cy = h/2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx1, cy, r, 0, Math.PI * 2);
  ctx.arc(cx2, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

export function drawTree(ctx, w, h, color, nodeColor){
  // Simplified Tree-of-Life layout using numerology constants
  const nodes = [
    {x:0.5, y:0.08}, // Kether
    {x:0.25, y:0.2}, // Chokmah
    {x:0.75, y:0.2}, // Binah
    {x:0.2, y:0.4},  // Chesed
    {x:0.8, y:0.4},  // Geburah
    {x:0.5, y:0.5},  // Tiphareth
    {x:0.25, y:0.7}, // Netzach
    {x:0.75, y:0.7}, // Hod
    {x:0.5, y:0.8},  // Yesod
    {x:0.5, y:0.95}  // Malkuth
  ];
  const edges = [
    [0,1],[0,2],[1,2],
    [1,3],[2,4],[3,4],
    [3,5],[4,5],[3,6],[4,7],
    [5,6],[5,7],[6,7],
    [6,8],[7,8],[5,8],
    [8,9],[6,9],[7,9],[1,5],[2,5],[0,5]
  ];
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  for(const [a,b] of edges){
    const p1 = nodes[a];
    const p2 = nodes[b];
    ctx.beginPath();
    ctx.moveTo(p1.x*w, p1.y*h);
    ctx.lineTo(p2.x*w, p2.y*h);
    ctx.stroke();
  }
  ctx.fillStyle = nodeColor;
  for(const p of nodes){
    ctx.beginPath();
    ctx.arc(p.x*w, p.y*h, 6, 0, Math.PI*2);
    ctx.fill();
  }
}

export function drawFibonacci(ctx, w, h, color){
  // Log spiral approximating Fibonacci sequence. Golden Ratio ~1.618034
  const phi = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  const steps = 144; // uses ONEFORTYFOUR for smoothness
  const scale = Math.min(w, h) / 20;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for(let i=0;i<=steps;i++){
    const t = i/steps * Math.PI * 4; // full sweep
    const r = scale * Math.pow(phi, t/(Math.PI/2));
    const x = w/2 + r*Math.cos(t);
    const y = h/2 + r*Math.sin(t);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();
}

export function drawHelix(ctx, w, h, color, NUM){
  // Double helix rendered as phase-shifted sine waves
  const turns = NUM.THIRTYTHREE / NUM.ELEVEN; // symbolic count
  const points = NUM.ONEFORTYFOUR;
  const amp = h/4;
  const cy = h/2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  // first strand
  ctx.beginPath();
  for(let i=0;i<=points;i++){
    const t = i/points * Math.PI*2*turns;
    const x = (i/points)*w;
    const y = cy + amp*Math.sin(t);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();
  // second strand
  ctx.beginPath();
  for(let i=0;i<=points;i++){
    const t = i/points * Math.PI*2*turns;
    const x = (i/points)*w;
    const y = cy + amp*Math.sin(t + Math.PI);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();
}

