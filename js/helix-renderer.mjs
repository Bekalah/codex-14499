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

// Public entry point: orchestrates the four calm layers.
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

// Prepare the canvas by clearing previous content and filling the calm background.
function prepareCanvas(ctx, width, height, bgColor) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// Layer 1: Vesica field keeps the space grounded with intersecting circles.
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

// Layer 2: Tree-of-Life scaffold with ten sephirot and twenty-two connective paths.
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

// Layer 3: Fibonacci spiral traced as a calm polyline with 99 samples.
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

// Layer 4: Double-helix lattice with steady crossbars for depth.
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

// Compute a point along a sine-based helix strand.
function helixPoint(t, phase, width, verticalMargin, usableHeight, amplitude, waveFrequency) {
  const centerX = width / 2;
  const wave = Math.sin((waveFrequency * Math.PI * t) + phase);
  const x = centerX + wave * amplitude;
  const y = verticalMargin + usableHeight * t;
  return { x, y };
}

// Normalize canvas options into a calm, predictable configuration.
function normalizeOptions(opts) {
  const width = Number.isFinite(opts.width) ? opts.width : DEFAULT_DIMENSIONS.width;
  const height = Number.isFinite(opts.height) ? opts.height : DEFAULT_DIMENSIONS.height;
  const palette = ensurePalette(opts.palette);
  const NUM = ensureNumerology(opts.NUM);
  return { width, height, palette, NUM };
}

// Ensure palette has background, ink, and six layer colors.
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

// Ensure numerology constants include the sacred anchors; missing values fall back to defaults.
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

// Helper: stroke or fill a circle while keeping alpha and line width intact.
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
