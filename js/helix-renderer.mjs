/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted strands)

  All routines are pure and parameterized. No motion or network calls.
*/

const TAU = Math.PI * 2;

export function renderHelix(ctx, opts){
  if (!ctx) return;
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg; // high-contrast stage
  ctx.fillRect(0,0,width,height);

  drawVesica(ctx,{ width, height, color: palette.layers[0], NUM });
  drawTree(ctx,{ width, height, colors:[palette.layers[1], palette.layers[2]], NUM });
  drawFibonacci(ctx,{ width, height, color: palette.layers[3], NUM });
  drawHelix(ctx,{ width, height, colors:[palette.layers[4], palette.layers[5]], NUM });
}

// --- Layer 1: Vesica field -------------------------------------------------
function drawVesica(ctx,{width,height,color,NUM}){
  /* ND-safe: static intersecting circles; no animation or fills. */
  const r = Math.min(width,height)/NUM.THREE;
  const cx1 = width/2 - r/2;
  const cx2 = width/2 + r/2;
  const cy  = height/2;
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(cx1,cy,r,0,TAU);
  ctx.arc(cx2,cy,r,0,TAU);
  ctx.stroke();
}

// --- Layer 2: Tree-of-Life scaffold ---------------------------------------
function drawTree(ctx,{width,height,colors,NUM}){
  /* Static sephirot + 22 paths; coordinates as canvas ratios. */
  const nodes = [
    [0.5,0.05],
    [0.75,0.2],[0.25,0.2],
    [0.75,0.4],[0.25,0.4],
    [0.5,0.5],
    [0.75,0.7],[0.25,0.7],
    [0.5,0.8],
    [0.5,0.95]
  ];
  const paths = [
    [0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[1,4],[2,3],
    [5,6],[5,7],[3,6],[4,7],[6,8],[7,8],[8,9],[1,6],
    [2,7],[0,5],[3,8],[4,8],[1,5],[2,5]
  ];
  ctx.strokeStyle = colors[0];
  ctx.lineWidth = 1;
  for (const [a,b] of paths){
    ctx.beginPath();
    const ax = nodes[a][0]*width, ay = nodes[a][1]*height;
    const bx = nodes[b][0]*width, by = nodes[b][1]*height;
    ctx.moveTo(ax,ay);
    ctx.lineTo(bx,by);
    ctx.stroke();
  }
  ctx.fillStyle = colors[1];
  const rad = Math.min(width,height)/NUM.NINETYNINE * NUM.THREE;
  for (const [x,y] of nodes){
    ctx.beginPath();
    ctx.arc(x*width,y*height,rad,0,TAU);
    ctx.fill();
  }
}

// --- Layer 3: Fibonacci curve ---------------------------------------------
function drawFibonacci(ctx,{width,height,color,NUM}){
  /* Log spiral polyline; static and ND-safe. */
  const points = [];
  const a = Math.min(width,height)/NUM.ONEFORTYFOUR;
  const b = Math.log(1.61803398875); // golden ratio
  for (let i=0;i<=NUM.NINETYNINE;i++){
    const t = i/NUM.NINETYNINE * NUM.THIRTYTHREE * Math.PI/NUM.ELEVEN;
    const r = a * Math.exp(b*t);
    const x = width/2 + r*Math.cos(t);
    const y = height/2 + r*Math.sin(t);
    points.push([x,y]);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(points[0][0],points[0][1]);
  for (const [x,y] of points.slice(1)){
    ctx.lineTo(x,y);
  }
  ctx.stroke();
}

// --- Layer 4: Double-helix lattice ----------------------------------------
function drawHelix(ctx,{width,height,colors,NUM}){
  /* Two phase-shifted strands with static connectors. */
  const steps = NUM.NINETYNINE;
  const amp   = height/NUM.NINE;
  const mid   = height/2;
  const freq  = NUM.TWENTYTWO;
  for (let s=0;s<2;s++){
    ctx.strokeStyle = colors[s];
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i=0;i<=steps;i++){
      const x = i/steps*width;
      const y = mid + amp*Math.sin((i/steps)*freq + s*Math.PI);
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  ctx.strokeStyle = colors[1];
  ctx.lineWidth = 1;
  for (let i=0;i<=NUM.ELEVEN;i++){
    const x  = i/NUM.ELEVEN*width;
    const y1 = mid + amp*Math.sin((i/steps)*freq);
    const y2 = mid + amp*Math.sin((i/steps)*freq + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x,y1);
    ctx.lineTo(x,y2);
    ctx.stroke();
  }
}
