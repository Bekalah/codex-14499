/*
  helix-renderer.mjs
  ND-safe static renderer for the layered cosmology in Codex 144:99.

  Layer order (furthest to nearest):
    1. Vesica field (intersecting circles anchor the stage)
    2. Tree-of-Life scaffold (ten sephirot plus twenty-two connective paths)
    3. Fibonacci curve (static golden spiral polyline)
    4. Double-helix lattice (two strands with steady crossbars)

  All helpers are small pure functions that run once per invocation to honor the
  trauma-informed, offline-first requirement: no motion, readable contrast, and
  comments that explain why each choice stays ND-safe.
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

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

// Blueprint for the Tree-of-Life layout. Column offsets keep the geometry layered.
const TREE_BLUEPRINT = [
  { key: 'kether', label: 'Kether', column: 0, level: 0, offset: 0 },
  { key: 'chokmah', label: 'Chokmah', column: 1, level: 1, offset: -0.12 },
  { key: 'binah', label: 'Binah', column: -1, level: 1, offset: 0.12 },
  { key: 'chesed', label: 'Chesed', column: 1, level: 2, offset: -0.08 },
  { key: 'geburah', label: 'Geburah', column: -1, level: 2, offset: 0.08 },
  { key: 'tiphareth', label: 'Tiphareth', column: 0, level: 3, offset: 0 },
  { key: 'netzach', label: 'Netzach', column: 1, level: 4, offset: -0.18 },
  { key: 'hod', label: 'Hod', column: -1, level: 4, offset: 0.18 },
  { key: 'yesod', label: 'Yesod', column: 0, level: 5, offset: 0 },
  { key: 'malkuth', label: 'Malkuth', column: 0, level: 6, offset: 0 }
];

// Twenty-two connective paths honoring the major arcana mapping.
const TREE_PATHS = [
  ['kether', 'chokmah'],
  ['kether', 'binah'],
  ['kether', 'tiphareth'],
  ['chokmah', 'binah'],
  ['chokmah', 'tiphareth'],
  ['chokmah', 'chesed'],
  ['binah', 'tiphareth'],
  ['binah', 'geburah'],
  ['chesed', 'geburah'],
  ['chesed', 'tiphareth'],
  ['chesed', 'netzach'],
  ['geburah', 'tiphareth'],
  ['geburah', 'hod'],
  ['tiphareth', 'netzach'],
  ['tiphareth', 'yesod'],
  ['tiphareth', 'hod'],
  ['netzach', 'hod'],
  ['netzach', 'yesod'],
  ['netzach', 'malkuth'],
  ['hod', 'yesod'],
  ['hod', 'malkuth'],
  ['yesod', 'malkuth']
];

/**
 * Render the full static helix visualization onto a 2D canvas context.
 *
 * Normalizes options (width, height, palette, numerology), synchronizes the
 * canvas dimensions when available, and draws four non-animated layers
 * (background/vesica field, Tree-of-Life scaffold, Fibonacci curve, and
 * double-helix lattice) from back to front. Exits quietly if `ctx` is falsy.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D drawing context to render into.
 * @param {Object} [opts] - Optional rendering settings (width, height, palette, NUM).
 */
export function renderHelix(ctx, opts = {}) {
  if (!ctx) return;

  const { width, height, palette, NUM } = normalizeOptions(opts);
  if (ctx.canvas) {
    if (ctx.canvas.width !== width) ctx.canvas.width = width;
    if (ctx.canvas.height !== height) ctx.canvas.height = height;
  }

  fillBackground(ctx, width, height, palette.bg);
  drawVesicaField(ctx, width, height, palette, NUM);
  drawTreeOfLife(ctx, width, height, palette, NUM);
  drawFibonacciCurve(ctx, width, height, palette, NUM);
  drawHelixLattice(ctx, width, height, palette, NUM);
}

/**
 * Normalize rendering options, filling in defaults for missing or non-finite values.
 *
 * Takes a partial opts object and returns a normalized options object with:
 * - width and height: finite numbers (falling back to DEFAULT_DIMENSIONS),
 * - palette: validated/normalized palette from ensurePalette,
 * - NUM: numeric configuration produced by ensureNumerology.
 *
 * @param {Object} opts - Partial options; may contain width, height, palette, and NUM.
 * @return {{width:number, height:number, palette:Object, NUM:Object}} Normalized options ready for rendering.
 */
function normalizeOptions(opts) {
  const width = isFiniteNumber(opts.width) ? opts.width : DEFAULT_DIMENSIONS.width;
  const height = isFiniteNumber(opts.height) ? opts.height : DEFAULT_DIMENSIONS.height;
  return {
    width,
    height,
    palette: ensurePalette(opts.palette),
    NUM: ensureNumerology(opts.NUM)
  };
}

/**
 * Normalize and validate a color palette object, returning a complete palette.
 *
 * If the input is not a plain object, a shallow copy of DEFAULT_PALETTE is returned.
 * bg and ink are taken from input when they are valid hex color strings (checked with isColorString); otherwise the defaults are used.
 * layers is built from any valid color strings in input.layers, padded (or truncated) to at least the greater of:
 *   - DEFAULT_PALETTE.layers.length
 *   - the number of valid input layers
 *   - 4
 * Missing layer slots are filled by cycling through DEFAULT_PALETTE.layers.
 *
 * @param {object} input - Candidate palette object with optional `bg`, `ink`, and `layers` properties.
 * @return {{bg: string, ink: string, layers: string[]}} A normalized palette with guaranteed bg, ink, and a layers array of sufficient length.
 */
function ensurePalette(input) {
  if (!isPlainObject(input)) return { ...DEFAULT_PALETTE };
  const bg = isColorString(input.bg) ? input.bg : DEFAULT_PALETTE.bg;
  const ink = isColorString(input.ink) ? input.ink : DEFAULT_PALETTE.ink;
  const sourceLayers = Array.isArray(input.layers) ? input.layers.filter(isColorString) : [];
  const layers = [];
  const needed = Math.max(DEFAULT_PALETTE.layers.length, sourceLayers.length, 4);
  for (let i = 0; i < needed; i += 1) {
    layers.push(sourceLayers[i] || DEFAULT_PALETTE.layers[i % DEFAULT_PALETTE.layers.length]);
  }
  return { bg, ink, layers };
}

/**
 * Normalize a numerology/options object by ensuring every numeric key from DEFAULT_NUM is present and finite.
 *
 * For each key defined in DEFAULT_NUM, the function uses the finite numeric value from `input` when available;
 * otherwise it falls back to the corresponding value from DEFAULT_NUM. The returned object contains numeric
 * values for all keys in DEFAULT_NUM and does not mutate the original DEFAULT_NUM.
 *
 * @param {?Object} input - Partial numerology map (may be missing keys); non-objects are treated as empty.
 * @return {Object} A new object with the same keys as DEFAULT_NUM and numeric values guaranteed for each key.
 */
function ensureNumerology(input) {
  const result = {};
  const source = isPlainObject(input) ? input : {};
  for (const key of Object.keys(DEFAULT_NUM)) {
    result[key] = isFiniteNumber(source[key]) ? source[key] : DEFAULT_NUM[key];
  }
  return result;
}

/**
 * Determine whether a value is a finite number.
 * @param {*} value - Value to test.
 * @returns {boolean} True if the value is a number and finite (not NaN or ±Infinity); otherwise false.
 */
function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Determine whether a value is a plain object (i.e., an Object literal).
 *
 * Returns true for objects created by `{}` or `new Object()` and false for
 * arrays, null, functions, dates, regexes, or other built-in/host types.
 *
 * @param {*} value - Value to test.
 * @returns {boolean} True if `value` is a plain object.
 */
function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * Check whether a value is a 6-digit hexadecimal color string of the form `#rrggbb`.
 * Trims surrounding whitespace and matches case-insensitively.
 * @param {*} value - Value to test.
 * @returns {boolean} True if the value is a `#`-prefixed 6-hex-digit color string; otherwise false.
 */
function isColorString(value) {
  return typeof value === 'string' && /^#([0-9a-f]{6})$/i.test(value.trim());
}

/**
 * Clamp a numeric value into the inclusive range [0, 1].
 *
 * Non-finite or non-numeric inputs are treated as 0. Values below 0 return 0;
 * values above 1 return 1; otherwise the original numeric value is returned.
 *
 * @param {number} value - The value to clamp.
 * @returns {number} The clamped value in the range [0, 1].
 */
function clamp01(value) {
  if (!isFiniteNumber(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

/**
 * Convert a hex color string ("#rrggbb") to an `rgba(r, g, b, a)` CSS string.
 *
 * If `hex` is not a valid 6-digit hex color, returns a neutral fallback `rgba(232, 232, 240, a)`.
 * The `alpha` value is clamped to the [0,1] range before insertion.
 *
 * @param {string} hex - A hex color in the form `#rrggbb`.
 * @param {number} alpha - Desired alpha (opacity); non-finite or out-of-range values are clamped to [0, 1].
 * @return {string} An `rgba(...)` CSS color string.
 */
function withAlpha(hex, alpha) {
  if (!isColorString(hex)) return `rgba(232, 232, 240, ${clamp01(alpha)})`;
  const value = hex.trim().slice(1);
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${clamp01(alpha)})`;
}

/**
 * Fill the entire canvas area with a solid color.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D drawing context to paint into.
 * @param {number} width - Width of the area to fill, in pixels.
 * @param {number} height - Height of the area to fill, in pixels.
 * @param {string} color - CSS color string (e.g., `#rrggbb` or any valid CSS color).
 */
function fillBackground(ctx, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

/**
 * Draws a translucent, evenly spaced grid of overlapping circles ("vesica" field) centered on the canvas.
 *
 * The grid size, circle radius and spacing are derived from canvas dimensions and numeric parameters from `NUM`.
 * Uses the first palette layer (or `palette.ink` fallback) with reduced alpha for the stroke.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context to draw into.
 * @param {number} width - Canvas width in pixels; used to compute radii and horizontal spacing.
 * @param {number} height - Canvas height in pixels; used to compute radii and vertical spacing.
 * @param {Object} palette - Color palette object; `palette.layers[0]` is used for the circle strokes (falls back to `palette.ink`).
 * @param {Object} NUM - Numerology/config object with numeric constants (e.g., SEVEN, THREE, TWENTYTWO, NINE, THIRTYTHREE) used to size and space the field.
 */
function drawVesicaField(ctx, width, height, palette, NUM) {
  const rowCount = Math.max(NUM.SEVEN, 6);
  const columnCount = Math.max(NUM.THREE + 1, 4);
  const radius = Math.min(width / (columnCount * 1.6), height / (rowCount * 1.8));
  const horizontalSpacing = radius * (2 - 2 / NUM.TWENTYTWO);
  const verticalSpacing = radius * (1 + 1 / NUM.NINE);
  const offsetX = width / 2 - (columnCount - 1) * horizontalSpacing / 2;
  const offsetY = height / 2 - (rowCount - 1) * verticalSpacing / 2;

  ctx.save();
  ctx.strokeStyle = withAlpha(palette.layers[0] || palette.ink, 0.35);
  ctx.lineWidth = Math.max(1, radius / NUM.THIRTYTHREE);

  for (let row = 0; row < rowCount; row += 1) {
    const y = offsetY + row * verticalSpacing;
    const shift = row % 2 === 0 ? 0 : horizontalSpacing / 2;
    for (let col = 0; col < columnCount + 1; col += 1) {
      const x = offsetX + col * horizontalSpacing + shift;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

/**
 * Render the Tree-of-Life scaffold and labeled sephirot nodes onto a canvas.
 *
 * Draws connective paths between sephirot (using TREE_PATHS and computeSephirotPositions),
 * then renders a filled circular node for each sephirot with a smaller inner circle,
 * a textual label above the node, and an order index centered on the node.
 * The function saves and restores canvas state around major phases so it does not leave
 * persistent style changes on the context.
 *
 * @param {number} width - Canvas drawing width (used to compute layout and sizing).
 * @param {number} height - Canvas drawing height (used to compute layout and sizing).
 * @param {object} palette - Color palette object with at least `bg`, `ink`, and `layers` array;
 *                           specific layer entries are used for path, node border, and fills.
 * @param {object} NUM - Numerology constants object (prevalidated) providing numeric factors
 *                       such as TWENTYTWO, THIRTYTHREE, ELEVEN, THREE, NINETYNINE used for sizing.
 */
function drawTreeOfLife(ctx, width, height, palette, NUM) {
  const nodes = computeSephirotPositions(width, height, NUM);
  const nodeMap = new Map(nodes.map((node) => [node.key, node]));
  const pathColor = withAlpha(palette.layers[1] || palette.ink, 0.55);

  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = Math.max(1.2, Math.min(width, height) / NUM.NINETYNINE);
  ctx.lineCap = 'round';

  for (const [fromKey, toKey] of TREE_PATHS) {
    const from = nodeMap.get(fromKey);
    const to = nodeMap.get(toKey);
    if (!from || !to) continue;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  ctx.restore();

  ctx.save();
  const nodeRadius = Math.min(width, height) / NUM.TWENTYTWO;
  const labelFont = `${Math.max(12, Math.round(nodeRadius * 0.5))}px system-ui`;
  const indexFont = `${Math.max(10, Math.round(nodeRadius * 0.35))}px system-ui`;
  ctx.lineWidth = Math.max(1.5, nodeRadius / NUM.THIRTYTHREE * 4);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (const node of nodes) {
    ctx.fillStyle = withAlpha(palette.bg, 0.85);
    ctx.strokeStyle = withAlpha(palette.layers[1] || palette.ink, 0.85);
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = withAlpha(palette.layers[1] || palette.ink, 0.7);
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius / NUM.THREE, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = withAlpha(palette.ink, 0.9);
    ctx.font = labelFont;
    ctx.fillText(node.label, node.x, node.y - nodeRadius - nodeRadius / NUM.ELEVEN);

    ctx.font = indexFont;
    ctx.fillStyle = withAlpha(palette.ink, 0.75);
    ctx.fillText(String(node.order), node.x, node.y);
  }

  ctx.restore();
}

/**
 * Compute Cartesian positions for the Tree-of-Life nodes from the blueprint.
 *
 * Uses the module TREE_BLUEPRINT to map each node's blueprint column, level and offset
 * into concrete x/y canvas coordinates based on the provided canvas width/height and
 * numerology values.
 *
 * @param {number} width - Canvas width in pixels.
 * @param {number} height - Canvas height in pixels.
 * @param {Object} NUM - Numerology object providing layout divisors; must include numeric `SEVEN` and `THREE` properties used to compute vertical and horizontal spacing.
 * @return {Array<Object>} Array of node objects derived from TREE_BLUEPRINT with added properties:
 *   - x {number}: computed x coordinate (pixels)
 *   - y {number}: computed y coordinate (pixels)
 *   - order {number}: 1-based index corresponding to the node's position in the returned array
 */
function computeSephirotPositions(width, height, NUM) {
  const verticalSpacing = height / (NUM.SEVEN + 1);
  const horizontalSpacing = width / (NUM.THREE + 1);
  const centerX = width / 2;

  return TREE_BLUEPRINT.map((node, index) => {
    const x = centerX + node.column * horizontalSpacing + node.offset * horizontalSpacing;
    const y = verticalSpacing * (node.level + 1);
    return { ...node, x, y, order: index + 1 };
  });
}

/**
 * Render a static Fibonacci (golden-ratio) spiral with periodic markers.
 *
 * Draws a smooth spiral curve centered within the canvas area using the GOLDEN_RATIO
 * scaling and paints small circular markers along the curve. Exits silently if there
 * are not enough computed points to draw.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D drawing context to render into.
 * @param {number} width - Canvas drawing width in pixels.
 * @param {number} height - Canvas drawing height in pixels.
 * @param {Object} palette - Normalized palette object; uses palette.layers[2] or palette.ink for stroke/fill colors.
 * @param {Object} NUM - Numerology constants object used to derive segment counts, spacings and sizes.
 */
function drawFibonacciCurve(ctx, width, height, palette, NUM) {
  const segments = NUM.TWENTYTWO + NUM.ELEVEN; // 33 calm segments along the spiral.
  const totalAngle = Math.PI * (NUM.THREE - NUM.ELEVEN / NUM.TWENTYTWO);
  const baseRadius = Math.min(width, height) / NUM.NINE;
  const centerX = width * (NUM.SEVEN / NUM.TWENTYTWO);
  const centerY = height * (NUM.NINE / NUM.TWENTYTWO);
  const points = [];

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const angle = t * totalAngle;
    const radius = baseRadius * Math.pow(GOLDEN_RATIO, angle / Math.PI);
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    points.push({ x, y });
  }

  if (points.length < 2) return;

  ctx.save();
  ctx.strokeStyle = withAlpha(palette.layers[2] || palette.ink, 0.75);
  ctx.lineWidth = Math.max(1.5, Math.min(width, height) / NUM.ONEFORTYFOUR * 3);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  ctx.fillStyle = withAlpha(palette.layers[2] || palette.ink, 0.5);
  const markerStep = Math.max(1, Math.round(segments / NUM.ELEVEN));
  const markerRadius = Math.max(2, baseRadius / NUM.THIRTYTHREE);
  for (let i = 0; i < points.length; i += markerStep) {
    const point = points[i];
    ctx.beginPath();
    ctx.arc(point.x, point.y, markerRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Render a double-helix lattice (two sine-wave strands with crossbars) onto a 2D canvas context.
 *
 * Draws two vertically spanning strands and horizontal rungs between them using colors derived
 * from `palette`. Geometry and density are driven by values in `NUM` (e.g., `NUM.ONEFORTYFOUR`
 * controls segment count). The function mutates the provided CanvasRenderingContext2D by stroking
 * paths and does not return a value.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D drawing context to render into.
 * @param {number} width - Canvas width in pixels; used to compute amplitudes and stroke widths.
 * @param {number} height - Canvas height in pixels; used to compute vertical span and margins.
 * @param {{ink: string, layers: string[]}} palette - Color palette; strand and rung colors are
 *   taken from palette.layers[3], [4], [5] with fallbacks to palette.ink when absent.
 * @param {object} NUM - Numerology constants object (finite numeric properties such as
 *   ONEFORTYFOUR, THREE, SEVEN, ELEVEN, etc.) used to scale segment counts, amplitudes, phases,
 *   and stroke widths.
 */
function drawHelixLattice(ctx, width, height, palette, NUM) {
  const segments = NUM.ONEFORTYFOUR;
  const amplitude = width / (NUM.THREE + NUM.SEVEN);
  const centerX = width * (NUM.TWENTYTWO - NUM.SEVEN) / NUM.TWENTYTWO;
  const verticalMargin = height / NUM.ELEVEN;
  const startY = verticalMargin;
  const endY = height - verticalMargin;
  const totalY = endY - startY;
  const phase = Math.PI / NUM.THREE;

  const strandA = [];
  const strandB = [];

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const angle = t * Math.PI * (NUM.THIRTYTHREE / NUM.ELEVEN);
    const y = startY + totalY * t;
    const xA = centerX + Math.sin(angle) * amplitude;
    const xB = centerX + Math.sin(angle + phase) * amplitude * 0.9;
    strandA.push({ x: xA, y });
    strandB.push({ x: xB, y });
  }

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const strandColorA = withAlpha(palette.layers[3] || palette.ink, 0.85);
  const strandColorB = withAlpha(palette.layers[4] || palette.layers[3] || palette.ink, 0.75);
  const rungColor = withAlpha(palette.layers[5] || palette.ink, 0.5);

  ctx.lineWidth = Math.max(1.2, Math.min(width, height) / NUM.ONEFORTYFOUR * 4);
  ctx.strokeStyle = strandColorA;
  ctx.beginPath();
  ctx.moveTo(strandA[0].x, strandA[0].y);
  for (let i = 1; i < strandA.length; i += 1) {
    ctx.lineTo(strandA[i].x, strandA[i].y);
  }
  ctx.stroke();

  ctx.strokeStyle = strandColorB;
  ctx.beginPath();
  ctx.moveTo(strandB[0].x, strandB[0].y);
  for (let i = 1; i < strandB.length; i += 1) {
    ctx.lineTo(strandB[i].x, strandB[i].y);
  }
  ctx.stroke();

  ctx.strokeStyle = rungColor;
  ctx.lineWidth = Math.max(1, Math.min(width, height) / NUM.NINETYNINE * 2);
  const rungStep = Math.max(2, Math.round(segments / NUM.TWENTYTWO));
  for (let i = 0; i < strandA.length; i += rungStep) {
    const a = strandA[i];
    const b = strandB[i];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}
