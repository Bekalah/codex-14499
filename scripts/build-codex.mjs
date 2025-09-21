#!/usr/bin/env node
/*
  build-codex.mjs
  Local-only build step that assembles the static data files into a single minified JSON bundle.
  This honors the offline-first requirement by avoiding external requests or toolchains.
*/

import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const DIST_DIR = path.join(ROOT, 'dist');
const OUTPUT_PATH = path.join(DIST_DIR, 'codex.min.json');

/**
 * Read and parse a JSON file from the data directory, returning a fallback if the file is missing.
 *
 * Attempts to read and JSON-parse the file at DATA_DIR/filename. If the file does not exist (ENOENT),
 * returns `fallback` instead so local builds can continue. Any other I/O or parse errors are propagated.
 *
 * @param {string} filename - Relative filename inside the data directory (e.g., 'constants.json').
 * @param {*} [fallback=null] - Value to return if the file is missing; defaults to `null`.
 * @returns {*} The parsed JSON value from the file, or the provided `fallback` when the file is not found.
 * @throws {Error} Rethrows any non-ENOENT filesystem or JSON parsing errors.
 */
async function readJSON(filename, fallback = null) {
  const fullPath = path.join(DATA_DIR, filename);
  try {
    const raw = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    // Local builds must proceed even if optional files are missing.
    if (error.code !== 'ENOENT') {
      throw error;
    }
    return fallback;
  }
}

/**
 * Assemble static data files into a single minified JSON bundle and write it to dist/codex.min.json.
 *
 * Reads optional JSON files from the data directory (using safe fallbacks), constructs a payload
 * containing a generated_at ISO timestamp plus constants, nodes, citations, and palette, ensures
 * the dist directory exists, writes the serialized payload to OUTPUT_PATH, and logs the relative
 * output path and byte size.
 *
 * @return {Promise<void>} Resolves when the bundle has been written to disk.
 */
async function buildBundle() {
  const [constants, nodes, citations, palette] = await Promise.all([
    readJSON('constants.json', {}),
    readJSON('nodes.json', []),
    readJSON('citations.json', []),
    readJSON('palette.json', null)
  ]);

  const payload = {
    generated_at: new Date().toISOString(),
    constants,
    nodes,
    citations,
    palette
  };

  await fs.mkdir(DIST_DIR, { recursive: true });
  const json = JSON.stringify(payload);
  await fs.writeFile(OUTPUT_PATH, json, 'utf8');
  const size = Buffer.byteLength(json);
  console.log(`[build] wrote ${path.relative(ROOT, OUTPUT_PATH)} (${size} bytes)`);
}

buildBundle().catch(error => {
  console.error('[build] failed:', error);
  process.exitCode = 1;
});
