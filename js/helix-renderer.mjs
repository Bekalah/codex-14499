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

    4) Double-helix lattice (two phase-shifted strands)

  All routines are pure and parameterized. No motion or network calls.
*/

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
  ctx.moveTo(points[0][0], points[0][1]);
  for (const [x,y] of points.slice(1)){
    ctx.lineTo(x,y);

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

