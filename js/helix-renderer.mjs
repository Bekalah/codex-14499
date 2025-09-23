/*
  helix-renderer.mjs
  ND-safe static renderer for the layered cosmology in Codex 144:99.

  Layer order (back to front):
    1. Vesica field (intersecting circles ground the canvas).
    2. Tree-of-Life scaffold (ten sephirot joined by twenty-two paths).
    3. Fibonacci curve (static golden spiral polyline sampled once).
    4. Double-helix lattice (phase-shifted strands with steady crossbars).

  ND-safe commitments:
    - No animation or timers; renderHelix draws the scene once per call.
    - Gentle palette and geometry comments make sensory choices auditable.
    - Small pure helpers keep numerology-driven math easy to inspect offline.
*/

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2; // Golden Ratio stabilizes the Fibonacci layer.

const DEFAULT_WIDTH = 1440;
const DEFAULT_HEIGHT = 900;

const DEFAULT_NUM = Object.freeze({
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  TWENTYTWO: 22,
  THIRTYTHREE: 33,
  NINETYNINE: 99,
  ONEFORTYFOUR: 144
});

const DEFAULT_PALETTE = Object.freeze({
  bg: '#0b0b12',
  ink: '#e8e8f0',
  layers: ['#b1c7ff', '#89f7fe', '#a0ffa1', '#ffd27f', '#f5a3ff', '#d0d0e6']
});

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && !Number.isNaN(value);
}

function ensureNumerology(input) {
  // Merge user numerology while ignoring zero or NaN to keep sacred ratios stable.
  const source = input && typeof input === 'object' ? input : {};
  const result = { ...DEFAULT_NUM };
  for (const key of Object.keys(DEFAULT_NUM)) {
    const value = source[key];
    if (isFiniteNumber(value) && value !== 0) {
      result[key] = value;
    }
  }
  return result;
}

function normalizeColor(value, fallback) {
  return typeof value === 'string' && value.trim().startsWith('#') ? value.trim() : fallback;
}

function ensurePalette(input) {
  // Guarantee six hues even if the palette file is absent, preserving layer contrast offline.
  const base = input && typeof input === 'object' ? input : {};
  const layers = Array.isArray(base.layers) ? base.layers.filter(color => typeof color === 'string') : [];
  const padded = [...layers];
  const defaults = DEFAULT_PALETTE.layers;
  while (padded.length < defaults.length) {
    padded.push(defaults[padded.length]);
  }
  if (padded.length > defaults.length) {
    padded.length = defaults.length;
  }
  return {
    bg: normalizeColor(base.bg, DEFAULT_PALETTE.bg),
    ink: normalizeColor(base.ink, DEFAULT_PALETTE.ink),
    layers: padded
  };
}

function normalizeOptions(opts = {}) {
  // Normalize options so every downstream helper receives predictable dimensions and numerology.
  const NUM = ensureNumerology(opts.NUM || opts.numerology);
  const palette = ensurePalette(opts.palette);
  const width = isFiniteNumber(opts.width) ? opts.width : DEFAULT_WIDTH;
  const height = isFiniteNumber(opts.height) ? opts.height : DEFAULT_HEIGHT;
  return { width, height, palette, NUM };
}

function prepareContext(ctx, width, height, palette) {
  // Reset transforms and paint a calm background so layers remain high contrast without flashing.
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawCircle(ctx, x, y, radius, fill = true) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  if (fill) {
    ctx.fill();
  }
  ctx.stroke();
}

function drawVesica(ctx, width, height, palette, NUM) {
  ctx.save();
  ctx.strokeStyle = palette.layers[0];
  ctx.lineWidth = 1.25;
  ctx.globalAlpha = 0.6;

  // Nine columns and seven rows echo sacred numbers while producing a vesica-style overlap grid.
  const columns = NUM.NINE;
  const rows = NUM.SEVEN;
  // Radius is reduced to 75 percent of the spacing to keep intersections soft rather than overwhelming.
  const radius = Math.min(width / (columns + 2), height / (rows + 2)) * 0.75;
  const offsetX = (width - (columns - 1) * radius) / 2;
  const offsetY = (height - (rows - 1) * radius) / 2;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const cx = offsetX + col * radius;
      const cy = offsetY + row * radius;
      // Each circle is stroked only once to avoid flicker while still suggesting the vesica weave.
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

const TREE_POSITIONS = [
  { key: 'kether', level: 0, column: 0 },
  { key: 'chokmah', level: 1, column: 1 },
  { key: 'binah', level: 1, column: -1 },
  { key: 'chesed', level: 2, column: 1 },
  { key: 'geburah', level: 2, column: -1 },
  { key: 'tiphareth', level: 3, column: 0 },
  { key: 'netzach', level: 4, column: 1 },
  { key: 'hod', level: 4, column: -1 },
  { key: 'yesod', level: 5, column: 0 },
  { key: 'malkuth', level: 6, column: 0 }
];

const TREE_PATHS = [
  ['kether', 'chokmah'], ['kether', 'binah'], ['kether', 'tiphareth'],
  ['chokmah', 'binah'], ['chokmah', 'tiphareth'], ['chokmah', 'chesed'],
  ['binah', 'tiphareth'], ['binah', 'geburah'], ['chesed', 'geburah'],
  ['chesed', 'tiphareth'], ['chesed', 'netzach'], ['geburah', 'tiphareth'],
  ['geburah', 'hod'], ['tiphareth', 'netzach'], ['tiphareth', 'hod'],
  ['netzach', 'hod'], ['netzach', 'yesod'], ['netzach', 'malkuth'],
  ['hod', 'yesod'], ['hod', 'malkuth'], ['yesod', 'malkuth'], ['tiphareth', 'yesod']
];

function mapTreePositions(width, height, NUM) {
  const verticalSpan = height * 0.72;
  const top = height * 0.12;
  // 144/22 calibrates the level spacing so twenty-two paths stay balanced across the height.
  const levelStep = verticalSpan / (NUM.ONEFORTYFOUR / NUM.TWENTYTWO);
  // Width is divided by 3*7 to respect triads and sevens when spacing the columns.
  const horizontalUnit = width / (NUM.THREE * NUM.SEVEN);
  const centerX = width / 2;

  const nodes = new Map();
  for (const node of TREE_POSITIONS) {
    const x = centerX + node.column * horizontalUnit * NUM.THREE;
    const y = top + node.level * levelStep;
    nodes.set(node.key, { x, y });
  }
  return nodes;
}

function drawTree(ctx, width, height, palette, NUM) {
  ctx.save();
  const positions = mapTreePositions(width, height, NUM);

  ctx.strokeStyle = palette.layers[1];
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.8;
  // Paths are drawn before nodes so lines recede gently behind the luminous sephirot.
  for (const [fromKey, toKey] of TREE_PATHS) {
    const from = positions.get(fromKey);
    const to = positions.get(toKey);
    if (!from || !to) {
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  ctx.fillStyle = palette.layers[2];
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 1;
  const nodeRadius = Math.max(8, Math.min(width, height) / NUM.THIRTYTHREE);
  for (const [, pos] of positions) {
    drawCircle(ctx, pos.x, pos.y, nodeRadius, true);
  }

  ctx.restore();
}

function fibonacciPoints(width, height, NUM) {
  // Sample ninety-nine points to keep the static spiral smooth without hinting at motion.
  const samples = NUM.NINETYNINE;
  const centerX = width * 0.32;
  const centerY = height * 0.64;
  const baseRadius = Math.min(width, height) / NUM.THREE;
  const angleStep = (NUM.TWENTYTWO / NUM.SEVEN) * Math.PI / samples;
  const points = [];
  for (let i = 0; i < samples; i += 1) {
    const angle = i * angleStep;
    const radius = baseRadius * Math.pow(GOLDEN_RATIO, angle / (2 * Math.PI));
    const x = centerX + radius * Math.cos(angle);
    const y = centerY - radius * Math.sin(angle);
    points.push({ x, y });
  }
  return points;
}

function drawFibonacci(ctx, width, height, palette, NUM) {
  ctx.save();
  const points = fibonacciPoints(width, height, NUM);
  if (points.length < 2) {
    ctx.restore();
    return;
  }

  ctx.strokeStyle = palette.layers[3];
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.85;
  // The spiral is rendered as a calm polyline so no easing curves imply motion.
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    const p = points[i];
    ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();

  ctx.fillStyle = palette.layers[4];
  ctx.globalAlpha = 0.9;
  const markerRadius = 4;
  const step = Math.max(6, Math.floor(points.length / NUM.TWENTYTWO));
  for (let i = 0; i < points.length; i += step) {
    const p = points[i];
    // Evenly spaced markers act as quiet milestones instead of animated highlights.
    drawCircle(ctx, p.x, p.y, markerRadius, true);
  }

  ctx.restore();
}

function helixPoint(t, phase, width, verticalMargin, usableHeight, amplitude, frequency) {
  const angle = phase + t * frequency * Math.PI;
  const x = width / 2 + Math.sin(angle) * amplitude;
  const y = verticalMargin + t * usableHeight;
  return { x, y };
}

function drawHelix(ctx, width, height, palette, NUM) {
  ctx.save();
  const verticalMargin = height * 0.12;
  const usableHeight = height - verticalMargin * 2;
  // Amplitude is governed by eleven to keep the helix within gentle bounds.
  const amplitude = width / NUM.ELEVEN;
  // Frequency leans on 3 and 7, scaled by 22, to honor the requested numerology set.
  const frequency = NUM.THREE + NUM.SEVEN / NUM.TWENTYTWO;
  const samples = NUM.ONEFORTYFOUR;

  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.9;

  function drawStrand(color, phase) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let i = 0; i <= samples; i += 1) {
      const t = i / samples;
      const point = helixPoint(t, phase, width, verticalMargin, usableHeight, amplitude, frequency);
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }
    ctx.stroke();
  }

  drawStrand(palette.layers[5], 0);
  drawStrand(palette.layers[4], Math.PI);

  // Crossbars tie the two strands without implying motion; 33 anchors yield 22 calm rungs.
  const rungCount = NUM.THIRTYTHREE - NUM.ELEVEN;
  ctx.strokeStyle = palette.ink;
  ctx.globalAlpha = 0.6;
  const rungStep = Math.max(1, rungCount - 1);
  for (let i = 0; i < rungCount; i += 1) {
    const t = i / rungStep;
    const a = helixPoint(t, 0, width, verticalMargin, usableHeight, amplitude, frequency);
    const b = helixPoint(t, Math.PI, width, verticalMargin, usableHeight, amplitude, frequency);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}

function renderHelix(ctx, opts = {}) {
  if (!ctx) {
    return;
  }

  const canvas = ctx.canvas || { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
  const normalized = normalizeOptions({
    ...opts,
    width: opts.width || canvas.width || DEFAULT_WIDTH,
    height: opts.height || canvas.height || DEFAULT_HEIGHT
  });

  const { width, height, palette, NUM } = normalized;

  prepareContext(ctx, width, height, palette);

  ctx.save();
  ctx.translate((canvas.width - width) / 2, (canvas.height - height) / 2);

  // Paint layers from background to foreground so overlaps stay coherent and legible.
  drawVesica(ctx, width, height, palette, NUM);
  drawTree(ctx, width, height, palette, NUM);
  drawFibonacci(ctx, width, height, palette, NUM);
  drawHelix(ctx, width, height, palette, NUM);

  ctx.restore();
}

export {
  DEFAULT_NUM,
  DEFAULT_PALETTE,
  GOLDEN_RATIO,
  ensureNumerology,
  ensurePalette,
  normalizeOptions,
  prepareContext,
  drawCircle,
  drawVesica,
  drawTree,
  fibonacciPoints,
  drawFibonacci,
  helixPoint,
  drawHelix,
  renderHelix
};
