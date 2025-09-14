// Per Texturas Numerorum, Spira Loquitur.
// Per Texturas Numerorum, Spira Loquitur. //
/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths)
    3) Fibonacci curve (log spiral polyline)
    3) Fibonacci curve (log spiral)
    4) Double-helix lattice (static strands)
  Rationale: no motion, soft contrast, numerology constants.
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted strands)

    3) Fibonacci curve (log spiral)
    4) Double-helix lattice (two phase-shifted strands)
  ND-safe choices: no motion, calm colors, clear separation.
  Notes:
    - No motion or animation.
    - Palette and numerology constants passed in.
    - Geometry uses constants 3,7,9,11,22,33,99,144.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  // ND-safe: fill background first to avoid flashes
    - All geometry parameterized by numerology constants.
    - Golden Ratio used in Fibonacci curve.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  // ND-safe: fill background first to avoid flashes
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  // Layer order preserves contemplative depth
    1) Vesica field (intersecting circle grid)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths)
    3) Fibonacci curve (log spiral polyline)
    4) Double-helix lattice (two strands with rungs)

  ND-safe choices:
    - No motion or animation; everything renders once.
    - Calming palette supplied externally; high-contrast lines.
    - Pure functions with numerology constants 3,7,9,11,22,33,99,144.
*/

    3) Fibonacci curve (log spiral)
    4) Double-helix lattice (two phase-shifted strands)
  ND-safe choices: no motion, calm colors, clear separation.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  // Fill background first to avoid flashes.
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  // Layer order preserves contemplative depth.
    - Geometry uses numerology constants.
    - Golden Ratio used for Fibonacci curve.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  // ND-safe: fill background first to avoid flashes

  ND-safe notes:
    - No motion or animation
    - Calm palette passed via palette.json
    - Geometry uses numerology constants
    - Golden Ratio used for Fibonacci curve
*/

    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified)
    3) Fibonacci curve (log spiral polyline)
    4) Double-helix lattice (two phase-shifted strands)
  No motion; calm palette and layer order support readability.
*/

    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified)
    3) Fibonacci curve (log spiral polyline)
    4) Double-helix lattice (two phase-shifted strands)
  No motion; calm palette and layer order support readability.
*/

  Why: preserves contemplative depth without motion or external libs.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  // Fill background first to avoid flashes
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  // Layer order preserves contemplative depth
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted strands)

  ND-safe notes:
    - no motion or animation
    - calm palette for readability
    - geometry driven by numerology constants
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  // fill background first to avoid flashes
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  // layer order preserves contemplative depth

  ND-safe notes:
    - No motion or animation.
    - Calm palette, high readability.
    - Layer order preserves contemplative depth.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  // Fill background first to avoid flashes.
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// Layer 1: Vesica field
// ND-safe: static intersecting circles
function drawVesica(ctx, w, h, color, NUM) {
// ND-safe: static intersecting circles, soft lines
export function drawVesica(ctx, w, h, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
function drawVesica(ctx, w, h, color, NUM) {
  const r = Math.min(w, h) / NUM.THREE;
  const step = r / NUM.NINE;
  const cy = h / 2;

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx1, cy, r, 0, Math.PI * 2);
  ctx.arc(cx2, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  ctx.lineWidth = 1.5;
  for (let i = -NUM.THREE; i <= NUM.THREE; i++) {
    const cx = w / 2 + i * step * NUM.SEVEN;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const r = Math.min(w, h) / NUM.THREE;
  const offset = r / NUM.NINE;
  const cy = h / 2;
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
function drawTree(ctx, w, h, lineColor, nodeColor, NUM) {
  ctx.save();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1.5;
export function drawTree(ctx, w, h, lineColor, nodeColor, NUM) {
  const nodes = [
    [w / 2, h * 0.05],
    [w / 4, h * 0.2], [w * 3 / 4, h * 0.2],
    [w / 4, h * 0.4], [w / 2, h * 0.55], [w * 3 / 4, h * 0.4],
    [w / 4, h * 0.7], [w * 3 / 4, h * 0.7],
    [w / 2, h * 0.85],
    [w / 2, h * 0.95]
  ];
  const paths = [
    [0,1],[0,2],[1,2],[1,3],[2,4],[3,4],[3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],[6,8],[7,8],
    [6,9],[7,9],[8,9],[1,6],[1,7],[2,6],[2,7]
// ND-safe: static intersecting circles, soft strokes.
function drawVesica(ctx, w, h, color, NUM) {
  const r = Math.min(w, h) / NUM.THREE;
  const step = r / NUM.NINE;
  const cy = h / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let i = -NUM.THREE; i <= NUM.THREE; i++) {
    const cx = w / 2 + i * step * NUM.SEVEN;
    ctx.beginPath();
    ctx.arc(cx - r / NUM.THREE, cy, r, 0, Math.PI * 2);
    ctx.arc(cx + r / NUM.THREE, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// Layer 2: Tree-of-Life scaffold
// ND-safe: simple nodes and paths only.
function drawTree(ctx, w, h, pathColor, nodeColor, NUM) {
  const nodes = [
    [0.5, 0.05],
    [0.25, 0.2], [0.75, 0.2],
    [0.25, 0.4], [0.75, 0.4],
    [0.5, 0.55],
    [0.25, 0.7], [0.75, 0.7],
    [0.5, 0.85],
    [0.5, 0.95]
  ];
  const paths = [
    [0,1],[0,2],[1,2],[1,3],[2,4],[3,5],[4,5],[3,6],[4,6],[5,6],
    [5,7],[6,7],[6,8],[7,8],[8,9],[1,3],[2,4],[3,4],[6,7],[3,5],[4,5],[4,8]
  ]; // 22 paths
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 1;
  paths.forEach(([a,b]) => {
    [0,1],[0,2],[1,2],
    [1,3],[2,4],[3,5],[4,5],
    [3,6],[4,6],[5,6],
    [5,7],[6,7],
    [6,8],[7,8],[8,9]
  ]; // 22 paths

  ctx.strokeStyle = lineColor;
  ctx.save();
  ctx.strokeStyle = lineColor;
  ctx.fillStyle = nodeColor;

  ctx.save();
export function drawTree(ctx, w, h, lineColor, nodeColor, NUM) {
  const nodes = [
    [w/2, h*0.05],
    [w/4, h*0.2], [w*3/4, h*0.2],
    [w/4, h*0.4], [w/2, h*0.35], [w*3/4, h*0.4],
    [w/4, h*0.6], [w*3/4, h*0.6],
    [w/2, h*0.8],
    [w/2, h*0.95]
    [w / 2, h * 0.08],
    [w / 4, h * 0.2], [w * 3 / 4, h * 0.2],
    [w / 4, h * 0.4], [w / 2, h * 0.35], [w * 3 / 4, h * 0.4],
    [w / 4, h * 0.6], [w * 3 / 4, h * 0.6],
    [w / 2, h * 0.8],
    [w / 2, h * 0.95]
  ];

  const paths = [
    [0,1],[0,2],[1,3],[1,4],[2,4],[2,5],
    [3,4],[4,5],[3,6],[4,6],[4,7],[5,7],
    [6,8],[7,8],[8,9]
  ]; // 22 paths
  paths.forEach(([a,b]) => {
    [6,8],[7,8],[8,9],
    [3,5],[1,2],[6,7],[1,3],[2,5],[3,5],[4,8],[5,7],
  ]; // 22 paths

    [0,1],[0,2],[1,2],
    [1,3],[2,4],[3,5],[4,5],
    [3,6],[4,6],[5,6],
    [5,7],[6,7],
    [6,8],[7,8],[8,9]
  const nodes = [
    [w/2, h*0.05],
    [w/4, h*0.2], [w*3/4, h*0.2],
    [w/4, h*0.4], [w/2, h*0.35], [w*3/4, h*0.4],
    [w/4, h*0.6], [w*3/4, h*0.6],
    [w/2, h*0.8],
    [w/2, h*0.95],
  ];

  const paths = [
    [0,1],[0,2],[1,2],[1,3],[2,5],[3,4],[5,4],[3,6],[5,7],[6,8],[7,8],
    [8,9],[1,4],[2,4],[3,5],[6,7],[1,6],[2,7],[4,6],[4,7],[0,4],[4,8]
  ]; // 22 paths

    [6,8],[7,8],[8,9]
  ]; // 22 paths

    [0,1],[0,2],[1,2],[1,3],[2,4],[3,4],[3,5],[4,5],
    [3,6],[4,7],[5,6],[5,7],[6,7],[6,8],[7,8],
    [6,9],[7,9],[8,9],[5,8],[2,5],[1,5],[0,5]
    [3,5],[1,2],[6,7],[1,3],[2,5],[4,8],[5,7]
  ]; // 22 paths

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1.5;
  paths.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a][0] * w, nodes[a][1] * h);
    ctx.lineTo(nodes[b][0] * w, nodes[b][1] * h);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const r = Math.min(w, h) / NUM.NINETYNINE * NUM.SEVEN;
  nodes.forEach(([x,y]) => {

  const rNode = Math.min(w, h) / NUM.NINETYNINE * NUM.SEVEN;
  nodes.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
  const rNode = Math.min(w, h) / NUM.NINETYNINE * NUM.SEVEN;
  nodes.forEach(([nx, ny]) => {
    ctx.beginPath();
    ctx.arc(nx * w, ny * h, rNode, 0, Math.PI * 2);
  const rNode = Math.min(w, h) / NUM.NINETYNINE * NUM.SEVEN;
  ctx.fillStyle = nodeColor;
  nodes.forEach(([x,y]) => {
  nodes.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x * w, y * h, r, 0, Math.PI * 2);
  nodes.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x * w, y * h, rNode, 0, Math.PI * 2);
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
// ND-safe: single log spiral; uses the Golden Ratio
// ND-safe: single log spiral; Golden Ratio guides growth
// ND-safe: single log spiral, uses the Golden Ratio
export function drawFibonacci(ctx, w, h, color, NUM) {
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  const steps = NUM.TWENTYTWO;
  const scale = Math.min(w, h) / NUM.ONEFORTYFOUR;
  const cx = w / 2;
  const cy = h / 2;
  let angle = 0;
  let radius = scale;

  let radius = scale;
  let angle = 0;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
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
}

// Layer 4: Double-helix lattice
// ND-safe: static lattice, no oscillation
export function drawHelix(ctx, w, h, color1, color2, NUM) {
  const amplitude = w / NUM.THIRTYTHREE;
  const steps = NUM.NINETYNINE;
  ctx.lineWidth = 1.5;

  ctx.strokeStyle = color1;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = w / 2 + amplitude * Math.sin(NUM.ELEVEN * t * Math.PI);
    const y = t * h;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = color2;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = w / 2 + amplitude * Math.sin(NUM.ELEVEN * t * Math.PI + Math.PI);
    const y = t * h;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = color1;
  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const t = i / NUM.THIRTYTHREE;
    const y = t * h;
    const x1 = w / 2 + amplitude * Math.sin(NUM.ELEVEN * t * Math.PI);
    const x2 = w / 2 + amplitude * Math.sin(NUM.ELEVEN * t * Math.PI + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }
// ND-safe: single log spiral, uses the Golden Ratio
export function drawFibonacci(ctx, w, h, color, NUM) {
// ND-safe: single log spiral, uses the Golden Ratio
function drawFibonacci(ctx, w, h, color, NUM) {
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  const steps = NUM.TWENTYTWO;
  const scale = Math.min(w, h) / NUM.ONEFORTYFOUR;
  const cx = w / 2;
  const cy = h / 2;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  let angle = 0;
  let radius = scale;
// ND-safe: static logarithmic spiral using the Golden Ratio.
function drawFibonacci(ctx, w, h, color, NUM) {
  const PHI = (1 + Math.sqrt(5)) / 2;
  const steps = NUM.THIRTYTHREE;
  const scale = Math.min(w, h) / NUM.ONEFORTYFOUR;

  let angle = 0;
  let radius = scale;
  const cx = w / 2;
  const cy = h / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, cy);

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < steps; i++) {
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    radius *= PHI;
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
// ND-safe: single log spiral, uses the Golden Ratio
export function drawFibonacci(ctx, w, h, color, NUM) {
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  const steps = NUM.TWENTYTWO;
  const scale = Math.min(w, h) / NUM.ONEFORTYFOUR;

  let angle = 0;
  let radius = scale;
  const cx = w / 2;
  const cy = h / 2;

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < steps; i++) {
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    radius *= PHI;
    angle += Math.PI / NUM.SEVEN;
  }
  ctx.stroke();
  ctx.save();
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio
  const steps = NUM.THIRTYTHREE;
  const scale = Math.min(w, h) / NUM.ONEFORTYFOUR * NUM.THIRTYTHREE;
  let angle = 0;
  let radius = scale;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w/2, h/2);
  for (let i = 0; i < steps; i++) {
    const x = w/2 + radius * Math.cos(angle);
    const y = h/2 + radius * Math.sin(angle);
    x = w/2 + radius * Math.cos(angle);
    y = h/2 + radius * Math.sin(angle);
    ctx.lineTo(x, y);
    radius *= PHI;
    angle += Math.PI / NUM.SEVEN;
  }
  ctx.stroke();
  ctx.restore();
  }
  ctx.stroke();
}

// Layer 4: Double-helix lattice
// ND-safe: static lattice without oscillation
export function drawHelix(ctx, w, h, color1, color2, NUM) {
  ctx.save();
  const turns = NUM.NINETYNINE / NUM.NINE; // 11 turns
  const amplitude = h / 4;
  const turns = NUM.ELEVEN;
  const step = w / NUM.ONEFORTYFOUR;
  const amplitude = h / 4;

// ND-safe: static lattice, no oscillation
export function drawHelix(ctx, w, h, color1, color2, NUM) {
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
export function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  ctx.save();
  const amplitude = w / NUM.THIRTYTHREE;
  const steps = NUM.NINETYNINE;
  const strands = [
    { phase: 0, color: colorA },
    { phase: Math.PI, color: colorB }
  ];
  strands.forEach(({ phase, color }) => {
    ctx.strokeStyle = color;
  const amplitude = w / NUM.THIRTYTHREE;
  const steps = NUM.NINETYNINE;
  ctx.lineWidth = 1.5;

  [0, Math.PI].forEach((phase, idx) => {
    ctx.strokeStyle = idx === 0 ? color1 : color2;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = w / 2 + amplitude * Math.sin(NUM.ELEVEN * t * Math.PI + phase);
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
  ctx.restore();
export function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const amplitude = w / NUM.THIRTYTHREE;
  const steps = NUM.NINETYNINE;
  [colorA, colorB].forEach((color, i) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const x = w/2 + amplitude * Math.sin(NUM.ELEVEN * t * Math.PI + i * Math.PI);
      const y = t * h;
      if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });

  ctx.strokeStyle = color2;
  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const t = i / NUM.THIRTYTHREE;
    const y = t * h;
    const x1 = w / 2 + amplitude * Math.sin(NUM.ELEVEN * t * Math.PI);
    const x2 = w / 2 + amplitude * Math.sin(NUM.ELEVEN * t * Math.PI + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }
}
function drawHelix(ctx, w, h, color1, color2, NUM) {
  const turns = NUM.NINETYNINE / NUM.NINE; // 11 turns
  const amplitude = h / 4;
  const step = w / NUM.ONEFORTYFOUR;
  ctx.lineWidth = 1.5;

// Layer 4: Double-helix lattice
// ND-safe: two static strands with cross rungs; no oscillation.
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const turns = NUM.ELEVEN;
  const amplitude = w / NUM.THIRTYTHREE;
  const steps = NUM.NINETYNINE;
  ctx.lineWidth = 1;
  [colorA, colorB].forEach((col, idx) => {
    ctx.strokeStyle = col;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = w / 2 + amplitude * Math.sin(turns * t * Math.PI * 2 + idx * Math.PI);
      const y = t * h;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });
  ctx.strokeStyle = colorB;
  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const t = i / NUM.THIRTYTHREE;
    const y = t * h;
    const x1 = w / 2 + amplitude * Math.sin(turns * t * Math.PI * 2);
    const x2 = w / 2 + amplitude * Math.sin(turns * t * Math.PI * 2 + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }
  ctx.restore();
}

export { drawVesica, drawTree, drawFibonacci, drawHelix };
  ctx.restore();
}

