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
  Layer order (back to front):
    1. Vesica field — repeating intersecting circles anchor the space.
    2. Tree-of-Life scaffold — ten sephirot nodes with twenty-two arcana paths.
    3. Fibonacci curve — calm golden spiral sampled once.
    4. Double-helix lattice — two strands with steady rungs, no motion.

  Every helper is a small pure function; comments document why choices support
  ND-safe, trauma-informed rendering (no animation, calm contrast, offline-first).
  Static offline renderer for the Cosmic Helix scene.

  Layer order (back to front):
    1. Vesica field (intersecting circles)
    2. Tree-of-Life scaffold (ten nodes, twenty-two paths)
    3. Fibonacci curve (golden spiral)
    4. Double-helix lattice (two strands plus crossbars)

  ND-safe commitments:
    - No animation or timers; every layer renders once per call.
    - Calm contrast drawn from a six-color palette with background and ink.
    - Small pure helpers make each symbolic layer auditable and lore-safe.
  ND-safe static renderer for layered sacred geometry.

  Layer order (furthest to nearest):
    1) Vesica field (intersecting circles form the grounding grid)
    2) Tree-of-Life scaffold (ten sephirot nodes with twenty-two connective paths)
    3) Fibonacci curve (logarithmic spiral polyline)
    4) Double-helix lattice (twin strands with steady crossbars)

  ND-safe rationale:
    - No motion or timers; each layer renders once when invoked.
    - Calm palette with readable contrast to avoid sensory overload.
    - Small, pure helper functions keep the cosmology legible and lore-safe.
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
const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

/*
  The lore arrays below preserve the canon provided in the request. Keeping the
  text intact avoids overwriting lineage knowledge while giving the renderer a
  structured source for numerology and naming.
*/
const MAJOR_ARCANA = [
  { name: 'The Fool', numerology: 0, lore: 'Pure potential, leap into the abyss, Aleph breath of beginning', lab: 'respawn-meditation' },
  { name: 'The Magician', numerology: 1, lore: "Will manifested, Mercury's messenger, tools of transformation", lab: 'beth-house-ritual' },
  { name: 'High Priestess', numerology: 2, lore: 'Veiled wisdom, lunar mysteries, guardian of thresholds', lab: 'gimel-camel-path' },
  { name: 'The Empress', numerology: 3, lore: "Venus fertile, creative abundance, nature's sovereignty" },
  { name: 'The Emperor', numerology: 4, lore: "Cubic throne, Mars authority, structure and order" },
  { name: 'Hierophant', numerology: 5, lore: 'Taurus teaching, bridge between worlds, sacred tradition' },
  { name: 'The Lovers', numerology: 6, lore: 'Zayin sword divides, conscious choice, sacred union' },
  { name: 'The Chariot', numerology: 7, lore: "Cancer's shell, sphinx guardians, triumphant will" },
  { name: 'Strength', numerology: 8, lore: "Serpent power, Leo's courage, infinite lemniscate" },
  { name: 'Hermit', numerology: 9, lore: "Virgo's lamp, Yod hand of God, inner guidance" },
  { name: 'Wheel of Fortune', numerology: 10, lore: "Jupiter's expansion, karma cycles, sphinx wisdom" },
  { name: 'Justice', numerology: 11, lore: "Libra's balance, Lamed ox-goad, karmic adjustment" },
  { name: 'Hanged Man', numerology: 12, lore: "Neptune's water, suspended mind, reversal wisdom" },
  { name: 'Death', numerology: 13, lore: 'Scorpio transformation, Nun fish, ego dissolution', lab: 'death-rebirth' },
  { name: 'Temperance', numerology: 14, lore: "Sagittarius arrow, alchemical mixture, middle path" },
  { name: 'Devil', numerology: 15, lore: "Capricorn matter, Ayin eye opens, shadow integration" },
  { name: 'Tower', numerology: 16, lore: "Mars lightning, false crown falls, liberation shock", lab: 'tower-catalyst' },
  { name: 'Star', numerology: 17, lore: "Aquarius pours, seven chakras, cosmic consciousness" },
  { name: 'Moon', numerology: 18, lore: "Pisces dreams, Qoph back of head, astral journey", lab: 'moon-veil' },
  { name: 'Sun', numerology: 19, lore: 'Solar child, Resh head renewal, conscious joy' },
  { name: 'Judgement', numerology: 20, lore: "Pluto rises, Shin tooth/fire, eternal calling" },
  { name: 'World', numerology: 21, lore: "Saturn completes, Tau cross manifest, cosmic dance" }
];

const SEPHIROT = [
  { key: 'kether', name: 'Kether', numerology: 1, lore: 'Crown unity, source point, pure will undifferentiated', yUnits: 9, xShift: 0 },
  { key: 'chokmah', name: 'Chokmah', numerology: 2, lore: 'Wisdom force, Zodiac sphere, active principle', yUnits: 22, xShift: 1.2 },
  { key: 'binah', name: 'Binah', numerology: 3, lore: "Understanding form, Saturn's restriction, divine mother", yUnits: 22, xShift: -1.2 },
  { key: 'chesed', name: 'Chesed', numerology: 4, lore: 'Jupiter mercy, building power, benevolent king', yUnits: 44, xShift: 1.45 },
  { key: 'geburah', name: 'Geburah', numerology: 5, lore: 'Mars severity, destroying force, necessary restriction', yUnits: 44, xShift: -1.45 },
  { key: 'tiphareth', name: 'Tiphareth', numerology: 6, lore: 'Solar beauty, Christ center, harmonious balance', yUnits: 55, xShift: 0 },
  { key: 'netzach', name: 'Netzach', numerology: 7, lore: 'Venus victory, desire nature, creative force', yUnits: 77, xShift: 1.1 },
  { key: 'hod', name: 'Hod', numerology: 8, lore: 'Mercury splendor, mental forms, magical image', yUnits: 77, xShift: -1.1 },
  { key: 'yesod', name: 'Yesod', numerology: 9, lore: 'Lunar foundation, astral light, subconscious machinery', yUnits: 99, xShift: 0 },
  { key: 'malkuth', name: 'Malkuth', numerology: 10, lore: 'Kingdom manifest, four elements, physical completion', yUnits: 126, xShift: 0 }
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

export function renderHelix(ctx, options = {}) {
  if (!ctx) return;

  const settings = normalizeOptions(options);
  const { width, height, palette, NUM } = settings;
export function renderHelix(ctx, config = {}) {
  if (!ctx) return;

  const width = sanitizeDimension(config.width, 1440);
  const height = sanitizeDimension(config.height, 900);
  const palette = sanitizePalette(config.palette);
  const NUM = sanitizeNumerology(config.NUM);
// Public entry point: orchestrates the four calm layers.
export function renderHelix(ctx, config = {}) {
  if (!ctx) return;
  const { width, height, palette, NUM } = normalizeOptions(config);

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
function normalizeOptions(config) {
  const width = Number.isFinite(config.width) ? config.width : 1440;
  const height = Number.isFinite(config.height) ? config.height : 900;
  const palette = ensurePalette(config.palette);
  const NUM = ensureNumerology(config.NUM);
  return { width, height, palette, NUM };
}

// Calm fallback palette keeps offline rendering predictable.
function ensurePalette(input) {
  if (!input) return { ...DEFAULT_PALETTE };
  const safe = {
    bg: typeof input.bg === "string" ? input.bg : DEFAULT_PALETTE.bg,
    ink: typeof input.ink === "string" ? input.ink : DEFAULT_PALETTE.ink,
    layers: []
  };
  if (Array.isArray(input.layers)) {
    for (let i = 0; i < Math.min(input.layers.length, DEFAULT_PALETTE.layers.length); i += 1) {
      if (typeof input.layers[i] === "string") safe.layers.push(input.layers[i]);
    }
  }
  while (safe.layers.length < DEFAULT_PALETTE.layers.length) {
    safe.layers.push(DEFAULT_PALETTE.layers[safe.layers.length]);
  }

  return safe;
  drawFibonacciCurve(ctx, width, height, palette.layers[3], palette.ink, NUM);
  drawHelixLattice(ctx, width, height, palette.layers[4], palette.layers[5], palette.ink, NUM);
}

function normalizeOptions(options = {}) {
  const width = Number.isFinite(options.width) ? options.width : DEFAULT_DIMENSIONS.width;
  const height = Number.isFinite(options.height) ? options.height : DEFAULT_DIMENSIONS.height;
  const palette = ensurePalette(options.palette);
  const NUM = ensureNumerology(options.NUM);
  return { width, height, palette, NUM };
}

function ensurePalette(input) {
  const base = {
    bg: DEFAULT_PALETTE.bg,
    ink: DEFAULT_PALETTE.ink,
    layers: [...DEFAULT_PALETTE.layers]
function sanitizeDimension(value, fallback) {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function sanitizePalette(input) {
  if (!input) return { ...DEFAULT_PALETTE };
  const layers = Array.isArray(input.layers) ? input.layers.slice(0, 6) : [];
  while (layers.length < 6) layers.push(DEFAULT_PALETTE.layers[layers.length]);
  return {
    bg: typeof input.bg === "string" ? input.bg : DEFAULT_PALETTE.bg,
    ink: typeof input.ink === "string" ? input.ink : DEFAULT_PALETTE.ink,
    layers
  };
  if (!input) return base;
  if (typeof input.bg === 'string') base.bg = input.bg;
  if (typeof input.ink === 'string') base.ink = input.ink;
  if (Array.isArray(input.layers)) {
    input.layers.forEach((color, index) => {
      if (typeof color === 'string' && color.trim()) {
        base.layers[index] = color;
      }
    });
  }
  return base;
}

function ensureNumerology(input) {
  const base = { ...DEFAULT_NUM };
  if (!input) return base;
  for (const key of Object.keys(base)) {
    const value = Number(input[key]);
    if (Number.isFinite(value) && value !== 0) {
      base[key] = value;
    }
  }
  return base;
function sanitizeNumerology(input) {
  const safe = { ...DEFAULT_NUM };
  if (!input) return safe;
  for (const key of Object.keys(DEFAULT_NUM)) {
    if (Number.isFinite(input[key]) && input[key] !== 0) {
      safe[key] = input[key];
function ensureNumerology(rawNUM) {
  const safe = { ...DEFAULT_NUM };
  if (!rawNUM || typeof rawNUM !== "object") return safe;
  for (const key of Object.keys(DEFAULT_NUM)) {
    if (Number.isFinite(rawNUM[key])) {
      safe[key] = rawNUM[key];
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

// Layer 1: Vesica field. Calm, repeating intersections establish depth with no motion.
function drawVesicaField(ctx, width, height, color, NUM) {
  const columns = NUM.NINE;
  const rows = NUM.SEVEN;
  const marginX = width / NUM.ELEVEN;
  const marginY = height / NUM.ELEVEN;
  const availableWidth = width - marginX * 2;
  const availableHeight = height - marginY * 2;
  const spacingX = availableWidth / (columns - 1);
  const spacingY = availableHeight / (rows - 1);
  const radius = Math.min(spacingX, spacingY) * 0.6;
  const offset = radius / NUM.THREE;

function drawVesicaField(ctx, width, height, color, NUM) {
  ctx.save();
  ctx.lineWidth = Math.max(1, width / NUM.ONEFORTYFOUR);
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

function drawCircle(ctx, cx, cy, radius) {
/**
 * Draw two horizontally offset stroked circles centered on a common y coordinate.
 *
 * @param {CanvasRenderingContext2D} ctx - 2D canvas rendering context to draw into.
 * @param {number} cx - Central x coordinate around which the pair is placed.
 * @param {number} cy - Y coordinate for both circle centers.
 * @param {number} radius - Radius of each circle.
 * @param {number} offset - Horizontal distance from `cx` to each circle center (one at cx - offset, the other at cx + offset).
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
  ctx.globalAlpha = 0.35;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const cx = marginX + col * spacingX;
      const cy = marginY + row * spacingY;
      drawCirclePair(ctx, cx, cy, radius, offset);
  for (let row = -Math.floor(rows / 2); row <= Math.floor(rows / 2); row++) {
    for (let col = -Math.floor(columns / 2); col <= Math.floor(columns / 2); col++) {
      const cx = width / 2 + col * horizontalStep;
      const cy = height / 2 + row * verticalStep;
      drawVesicaPair(ctx, cx, cy, radius, offset);
// Layer 1: Vesica field - intersecting circles provide depth without motion.
function drawVesicaField(ctx, width, height, color, NUM) {
  const cols = NUM.NINE;
  const rows = NUM.SEVEN;
  const marginX = width / NUM.NINE;
  const marginY = height / NUM.NINE;
  const fieldWidth = width - marginX * 2;
  const fieldHeight = height - marginY * 2;
  const horizontalStep = fieldWidth / (cols - 1);
  const verticalStep = fieldHeight / (rows - 1);
  const radius = Math.min(horizontalStep, verticalStep) * 0.6;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4;
  ctx.globalAlpha = 0.28;

  for (let row = 0; row < rows; row += 1) {
    const y = marginY + row * verticalStep;
    const shift = (row % 2 === 0) ? 0 : horizontalStep / 2;
    for (let col = 0; col < cols; col += 1) {
      const x = marginX + shift + col * horizontalStep;
      if (x < marginX * 0.5 || x > width - marginX * 0.5) continue;
      ctx.beginPath();
      ctx.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Second pass: vertical vesica strands reinforce the lattice.
  const verticalCols = NUM.SEVEN;
  const verticalRows = NUM.NINE;
  const verticalStepX = fieldWidth / (verticalCols - 1);
  const verticalStepY = fieldHeight / (verticalRows - 1);
  for (let col = 0; col < verticalCols; col += 1) {
    const x = marginX + col * verticalStepX;
    const shiftY = (col % 2 === 0) ? 0 : verticalStepY / 2;
    for (let row = 0; row < verticalRows; row += 1) {
      const y = marginY + shiftY + row * verticalStepY;
      if (y < marginY * 0.5 || y > height - marginY * 0.5) continue;
      ctx.beginPath();
      ctx.ellipse(x, y, radius * 0.85, radius * 0.85, Math.PI / 2, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawCirclePair(ctx, cx, cy, radius, offset) {
function drawVesicaPair(ctx, cx, cy, radius, offset) {
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
// Layer 2: Tree-of-Life scaffold - ten sephirot nodes plus twenty-two connective paths.
function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, NUM) {
  const centerX = width / 2;
  const marginY = height / NUM.NINE;
  const verticalStep = (height - marginY * 2) / NUM.TWENTYTWO;
  const horizontalUnit = width / NUM.ELEVEN;

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
  const levelY = (multiplier) => marginY + multiplier * verticalStep;
  const lane = (offset) => centerX + offset * horizontalUnit;

  const nodes = [
    { id: 0, x: lane(0), y: levelY(0) },
    { id: 1, x: lane(1.8), y: levelY(NUM.THREE) },
    { id: 2, x: lane(-1.8), y: levelY(NUM.THREE) },
    { id: 3, x: lane(1.4), y: levelY(NUM.SEVEN) },
    { id: 4, x: lane(-1.4), y: levelY(NUM.SEVEN) },
    { id: 5, x: lane(0), y: levelY(NUM.ELEVEN) },
    { id: 6, x: lane(1.4), y: levelY(NUM.ELEVEN + NUM.THREE) },
    { id: 7, x: lane(-1.4), y: levelY(NUM.ELEVEN + NUM.THREE) },
    { id: 8, x: lane(0), y: levelY(NUM.ELEVEN + NUM.SEVEN) },
    { id: 9, x: lane(0), y: levelY(NUM.TWENTYTWO) }
  ];

  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  const paths = [
    [0, 1], [0, 2], [0, 5],
    [1, 2], [1, 3], [1, 5], [1, 6],
    [2, 4], [2, 5], [2, 7],
    [3, 4], [3, 5], [3, 6],
    [4, 5], [4, 7],
    [5, 6], [5, 7], [5, 8],
    [6, 8], [7, 8],
    [7, 9], [8, 9]
    [1, 2], [1, 3], [1, 5],
    [2, 4], [2, 5],
    [3, 4], [3, 5], [3, 6],
    [4, 5], [4, 7],
    [5, 6], [5, 7], [5, 8],
    [6, 7], [6, 8], [6, 9],
    [7, 8], [7, 9],
    [8, 9]
  ];
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
function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, NUM) {
  const nodes = createTreeNodes(width, height, NUM);
  const paths = createTreePaths();

  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.globalAlpha = 0.45;
  ctx.lineWidth = Math.max(1.5, Math.min(width, height) / (NUM.ONEFORTYFOUR / 2));

  for (const [a, b] of paths) {
    const start = nodes[a];
    const end = nodes[b];
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  paths.forEach(([a, b]) => {
  ctx.globalAlpha = 0.6;
  for (const [a, b] of paths) {
    const start = nodeById.get(a);
    const end = nodeById.get(b);
    if (!start || !end) continue;
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
// Layer 2: Tree-of-Life scaffold. Static lines and nodes preserve sacred ordering without animation.
function drawTreeOfLife(ctx, width, height, pathColor, nodeColor, inkColor, NUM) {
  const nodes = createTreeNodes(width, height, NUM);
  const nodeMap = Object.create(null);
  nodes.forEach(node => {
    nodeMap[node.key] = node;
  });

  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = Math.max(1.5, width / NUM.ONEFORTYFOUR);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  TREE_PATH_DEFINITIONS.forEach(path => {
    const from = nodeMap[path.from];
    const to = nodeMap[path.to];
    const card = MAJOR_ARCANA[path.arcanaIndex];
    if (!from || !to || !card) return;

    const alphaBoost = (card.numerology + NUM.THREE) / (NUM.TWENTYTWO * 1.5);
    ctx.globalAlpha = 0.35 + alphaBoost;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    const labelX = (from.x + to.x) / 2;
    const labelY = (from.y + to.y) / 2;
    drawPathLabel(ctx, card.name, labelX, labelY, inkColor, width, NUM);
  });
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = nodeColor;
  ctx.strokeStyle = inkColor;
  ctx.lineWidth = Math.max(1, width / NUM.ONEFORTYFOUR);

  nodes.forEach(node => {
    const radius = computeNodeRadius(node, width, NUM);
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
    drawNodeLabel(ctx, node, radius, inkColor, width, NUM);
  });

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
function createTreeNodes(width, height, NUM) {
  const verticalUnit = height / NUM.ONEFORTYFOUR;
  const spread = width / NUM.ELEVEN;
  const centerX = width / 2;

  return SEPHIROT.map(node => ({
    key: node.key,
    name: node.name,
    numerology: node.numerology,
    lore: node.lore,
    x: centerX + spread * node.xShift,
    y: verticalUnit * node.yUnits
  }));
}

function computeNodeRadius(node, width, NUM) {
  const base = width / NUM.NINETYNINE;
  return base * (1 + node.numerology / NUM.TWENTYTWO);
}

function drawNodeLabel(ctx, node, radius, inkColor, width, NUM) {
  ctx.save();
  ctx.fillStyle = inkColor;
  ctx.globalAlpha = 0.85;
  const fontSize = Math.max(11, (width / NUM.ONEFORTYFOUR) * 1.1);
  ctx.font = `${fontSize}px system-ui, -apple-system, "Segoe UI", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(`${node.name} · ${node.numerology}`, node.x, node.y + radius + 4);
  ctx.restore();
}

function drawPathLabel(ctx, text, x, y, inkColor, width, NUM) {
  ctx.save();
  ctx.fillStyle = inkColor;
  ctx.globalAlpha = 0.6;
  const fontSize = Math.max(9, width / (NUM.ONEFORTYFOUR * 1.2));
  ctx.font = `${fontSize}px system-ui, -apple-system, "Segoe UI", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
  ctx.restore();
}

// Layer 3: Fibonacci curve. One static sampling of a golden spiral keeps the motion implied but still.
function drawFibonacciCurve(ctx, width, height, color, inkColor, NUM) {
  const centerX = width / 2;
  const centerY = height / 2;
  const startRadius = Math.min(width, height) / NUM.ONEFORTYFOUR * NUM.SEVEN;
  const maxRadius = Math.min(width, height) / NUM.THREE;
  const angleStep = (Math.PI * 2) / NUM.THIRTYTHREE;
  const turns = NUM.THREE;

  const points = createGoldenSpiralPoints(centerX, centerY, startRadius, maxRadius, angleStep, turns);
  if (points.length < 2) return;

  ctx.save();
  ctx.globalAlpha = 0.9;
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
function createTreeNodes(width, height, NUM) {
  const baseY = height / NUM.ONEFORTYFOUR;
  const centerX = width / 2;
  const spread = width / NUM.ELEVEN;
  return [
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
}

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

function drawFibonacciCurve(ctx, width, height, color, NUM) {
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
  const goldenRatio = (1 + Math.sqrt(5)) / 2; // Golden Ratio keeps sacred growth steady.
  const centerX = (width / NUM.THREE) * 2;
  const centerY = height / NUM.THREE;
  const scale = (Math.min(width, height) / NUM.NINETYNINE) * NUM.SEVEN;
  const maxTheta = Math.PI * NUM.SEVEN;
  const thetaStep = Math.PI / NUM.TWENTYTWO;

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

function drawHelixLattice(ctx, width, height, strandColorA, strandColorB, rungColor, NUM) {
  ctx.save();

  const steps = NUM.TWENTYTWO;
  const amplitude = height / NUM.THIRTYTHREE;
  const baseline = height * 0.65;
  const frequency = (Math.PI * NUM.ELEVEN) / width;
  const stepWidth = width / steps;

  const strandA = [];
  const strandB = [];
  for (let i = 0; i <= steps; i++) {
    const x = stepWidth * i;
    const yA = baseline + amplitude * Math.sin(frequency * x);
    const yB = baseline + amplitude * Math.sin(frequency * x + Math.PI);
    strandA.push({ x, y: yA });
    strandB.push({ x, y: yB });
  }

  drawHelixStrand(ctx, width, steps, amplitude, frequency, baseline, 0, strandColorA);
  drawHelixStrand(ctx, width, steps, amplitude, frequency, baseline, Math.PI, strandColorB || strandColorA);
  drawHelixRungs(ctx, width, steps, amplitude, frequency, baseline, rungColor);
  ctx.lineWidth = Math.max(1.5, width / NUM.ONEFORTYFOUR);
  drawPolyline(ctx, points);
  ctx.restore();
  tracePolyline(ctx, strandA, strandColorA, 2);
  tracePolyline(ctx, strandB, strandColorB || strandColorA, 2);
  drawHelixRungs(ctx, strandA, strandB, rungColor, NUM);

  // Gentle markers reveal sample points without introducing motion.
  ctx.save();
  ctx.fillStyle = inkColor;
  ctx.globalAlpha = 0.55;
  const markerRadius = Math.max(2, width / NUM.ONEFORTYFOUR);
  const markerStep = Math.max(1, Math.floor(points.length / (NUM.THREE * NUM.ELEVEN)));
  for (let index = 0; index < points.length; index += markerStep) {
    const pt = points[index];
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, markerRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function createGoldenSpiralPoints(centerX, centerY, startRadius, maxRadius, angleStep, turns) {
  const points = [];
  const quarterTurn = Math.PI / 2;
  const maxAngle = Math.PI * 2 * turns;
  for (let angle = 0; angle <= maxAngle; angle += angleStep) {
    const radius = startRadius * Math.pow(GOLDEN_RATIO, angle / quarterTurn);
    if (radius > maxRadius) break;
    points.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    });
  }
  return points;
}

function drawPolyline(ctx, points) {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let index = 1; index < points.length; index += 1) {
    ctx.lineTo(points[index].x, points[index].y);
  }
  ctx.stroke();
}

// Layer 4: Double-helix lattice. Static strands with crossbars create depth without animation.
function drawHelixLattice(ctx, width, height, strandColorA, strandColorB, rungColor, NUM) {
  const marginY = height / NUM.ELEVEN;
  const verticalSpan = height - marginY * 2;
  const centerX = width / 2;
  const amplitude = width / NUM.NINE;
  const steps = NUM.NINETYNINE;
  const turns = NUM.THREE;

  const strandA = createHelixStrandPoints(centerX, marginY, verticalSpan, amplitude, steps, turns, 0);
  const strandB = createHelixStrandPoints(centerX, marginY, verticalSpan, amplitude, steps, turns, Math.PI);
  if (strandA.length < 2 || strandB.length < 2) return;

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
function tracePolyline(ctx, points, color, lineWidth) {
  if (!points.length) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
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
  ctx.save();
  ctx.lineWidth = Math.max(1.5, width / NUM.ONEFORTYFOUR);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.globalAlpha = 0.85;
  ctx.strokeStyle = strandColorA;
  drawPolyline(ctx, strandA);

  ctx.strokeStyle = strandColorB;
  drawPolyline(ctx, strandB);

  ctx.strokeStyle = rungColor;
  ctx.globalAlpha = 0.6;
  const rungCount = NUM.ELEVEN;
  for (let rung = 0; rung <= rungCount; rung += 1) {
    const t = rung / rungCount;
    const index = Math.floor(t * (strandA.length - 1));
    const a = strandA[index];
    const b = strandB[index];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
function drawHelixRungs(ctx, strandA, strandB, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  const rungInterval = Math.max(1, Math.floor(strandA.length / NUM.ELEVEN));
  for (let i = 0; i < strandA.length && i < strandB.length; i += rungInterval) {
    ctx.beginPath();
    ctx.moveTo(strandA[i].x, strandA[i].y);
    ctx.lineTo(strandB[i].x, strandB[i].y);
    ctx.stroke();

    const markerRadius = Math.max(2, width / NUM.ONEFORTYFOUR);
    ctx.beginPath();
    ctx.arc(a.x, a.y, markerRadius, 0, Math.PI * 2);
    ctx.fillStyle = strandColorA;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(b.x, b.y, markerRadius, 0, Math.PI * 2);
    ctx.fillStyle = strandColorB;
    ctx.fill();
  }

  ctx.restore();
  const nodeRadius = Math.min(width, height) / NUM.ONEFORTYFOUR * NUM.THREE;
  for (const node of nodes) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Layer 3: Fibonacci curve - calm logarithmic spiral referencing golden ratio.
function drawFibonacciCurve(ctx, width, height, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const centerX = width * 0.32;
  const centerY = height * 0.68;
  const totalSteps = NUM.THIRTYTHREE;
  const thetaMax = Math.PI * NUM.THREE; // three half-turns keep the curve gentle.
  const growthRate = Math.log(phi) / (Math.PI / 2);
  const baseRadius = Math.min(width, height) / NUM.NINETYNINE * NUM.THIRTYTHREE;

  const points = [];
  for (let i = 0; i <= totalSteps; i += 1) {
    const t = i / totalSteps;
    const theta = t * thetaMax;
    const radius = baseRadius * Math.exp(growthRate * theta);
    const x = centerX + Math.cos(theta) * radius;
    const y = centerY + Math.sin(theta) * radius;
    points.push({ x, y });
  }

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.75;
  strokePolyline(ctx, points);
  ctx.restore();
}

// Layer 4: Double-helix lattice - two static strands with steady crossbars.
function drawHelixLattice(ctx, width, height, strandAColor, strandBColor, rungColor, NUM) {
  const steps = NUM.NINETYNINE;
  const rotations = NUM.THREE; // three gentle twists.
  const marginY = height / NUM.NINE;
  const spanY = height - marginY * 2;
  const midX = width * 0.68;
  const amplitude = width / NUM.ELEVEN;

  const strandA = [];
  const strandB = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const y = marginY + t * spanY;
    const phase = t * Math.PI * rotations;
    const offset = Math.sin(phase) * amplitude;
    strandA.push({ x: midX - offset, y });
    strandB.push({ x: midX + offset, y });
  }

  ctx.save();
  ctx.lineWidth = 2.4;
  ctx.globalAlpha = 0.85;
  ctx.strokeStyle = strandAColor;
  strokePolyline(ctx, strandA);
  ctx.strokeStyle = strandBColor;
  strokePolyline(ctx, strandB);

  // Crossbars anchor the strands; count references twenty-two paths.
  ctx.strokeStyle = rungColor;
  ctx.lineWidth = 1.6;
  ctx.globalAlpha = 0.5;
  const rungCount = NUM.TWENTYTWO;
  for (let i = 0; i <= rungCount; i += 1) {
    const t = i / rungCount;
    const y = marginY + t * spanY;
    const phase = t * Math.PI * rotations;
    const offset = Math.sin(phase) * amplitude;
    ctx.beginPath();
    ctx.moveTo(midX - offset, y);
    ctx.lineTo(midX + offset, y);
    ctx.stroke();
  }
  ctx.restore();
}

// Shared helper: stroke a sequence of points without animation.
function strokePolyline(ctx, points) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

function createHelixStrandPoints(centerX, topY, verticalSpan, amplitude, steps, turns, phase) {
  const points = [];
  for (let step = 0; step <= steps; step += 1) {
    const ratio = step / steps;
    const angle = ratio * turns * Math.PI * 2 + phase;
    const radial = Math.sin(angle);
    const lateral = Math.cos(angle);
    const x = centerX + radial * amplitude * 0.5 + lateral * amplitude * 0.1;
    const y = topY + ratio * verticalSpan;
    points.push({ x, y });
  }
  return points;
}
