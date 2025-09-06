/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine waves)

  All routines are pure and parameterized; palette and numerology constants
  arrive via the options object. No motion, no external dependencies.
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], NUM);
  drawFibonacci(ctx, width, height, palette.layers[2], NUM);
  drawHelix(ctx, width, height, palette.layers.slice(3), NUM);
}

function drawVesica(ctx, w, h, color, NUM) {
  // Vesica grid: calm interlocking circles, ND-safe (no strobe)
  const r = Math.min(w, h) / NUM.THREE;
  const step = r;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let i = -1; i <= 1; i++) {
    for (let j = 0; j <= 1; j++) {
      const cx = w / 2 + i * step;
      const cy = h / 2 + j * (step / 2);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function drawTree(ctx, w, h, color, NUM) {
  // Simplified Tree-of-Life: 10 nodes, 22 paths
  const nodes = [
    [w / 2, h / NUM.ONEFORTYFOUR * 8],
    [w / 2, h / NUM.TWENTYTWO * 3],
    [w / 2 - w / NUM.NINE, h / NUM.TWENTYTWO * 6],
    [w / 2 + w / NUM.NINE, h / NUM.TWENTYTWO * 6],
    [w / 2 - w / NUM.NINE, h / NUM.TWENTYTWO * 9],
    [w / 2 + w / NUM.NINE, h / NUM.TWENTYTWO * 9],
    [w / 2, h / NUM.TWENTYTWO * 12],
    [w / 2 - w / NUM.THREE, h / NUM.TWENTYTWO * 15],
    [w / 2 + w / NUM.THREE, h / NUM.TWENTYTWO * 15],
    [w / 2, h / NUM.TWENTYTWO * 18]
  ];

  const edges = [
    [0,1],[0,2],[0,6],
    [1,2],[1,3],[1,4],
    [2,3],[2,4],[2,5],
    [3,4],[3,6],[3,7],
    [4,5],[4,7],[4,8],
    [5,6],[5,8],[5,9],
    [6,7],[6,9],[7,8],[8,9]
  ];

  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  edges.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a][0], nodes[a][1]);
    ctx.lineTo(nodes[b][0], nodes[b][1]);
    ctx.stroke();
  });

  ctx.fillStyle = color;
  nodes.forEach(([x,y]) => {
    ctx.beginPath();
    ctx.arc(x, y, w / NUM.ONEFORTYFOUR * 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawFibonacci(ctx, w, h, color, NUM) {
  // Fibonacci spiral polyline: static, no animation
  const phi = (1 + Math.sqrt(5)) / 2;
  let radius = w / NUM.NINETYNINE;
  let angle = 0;
  const center = [w / 2, h / 2];
  const pts = [];
  for (let i = 0; i < NUM.ELEVEN; i++) {
    const x = center[0] + radius * Math.cos(angle);
    const y = center[1] + radius * Math.sin(angle);
    pts.push([x, y]);
    radius *= phi;
    angle += Math.PI / 2;


const TAU = Math.PI * 2;

export function renderHelix(ctx, opts){
  if (!ctx) return;
  const { width, height, palette, NUM } = opts;
  // clear background
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0,0,width,height);

  drawVesica(ctx, { width, height, color: palette.layers[0], NUM });
  drawTree(ctx, { width, height, colors: [palette.layers[1], palette.layers[2]], NUM });
  drawFibonacci(ctx, { width, height, color: palette.layers[3], NUM });
  drawHelix(ctx, { width, height, colors: [palette.layers[4], palette.layers[5]], NUM });
}

function drawVesica(ctx,{width,height,color,NUM}){
  // ND-safe: simple strokes, no fill, centered geometry
  const r = Math.min(width,height)/NUM.THREE;
  const cx1 = width/2 - r/2;
  const cx2 = width/2 + r/2;
  const cy = height/2;
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(cx1,cy,r,0,TAU);
  ctx.arc(cx2,cy,r,0,TAU);
  ctx.stroke();
}

function drawTree(ctx,{width,height,colors,NUM}){
  // layout using percentages; ensures offline determinism
  const nodes = [
    [0.5,0.05], // Keter
    [0.75,0.2], [0.25,0.2], // Chokmah, Binah
    [0.75,0.4], [0.25,0.4], // Chesed, Geburah
    [0.5,0.5], // Tiphereth
    [0.75,0.7], [0.25,0.7], // Netzach, Hod
    [0.5,0.8], // Yesod
    [0.5,0.95] // Malkuth
  ];
  const paths = [
    [0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[1,4],[2,3],
    [5,6],[5,7],[3,6],[4,7],[6,8],[7,8],[8,9],[1,6],
    [2,7],[0,5],[3,8],[4,8],[1,5],[2,5]
  ];
  // draw paths first
  ctx.strokeStyle = colors[0];
  ctx.lineWidth = 1;
  for (const [a,b] of paths){
    ctx.beginPath();
    const ax = nodes[a][0]*width; const ay = nodes[a][1]*height;
    const bx = nodes[b][0]*width; const by = nodes[b][1]*height;
    ctx.moveTo(ax,ay);
    ctx.lineTo(bx,by);
    ctx.stroke();
  }
  // draw nodes
  ctx.fillStyle = colors[1];
  const rad = Math.min(width,height)/NUM.NINETYNINE * NUM.THREE; // small constant size
  for (const [x,y] of nodes){
    ctx.beginPath();
    ctx.arc(x*width,y*height,rad,0,TAU);
    ctx.fill();
  }
}

function drawFibonacci(ctx,{width,height,color,NUM}){
  // log spiral using 99 sample points; static polyline
  const points = [];
  const a = Math.min(width,height)/NUM.ONEFORTYFOUR;
  const b = Math.log(1.61803398875);
  for (let i=0;i<=NUM.NINETYNINE;i++){
    const t = i/NUM.NINETYNINE * NUM.THREETHREE * Math.PI/NUM.ELEVEN;
    const r = a * Math.exp(b*t);
    const x = width/2 + r*Math.cos(t);
    const y = height/2 + r*Math.sin(t);
    points.push([x,y]);

  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke();
}

function drawHelix(ctx, w, h, colors, NUM) {
  // Double helix lattice: two sine waves, phase-shifted, static
  const midY = h / 2;
  const amp = h / NUM.SEVEN; // gentle amplitude
  const freq = NUM.NINE; // cycles across width
  ctx.lineWidth = 1;
  ctx.strokeStyle = colors[0];
  ctx.beginPath();
  for (let x = 0; x <= w; x++) {
    const y = midY + amp * Math.sin((x / w) * freq * Math.PI * 2);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  
  ctx.stroke();
  ctx.strokeStyle = colors[1];
  ctx.beginPath();
  for (let x = 0; x <= w; x++) {
    const y = midY + amp * Math.sin((x / w) * freq * Math.PI * 2 + Math.PI);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.moveTo(points[0][0], points[0][1]);
  for (const [x,y] of points.slice(1)){
    ctx.lineTo(x,y);
  }
  ctx.stroke();
}

function drawHelix(ctx,{width,height,colors,NUM}){
  // static double helix lattice with 99 horizontal steps
  const steps = NUM.NINETYNINE;
  const amp = height/NUM.NINE;
  const mid = height/2;
  const freq = NUM.TWENTYTWO;
  // strands
  for (let s=0;s<2;s++){
    ctx.strokeStyle = colors[s];
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i=0;i<=steps;i++){
      const x = i/steps * width;
      const y = mid + amp*Math.sin((i/steps)*freq + s*Math.PI);
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  // vertical connectors every 11 steps
  ctx.strokeStyle = colors[1];
  ctx.lineWidth = 1;
  for (let i=0;i<=NUM.ELEVEN;i++){
    const x = i/NUM.ELEVEN * width;
    const y1 = mid + amp*Math.sin((i/steps)*freq);
    const y2 = mid + amp*Math.sin((i/steps)*freq + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x,y1);
    ctx.lineTo(x,y2);
    ctx.stroke();
  }
}

