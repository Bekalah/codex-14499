#!/usr/bin/env node
/*
  build-dist.mjs
  Offline bundler that assembles the Oracle of Constants into a single minified JSON payload.
  Trauma-informed notes:
    - No network calls are made; everything reads from the local filesystem.
    - Outputs stay minified to support lightweight CDN mirrors without extra tooling.
*/

import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");
const distDir = path.join(repoRoot, "dist");

const registryFiles = {
  numbers: "registry/constants/numbers.json",
  tarot: "registry/constants/tarot.json",
  angels: "registry/constants/angels.json",
  demons: "registry/constants/demons.json",
  spine33: "registry/constants/spine33.json"
};

function normalizeJSON(value) {
  // Pure helper: ensures parsed JSON is returned as-is or throws a descriptive error.
  if (typeof value !== "string") {
    throw new Error("normalizeJSON expects a UTF-8 string");
  }
  return JSON.parse(value);
}

async function readJSON(relativePath) {
  // Pure async helper to read a JSON file from the repository root.
  const absolute = path.join(repoRoot, relativePath);
  const data = await fs.readFile(absolute, "utf8");
  return normalizeJSON(data);
}

async function buildBundle() {
  const pkgRaw = await fs.readFile(path.join(repoRoot, "package.json"), "utf8");
  const pkg = JSON.parse(pkgRaw);

  const payload = {
    name: "codex-14499-oracle",
    version: pkg.version,
    generated: new Date().toISOString(),
    sources: {}
  };

  for (const [key, relPath] of Object.entries(registryFiles)) {
    // Each dataset is copied verbatim to keep comments impossible and lore intact.
    payload.sources[key] = await readJSON(relPath);
  }

  await fs.mkdir(distDir, { recursive: true });
  const outputPath = path.join(distDir, "codex.min.json");
  await fs.writeFile(outputPath, JSON.stringify(payload));
  return outputPath;
}

buildBundle()
  .then((outPath) => {
    console.log(`Bundled constants written to ${outPath}`);
  })
  .catch((error) => {
    console.error("Failed to build constants bundle:", error);
    process.exitCode = 1;
  });
