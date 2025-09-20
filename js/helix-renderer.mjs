/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layer order (furthest to nearest):
    1. Vesica field (intersecting circles form the foundation)
    2. Tree-of-Life scaffold (ten sephirot plus twenty-two calm paths)
    3. Fibonacci curve (static golden spiral polyline)
    4. Double-helix lattice (two phase-shifted strands with steady crossbars)

  ND-safe design:
    - No animation; geometry paints once to keep sensory load gentle.
    - Muted contrast with readable ink values avoids harsh flashing.
    - Pure helpers make it easy to audit how lore-specific numbers are used.
*/

const DEFAULT_PALETTE = {
  bg: "#0b0b12",
  ink: "#e8e8f0",
  layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
};

const DEFAULT_NUM = {
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  TWENTYTWO: 22,
  THIRTYTHREE: 33,
  NINETYNINE: 99,
  ONEFORTYFOUR: 144
};

/**
 * Render the full static helix visualization onto a canvas context.
 *
 * Draws four non-animated layers (vesica field, Tree-of-Life scaffold, Fibonacci curve, double-helix lattice)
 * in back-to-front order using normalized options.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D drawing context; function returns immediately if falsy.
 * @param {Object} [opts] - Optional rendering settings. Width, height, palette, and numerology (NUM) are sanitized via normalizeOptions and defaulted when omitted.
 */
export function renderHelix(ctx, opts = {}) {
  if (!ctx) return;
  const { width, height, palette, NUM } = normalizeOptions(opts);

  fillBackground(ctx, width, height, palette.bg);
  drawVesicaField(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacciCurve(ctx, width, height, palette.layers[3], NUM);
  drawHelixLattice(ctx, width, height, palette.layers[4], palette.layers[5], palette.ink, NUM);
}

/**
 * Normalize and sanitize renderer options into a canonical shape.
 *
 * Accepts a partial options object and returns { width, height, palette, NUM }
 * with sensible defaults applied. Numeric width/height fall back to 1440x900
 * when not finite; palette and numerology are normalized via the module's
 * palette and numerology helpers.
 *
 * @param {Object} opts - Partial options that may contain `width`, `height`, `palette`, and `NUM`.
 * @return {{width:number, height:number, palette:Object, NUM:Object}} Normalized options ready for rendering.
 */
function normalizeOptions(opts) {
  const width = Number.isFinite(opts.width) ? opts.width : 1440;
  const height = Number.isFinite(opts.height) ? opts.height : 900;
  const palette = ensurePalette(opts.palette);
  const NUM = ensureNumerology(opts.NUM);
  return { width, height, palette, NUM };
}

/**
 * Ensure a complete palette object with `bg`, `ink`, and exactly six layer colors by filling any missing values from DEFAULT_PALETTE.
 * @param {object} [palette] - Optional partial palette; may include `bg`, `ink`, and `layers` (array of color strings).
 * @return {{bg:string, ink:string, layers:string[]}} Normalized palette where `layers` is an array of six colors.
 */
function ensurePalette(palette) {
  if (!palette) return { ...DEFAULT_PALETTE };
  const bg = palette.bg || DEFAULT_PALETTE.bg;
  const ink = palette.ink || DEFAULT_PALETTE.ink;
  const layers = Array.isArray(palette.layers) ? palette.layers.slice(0, 6) : [];
  while (layers.length < 6) {
    layers.push(DEFAULT_PALETTE.layers[layers.length]);
  }
  return { bg, ink, layers };
}

/**
 * Return a numerology object based on DEFAULT_NUM with any finite numeric overrides from the given input.
 *
 * Copies DEFAULT_NUM and then replaces keys with values from `input` only when `input[key]` is a finite number.
 * The function never mutates DEFAULT_NUM and always returns a complete numerology object (the copy with applied overrides).
 *
 * @param {Object} [input] - Optional partial numerology overrides; only finite numeric properties are applied.
 * @return {Object} A numerology object derived from DEFAULT_NUM with applied finite numeric overrides.
 */
function ensureNumerology(input) {
  const safe = { ...DEFAULT_NUM };
  if (!input) return safe;
  for (const key of Object.keys(safe)) {
    if (Number.isFinite(input[key])) {
      safe[key] = input[key];
    }
  }
  return safe;
}

/**
 * Fill the entire canvas with a solid color while preserving the canvas state.
 *
 * @param {number} width - Width of the area to fill, in pixels.
 * @param {number} height - Height of the area to fill, in pixels.
 * @param {string|CanvasGradient|CanvasPattern} color - Any valid canvas fillStyle value.
 */
function fillBackground(ctx, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

/**
 * Draws a static field of paired (vesica-style) circles across the canvas to establish depth.
 *
 * Renders a grid of horizontally offset circle pairs computed from canvas size and numerology constants.
 *
 * @param {string|CanvasGradient|CanvasPattern} color - Stroke style used for the circle outlines.
 * @param {object} NUM - Numerology constants (see DEFAULT_NUM) that control grid density and radii; used by createVesicaCenters to compute centers, radius, and offsets.
 */
function drawVesicaField(ctx, width, height, color, NUM) {
  const centers = createVesicaCenters(width, height, NUM);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.7;

  centers.forEach(({ cx, cy, radius, offset }) => {
    drawCirclePair(ctx, cx, cy, radius, offset);
  });

  ctx.restore();
}

/**
 * Build a centered grid of vesica center positions and radii for the vesica field.
 *
 * The grid has NUM.SEVEN columns and NUM.NINE rows, centered on (width/2, height/2).
 * Each cell provides the circle radius and a horizontal offset used to draw a pair
 * of overlapping circles (the "vesica") for that cell.
 *
 * @param {number} width - Canvas width in pixels.
 * @param {number} height - Canvas height in pixels.
 * @param {Object} NUM - Numerology constants object (expects numeric properties like NINE, THREE, SEVEN).
 * @return {Array<{cx:number, cy:number, radius:number, offset:number}>} Array of center descriptors:
 *   - cx, cy: center coordinates in pixels
 *   - radius: circle radius in pixels (min(width,height) / NUM.NINE)
 *   - offset: horizontal offset for the paired circles (radius / NUM.THREE)
 */
function createVesicaCenters(width, height, NUM) {
  const radius = Math.min(width, height) / NUM.NINE;
  const offset = radius / NUM.THREE;
  const horizontalStep = radius;
  const verticalStep = radius * (NUM.SEVEN / NUM.NINE);
  const columns = NUM.SEVEN;
  const rows = NUM.NINE;
  const centers = [];

  for (let r = -Math.floor(rows / 2); r <= Math.floor(rows / 2); r++) {
    for (let c = -Math.floor(columns / 2); c <= Math.floor(columns / 2); c++) {
      centers.push({
        cx: width / 2 + c * horizontalStep,
        cy: height / 2 + r * verticalStep,
        radius,
        offset
      });
    }
  }

  return centers;
}

/**
 * Draw two stroked circles horizontally offset from a central point.
 *
 * Draws a full (0 → 2π) stroked arc at (cx - offset, cy) and another at (cx + offset, cy)
 * using the canvas context's current strokeStyle/lineWidth. Does not save or restore canvas state.
 *
 * @param {number} cx - Center x coordinate around which the pair is positioned.
 * @param {number} cy - Center y coordinate for both circles.
 * @param {number} radius - Radius of each circle (expected positive).
 * @param {number} offset - Horizontal distance from `cx` to each circle's center.
 */
function drawCirclePair(ctx, cx, cy, radius, offset) {
  ctx.beginPath();
  ctx.arc(cx - offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * Render the Tree-of-Life scaffold: straight connecting paths and filled node discs.
 *
 * Draws a fixed set of nodes (positions from createTreeNodes) and straight-line edges
 * between them (from createTreePaths). Node radius is computed from canvas width
 * (minimum 3) using NUM.NINETYNINE. The function preserves and restores the canvas state.
 *
 * @param {number} width - Canvas width used to position nodes and compute node radius.
 * @param {number} height - Canvas height used to position nodes.
 * @param {string|CanvasPattern|CanvasGradient} pathColor - Stroke style for scaffold paths.
 * @param {string|CanvasPattern|CanvasGradient} nodeColor - Fill style for node discs.
 * @param {object} NUM - Numerology constants; NUM.NINETYNINE is used to compute node radius.
 */
function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, NUM) {
  const nodes = createTreeNodes(width, height, NUM);
  const paths = createTreePaths();
  const radius = Math.max(3, width / NUM.NINETYNINE);

  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";

  paths.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

/**
 * Generate 10 node positions for the Tree-of-Life scaffold on the canvas.
 *
 * Positions are returned as objects with pixel coordinates { x, y } arranged
 * roughly vertically around the canvas center with horizontal spread. Vertical
 * spacing and horizontal offsets are scaled using values from the provided
 * numerology (`NUM`) so the layout adapts to different canvas sizes.
 *
 * @param {number} width - Canvas width in pixels.
 * @param {number} height - Canvas height in pixels.
 * @param {Object} NUM - Numerology constants used to scale spacing (expects at least ONEFORTYFOUR and ELEVEN).
 * @return {Array<{x:number,y:number}>} An array of 10 node coordinate objects.
function createTreeNodes(width, height, NUM) {
  const unitY = height / NUM.ONEFORTYFOUR;
  const centerX = width / 2;
  const spread = width / NUM.ELEVEN;
  return [
    { x: centerX, y: unitY * 9 },
    { x: centerX + spread, y: unitY * 22 },
    { x: centerX - spread, y: unitY * 22 },
    { x: centerX + spread * 1.4, y: unitY * 44 },
    { x: centerX - spread * 1.4, y: unitY * 44 },
    { x: centerX, y: unitY * 55 },
    { x: centerX + spread, y: unitY * 77 },
    { x: centerX - spread, y: unitY * 77 },
    { x: centerX, y: unitY * 99 },
    { x: centerX, y: unitY * 126 }
  ];
}

/**
 * Return the fixed set of edges (index pairs) that define the Tree-of-Life scaffold.
 *
 * This function provides a hard-coded list of 23 connections between the 10 nodes
 * produced by `createTreeNodes`. Each entry is a two-element array [a, b]
 * representing an undirected edge between node indices `a` and `b`.
 *
 * @return {number[][]} Array of index pairs for node connections (e.g., [0,1]).
 */
function createTreePaths() {
  return [
    [0, 1], [0, 2], [1, 2],
    [1, 3], [2, 4], [3, 4],
    [3, 5], [4, 5], [1, 5], [2, 5],
    [3, 6], [4, 7], [5, 6], [5, 7],
    [6, 7], [6, 8], [7, 8],
    [6, 9], [7, 9], [8, 9],
    [2, 3], [1, 4]
  ];
}

/**
 * Render a static polyline approximating a golden-spiral (Fibonacci-like) curve.
 *
 * Generates sample points via createFibonacciPoints(...) and strokes a single continuous path.
 *
 * @param {number} width - Canvas width used to center and scale the curve.
 * @param {number} height - Canvas height used to center and scale the curve.
 * @param {string} color - Stroke color for the curve.
 * @param {Object} NUM - Numerology constants that control scale and sampling (e.g., NINE, THREE, SEVEN, TWENTYTWO, NINETYNINE).
 */
function drawFibonacciCurve(ctx, width, height, color, NUM) {
  const points = createFibonacciPoints(width, height, NUM);
  if (points.length < 2) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  ctx.restore();
}

/**
 * Generate sample points that trace a golden-ratio–scaled spiral approximating a Fibonacci/golden spiral.
 *
 * Produces (NUM.NINETYNINE + 1) {x,y} points centered at (width/2, height/2). Radius grows exponentially with
 * angle using the golden ratio (phi); theta ranges linearly from 0 to maxTheta, where maxTheta and the growth
 * scaling are derived from fields on the NUM object.
 *
 * @param {number} width - Canvas width in pixels.
 * @param {number} height - Canvas height in pixels.
 * @param {object} NUM - Numerology constants used to compute scale and sampling. Expected numeric fields:
 *   NUM.NINE, NUM.THREE, NUM.SEVEN, NUM.TWENTYTWO, NUM.NINETYNINE.
 * @return {Array<{x:number,y:number}>} Array of points describing the spiral, in drawing coordinate space.
 */
function createFibonacciPoints(width, height, NUM) {
  const centerX = width / 2;
  const centerY = height / 2;
  const phi = (1 + Math.sqrt(5)) / 2;
  const baseRadius = Math.min(width, height) / NUM.NINE;
  const maxTheta = Math.PI * (NUM.THREE + NUM.SEVEN / NUM.TWENTYTWO);
  const steps = NUM.NINETYNINE;
  const scaleDivisor = Math.PI * (NUM.TWENTYTWO / NUM.SEVEN);
  const points = [];

  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * maxTheta;
    const growth = Math.pow(phi, theta / scaleDivisor);
    const radius = baseRadius * growth;
    const x = centerX + radius * Math.cos(theta);
    const y = centerY - radius * Math.sin(theta);
    points.push({ x, y });
  }

  return points;
}

/**
 * Render a static double-helix lattice: two interlaced strands with connecting rungs.
 *
 * Draws two polyline strands and a set of short rung segments onto the provided 2D canvas
 * context using the supplied colors. The canvas state is saved and restored by the function.
 *
 * @param {number} width - Canvas width used to generate helix geometry.
 * @param {number} height - Canvas height used to generate helix geometry.
 * @param {string} strandColorA - CSS color for the first strand.
 * @param {string} strandColorB - CSS color for the second strand.
 * @param {string} rungColor - CSS color for the rungs between strands.
 * @param {object} NUM - Numerology constants object controlling geometry sampling and scaling.
 */
function drawHelixLattice(ctx, width, height, strandColorA, strandColorB, rungColor, NUM) {
  const geometry = createHelixGeometry(width, height, NUM);

  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.strokeStyle = strandColorA;
  ctx.lineWidth = 2;
  drawPolyline(ctx, geometry.strandA);

  ctx.strokeStyle = strandColorB;
  ctx.lineWidth = 2;
  drawPolyline(ctx, geometry.strandB);

  ctx.strokeStyle = rungColor;
  ctx.lineWidth = 1.2;
  geometry.rungs.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  });

  ctx.restore();
}

/**
 * Build geometry for a static double-helix lattice scaled to the given canvas size.
 *
 * Returns sampled points for two interlaced strands and paired rungs positioned between them.
 *
 * @param {number} width - Canvas width used to compute horizontal amplitude and center.
 * @param {number} height - Canvas height used to compute vertical span (top/bottom).
 * @param {object} NUM - Numerology constants object supplying integer divisors and counts.
 *                       Required keys: THIRTYTHREE (segment samples), TWENTYTWO (rung samples),
 *                       NINE, SEVEN (used to compute vertical/top offsets and amplitude).
 * @return {{ strandA: Array<{x:number,y:number}>, strandB: Array<{x:number,y:number}>, rungs: Array<[ {x:number,y:number}, {x:number,y:number} ] }}
 *         strandA / strandB are ordered sample points along each helix; rungs is an array of paired points [a,b]
 *         representing short cross-links between corresponding positions on the two strands.
 */
function createHelixGeometry(width, height, NUM) {
  const segmentCount = NUM.THIRTYTHREE;
  const rungCount = NUM.TWENTYTWO;
  const top = height / NUM.NINE;
  const bottom = height - top;
  const amplitude = (width / NUM.THIRTYTHREE) * (NUM.SEVEN / NUM.NINE);
  const strandA = [];
  const strandB = [];
  const rungs = [];

  for (let i = 0; i <= segmentCount; i++) {
    const t = i / segmentCount;
    strandA.push(calcHelixPoint(t, 0, width, top, bottom, amplitude, NUM));
    strandB.push(calcHelixPoint(t, Math.PI, width, top, bottom, amplitude, NUM));
  }

  for (let i = 0; i <= rungCount; i++) {
    const t = i / rungCount;
    const a = calcHelixPoint(t, 0, width, top, bottom, amplitude, NUM);
    const b = calcHelixPoint(t, Math.PI, width, top, bottom, amplitude, NUM);
    rungs.push([a, b]);
  }

  return { strandA, strandB, rungs };
}

/**
 * Compute a point on a vertical helix-like strand at progress t.
 *
 * t is treated as a normalized progress (0–1) from top to bottom; phase is an angular offset in radians.
 *
 * @param {number} t - Normalized position along the strand (0 = top, 1 = bottom).
 * @param {number} phase - Phase offset in radians applied to the sinusoidal horizontal oscillation.
 * @param {number} width - Canvas width used to center the helix horizontally.
 * @param {number} top - Y coordinate for the top of the helix.
 * @param {number} bottom - Y coordinate for the bottom of the helix.
 * @param {number} amplitude - Horizontal amplitude (in pixels) of the sinusoidal oscillation.
 * @param {object} NUM - Numerology constants object; this function uses NUM.THREE to determine oscillation count.
 * @returns {{x: number, y: number}} Point with x and y coordinates for the helix at progress t.
 */
function calcHelixPoint(t, phase, width, top, bottom, amplitude, NUM) {
  const y = top + (bottom - top) * t;
  const oscillations = NUM.THREE;
  const angle = t * Math.PI * oscillations + phase;
  const x = width / 2 + Math.sin(angle) * amplitude;
  return { x, y };
}

/**
 * Draws a continuous stroked polyline on the provided 2D canvas context connecting an ordered array of points.
 *
 * No-op if the points array is empty.
 *
 * @param {{x:number,y:number}[]} points - Ordered list of points with numeric `x` and `y`.
 */
function drawPolyline(ctx, points) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}
