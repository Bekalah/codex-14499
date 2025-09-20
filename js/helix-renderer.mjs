/*
  helix-renderer.mjs
  ND-safe static renderer for the layered cosmology in Codex 144:99.

  Layer order (furthest to nearest):
    1. Vesica field (intersecting circles to ground the scene)
    2. Tree-of-Life scaffold (ten sephirot connected by twenty-two paths)
    3. Fibonacci curve (static golden spiral polyline)
    4. Double-helix lattice (paired strands with steady crossbars)

  All helpers are small pure functions and run once per render call.
  This honors the offline-first, trauma-informed protocol: no motion,
  gentle contrast, and clear layering comments explaining why.
  ND-safe static renderer for layered sacred geometry in Codex 144:99.

  Layers (rendered back-to-front):
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (ten sephirot, twenty-two paths)
    3) Fibonacci curve (golden spiral polyline)
    4) Double-helix lattice (two strands plus crossbars)

  ND-safe commitments:
    - No animation or timers; everything renders once per call.
    - Calm palette with readable contrast to avoid sensory overload.
    - Small, pure helpers so future adaptations stay lore-safe.
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

// Entry point: orchestrates the four layers in a single synchronous pass.
/**
 * Render a calm, ND-safe static composition of four layered elements onto a 2D canvas context.
 *
 * Draws four layers back-to-front: Vesica field, Tree-of-Life scaffold, Fibonacci curve, and a double-helix lattice.
 * The function performs a single static render (no animation or timers), normalizes palette and numerology via helpers,
 * and returns immediately if no canvas context is provided.
 *
 * @param {CanvasRenderingContext2D} ctx - Destination 2D canvas context (required).
 * @param {Object} [opts] - Optional render options.
 * @param {number} [opts.width=1440] - Canvas width in pixels.
 * @param {number} [opts.height=900] - Canvas height in pixels.
 * @param {Object} [opts.palette] - Palette input passed to ensurePalette; missing or invalid entries are replaced with defaults.
 * @param {Object} [opts.NUM] - Numeric constants passed to ensureNumerology; missing/invalid keys are filled from defaults.
 */
export function renderHelix(ctx, opts = {}) {
  if (!ctx) return;

  const width = typeof opts.width === "number" ? opts.width : 1440;
  const height = typeof opts.height === "number" ? opts.height : 900;
  const palette = ensurePalette(opts.palette);
  const NUM = ensureNumerology(opts.NUM);

  fillBackground(ctx, width, height, palette.bg);
  drawVesicaField(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], palette.ink, NUM);
  drawFibonacciCurve(ctx, width, height, palette.layers[3], NUM);
  drawHelixLattice(ctx, width, height, palette.layers[4], palette.layers[5], palette.ink, NUM);
}

// Validate palette input so missing data never blocks offline rendering.
function ensurePalette(palette) {
  const base = { ...DEFAULT_PALETTE };
  if (!palette) return base;

  const layers = Array.isArray(palette.layers) ? palette.layers.slice(0, 6) : [];
  while (layers.length < 6) {
    layers.push(base.layers[layers.length]);
  }

  return {
    bg: typeof palette.bg === "string" ? palette.bg : base.bg,
    ink: typeof palette.ink === "string" ? palette.ink : base.ink,
    layers
/**
 * Normalize an input palette into a calm, safe palette object.
 *
 * Returns a palette object guaranteed to have string `bg` and `ink` properties
 * and a `layers` array whose length matches DEFAULT_PALETTE.layers; any missing
 * or non-string entries are replaced with defaults from DEFAULT_PALETTE.
 *
 * @param {object|undefined} palette - Partial palette to sanitize. May include `bg`, `ink`, and `layers` (array of strings).
 * @return {{bg: string, ink: string, layers: string[]}} A sanitized palette safe for rendering.
 */
function ensurePalette(palette) {
  if (!palette || typeof palette !== "object") return { ...DEFAULT_PALETTE };

  const safe = {
    bg: typeof palette.bg === "string" ? palette.bg : DEFAULT_PALETTE.bg,
    ink: typeof palette.ink === "string" ? palette.ink : DEFAULT_PALETTE.ink,
    layers: []
  };

// Ensure numerology constants exist so geometry math stays predictable.
function ensureNumerology(NUM) {
  const safe = { ...DEFAULT_NUM };
  if (NUM && typeof NUM === "object") {
    for (const key of Object.keys(DEFAULT_NUM)) {
      if (Number.isFinite(NUM[key])) safe[key] = NUM[key];
    }
  }
  return safe;
}

  const sourceLayers = Array.isArray(palette.layers) ? palette.layers : [];
  for (let i = 0; i < DEFAULT_PALETTE.layers.length; i += 1) {
    const candidate = sourceLayers[i];
    safe.layers.push(typeof candidate === "string" ? candidate : DEFAULT_PALETTE.layers[i]);
  }

  return safe;
}

/**
 * Return a sanitized numerology object based on DEFAULT_NUM with safe numeric overrides.
 *
 * If `input` is an object, numeric keys present in it are coerced to Number and, when finite and non-zero,
 * replace the corresponding entries from DEFAULT_NUM. If `input` is falsy or not an object, a shallow copy
 * of DEFAULT_NUM is returned unchanged.
 *
 * @param {Object|undefined|null} input - Partial numerology values to override defaults (keys matching DEFAULT_NUM).
 * @return {Object} A new numerology object containing only DEFAULT_NUM keys with validated numeric overrides applied.
 */
function ensureNumerology(input) {
  const safe = { ...DEFAULT_NUM };
  if (!input || typeof input !== "object") return safe;

  for (const key of Object.keys(safe)) {
    const value = Number(input[key]);
    if (Number.isFinite(value) && value !== 0) {
      safe[key] = value;
    }
  }

  return safe;
}

/**
 * Fill the entire drawing surface with a solid background color.
 *
 * @param {number} width - Width in pixels of the area to fill.
 * @param {number} height - Height in pixels of the area to fill.
 * @param {string} color - CSS color string used to fill the background.
 */
function fillBackground(ctx, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// Layer 1: Vesica field. Intersecting circles provide depth without motion.
function drawVesicaField(ctx, width, height, color, NUM) {
  const cols = Math.max(1, NUM.NINE);
  const rows = Math.max(1, NUM.SEVEN);
  const stepX = width / (cols + 1);
  const stepY = height / (rows + 1);
  const radius = Math.min(stepX, stepY) * 0.75;
  const offset = radius / NUM.THREE;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = Math.max(1, Math.min(width, height) / NUM.NINETYNINE);

  for (let row = 1; row <= rows; row++) {
    const cy = stepY * row;
    for (let col = 1; col <= cols; col++) {
      const cx = stepX * col;
      drawCircle(ctx, cx - offset, cy, radius);
      drawCircle(ctx, cx + offset, cy, radius);
/**
 * Draws a static vesica field: a grid of horizontally paired, intersecting circles.
 *
 * The field is centered on the canvas and laid out back-to-front to provide
 * depth without animation. Circle sizing and grid spacing are derived from
 * the canvas dimensions and the provided numerology constants.
 *
 * @param {string} color - Stroke color for the circles.
 * @param {Object} NUM - Numerology constants object (expects numeric keys used here: `NINE`, `SEVEN`, `THREE`).
 */
function drawVesicaField(ctx, width, height, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;

  const radius = Math.min(width, height) / NUM.NINE;
  const horizontalStep = radius;
  const verticalStep = radius * (NUM.SEVEN / NUM.NINE);
  const offset = radius / NUM.THREE;
  const columns = NUM.SEVEN;
  const rows = NUM.NINE;

  for (let row = -Math.floor(rows / 2); row <= Math.floor(rows / 2); row += 1) {
    for (let col = -Math.floor(columns / 2); col <= Math.floor(columns / 2); col += 1) {
      const cx = width / 2 + col * horizontalStep;
      const cy = height / 2 + row * verticalStep;
      drawCirclePair(ctx, cx, cy, radius, offset);
    }
  }

  ctx.restore();
}

function drawCircle(ctx, cx, cy, radius) {
/**
 * Draw two horizontally offset stroked circles centered on a common y coordinate.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D canvas rendering context to draw into.
 * @param {number} cx - Central x coordinate around which the pair is placed.
 * @param {number} cy - Y coordinate for both circle centers.
 * @param {number} radius - Radius of each circle.
 * @param {number} offset - Horizontal distance from `cx` to each circle center (one at cx - offset, the other at cx + offset).
 */
function drawCirclePair(ctx, cx, cy, radius, offset) {
  ctx.beginPath();
  ctx.arc(cx - offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

// Layer 2: Tree-of-Life scaffold. Ten nodes, twenty-two calm connective paths.
function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, ink, NUM) {
  const unitY = height / NUM.ONEFORTYFOUR;
  const unitX = width / NUM.ONEFORTYFOUR;
  const centerX = width / 2;

  // Positions derive from numerology units to honor the cosmology.
  const nodes = [
    { name: "kether", x: centerX, y: unitY * NUM.NINE },
    { name: "chokmah", x: centerX + unitX * NUM.TWENTYTWO, y: unitY * NUM.TWENTYTWO },
    { name: "binah", x: centerX - unitX * NUM.TWENTYTWO, y: unitY * NUM.TWENTYTWO },
    { name: "chesed", x: centerX + unitX * (NUM.THIRTYTHREE - NUM.THREE), y: unitY * (NUM.THIRTYTHREE + NUM.THREE) },
    { name: "geburah", x: centerX - unitX * (NUM.THIRTYTHREE - NUM.THREE), y: unitY * (NUM.THIRTYTHREE + NUM.THREE) },
    { name: "tiphereth", x: centerX, y: unitY * (NUM.ONEFORTYFOUR / 2) },
    { name: "netzach", x: centerX + unitX * NUM.TWENTYTWO, y: unitY * NUM.NINETYNINE },
    { name: "hod", x: centerX - unitX * NUM.TWENTYTWO, y: unitY * NUM.NINETYNINE },
    { name: "yesod", x: centerX, y: unitY * (NUM.NINETYNINE + NUM.ELEVEN) },
    { name: "malkuth", x: centerX, y: unitY * (NUM.ONEFORTYFOUR - NUM.ELEVEN) }
/**
 * Render a static, ND-safe "Tree of Life" scaffold: straight connector paths and filled node discs.
 *
 * The function computes a fixed set of node positions relative to canvas size and draws the
 * connecting straight-line paths and circular nodes. Intended to be deterministic and non-animated.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D canvas rendering context to draw into.
 * @param {number} width - Canvas width in pixels; used to compute horizontal spacing and node radius.
 * @param {number} height - Canvas height in pixels; used to compute vertical positions.
 * @param {string} pathColor - Stroke color used for the connecting paths.
 * @param {string} nodeColor - Fill color used for the node discs.
 * @param {Object} NUM - Numerology constants (expects numeric fields like ONEFORTYFOUR, ELEVEN, NINETYNINE).
 */
function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, NUM) {
  const baseY = height / NUM.ONEFORTYFOUR;
  const centerX = width / 2;
  const spread = width / NUM.ELEVEN;

  const nodes = [
    { x: centerX, y: baseY * 9 },
    { x: centerX + spread, y: baseY * 22 },
    { x: centerX - spread, y: baseY * 22 },
    { x: centerX + spread * 1.4, y: baseY * 44 },
    { x: centerX - spread * 1.4, y: baseY * 44 },
    { x: centerX, y: baseY * 55 },
    { x: centerX + spread, y: baseY * 77 },
    { x: centerX - spread, y: baseY * 77 },
    { x: centerX, y: baseY * 99 },
    { x: centerX, y: baseY * 126 }
  ];

  const paths = [
    [0, 1], [0, 2], [0, 5],
    [1, 2], [1, 3], [1, 5], [1, 6],
    [2, 4], [2, 5], [2, 7],
    [3, 4], [3, 5], [3, 6],
    [4, 5], [4, 7],
    [5, 6], [5, 7], [5, 8],
    [6, 8], [7, 8],
    [7, 9], [8, 9]
  ];

  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.globalAlpha = 0.45;
  ctx.lineWidth = Math.max(1.5, Math.min(width, height) / (NUM.ONEFORTYFOUR / 2));

  for (const [a, b] of paths) {
    const start = nodes[a];
    const end = nodes[b];
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  paths.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.fillStyle = nodeColor;
  ctx.strokeStyle = ink;
  ctx.lineWidth = Math.max(1, Math.min(width, height) / NUM.ONEFORTYFOUR);

  const nodeRadius = Math.max(4, Math.min(width, height) / NUM.TWENTYTWO);
  for (const node of nodes) {
  const radius = Math.max(3, width / NUM.NINETYNINE);
  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

// Layer 3: Fibonacci curve. Static golden spiral sampled with gentle spacing.
function drawFibonacciCurve(ctx, width, height, color, NUM) {
  const centerX = width * 0.66;
  const centerY = height * 0.62;
  const baseRadius = Math.min(width, height) / NUM.THREE;
  const phi = (1 + Math.sqrt(5)) / 2; // Golden Ratio constant (phi)
  const growth = Math.log(phi) / (Math.PI / 2);
  const turns = NUM.THREE; // three turns keep the curve legible and calm.
  const steps = NUM.NINETYNINE;
  const maxTheta = turns * Math.PI * 2;
  const step = maxTheta / steps;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.75;
  ctx.lineWidth = Math.max(1.5, Math.min(width, height) / NUM.ONEFORTYFOUR);
  ctx.beginPath();

  for (let i = 0; i <= steps; i++) {
    const theta = i * step;
    const radius = baseRadius * Math.exp(growth * theta);
    const x = centerX + radius * Math.cos(theta);
    const y = centerY - radius * Math.sin(theta);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
  ctx.restore();
}

// Layer 4: Double-helix lattice. Two phase-shifted strands with calm crossbars.
function drawHelixLattice(ctx, width, height, strandAColor, strandBColor, rungColor, NUM) {
  const steps = NUM.ONEFORTYFOUR;
  const turns = NUM.THREE;
  const centerX = width / 2;
  const amplitude = width / NUM.ELEVEN;
  const yStep = height / steps;

  const strands = [
    { phase: 0, color: strandAColor, points: [] },
    { phase: Math.PI, color: strandBColor, points: [] }
  ];

  for (const strand of strands) {
    ctx.save();
    ctx.strokeStyle = strand.color;
    ctx.globalAlpha = 0.85;
    ctx.lineWidth = Math.max(1.5, Math.min(width, height) / NUM.NINETYNINE);
    ctx.beginPath();

    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * (Math.PI * 2 * turns) + strand.phase;
      const y = i * yStep;
      const x = centerX + Math.sin(theta) * amplitude;
      strand.points.push({ x, y });
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
    ctx.restore();
  }

  // Crossbars: evenly spaced rungs tie the strands together without motion.
  ctx.save();
  ctx.strokeStyle = rungColor;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = Math.max(1, Math.min(width, height) / NUM.ONEFORTYFOUR);

  const rungCount = NUM.TWENTYTWO;
  const stride = Math.floor(steps / (rungCount + 1));
  for (let i = stride; i < strands[0].points.length && i < strands[1].points.length; i += stride) {
    const a = strands[0].points[i];
    const b = strands[1].points[i];
/**
 * Draws a static, calm Fibonacci (golden) spiral sampled as a stroked polyline.
 *
 * Renders a spiraling curve centered near the upper-left third of the canvas using
 * the golden ratio; the curve is sampled from theta = 0 to theta = π * NUM.SEVEN
 * in steps of π / NUM.THIRTYTHREE and stroked with the provided color. The drawing
 * mutates the provided canvas context (no return value).
 *
 * @param {number} width - Canvas width in pixels.
 * @param {number} height - Canvas height in pixels.
 * @param {string} color - Stroke color used for the spiral.
 * @param {Object} NUM - Numerology constants object; expected numeric keys used:
 *   THREE, SEVEN, NINETYNINE, THIRTYTHREE (controls center, scale and sampling).
 */
function drawFibonacciCurve(ctx, width, height, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const centerX = (width / NUM.THREE) * 2;
  const centerY = height / NUM.THREE;
  const scale = (Math.min(width, height) / NUM.NINETYNINE) * NUM.SEVEN;
  const maxTheta = Math.PI * NUM.SEVEN;
  const thetaStep = Math.PI / NUM.THIRTYTHREE;

  ctx.beginPath();
  for (let theta = 0; theta <= maxTheta; theta += thetaStep) {
    const radius = scale * Math.pow(goldenRatio, theta / (Math.PI / 2));
    const x = centerX + radius * Math.cos(theta);
    const y = centerY + radius * Math.sin(theta);
    if (theta === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws a static double-helix lattice (two strands with crossbars) onto a 2D canvas.
 *
 * Renders two sine-like strands and vertical rungs between them. This layer is intentionally static (no animations) and uses NUM constants to determine step count, amplitude, and frequency. If `strandColorB` is falsy, it falls back to `strandColorA`.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D rendering context to draw into.
 * @param {number} width - Canvas width in pixels.
 * @param {number} height - Canvas height in pixels.
 * @param {string} strandColorA - Stroke color for the first helix strand.
 * @param {string} [strandColorB] - Stroke color for the second strand; defaults to `strandColorA` when not provided.
 * @param {string} rungColor - Stroke color for the crossbars (rungs) between strands.
 * @param {object} NUM - Numerology constants object (expects TWENTYTWO, THIRTYTHREE, ELEVEN).
 */
function drawHelixLattice(ctx, width, height, strandColorA, strandColorB, rungColor, NUM) {
  ctx.save();

  const steps = NUM.TWENTYTWO;
  const amplitude = height / NUM.THIRTYTHREE;
  const frequency = (Math.PI * NUM.ELEVEN) / width;
  const baseline = height * 0.65;

  drawHelixStrand(ctx, width, steps, amplitude, frequency, baseline, 0, strandColorA);
  drawHelixStrand(ctx, width, steps, amplitude, frequency, baseline, Math.PI, strandColorB || strandColorA);
  drawHelixRungs(ctx, width, steps, amplitude, frequency, baseline, rungColor);

  ctx.restore();
}

/**
 * Draws a single static helix strand as a smooth sine-based polyline across the given width.
 *
 * @param {number} width - Horizontal span (pixels) over which the strand is drawn.
 * @param {number} steps - Number of samples/segments; larger values produce a smoother curve.
 * @param {number} amplitude - Peak vertical displacement from the baseline (pixels).
 * @param {number} frequency - Angular frequency applied to the x coordinate (radians per pixel).
 * @param {number} baseline - Vertical centerline (pixels) around which the strand oscillates.
 * @param {number} phase - Phase offset (radians) applied to the sine wave.
 * @param {string} color - Stroke color used to draw the strand.
 */
function drawHelixStrand(ctx, width, steps, amplitude, frequency, baseline, phase, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  ctx.beginPath();
  for (let i = 0; i <= steps; i += 1) {
    const x = (width / steps) * i;
    const y = baseline + amplitude * Math.sin(frequency * x + phase);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

/**
 * Draws the vertical crossbars ("rungs") connecting two helix strands across the canvas.
 *
 * Renders a series of short vertical lines at every other step along the horizontal span. Each rung is drawn between the two strand y-positions computed as baseline + amplitude * sin(frequency * x + phase) with phases 0 and π so the rungs bridge opposite points of the two strands.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D canvas context to draw into.
 * @param {number} width - Total horizontal span (pixels) across which rungs are placed.
 * @param {number} steps - Number of divisions along the width; rungs are drawn at i = 0..steps in increments of 2.
 * @param {number} amplitude - Vertical amplitude used to compute strand displacement from the baseline.
 * @param {number} frequency - Frequency multiplier applied to the x position when computing the sine for strand y positions.
 * @param {number} baseline - Vertical center line (pixels) about which the two strands oscillate.
 * @param {string} color - Stroke color used for the rungs.
 */
function drawHelixRungs(ctx, width, steps, amplitude, frequency, baseline, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";

  for (let i = 0; i <= steps; i += 2) {
    const x = (width / steps) * i;
    const yA = baseline + amplitude * Math.sin(frequency * x);
    const yB = baseline + amplitude * Math.sin(frequency * x + Math.PI);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}
