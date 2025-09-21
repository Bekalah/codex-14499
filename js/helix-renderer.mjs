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
 * Render the complete calm helix composition onto a 2D canvas context.
 *
 * Normalizes options (dimensions, palette, numerology) and draws four layered
 * elements — vesica field, Tree of Life scaffold, Fibonacci curve, and
 * double-helix lattice — in a single synchronous pass. If `ctx` is falsy the
 * function returns without drawing.
 *
 * @param {Object} [opts] - Optional render configuration accepted by
 *   `normalizeOptions`. May include `width`, `height`, `palette`, and `NUM`;
 *   missing values are filled from defaults.
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
 * Reset the canvas state, clear its contents, and fill with a background color.
 *
 * Resets the transform to identity, clears the rectangle defined by width/height,
 * then fills that area with the provided CSS color.
 *
 * @param {number} width - Canvas width in pixels.
 * @param {number} height - Canvas height in pixels.
 * @param {string} bgColor - CSS color string used to fill the background.
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
 * Draws a grounding "vesica" field of overlapping circles across the canvas.
 *
 * Renders a grid of circle pairs (one slightly vertically offset from the other)
 * to produce repeated vesica piscis overlaps. The function preserves and
 * restores canvas state, sets a translucent stroke, and uses the provided
 * numerology constants to determine spacing, radius, and line width.
 *
 * @param {number} width - Canvas drawing width used to compute grid spacing.
 * @param {number} height - Canvas drawing height used to compute grid spacing.
 * @param {string} color - Stroke color applied to all circles.
 * @param {Object} NUM - Numerology constants object. Must include numeric keys used here:
 *   ONEFORTYFOUR, NINE, SEVEN, and THREE; these influence spacing, radius, and line width.
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
 * Draws a schematic Tree of Life scaffold onto the given canvas context.
 *
 * Renders ten sephirot nodes arranged across seven vertical levels and the
 * twenty-two canonical connective paths between them. Nodes are drawn as
 * filled circles with stroked outlines; paths are stroked lines. The drawing
 * is scaled and positioned to fit the provided width and height.
 *
 * @param {number} width - Canvas drawing width in pixels.
 * @param {number} height - Canvas drawing height in pixels.
 * @param {string} pathColor - CSS color for connective paths.
 * @param {string} nodeColor - CSS fill color for sephirot nodes.
 * @param {string} inkColor - CSS stroke color for node outlines.
 * @param {Object} NUM - Numerology constants used for layout (expected numeric
 *   properties include: THREE, SEVEN, NINE, ELEVEN, TWENTYTWO, THIRTYTHREE).
 */
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
 * Draws a calm, non-animated Fibonacci/golden-spiral polyline onto the provided canvas.
 *
 * Renders a stroked spiral approximating Fibonacci/golden growth using the golden ratio (phi).
 * The density, scale, center, and sweep of the curve are driven by the supplied numerology
 * constants (`NUM`). Sampling count is taken from `NUM.NINETYNINE` (minimum 2) and the sweep
 * produces roughly 1.5 turns. This function mutates the given canvas context state while
 * drawing and restores it before returning.
 *
 * Parameters:
 * - width, height: canvas dimensions used to compute center and scale.
 * - color: stroke color for the curve.
 * - NUM: numerology constants object (expected keys used here include ONEFORTYFOUR,
 *   NINETYNINE, THIRTYTHREE, TWENTYTWO, NINE, SEVEN, ELEVEN) that control line width,
 *   sample count, sweep fraction, and layout offsets.
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
 * Render a double-helix lattice with two colored strands and semi-transparent crossbars.
 *
 * Draws two phase-shifted sinusoidal strands down the canvas and a series of crossbars
 * between corresponding points to imply depth. The function mutates the provided 2D
 * rendering context (stroke/fill, transforms are saved/restored locally).
 *
 * @param {number} width - Canvas width in pixels.
 * @param {number} height - Canvas height in pixels.
 * @param {string} strandAColor - CSS color for the first helix strand.
 * @param {string} strandBColor - CSS color for the second helix strand.
 * @param {string} rungColor - CSS color for the crossbars (rungs) between strands.
 * @param {Object} NUM - Numerology constants used to derive layout. Required keys:
 *   - ONEFORTYFOUR: divisor to scale line width
 *   - THREE: wave frequency (number of twists)
 *   - SEVEN, NINE, ELEVEN, NINETYNINE: layout/step counts and spacing factors
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
   * Draws a stroked helix trace onto the surrounding canvas context.
   *
   * Renders a single phase-shifted helix strand by sampling helixPoint across the configured
   * step count and stroking a continuous polyline. Stroke appearance (alpha and line width)
   * is set based on canvas dimensions and numerology constants in the enclosing scope.
   *
   * @param {string} color - Stroke color for the helix strand (any valid CSS color).
   * @param {number} phase - Phase offset applied to the helix sampling function.
   * @returns {null} Always returns null; primary effect is drawing on the canvas context.
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
 * Compute a single (x,y) point on a sine-based helix curve.
 *
 * @param {number} t - Normalized vertical progress along the strand (0 = top, 1 = bottom).
 * @param {number} phase - Phase offset for the sine wave (radians).
 * @param {number} width - Total canvas width; used to compute the horizontal center.
 * @param {number} verticalMargin - Top offset for the helix drawing area.
 * @param {number} usableHeight - Vertical span available for the helix.
 * @param {number} amplitude - Horizontal amplitude of the sine wave.
 * @param {number} waveFrequency - Frequency multiplier controlling horizontal wave count over the strand.
 * @return {{x: number, y: number}} Cartesian coordinates of the helix point.
 */
function helixPoint(t, phase, width, verticalMargin, usableHeight, amplitude, waveFrequency) {
  const centerX = width / 2;
  const wave = Math.sin((waveFrequency * Math.PI * t) + phase);
  const x = centerX + wave * amplitude;
  const y = verticalMargin + usableHeight * t;
  return { x, y };
}

/**
 * Normalize and validate rendering options, returning a stable configuration object.
 *
 * Ensures numeric width/height fall back to DEFAULT_DIMENSIONS, runs palette through
 * ensurePalette, and numerology through ensureNumerology so callers receive a predictable
 * { width, height, palette, NUM } shape suitable for the renderer.
 *
 * @param {Object} opts - Partial options object supplied by callers (may be empty or partial).
 * @return {{width: number, height: number, palette: Object, NUM: Object}} Normalized configuration:
 *   - width, height: finite numbers (defaults from DEFAULT_DIMENSIONS when missing/invalid)
 *   - palette: validated palette object (result of ensurePalette)
 *   - NUM: validated numerology constants (result of ensureNumerology)
 */
function normalizeOptions(opts) {
  const width = Number.isFinite(opts.width) ? opts.width : DEFAULT_DIMENSIONS.width;
  const height = Number.isFinite(opts.height) ? opts.height : DEFAULT_DIMENSIONS.height;
  const palette = ensurePalette(opts.palette);
  const NUM = ensureNumerology(opts.NUM);
  return { width, height, palette, NUM };
}

/**
 * Normalize a palette object, ensuring background, ink, and a fixed-length layers array.
 *
 * If `input` is falsy or not an object, returns a copy of the default palette. For a partial
 * palette, `bg` and `ink` are taken when they are strings; `layers` is normalized to the same
 * length as DEFAULT_PALETTE.layers by truncating or filling missing entries from the defaults.
 *
 * @param {Object|undefined} input - Partial palette to normalize (may contain `bg`, `ink`, `layers`).
 * @return {{bg: string, ink: string, layers: string[]}} A palette object with validated `bg`, `ink`, and a full `layers` array.
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
 * Validate and return a safe numerology map, using DEFAULT_NUM for any missing or invalid entries.
 *
 * Accepts an object with numeric entries keyed like DEFAULT_NUM and produces a new object
 * where each key contains a finite, non-zero number: values from `input` override defaults
 * only if they coerce to a finite, non-zero Number; otherwise the corresponding default is kept.
 *
 * @param {Object|undefined|null} input - Partial numerology overrides keyed by the same symbols as DEFAULT_NUM.
 * @return {Object} A complete numerology map with all keys from DEFAULT_NUM populated with safe numbers.
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
 * Draws a circle path at (x, y) with the given radius and either strokes or fills it using the context's current state.
 *
 * Uses the context's current fillStyle, strokeStyle, globalAlpha, and lineWidth; does not change or restore the context state.
 * @param {number} x - Center x coordinate.
 * @param {number} y - Center y coordinate.
 * @param {number} radius - Circle radius.
 * @param {boolean} [fill=false] - If true, fills then strokes the circle; otherwise only strokes.
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
