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
const PKG_PATH = path.join(ROOT, 'package.json');

/**
 * Read and parse a JSON file from the data directory, returning a fallback when the file is missing.
 *
 * @param {string} filename - Path relative to the data directory.
 * @param {*} [fallback=null] - Value to return if the file does not exist (ENOENT).
 * @returns {*} The parsed JSON value, or the provided fallback when the file is absent.
 * @throws {Error} If reading or parsing fails for reasons other than a missing file.
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
 * Build a minified codex JSON bundle from data files and write it to the distribution directory.
 *
 * Reads constants.json, nodes.json, citations.json, and palette.json (each with a fallback)
 * in parallel, composes a payload containing a generated_at ISO timestamp plus the read data,
 * ensures the dist directory exists, writes the minified JSON payload to the configured output
 * path, and logs the relative output path and byte size.
 *
 * @return {Promise<void>} Resolves when the bundle has been written.
 */
async function buildBundle() {
  const [pkgRaw, constants, nodes, citations, palette] = await Promise.all([
    fs.readFile(PKG_PATH, 'utf8').catch(() => null),
    readJSON('constants.json', {}),
    readJSON('nodes.json', []),
    readJSON('citations.json', []),
    readJSON('palette.json', null)
  ]);

  const pkg = pkgRaw ? JSON.parse(pkgRaw) : {};

  const payload = {
    name: typeof pkg.name === 'string' ? pkg.name : 'codex-14499',
    version: typeof pkg.version === 'string' ? pkg.version : '0.0.0',
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
