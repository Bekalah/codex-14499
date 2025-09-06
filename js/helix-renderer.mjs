/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine paths)
*/

export function renderHelix(ctx, opts){
  const {width, height, palette} = opts;
  ctx.save();
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);
  drawVesica(ctx, width, height, palette.layers[0]);
  drawTree(ctx, width, height, palette.layers[1]);
  drawFibonacci(ctx, width, height, palette.layers[2]);
  drawHelix(ctx, width, height, palette.layers[3], palette.layers[4], palette.layers[5]);
  ctx.restore();
}

function drawVesica(ctx, w, h, color){
  // ND-safe: static intersection of two circles, no motion.
  ctx.save();
  ctx.strokeStyle = color;
  const r = Math.min(w, h) / 3;
  const cx = w / 2;
  const cy = h / 2;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx - r / 2, cy, r, 0, Math.PI * 2);
  ctx.arc(cx + r / 2, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawTree(ctx, w, h, color){
  // ND-safe: Tree-of-Life nodes and paths, static scaffold.
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  const nodes = [
    [0,0],[0,-1],[0,-2],[-1,-1],[1,-1],[-1,-2],[1,-2],[-1,-3],[1,-3],[0,-3]
  ];
  const scale = Math.min(w,h) / 6;
  const ox = w / 2;
  const oy = h / 2 - scale / 2;
  const paths = [
    [0,1],[1,2],[0,3],[0,4],[3,4],[3,1],[4,1],[3,5],[4,6],[5,6],[5,7],[6,8],[7,8],[7,9],[8,9],[2,5],[2,6],[1,6],[1,5],[9,2],[9,7],[9,8]
  ];
  ctx.lineWidth = 1;
  paths.forEach(([a,b])=>{
    ctx.beginPath();
    const [x1,y1] = nodes[a];
    const [x2,y2] = nodes[b];
    ctx.moveTo(ox + x1 * scale, oy + y1 * scale);
    ctx.lineTo(ox + x2 * scale, oy + y2 * scale);
    ctx.stroke();
  });
  const r = scale * 0.1;
  nodes.forEach(([x,y])=>{
    ctx.beginPath();
    ctx.arc(ox + x * scale, oy + y * scale, r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawFibonacci(ctx, w, h, color){
  // Golden Ratio phi guides static logarithmic spiral; no animation.
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const phi = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  let size = Math.min(w,h) / 6;
  let x = w / 2;
  let y = h / 2;
  let angle = 0;
  ctx.beginPath();
  ctx.moveTo(x, y);
  for(let i=0;i<10;i++){
    const next = size * phi;
    angle += Math.PI / 2;
    x += Math.cos(angle) * next;
    y += Math.sin(angle) * next;
    ctx.lineTo(x, y);
    size = next;
  }
  ctx.stroke();
  ctx.restore();
}

function drawHelix(ctx, w, h, colorA, colorB, colorC){
  // Static double helix lattice using sine waves; ND-safe, no motion.
  ctx.save();
  const steps = 33;
  const amp = h / 4;
  ctx.lineWidth = 1;
  for(let phase=0; phase<2; phase++){
    ctx.strokeStyle = phase===0 ? colorA : colorB;
    ctx.beginPath();
    for(let i=0; i<=steps; i++){
      const t = i / steps;
      const x = t * w;
      const y = h / 2 + amp * Math.sin(t * 4 * Math.PI + phase * Math.PI);
      if(i===0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.strokeStyle = colorC;
  for(let i=0; i<=steps; i+=3){
    const t = i / steps;
    const x = t * w;
    const y1 = h / 2 + amp * Math.sin(t * 4 * Math.PI);
    const y2 = h / 2 + amp * Math.sin(t * 4 * Math.PI + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
  ctx.restore();
}
