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
  };
}

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
    }
  }

  ctx.restore();
}

function drawCircle(ctx, cx, cy, radius) {
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
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}
