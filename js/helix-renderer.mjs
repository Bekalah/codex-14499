/*
  helix-renderer.mjs
  ND-safe static renderer for the layered cosmology in Codex 144:99.

  Layer order (rendered back to front):
    1. Vesica field (intersecting circles ground the space).
    2. Tree-of-Life scaffold (ten sephirot nodes plus twenty-two calm paths).
    3. Fibonacci curve (static golden spiral polyline).
    4. Double-helix lattice (two phase-shifted strands with steady crossbars).

  ND-safe commitments:
    - No animation or timers; everything renders in a single synchronous pass.
    - Calm palette with readable contrast to avoid sensory overload.
    - Small pure helper functions so the cosmology remains lore-safe and auditable.
*/

const DEFAULT_DIMENSIONS = { width: 1440, height: 900 };

const DEFAULT_PALETTE = {
  bg: '#0b0b12',
  ink: '#e8e8f0',
  layers: ['#b1c7ff', '#89f7fe', '#a0ffa1', '#ffd27f', '#f5a3ff', '#d0d0e6']
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
 * Render the full static helix composition onto a 2D canvas context.
 *
 * Normalizes options, clears and fills the canvas background, then draws the four
 * layered elements (vesica field, Tree of Life scaffold, Fibonacci curve, and
 * double-helix lattice) in a single synchronous pass. Exits silently if `ctx`
 * is falsy.
 *
 * @param {CanvasRenderingContext2D} ctx - Destination 2D canvas context (required).
 * @param {Object} [opts] - Optional render configuration forwarded to normalizeOptions.
 *   Recognized fields include `width`, `height`, `palette`, and `NUM`; each will be
 *   merged with safe defaults by normalizeOptions.
 */
export function renderHelix(ctx, opts = {}) {
  if (!ctx) return;

  const { width, height, palette, NUM } = normalizeOptions(opts);

  ctx.save();
  prepareCanvas(ctx, width, height, palette.bg);
  drawVesicaField(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], palette.ink, NUM);
  drawFibonacciCurve(ctx, width, height, palette.layers[3], NUM);
  drawHelixLattice(ctx, width, height, palette.layers[4], palette.layers[5], palette.ink, NUM);
  ctx.restore();
}

/**
 * Reset the drawing state, clear the canvas, and fill it with a background color.
 *
 * This saves and restores the canvas state, resets the transform to identity,
 * clears the rectangle [0,0,width,height], and fills that area with `bgColor`.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context.
 * @param {number} width - Canvas width in pixels; area cleared/filled is [0,0,width,height].
 * @param {number} height - Canvas height in pixels.
 * @param {string} bgColor - CSS color used to fill the background.
 */
function prepareCanvas(ctx, width, height, bgColor) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

/**
 * Render a grid of overlapping circles (a vesica piscis field) across the canvas.
 *
 * Draws two vertically offset circles per grid cell to create gentle vesica overlaps.
 * Stroke alpha and line width are scaled to the canvas size using the provided numerology
 * constants. Uses the helper drawCircle for each circle; no value is returned.
 *
 * @param {number} width - Canvas width in pixels.
 * @param {number} height - Canvas height in pixels.
 * @param {string} color - Stroke color (any valid CSS color string) for the circles.
 * @param {Object} NUM - Numerology constants used to compute grid dimensions, radius, and offsets
 *                       (expected to include properties like ONEFORTYFOUR, NINE, SEVEN, THREE).
 */
function drawVesicaField(ctx, width, height, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = Math.max(1.25, Math.min(width, height) / NUM.ONEFORTYFOUR);

  const columns = NUM.NINE;
  const rows = NUM.SEVEN;
  const xSpacing = width / (columns + 1);
  const ySpacing = height / (rows + 1);
  const radius = Math.min(xSpacing, ySpacing) * (NUM.THREE / (NUM.NINE - NUM.SEVEN)); // 3 / 2 keeps vesica overlap gentle.
  const verticalOffset = (radius / NUM.THREE) * (NUM.NINE - NUM.SEVEN); // radius * 2/3 using sacred numbers.

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const cx = xSpacing * (col + 1);
      const cy = ySpacing * (row + 1);
      drawCircle(ctx, cx, cy, radius);
      // Offset circle creates the vesica piscis overlap for layered depth.
      drawCircle(ctx, cx, cy + verticalOffset, radius);
    }
  }

  ctx.restore();
}

/**
 * Draws a Tree-of-Life scaffold: ten sephirot positioned on seven vertical levels with twenty-two interconnecting paths.
 *
 * Computes node positions from the supplied width/height, scales node radius and spacing using values from `NUM`,
 * renders connecting lines using `pathColor` (at ~60% opacity), then draws filled sephirot using `nodeColor`
 * with outlines stroked in `inkColor`. Canvas state is saved and restored; the function mutates the provided
 * 2D context only by drawing.
 *
 * @param {Object} NUM - Numerology constants used to derive spacing and radii (e.g., SEVEN, THREE, ELEVEN, TWENTYTWO, THIRTYTHREE).
function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, inkColor, NUM) {
  ctx.save();

  const yMargin = height / NUM.SEVEN;
  const levelCount = NUM.THREE + NUM.THREE; // six intervals create seven vertical levels.
  const ySpacing = (height - yMargin * 2) / levelCount;
  const xCenter = width / 2;
  const xMajor = width / NUM.THREE;
  const xMinor = xMajor * (NUM.SEVEN / NUM.ELEVEN);
  const xGentle = xMajor * (NUM.NINE / NUM.TWENTYTWO);
  const nodeRadius = Math.min(width, height) / (NUM.THIRTYTHREE + NUM.ELEVEN);

  const layout = [
    { key: 'kether', level: 0, offset: 0 },
    { key: 'chokmah', level: 1, offset: xMajor / 2 },
    { key: 'binah', level: 1, offset: -xMajor / 2 },
    { key: 'chesed', level: 2, offset: xMinor },
    { key: 'geburah', level: 2, offset: -xMinor },
    { key: 'tiphareth', level: 3, offset: 0 },
    { key: 'netzach', level: 4, offset: xGentle },
    { key: 'hod', level: 4, offset: -xGentle },
    { key: 'yesod', level: 5, offset: 0 },
    { key: 'malkuth', level: 6, offset: 0 }
  ];

  const nodes = layout.map(node => ({
    key: node.key,
    x: xCenter + node.offset,
    y: yMargin + node.level * ySpacing
  }));

  const nodeLookup = new Map(nodes.map(n => [n.key, n]));

  const treePaths = [
    ['kether', 'chokmah'],
    ['kether', 'binah'],
    ['kether', 'tiphareth'],
    ['chokmah', 'binah'],
    ['chokmah', 'chesed'],
    ['chokmah', 'tiphareth'],
    ['binah', 'geburah'],
    ['binah', 'tiphareth'],
    ['chesed', 'geburah'],
    ['chesed', 'tiphareth'],
    ['chesed', 'netzach'],
    ['geburah', 'tiphareth'],
    ['geburah', 'hod'],
    ['tiphareth', 'netzach'],
    ['tiphareth', 'hod'],
    ['tiphareth', 'yesod'],
    ['netzach', 'hod'],
    ['netzach', 'yesod'],
    ['netzach', 'malkuth'],
    ['hod', 'yesod'],
    ['hod', 'malkuth'],
    ['yesod', 'malkuth']
  ];

  ctx.strokeStyle = pathColor;
  ctx.lineWidth = Math.max(2, nodeRadius / NUM.SEVEN);
  ctx.globalAlpha = 0.6;

  treePaths.forEach(([fromKey, toKey]) => {
    const from = nodeLookup.get(fromKey);
    const to = nodeLookup.get(toKey);
    if (!from || !to) return;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  });

  ctx.globalAlpha = 1;
  ctx.fillStyle = nodeColor;
  ctx.strokeStyle = inkColor;
  ctx.lineWidth = Math.max(1.5, nodeRadius / NUM.ELEVEN);

  nodes.forEach(node => {
    drawCircle(ctx, node.x, node.y, nodeRadius, true);
  });

  ctx.restore();
}

/**
 * Draws a calm Fibonacci-style spiral as a stroked polyline onto the provided canvas context.
 *
 * The spiral is sampled as a sequence of points computed from the golden ratio (φ) and an angular
 * sweep derived from NUM constants. Stroke width, sampling count, center, and scale are all
 * computed from the canvas dimensions and values from the NUM object so the curve scales with the
 * canvas. The drawing uses the provided color and preserves/restores the canvas state.
 *
 * Note: This function mutates the drawing on `ctx` (strokes the polyline) but restores context
 * state before returning.
 *
 * @param {number} width - Canvas width used to compute center and scale.
 * @param {number} height - Canvas height used to compute center and scale.
 * @param {string} color - Stroke color for the spiral.
 * @param {Object} NUM - Numerology constants object (expects numeric properties used for scale,
 *   sampling, and positioning such as NINETYNINE, THIRTYTHREE, TWENTYTWO, NINE, SEVEN, ELEVEN,
 *   ONEFORTYFOUR).
 */
function drawFibonacciCurve(ctx, width, height, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.5, Math.min(width, height) / NUM.ONEFORTYFOUR);
  ctx.globalAlpha = 0.85;

  const phi = (1 + Math.sqrt(5)) / 2;
  const sampleCount = Math.max(NUM.NINETYNINE, 2);
  const sweep = Math.PI * (NUM.THIRTYTHREE / NUM.TWENTYTWO); // 1.5 turns for golden growth.
  const centerX = width * (NUM.NINE / NUM.TWENTYTWO);
  const centerY = height * (NUM.SEVEN / NUM.ELEVEN);
  const scale = Math.min(width, height) / NUM.NINE;

  ctx.beginPath();
  for (let i = 0; i < sampleCount; i += 1) {
    const t = i / (sampleCount - 1);
    const theta = t * sweep;
    const radius = scale * Math.pow(phi, theta / Math.PI);
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

/**
 * Render a double-helix lattice with two sine-based strands and evenly spaced crossbars.
 *
 * Draws two intertwined helix strands (strandA and strandB) down the canvas and renders
 * crossbars ("rungs") connecting the strands at fixed intervals to create a static lattice.
 * Geometry (margins, amplitude, frequency, steps, and counts) is driven by the provided NUM
 * numerology object to keep proportions consistent across canvas sizes.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D rendering context to draw into.
 * @param {number} width - Canvas width in pixels.
 * @param {number} height - Canvas height in pixels.
 * @param {string} strandAColor - CSS color for the first helix strand.
 * @param {string} strandBColor - CSS color for the second helix strand.
 * @param {string} rungColor - CSS color for the crossbars between strands.
 * @param {Object} NUM - Numerology constants object (e.g., NUM.NINE, NUM.SEVEN, etc.) that parameterizes spacing, counts, and scales.
 */
function drawHelixLattice(ctx, width, height, strandAColor, strandBColor, rungColor, NUM) {
  ctx.save();

  const verticalMargin = height / NUM.NINE;
  const usableHeight = height - verticalMargin * 2;
  const amplitude = width / NUM.SEVEN;
  const waveFrequency = NUM.THREE; // three gentle twists down the canvas.
  const steps = Math.max(NUM.NINETYNINE, 12);
  const phaseShift = Math.PI / (NUM.NINE - NUM.SEVEN); // pi/2 using sacred subtraction.

  const strandA = traceHelix(strandAColor, 0);
  const strandB = traceHelix(strandBColor, phaseShift);

  // Crossbars keep the lattice layered without implying motion.
  ctx.strokeStyle = rungColor;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = Math.max(1.5, Math.min(width, height) / NUM.ONEFORTYFOUR);
  const rungCount = NUM.ELEVEN;
  for (let i = 0; i <= rungCount; i += 1) {
    const t = i / rungCount;
    const a = helixPoint(t, 0, width, verticalMargin, usableHeight, amplitude, waveFrequency);
    const b = helixPoint(t, phaseShift, width, verticalMargin, usableHeight, amplitude, waveFrequency);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();

  /**
   * Draws a single helix strand as a stroked polyline on the current canvas context.
   *
   * Iterates across the precomputed step count, samples points from `helixPoint` using
   * the provided phase offset, and strokes a continuous path through those points.
   * This function mutates the shared canvas context state (strokeStyle, globalAlpha,
   * lineWidth) and performs the actual drawing; it does not change or return geometry.
   *
   * @param {string} color - Stroke color for the strand (any valid CSS color).
   * @param {number} phase - Phase offset applied to the helix waveform (radians).
   * @returns {null} Always returns null.
   */
  function traceHelix(color, phase) {
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.85;
    ctx.lineWidth = Math.max(1.5, Math.min(width, height) / NUM.ONEFORTYFOUR);
    ctx.beginPath();
    for (let i = 0; i < steps; i += 1) {
      const t = i / (steps - 1);
      const point = helixPoint(t, phase, width, verticalMargin, usableHeight, amplitude, waveFrequency);
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }
    ctx.stroke();
    return null;
  }
}

/**
 * Compute a 2D canvas point on a sine-based helix strand for a given normalized position.
 *
 * t is treated as a normalized vertical parameter (0..1) mapping from top to bottom.
 * phase offsets the sine wave (radians). waveFrequency controls how many oscillations
 * occur over t (higher values produce more lateral waves). width, verticalMargin,
 * usableHeight, and amplitude are pixel measurements used to place the point on the canvas.
 *
 * @param {number} t - Normalized position along the strand (0 = top, 1 = bottom).
 * @param {number} phase - Phase offset for the sine wave, in radians.
 * @param {number} width - Canvas width in pixels (used to compute horizontal center).
 * @param {number} verticalMargin - Top margin in pixels where the strand starts.
 * @param {number} usableHeight - Vertical span in pixels the strand occupies.
 * @param {number} amplitude - Horizontal amplitude in pixels for the sine displacement.
 * @param {number} waveFrequency - Frequency multiplier controlling number of oscillations over t.
 * @return {{x: number, y: number}} A point in canvas coordinates for the helix at parameter t.
 */
function helixPoint(t, phase, width, verticalMargin, usableHeight, amplitude, waveFrequency) {
  const centerX = width / 2;
  const wave = Math.sin((waveFrequency * Math.PI * t) + phase);
  const x = centerX + wave * amplitude;
  const y = verticalMargin + usableHeight * t;
  return { x, y };
}

/**
 * Normalize and sanitize rendering options, returning concrete width, height, palette, and NUM.
 *
 * Ensures numeric width/height fall back to DEFAULT_DIMENSIONS when not finite, and produces
 * a validated palette and numerology object via ensurePalette and ensureNumerology.
 *
 * @param {Object} opts - Partial options supplied to the renderer (may be empty or incomplete).
 * @return {{width: number, height: number, palette: Object, NUM: Object}} Normalized configuration ready for rendering.
 */
function normalizeOptions(opts) {
  const width = Number.isFinite(opts.width) ? opts.width : DEFAULT_DIMENSIONS.width;
  const height = Number.isFinite(opts.height) ? opts.height : DEFAULT_DIMENSIONS.height;
  const palette = ensurePalette(opts.palette);
  const NUM = ensureNumerology(opts.NUM);
  return { width, height, palette, NUM };
}

/**
 * Normalize a palette object, ensuring background, ink, and exactly six layer colors.
 *
 * If `input` is not a plain object the function returns a copy of DEFAULT_PALETTE.
 * For a provided object it:
 * - uses `input.bg` and `input.ink` when they are strings, otherwise falls back to defaults;
 * - takes up to the default number of layer colors from `input.layers`, truncating extras;
 * - pads missing layer entries with the corresponding colors from DEFAULT_PALETTE so the
 *   returned `layers` array always matches DEFAULT_PALETTE.layers.length.
 *
 * @param {object|undefined|null} input - Partial palette to normalize (may contain `bg`, `ink`, `layers`).
 * @return {{bg: string, ink: string, layers: string[]}} Normalized palette with `bg`, `ink`, and a fixed-length `layers` array.
 */
function ensurePalette(input) {
  if (!input || typeof input !== 'object') {
    return {
      bg: DEFAULT_PALETTE.bg,
      ink: DEFAULT_PALETTE.ink,
      layers: [...DEFAULT_PALETTE.layers]
    };
  }

  const layers = Array.isArray(input.layers) ? input.layers.slice(0, DEFAULT_PALETTE.layers.length) : [];
  while (layers.length < DEFAULT_PALETTE.layers.length) {
    layers.push(DEFAULT_PALETTE.layers[layers.length]);
  }

  return {
    bg: typeof input.bg === 'string' ? input.bg : DEFAULT_PALETTE.bg,
    ink: typeof input.ink === 'string' ? input.ink : DEFAULT_PALETTE.ink,
    layers
  };
}

/**
 * Merge a partial numerology object with DEFAULT_NUM, returning a safe copy where only finite, non-zero numeric values replace defaults.
 *
 * If `input` is not an object, a copy of DEFAULT_NUM is returned. Properties on `input` that are non-finite, NaN, or zero are ignored.
 *
 * @param {Object} [input] - Partial numerology map whose numeric entries may override defaults.
 * @return {Object} A new numerology object containing validated values merged with DEFAULT_NUM.
 */
function ensureNumerology(input) {
  const safe = { ...DEFAULT_NUM };
  if (!input || typeof input !== 'object') return safe;
  Object.keys(safe).forEach(key => {
    const value = Number(input[key]);
    if (Number.isFinite(value) && value !== 0) {
      safe[key] = value;
    }
  });
  return safe;
}

/**
 * Draws a circle at the given center and radius using the context's current styles; optionally fills before stroking.
 *
 * Uses the canvas context's current fillStyle, strokeStyle, lineWidth, and globalAlpha. This function begins a new path and draws an arc but does not save/restore the context state or modify transforms.
 *
 * @param {number} x - X coordinate of the circle center.
 * @param {number} y - Y coordinate of the circle center.
 * @param {number} radius - Radius of the circle in canvas units.
 * @param {boolean} [fill=false] - If true, fills the circle then strokes its outline; if false, only strokes.
 */
function drawCircle(ctx, x, y, radius, fill = false) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  if (fill) {
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.stroke();
  }
}
