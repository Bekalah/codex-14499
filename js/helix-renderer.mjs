/*
  helix-renderer.mjs
  ND-safe static renderer for the layered cosmology in Codex 144:99.

  Layer order (furthest to nearest):
    1. Vesica field - intersecting circles ground the space.
    2. Tree-of-Life scaffold - ten sephirot connected by twenty-two paths.
    3. Fibonacci curve - calm golden spiral polyline, sampled once.
    4. Double-helix lattice - paired strands with steady crossbars.

  ND-safe commitments:
    - No animation or timers; everything draws once per call.
    - Calm palette with readable contrast; background and ink values guard sensory comfort.
    - Pure helper functions keep the lineage data intact and auditable (no workflow side-effects).
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

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

/*
  Canonical lore: major arcana names stay present so path numerology remains traceable.
  This data is read-only and used to weight Tree-of-Life path opacity by numerology value.
*/
const MAJOR_ARCANA = [
  { name: 'The Fool', numerology: 0 },
  { name: 'The Magician', numerology: 1 },
  { name: 'The High Priestess', numerology: 2 },
  { name: 'The Empress', numerology: 3 },
  { name: 'The Emperor', numerology: 4 },
  { name: 'The Hierophant', numerology: 5 },
  { name: 'The Lovers', numerology: 6 },
  { name: 'The Chariot', numerology: 7 },
  { name: 'Strength', numerology: 8 },
  { name: 'The Hermit', numerology: 9 },
  { name: 'Wheel of Fortune', numerology: 10 },
  { name: 'Justice', numerology: 11 },
  { name: 'The Hanged Man', numerology: 12 },
  { name: 'Death', numerology: 13 },
  { name: 'Temperance', numerology: 14 },
  { name: 'The Devil', numerology: 15 },
  { name: 'The Tower', numerology: 16 },
  { name: 'The Star', numerology: 17 },
  { name: 'The Moon', numerology: 18 },
  { name: 'The Sun', numerology: 19 },
  { name: 'Judgement', numerology: 20 },
  { name: 'The World', numerology: 21 }
];

/*
  Sephirot layout is encoded with numerology-weighted offsets so we keep the tradition intact.
  xShift values are scaled against width/NUM.ELEVEN; yUnits scale against height/NUM.ONEFORTYFOUR.
*/
const SEPHIROT_TEMPLATE = [
  { key: 'kether', name: 'Kether', yUnits: 9, xShift: 0 },
  { key: 'chokmah', name: 'Chokmah', yUnits: 22, xShift: 1.2 },
  { key: 'binah', name: 'Binah', yUnits: 22, xShift: -1.2 },
  { key: 'chesed', name: 'Chesed', yUnits: 44, xShift: 1.45 },
  { key: 'geburah', name: 'Geburah', yUnits: 44, xShift: -1.45 },
  { key: 'tiphareth', name: 'Tiphareth', yUnits: 55, xShift: 0 },
  { key: 'netzach', name: 'Netzach', yUnits: 77, xShift: 1.1 },
  { key: 'hod', name: 'Hod', yUnits: 77, xShift: -1.1 },
  { key: 'yesod', name: 'Yesod', yUnits: 99, xShift: 0 },
  { key: 'malkuth', name: 'Malkuth', yUnits: 126, xShift: 0 }
];

const TREE_PATH_DEFINITIONS = [
  { from: 'kether', to: 'chokmah', arcanaIndex: 0 },
  { from: 'kether', to: 'binah', arcanaIndex: 1 },
  { from: 'kether', to: 'tiphareth', arcanaIndex: 2 },
  { from: 'chokmah', to: 'binah', arcanaIndex: 3 },
  { from: 'chokmah', to: 'tiphareth', arcanaIndex: 4 },
  { from: 'chokmah', to: 'chesed', arcanaIndex: 5 },
  { from: 'binah', to: 'tiphareth', arcanaIndex: 6 },
  { from: 'binah', to: 'geburah', arcanaIndex: 7 },
  { from: 'chesed', to: 'geburah', arcanaIndex: 8 },
  { from: 'chesed', to: 'tiphareth', arcanaIndex: 9 },
  { from: 'chesed', to: 'netzach', arcanaIndex: 10 },
  { from: 'geburah', to: 'tiphareth', arcanaIndex: 11 },
  { from: 'geburah', to: 'hod', arcanaIndex: 12 },
  { from: 'tiphareth', to: 'netzach', arcanaIndex: 13 },
  { from: 'tiphareth', to: 'yesod', arcanaIndex: 14 },
  { from: 'tiphareth', to: 'hod', arcanaIndex: 15 },
  { from: 'netzach', to: 'hod', arcanaIndex: 16 },
  { from: 'netzach', to: 'yesod', arcanaIndex: 17 },
  { from: 'netzach', to: 'malkuth', arcanaIndex: 18 },
  { from: 'hod', to: 'yesod', arcanaIndex: 19 },
  { from: 'hod', to: 'malkuth', arcanaIndex: 20 },
  { from: 'yesod', to: 'malkuth', arcanaIndex: 21 }
];

/**
 * Render the four-layer helix cosmology onto a 2D canvas context.
 * One synchronous call keeps the scene static (no animation, no timers).
 *
 * @param {CanvasRenderingContext2D} ctx - Target 2D context; function exits quietly when missing.
 * @param {Object} [opts] - Optional settings (width, height, palette, NUM numerology constants).
 */
export function renderHelix(ctx, opts = {}) {
  if (!ctx) return;

  const { width, height, palette, NUM } = normalizeOptions(opts);
  const canvas = ctx.canvas;
  if (canvas && (canvas.width !== width || canvas.height !== height)) {
    canvas.width = width;
    canvas.height = height;
  }

  drawBackground(ctx, width, height, palette.bg);
  drawVesicaField(ctx, { width, height }, palette, NUM);
  drawTreeOfLife(ctx, { width, height }, palette, NUM);
  drawFibonacciCurve(ctx, { width, height }, palette, NUM);
  drawDoubleHelix(ctx, { width, height }, palette, NUM);
}

function normalizeOptions(opts) {
  const width = isPositiveNumber(opts.width) ? opts.width : DEFAULT_DIMENSIONS.width;
  const height = isPositiveNumber(opts.height) ? opts.height : DEFAULT_DIMENSIONS.height;
  const palette = ensurePalette(opts.palette);
  const numerology = ensureNumerology(opts.NUM);
  return { width, height, palette, NUM: numerology };
}

function isPositiveNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function ensurePalette(candidate) {
  if (!candidate || typeof candidate !== 'object') return DEFAULT_PALETTE;
  const bg = typeof candidate.bg === 'string' ? candidate.bg : DEFAULT_PALETTE.bg;
  const ink = typeof candidate.ink === 'string' ? candidate.ink : DEFAULT_PALETTE.ink;
  const layers = buildLayerPalette(candidate.layers, DEFAULT_PALETTE.layers);
  return { bg, ink, layers };
}

function buildLayerPalette(candidate, fallbackLayers) {
  const fallback = Array.isArray(fallbackLayers) ? fallbackLayers : DEFAULT_PALETTE.layers;
  if (!Array.isArray(candidate) || candidate.length === 0) return fallback.slice();
  const limit = Math.max(candidate.length, fallback.length);
  const result = [];
  for (let index = 0; index < limit; index += 1) {
    const color = typeof candidate[index] === 'string' ? candidate[index] : fallback[index % fallback.length];
    result.push(color);
  }
  return result;
}

function ensureNumerology(candidate) {
  if (!candidate || typeof candidate !== 'object') return DEFAULT_NUM;
  const numerology = {};
  for (const key of Object.keys(DEFAULT_NUM)) {
    numerology[key] = isPositiveNumber(candidate[key]) ? candidate[key] : DEFAULT_NUM[key];
  }
  return numerology;
}

function drawBackground(ctx, width, height, color) {
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

function drawVesicaField(ctx, dims, palette, NUM) {
  ctx.save();
  const columns = NUM.NINE;
  const rows = NUM.SEVEN;
  const marginX = dims.width / NUM.TWENTYTWO;
  const marginY = dims.height / NUM.TWENTYTWO;
  const stepX = (dims.width - marginX * 2) / (columns - 1);
  const stepY = (dims.height - marginY * 2) / (rows - 1);
  const radius = Math.min(stepX, stepY) / 1.9;

  ctx.lineWidth = Math.max(1.25, radius / NUM.THIRTYTHREE);
  ctx.strokeStyle = palette.layers[0] ?? DEFAULT_PALETTE.layers[0];
  ctx.globalAlpha = 0.35;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const cx = marginX + col * stepX;
      const cy = marginY + row * stepY;
      drawCircle(ctx, cx, cy, radius);
    }
  }

  ctx.strokeStyle = palette.layers[5] ?? DEFAULT_PALETTE.layers[5];
  ctx.globalAlpha = 0.2;
  const offsetX = stepX / 2;
  const offsetY = stepY / 2;
  for (let row = 0; row < rows - 1; row += 1) {
    for (let col = 0; col < columns - 1; col += 1) {
      const cx = marginX + col * stepX + offsetX;
      const cy = marginY + row * stepY + offsetY;
      drawCircle(ctx, cx, cy, radius);
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

function drawTreeOfLife(ctx, dims, palette, NUM) {
  ctx.save();
  const nodes = mapSephirotPositions(dims.width, dims.height, NUM);
  const nodeByKey = new Map(nodes.map((node) => [node.key, node]));

  // Paths first to keep nodes legible on top.
  ctx.strokeStyle = palette.layers[1] ?? DEFAULT_PALETTE.layers[1];
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(1.5, dims.width / NUM.ONEFORTYFOUR);

  for (const path of TREE_PATH_DEFINITIONS) {
    const start = nodeByKey.get(path.from);
    const end = nodeByKey.get(path.to);
    if (!start || !end) continue;

    const arcana = MAJOR_ARCANA[path.arcanaIndex] ?? MAJOR_ARCANA[0];
    const weight = 0.35 + (arcana.numerology % NUM.ELEVEN) / (NUM.THIRTYTHREE);
    ctx.globalAlpha = clamp(weight, 0.35, 0.85);

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  // Sephirot nodes - calm fill with ink outline for readability.
  const nodeRadius = Math.max(8, Math.min(dims.width, dims.height) / NUM.THIRTYTHREE);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = palette.ink ?? DEFAULT_PALETTE.ink;
  ctx.lineWidth = Math.max(1, nodeRadius / NUM.TWENTYTWO);

  for (const node of nodes) {
    ctx.fillStyle = palette.layers[2] ?? DEFAULT_PALETTE.layers[2];
    drawFilledCircle(ctx, node.x, node.y, nodeRadius);
    // ND-safe annotation: gentle, centered labels keep lore legible without overwhelming the eye.
    ctx.font = `${Math.round(nodeRadius * 0.9)}px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = palette.ink ?? DEFAULT_PALETTE.ink;
    ctx.fillText(node.name, node.x, node.y - nodeRadius * 1.6);
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

function mapSephirotPositions(width, height, NUM) {
  const unitY = height / NUM.ONEFORTYFOUR;
  const unitX = width / NUM.ELEVEN;
  return SEPHIROT_TEMPLATE.map((entry) => ({
    key: entry.key,
    name: entry.name,
    x: width / 2 + entry.xShift * unitX,
    y: entry.yUnits * unitY,
  }));
}

function drawFibonacciCurve(ctx, dims, palette, NUM) {
  ctx.save();
  const points = generateFibonacciPoints(dims, NUM);
  if (points.length < 2) {
    ctx.restore();
    return;
  }

  ctx.strokeStyle = palette.layers[3] ?? DEFAULT_PALETTE.layers[3];
  ctx.lineWidth = Math.max(2, dims.width / NUM.ONEFORTYFOUR);
  ctx.globalAlpha = 0.85;
  drawPolyline(ctx, points);

  // Gentle markers highlight growth points without motion.
  ctx.fillStyle = palette.layers[3] ?? DEFAULT_PALETTE.layers[3];
  ctx.globalAlpha = 0.9;
  const markerRadius = Math.max(3, Math.min(dims.width, dims.height) / (NUM.NINETYNINE));
  for (let i = 0; i < points.length; i += Math.floor(NUM.NINETYNINE / NUM.ELEVEN)) {
    const point = points[i];
    drawFilledCircle(ctx, point.x, point.y, markerRadius);
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

function generateFibonacciPoints(dims, NUM) {
  const sampleCount = NUM.NINETYNINE;
  const points = [];
  const baseRadius = Math.min(dims.width, dims.height) / NUM.TWENTYTWO;
  const centerX = dims.width * (NUM.THREE / NUM.NINE);
  const centerY = dims.height * (NUM.NINETYNINE / NUM.ONEFORTYFOUR);
  const thetaMax = (NUM.THREE + NUM.SEVEN / NUM.TWENTYTWO) * Math.PI;
  for (let index = 0; index < sampleCount; index += 1) {
    const t = index / (sampleCount - 1);
    const theta = t * thetaMax;
    const radius = baseRadius * Math.pow(GOLDEN_RATIO, theta / (Math.PI / 2));
    const x = centerX + radius * Math.cos(theta);
    const y = centerY - radius * Math.sin(theta);
    points.push({ x, y });
  }
  return points;
}

function drawDoubleHelix(ctx, dims, palette, NUM) {
  ctx.save();
  const strandPoints = generateHelixStrands(dims, NUM);
  const strandA = strandPoints.strandA;
  const strandB = strandPoints.strandB;

  ctx.strokeStyle = palette.layers[4] ?? DEFAULT_PALETTE.layers[4];
  ctx.lineWidth = Math.max(2, dims.width / NUM.ONEFORTYFOUR);
  ctx.globalAlpha = 0.8;
  drawPolyline(ctx, strandA);
  drawPolyline(ctx, strandB);

  // Crossbars keep the lattice stable; drawn with the most muted layer color.
  ctx.strokeStyle = palette.layers[5] ?? DEFAULT_PALETTE.layers[5];
  ctx.lineWidth = Math.max(1.25, dims.width / (NUM.ONEFORTYFOUR * 1.5));
  const crossStep = Math.max(2, Math.floor(strandA.length / NUM.TWENTYTWO));
  for (let i = 0; i < strandA.length && i < strandB.length; i += crossStep) {
    const a = strandA[i];
    const b = strandB[i];
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
}

function generateHelixStrands(dims, NUM) {
  const sampleCount = NUM.ONEFORTYFOUR;
  const strandA = [];
  const strandB = [];
  const amplitude = dims.width / NUM.TWENTYTWO;
  const centerX = dims.width * (NUM.TWENTYTWO / NUM.THIRTYTHREE);
  const stepY = dims.height / (sampleCount - 1);
  const phaseShift = Math.PI;
  const totalTurns = NUM.THREE; // Three calm turns encode 3-7-9 layering without motion.

  for (let index = 0; index < sampleCount; index += 1) {
    const y = index * stepY;
    const progress = index / (sampleCount - 1);
    const angle = progress * totalTurns * Math.PI;
    const xA = centerX + Math.sin(angle) * amplitude;
    const xB = centerX + Math.sin(angle + phaseShift) * amplitude;
    strandA.push({ x: xA, y });
    strandB.push({ x: xB, y });
  }

  return { strandA, strandB };
}

function drawCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawFilledCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawPolyline(ctx, points) {
  if (points.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    ctx.lineTo(point.x, point.y);
  }
  ctx.stroke();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));

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
