/*
  Testing library/framework: Node.js built-in test runner (node:test) + assert/strict
  Purpose: Validate README structure/claims and presence/contents of index.html and js/helix-renderer.mjs.
  Focus: Sections and assertions derived from PR diff README content (Cosmic Helix Renderer).
*/

import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";

async function findFirstExisting(paths) {
  for (const p of paths) {
    try {
      const full = path.resolve(p);
      await fs.access(full);
      return full;
    } catch (err) {
      // ignore
    }
  }
  return null;
}

async function readIfExists(p) {
  try {
    return await fs.readFile(p, "utf8");
  } catch (err) {
    return null;
  }
}

function hasAll(haystack, needles) {
  const text = String(haystack || "").toLowerCase();
  return needles.every(n => {
    if (n instanceof RegExp) {
      return n.test(haystack);
    }
    return text.includes(String(n).toLowerCase());
  });
}

function looksLikeColor(v) {
  if (typeof v !== "string") {
    return false;
  }
  const s = v.trim().toLowerCase();
  if (s.startsWith("#")) {
    return /^#[0-9a-f]{3,8}$/i.test(s);
  }
  if (
    s.startsWith("rgb(") ||
    s.startsWith("rgba(") ||
    s.startsWith("hsl(") ||
    s.startsWith("hsla(")
  ) {
    return true;
  }
  return /^[a-z]+$/i.test(s);
}

test("README: contains H1 'Cosmic Helix Renderer'", async () => {
  const readme = await findFirstExisting(["README.md","Readme.md","README.MD","README.markdown","README.mdx"]);
  assert.ok(readme, "README not found");
  const md = await readIfExists(readme);
  assert.match(md, /^#\s+Cosmic Helix Renderer/m);
});

test("README: Files section lists index.html, js/helix-renderer.mjs, data/palette.json", async () => {
  const readme = await findFirstExisting(["README.md","Readme.md","README.MD","README.markdown","README.mdx"]);
  const md = await readIfExists(readme);
  assert.match(md, /^##\s+Files/m);
  assert.ok(hasAll(md, ["index.html","js/helix-renderer.mjs","data/palette.json"]));
});

test("README: Rendered Layers list includes four named layers", async () => {
  const readme = await findFirstExisting(["README.md","Readme.md","README.MD","README.markdown","README.mdx"]);
  const md = await readIfExists(readme);
  assert.match(md, /^##\s+Rendered Layers/m);
  assert.ok(hasAll(md, [
    "Vesica field",
    "Tree-of-Life scaffold",
    "Fibonacci curve",
    "Double-helix lattice"
  ]));
});

test("README: ND-safe design notes mention no animation and fallback palette", async () => {
  const readme = await findFirstExisting(["README.md","Readme.md","README.MD","README.markdown","README.mdx"]);
  const md = await readIfExists(readme);
  assert.match(md, /^##\s+ND-safe Design Notes/m);
  assert.ok(hasAll(md, ["No animation","fallback palette"]));
});

test("README: Local Use guidance includes opening index.html and palette override", async () => {
  const readme = await findFirstExisting(["README.md","Readme.md","README.MD","README.markdown","README.mdx"]);
  const md = await readIfExists(readme);
  assert.match(md, /^##\s+Local Use/m);
  assert.ok(hasAll(md, ["Open `?index.html`? directly","data/palette.json"]));
});

test("index.html: exists at root/public/src", async () => {
  const html = await findFirstExisting(["index.html","public/index.html","src/index.html"]);
  assert.ok(html, "index.html not found");
});

test("index.html: contains a 1440x900 canvas", async () => {
  const html = await findFirstExisting(["index.html","public/index.html","src/index.html"]);
  const content = await readIfExists(html);
  assert.match(content, /<canvas[^>]*\b(width\s*=\s*["']?1440["']?[^>]*\bheight\s*=\s*["']?900["']?|height\s*=\s*["']?900["']?[^>]*\bwidth\s*=\s*["']?1440["']?)\b[^>]*>/i);
});

test("index.html: references helix renderer module", async () => {
  const html = await findFirstExisting(["index.html","public/index.html","src/index.html"]);
  const content = await readIfExists(html);
  assert.ok(/helix-renderer\.mjs/i.test(content), "helix-renderer.mjs reference not found");
});

test("helix-renderer: exists in conventional locations", async () => {
  const mod = await findFirstExisting([
    "js/helix-renderer.mjs",
    "src/js/helix-renderer.mjs",
    "public/js/helix-renderer.mjs",
    "web/js/helix-renderer.mjs"
  ]);
  assert.ok(mod, "helix renderer module not found");
});

test("helix-renderer: exports renderHelix (text scan)", async () => {
  const mod = await findFirstExisting(["js/helix-renderer.mjs","src/js/helix-renderer.mjs","public/js/helix-renderer.mjs","web/js/helix-renderer.mjs"]);
  const code = await readIfExists(mod);
  assert.ok(/export\s+function\s+renderHelix\s*\(|export\s*\{[^}]*\brenderHelix\b[^}]*\}/m.test(code), "renderHelix export not detected");
});

test("helix-renderer: avoids animation constructs (ND-safe)", async () => {
  const mod = await findFirstExisting(["js/helix-renderer.mjs","src/js/helix-renderer.mjs","public/js/helix-renderer.mjs","web/js/helix-renderer.mjs"]);
  const code = await readIfExists(mod);
  assert.ok(!(/requestAnimationFrame|setInterval|setTimeout/i.test(code)), "Animation constructs detected");
});

test("helix-renderer: mentions helpers for vesica/tree/fibonacci/helix", async () => {
  const mod = await findFirstExisting(["js/helix-renderer.mjs","src/js/helix-renderer.mjs","public/js/helix-renderer.mjs","web/js/helix-renderer.mjs"]);
  const code = await readIfExists(mod);
  assert.ok(hasAll(code, ["vesica","tree","fibonacci","helix"]), "Layer helper mentions not found");
});

test("palette.json (optional): parses and contains background/ink and >= 6 color-like entries", async () => {
  const palettePath = await findFirstExisting(["data/palette.json","public/data/palette.json","src/data/palette.json"]);
  if (!palettePath) { return; } // skip
  const raw = await readIfExists(palettePath);
  const obj = JSON.parse(raw);

  const keys = Object.keys(obj || {});
  assert.ok(keys.includes("background"), "missing background");
  assert.ok(keys.includes("ink"), "missing ink");

  const colorishValues = Object.values(obj).filter(looksLikeColor);
  assert.ok(colorishValues.length >= 8, "expected at least 8 color-like values (background, ink, +6 hues)");
});