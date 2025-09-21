/**
 * @jest-environment jsdom
 *
 * Test targets:
 *  - Inline module script in index.html that imports renderHelix, fetches palette.json,
 *    sets CSS custom properties, updates status text, and invokes renderHelix with NUM constants.
 *
 * Testing library/framework:
 *  - Primary: Jest (+ jsdom). If the repository uses Vitest, these tests also run by using vi.* when available.
 */

const mock = globalThis.vi || globalThis.jest;
const fn = mock ? mock.fn.bind(mock) : (...args) => { throw new Error('No mocking framework detected (jest or vitest)'); };

const HTML_SOURCE = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Cosmic Helix Renderer (ND-safe, Offline)</title>
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="color-scheme" content="light dark">
  <style>
    :root { --bg: #0b0b12; --ink: #e8e8f0; --muted: #a6a6c1; }
  </style>
</head>
<body>
  <header>
    <div><strong>Cosmic Helix Renderer</strong> &mdash; layered sacred geometry (offline, ND-safe)</div>
    <div class="status" id="status">Loading palette...</div>
  </header>
  <canvas id="stage" width="1440" height="900" aria-label="Layered sacred geometry canvas"></canvas>
  <script type="module">
    import { renderHelix } from "./js/helix-renderer.mjs";

    const statusEl = document.getElementById("status");
    const canvas = document.getElementById("stage");
    const ctx = canvas ? canvas.getContext("2d") : null;

    function setStatus(text) {
      if (statusEl) {
        statusEl.textContent = text;
      }
    }

    async function loadJSON(path) {
      try {
        const response = await fetch(path, { cache: "no-store" });
        if (!response || !response.ok) return null;
        return await response.json();
      } catch (error) {
        return null;
      }
    }

    const FALLBACK = {
      palette: {
        bg: "#0b0b12",
        ink: "#e8e8f0",
        layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
      }
    };

    const paletteData = await loadJSON("./data/palette.json");
    const activePalette = paletteData ?? FALLBACK.palette;
    const statusMessage = paletteData ? "Palette loaded." : "Palette missing; using safe fallback.";

    const rootStyle = document.documentElement.style;
    rootStyle.setProperty("--bg", activePalette.bg);
    rootStyle.setProperty("--ink", activePalette.ink);
    rootStyle.setProperty("--muted", "#a6a6c1");

    const NUM = Object.freeze({
      THREE: 3, SEVEN: 7, NINE: 9, ELEVEN: 11,
      TWENTYTWO: 22, THIRTYTHREE: 33, NINETYNINE: 99, ONEFORTYFOUR: 144
    });

    if (!ctx) {
      setStatus(statusMessage + " Canvas context unavailable; rendering skipped.");
    } else {
      setStatus(statusMessage);
      renderHelix(ctx, {
        width: canvas.width,
        height: canvas.height,
        palette: activePalette,
        NUM
      });
    }
  </script>
</body>
</html>`;

function extractAndTransformInlineModule(html) {
  const startMatch = html.match(/<script[^>]*type=["']module["'][^>]*>/i);
  if (!startMatch) { throw new Error("Inline module <script type='module'> not found"); }
  const startIndex = startMatch.index + startMatch[0].length;
  const rest = html.slice(startIndex);
  const endOffset = rest.toLowerCase().indexOf('</script>');
  if (endOffset === -1) { throw new Error("Inline module <script type='module'> not found"); }
  let code = rest.slice(0, endOffset);

  // Replace ESM import with access to a global mock
  code = code.replace(
    /import\s*\{\s*renderHelix\s*\}\s*from\s*["'][^"']+["'];?/,
    'const renderHelix = globalThis.__test__mocks.renderHelix;'
  );

  // Wrap in async IIFE to support top-level await semantics during evaluation
  return 'return (async () => {\n' + code + '\n})();';
}

// Execute the transformed script in current jsdom context
async function runInlineScript({ withCanvas = true } = {}) {
  // Reset DOM to minimal structure reflecting the HTML (without embedding script again)
  document.body.innerHTML = `
    <header>
      <div><strong>Cosmic Helix Renderer</strong> &mdash; layered sacred geometry (offline, ND-safe)</div>
      <div class="status" id="status">Loading palette...</div>
    </header>
    ${withCanvas ? '<canvas id="stage" width="1440" height="900" aria-label="Layered sacred geometry canvas"></canvas>' : ''}
  `;

  // Provide a default canvas.getContext unless overridden in a test
  if (withCanvas) {
    // Some runners have getContext returning null; stub a minimal ctx by default
    HTMLCanvasElement.prototype.getContext = fn(() => ({}));
  }

  // Global renderHelix mock holder
  globalThis.__test__mocks = { renderHelix: fn() };

  const transformed = extractAndTransformInlineModule(HTML_SOURCE);
  const runner = new Function('document', 'fetch', 'globalThis', 'HTMLCanvasElement', transformed);
  return await runner(document, globalThis.fetch, globalThis, HTMLCanvasElement);
}

function getCssVar(name) {
  return document.documentElement.style.getPropertyValue(name);
}

afterEach(() => {
  try { jest?.restoreAllMocks?.(); } catch {}
  try { vi?.restoreAllMocks?.(); } catch {}
  delete globalThis.__test__mocks;
  delete globalThis.fetch;
});

describe("index.html inline module", () => {
  it("renders with loaded palette, updates CSS vars and calls renderHelix with expected args", async () => {
    // Arrange: successful palette fetch returning a direct palette object
    const palette = { bg: "#101010", ink: "#fafafa", layers: ["#111", "#222"] };
    globalThis.fetch = fn().mockResolvedValue({ ok: true, json: async () => palette });

    // Act
    await runInlineScript({ withCanvas: true });

    // Assert: status
    const statusEl = document.getElementById("status");
    expect(statusEl).toBeTruthy();
    expect(statusEl.textContent).toBe("Palette loaded.");

    // CSS variables applied
    expect(getCssVar("--bg")).toBe(palette.bg);
    expect(getCssVar("--ink")).toBe(palette.ink);
    expect(getCssVar("--muted")).toBe("#a6a6c1");

    // renderHelix invocation
    const renderHelix = globalThis.__test__mocks.renderHelix;
    expect(renderHelix).toHaveBeenCalledTimes(1);

    const [ctxArg, options] = renderHelix.mock.calls[0];
    expect(typeof ctxArg).toBe("object");
    expect(options).toMatchObject({
      width: 1440,
      height: 900,
      palette
    });

    // NUM constants correctness
    expect(options.NUM).toEqual({
      THREE: 3,
      SEVEN: 7,
      NINE: 9,
      ELEVEN: 11,
      TWENTYTWO: 22,
      THIRTYTHREE: 33,
      NINETYNINE: 99,
      ONEFORTYFOUR: 144
    });
  });

  it("falls back when fetch rejects, sets fallback CSS and still calls renderHelix", async () => {
    // Arrange: fetch rejects to simulate offline/blocked
    globalThis.fetch = fn().mockRejectedValue(new Error("offline"));

    await runInlineScript({ withCanvas: true });

    // Assert: status reflects fallback
    const statusEl = document.getElementById("status");
    expect(statusEl.textContent).toBe("Palette missing; using safe fallback.");

    // Fallback colors applied
    expect(getCssVar("--bg")).toBe("#0b0b12");
    expect(getCssVar("--ink")).toBe("#e8e8f0");
    expect(getCssVar("--muted")).toBe("#a6a6c1");

    // renderHelix called with fallback palette
    const renderHelix = globalThis.__test__mocks.renderHelix;
    expect(renderHelix).toHaveBeenCalledTimes(1);
    const [, options] = renderHelix.mock.calls[0];
    expect(options.palette).toEqual({
      bg: "#0b0b12",
      ink: "#e8e8f0",
      layers: ["#b1c7ff", "#89f7fe", "#a0ffa1", "#ffd27f", "#f5a3ff", "#d0d0e6"]
    });
  });

  it("handles non-ok fetch (404) the same as missing palette, using fallback", async () => {
    globalThis.fetch = fn().mockResolvedValue({ ok: false });

    await runInlineScript({ withCanvas: true });

    const statusEl = document.getElementById("status");
    expect(statusEl.textContent).toBe("Palette missing; using safe fallback.");

    const renderHelix = globalThis.__test__mocks.renderHelix;
    expect(renderHelix).toHaveBeenCalledTimes(1);
  });

  it("appends canvas-unavailable note when getContext returns null (no rendering)", async () => {
    const palette = { bg: "#121212", ink: "#f0f0f0", layers: ["#123", "#456"] };
    globalThis.fetch = fn().mockResolvedValue({ ok: true, json: async () => palette });

    // Force getContext to return null
    HTMLCanvasElement.prototype.getContext = fn(() => null);

    await runInlineScript({ withCanvas: true });

    const statusEl = document.getElementById("status");
    expect(statusEl.textContent).toBe("Palette loaded. Canvas context unavailable; rendering skipped.");

    // renderHelix must NOT be called when ctx is unavailable
    expect(globalThis.__test__mocks.renderHelix).not.toHaveBeenCalled();

    // CSS still updated from loaded palette
    expect(getCssVar("--bg")).toBe(palette.bg);
    expect(getCssVar("--ink")).toBe(palette.ink);
  });

  it("works gracefully when the status element is missing (no throw, still updates CSS and render)", async () => {
    const palette = { bg: "#0c0c0c", ink: "#ededed", layers: [] };
    globalThis.fetch = fn().mockResolvedValue({ ok: true, json: async () => palette });

    // Build DOM without the status element
    document.body.innerHTML = `
      <header>
        <div><strong>Cosmic Helix Renderer</strong></div>
        <!-- intentionally no #status -->
      </header>
      <canvas id="stage" width="1440" height="900" aria-label="Layered sacred geometry canvas"></canvas>
    `;
    HTMLCanvasElement.prototype.getContext = fn(() => ({}));
    globalThis.__test__mocks = { renderHelix: fn() };

    // Execute
    const transformed = extractAndTransformInlineModule(HTML_SOURCE);
    const runner = new Function('document', 'fetch', 'globalThis', 'HTMLCanvasElement', transformed);
    await expect(runner(document, globalThis.fetch, globalThis, HTMLCanvasElement)).resolves.toBeUndefined();

    // Assert: CSS vars set, render called
    expect(getCssVar("--bg")).toBe(palette.bg);
    expect(getCssVar("--ink")).toBe(palette.ink);
    expect(globalThis.__test__mocks.renderHelix).toHaveBeenCalledTimes(1);
  });

  it("when canvas element is missing entirely, sets status with canvas-unavailable suffix and does not render", async () => {
    globalThis.fetch = fn().mockRejectedValue(new Error("no file"));

    await runInlineScript({ withCanvas: false });

    const statusEl = document.getElementById("status");
    expect(statusEl.textContent).toBe("Palette missing; using safe fallback. Canvas context unavailable; rendering skipped.");

    expect(globalThis.__test__mocks.renderHelix).not.toHaveBeenCalled();
  });
});