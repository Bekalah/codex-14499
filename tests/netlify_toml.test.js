/**
 * Tests for Netlify configuration (netlify.toml).
 *
 * Framework note:
 * - These tests are written to be compatible with Jest/Vitest (describe/test/expect).
 * - If the project uses Mocha, `expect` will come from chai if configured,
 *   otherwise Node's assert can be swapped in easily.
 *
 * Scope:
 * - Focus on validating the contents relevant to the provided diff:
 *   [build], [build.environment], [[headers]] for "/*", and specific security headers.
 */

const fs = require('fs');
const path = require('path');

// Utility: Read netlify.toml as text. We avoid adding dependencies (no TOML parser).
function readNetlifyToml() {
  const p = path.resolve(process.cwd(), 'netlify.toml');
  const raw = fs.readFileSync(p, 'utf8');
  return raw.replace(/\r\n/g, '\n'); // normalize line endings
}

// Utility: naive block extractors (string/regex based) to validate presence and values.
function getBlock(raw, headerRegex) {
  const lines = raw.split('\n');
  const startIdx = lines.findIndex((l) => headerRegex.test(l.trim()));
  if (startIdx === -1) return null;
  // Capture until next top-level header ([...] or [[...]]) or EOF
  const block = [];
  for (let i = startIdx + 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (/^\[\[?.+?\]$/.test(trimmed)) break;
    block.push(lines[i]);
  }
  return { startLine: startIdx + 1, lines: block };
}

function findKeyValue(blockLines, key) {
  const re = new RegExp(`^\\s*${key}\\s*=\\s*"(.*)"\\s*$`);
  for (const line of blockLines) {
    const m = line.match(re);
    if (m) return m[1];
  }
  return undefined;
}

function blockIncludesLine(blockLines, pattern) {
  const re = typeof pattern === 'string' ? new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) : pattern;
  return blockLines.some((l) => re.test(l));
}

describe('netlify.toml configuration', () => {
  let raw;

  beforeAll(() => {
    raw = readNetlifyToml();
  });

  test('file exists and is non-empty', () => {
    expect(typeof raw).toBe('string');
    expect(raw.length).toBeGreaterThan(0);
  });

  describe('[build] block', () => {
    test('has [build] with publish="." and command=""', () => {
      const build = getBlock(raw, /^\[build\]$/);
      expect(build).not.toBeNull();
      const publish = findKeyValue(build.lines, 'publish');
      const command = findKeyValue(build.lines, 'command');
      expect(publish).toBe('.');
      expect(command).toBe('');
    });

    test('has [build.environment] with GIT_LFS_ENABLED="true"', () => {
      const env = getBlock(raw, /^\[build\.environment\]$/);
      expect(env).not.toBeNull();
      const lfs = findKeyValue(env.lines, 'GIT_LFS_ENABLED');
      expect(lfs).toBe('true');
    });
  });

  describe('[[headers]] block for "/*"', () => {
    test('has a headers block targeting /*', () => {
      // Find [[headers]] then check next block for = "/*"
      const lines = raw.split('\n');
      const headerIdx = lines.findIndex((l) => l.trim() === '[[headers]]');
      expect(headerIdx).toBeGreaterThanOrEqual(0);

      // Next non-empty line should include: for = "/*"
      const rest = lines.slice(headerIdx + 1).map((s) => s.trim()).filter(Boolean);
      const forLine = rest.find((l) => /^for\s*=\s*"\s*\/\*\s*"$/ .test(l) || /^for\s*=\s*"\s*\/\*\s*"$/.test(l));
      // Be lenient: simple regex for = "/*"
      const forLineLenient = rest.find((l) => /^for\s*=\s*"\s*\/\*\s*"\s*$/.test(l) || /for\s*=\s*"\s*\/\*\s*"/.test(l));
      expect(forLine || forLineLenient).toBeTruthy();
    });

    test('contains [headers.values] with required security headers and exact values', () => {
      // Extract the [headers.values] sub-block following a [[headers]] occurrence.
      const afterHeaders = raw.split('\n').slice(raw.split('\n').findIndex((l) => l.trim() === '[[headers]]') + 1);
      const sub = afterHeaders.join('\n');

      // Get [headers.values] block
      const valuesBlock = getBlock(sub, /^\[headers\.values\]$/);
      expect(valuesBlock).not.toBeNull();

      const expected = {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Content-Security-Policy': "default-src 'self' https: data:; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https:; script-src 'self' https:; connect-src 'self' https:; frame-ancestors 'none';",
      };

      for (const [k, v] of Object.entries(expected)) {
        const actual = findKeyValue(valuesBlock.lines, k.replace(/-/g, '-'));
        expect(actual).toBe(v);
      }
    });

    test('CSP includes frame-ancestors none and restricts to self/https/data where applicable', () => {
      const afterHeaders = raw.split('\n').slice(raw.split('\n').findIndex((l) => l.trim() === '[[headers]]') + 1);
      const valuesBlock = getBlock(afterHeaders.join('\n'), /^\[headers\.values\]$/);
      expect(valuesBlock).not.toBeNull();

      const csp = findKeyValue(valuesBlock.lines, 'Content-Security-Policy');
      expect(csp).toBeDefined();
      expect(csp).toEqual(expect.stringContaining("frame-ancestors 'none'"));
      expect(csp).toEqual(expect.stringContaining("default-src 'self' https: data:"));
      expect(csp).toEqual(expect.stringContaining("img-src 'self' https: data:"));
      expect(csp).toEqual(expect.stringContaining("style-src 'self' 'unsafe-inline' https:"));
      expect(csp).toEqual(expect.stringContaining("script-src 'self' https:"));
      expect(csp).toEqual(expect.stringContaining("connect-src 'self' https:"));
    });
  });

  describe('robustness and formatting tolerance', () => {
    test('tolerates extra whitespace around equals and values', () => {
      // Ensure our regex logic is robust by spot-checking that it matches a "key = \"value\"" style
      const build = getBlock(raw, /^\[build\]$/);
      expect(build).not.toBeNull();
      // It should match even if multiple spaces exist; here we simply verify our parsing captured known keys
      const keys = ['publish', 'command'];
      for (const k of keys) {
        const v = findKeyValue(build.lines, k);
        expect(v).toBeDefined();
      }
    });

    test('does not contain multiple conflicting [[headers]] for "/*"', () => {
      const lines = raw.split('\n');
      const headerPositions = [];
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '[[headers]]') {
          headerPositions.push(i);
        }
      }

      // Count how many of these have for = "/*"
      let countForAll = 0;
      for (const idx of headerPositions) {
        const rest = lines.slice(idx + 1).map((s) => s.trim());
        const forLine = rest.find((l) => /^for\s*=\s*"\s*\/\*\s*"\s*$/.test(l) || /for\s*=\s*"\s*\/\*\s*"/.test(l));
        if (forLine) countForAll++;
      }

      // We expect exactly one block for /* based on the diff.
      expect(countForAll).toBe(1);
    });
  });

  describe('failure scenarios (negative assertions)', () => {
    test('denies permissive CSP sources such as * or http: in default-src', () => {
      const cspLine = raw.split('\n').find((l) => l.includes('Content-Security-Policy'));
      expect(cspLine).toBeTruthy();
      // Ensure not using wildcard or http: in default-src
      expect(cspLine).not.toMatch(/default-src[^;]*\*/);
      expect(cspLine).not.toMatch(/default-src[^;]*\shttp:/);
    });

    test('X-Frame-Options must be DENY (not SAMEORIGIN or ALLOW-FROM)', () => {
      const xfoLine = raw.split('\n').find((l) => /\bX-Frame-Options\s*=/.test(l));
      expect(xfoLine).toBeTruthy();
      expect(xfoLine).toMatch(/X-Frame-Options\s*=\s*"DENY"/);
      expect(xfoLine).not.toMatch(/X-Frame-Options\s*=\s*"(SAMEORIGIN|ALLOW-FROM)/);
    });
  });
});