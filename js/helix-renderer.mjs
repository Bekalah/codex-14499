/*
  helix-renderer.mjs
  ND-safe static renderer for the layered cosmology in Codex 144:99.

  Layer order (back to front):
    1. Vesica field — repeating intersecting circles anchor the space.
    2. Tree-of-Life scaffold — ten sephirot nodes with twenty-two arcana paths.
    3. Fibonacci curve — calm golden spiral sampled once.
    4. Double-helix lattice — two strands with steady rungs, no motion.

  Every helper is a small pure function; comments document why choices support
  ND-safe, trauma-informed rendering (no animation, calm contrast, offline-first).
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

  fillBackground(ctx, width, height, palette.bg);
  drawVesicaField(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], palette.ink, NUM);
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
}

function fillBackground(ctx, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

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

  ctx.save();
  ctx.lineWidth = Math.max(1, width / NUM.ONEFORTYFOUR);
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.35;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const cx = marginX + col * spacingX;
      const cy = marginY + row * spacingY;
      drawCirclePair(ctx, cx, cy, radius, offset);
    }
  }

  ctx.restore();
}

function drawCirclePair(ctx, cx, cy, radius, offset) {
  ctx.beginPath();
  ctx.arc(cx - offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + offset, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

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
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    drawNodeLabel(ctx, node, radius, inkColor, width, NUM);
  });

  ctx.restore();
}

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
  ctx.lineWidth = Math.max(1.5, width / NUM.ONEFORTYFOUR);
  drawPolyline(ctx, points);
  ctx.restore();

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
