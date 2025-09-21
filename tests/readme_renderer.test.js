/**
 * README_RENDERER.md content contract tests
 *
 * Framework: Jest-style (compatible with Vitest)
 * Focus: Validate the content introduced/changed in README_RENDERER.md per the PR diff.
 * These are structural/content assertions that keep the doc accurate and actionable.
 */

const fs = require('fs');
const path = require('path');

function normalizeNewlines(s) {
  return s.replace(/\r\n/g, '\n');
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Lightweight recursive search for a filename anywhere in the repo (excluding heavy dirs)
function findFile(startDir, targetBasename, maxDirs = 8000) {
  const ignored = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', '.next', '.turbo', '.cache', 'out']);
  const queue = [startDir];
  let visited = 0;

  while (queue.length && visited < maxDirs) {
    const current = queue.shift();
    visited += 1;
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch (err) {
      continue;
    }
    for (const ent of entries) {
      if (ent.name === targetBasename && ent.isFile()) {
        return path.join(current, ent.name);
      }
      if (ent.isDirectory() && !ignored.has(ent.name)) {
        queue.push(path.join(current, ent.name));
      }
    }
  }
  return null;
}

function getSection(md, heading) {
  const re = new RegExp('^##\\s*' + escapeRegExp(heading) + '\\s*\\n([\\s\\S]*?)(?=^##\\s|\\Z)', 'mi');
  const m = md.match(re);
  return m ? m[1] : null;
}

describe('README_RENDERER.md - content contract', () => {
  const repoRoot = process.cwd();
  const readmeFilePath = findFile(repoRoot, 'README_RENDERER.md');

  test('README_RENDERER.md file exists in the repository', () => {
    expect(readmeFilePath).toBeTruthy();
    expect(fs.existsSync(readmeFilePath)).toBe(true);
  });

  // Load content once for the rest of tests (guard if not found to produce clearer failure)
  const md = (() => {
    if (!readmeFilePath || !fs.existsSync(readmeFilePath)) {
      return '';
    }
    return normalizeNewlines(fs.readFileSync(readmeFilePath, 'utf8'));
  })();

  test('Has H1 title and purpose statement about static offline renderer', () => {
    expect(md).toMatch(/^#\s*Cosmic Helix Renderer\s*$/m);
    expect(md).toMatch(/Static offline HTML5 canvas renderer/i);
    expect(md).toMatch(/no\s+server.*network access is required\./i);
  });

  test('Sections appear in a sensible order', () => {
    const order = [
      'Files',
      'Layer Stack',
      'Numerology Anchors',
      'Palette and Fallback',
      'ND-safe Design Choices',
      'Offline Use'
    ];
    const positions = order.map(h => md.search(new RegExp(`^##\\s*${escapeRegExp(h)}\\s*$`, 'm')));
    positions.forEach((pos, i) => expect({ heading: order[i], pos }).toEqual(expect.objectContaining({ pos: expect.any(Number) })));
    // All headings must exist
    positions.forEach(pos => expect(pos).toBeGreaterThanOrEqual(0));
    // Ensure strictly increasing
    for (let i = 1; i < positions.length; i++) {
      expect(positions[i]).toBeGreaterThan(positions[i - 1]);
    }
  });

  describe('Files section', () => {
    const section = getSection(md, 'Files');

    test('Files section exists', () => {
      expect(section).toBeTruthy();
    });

    test('Enumerates key artifacts with code formatting', () => {
      expect(section).toMatch(/`index\.html`/);
      expect(section).toMatch(/`js\/helix-renderer\.mjs`/);
      expect(section).toMatch(/`data\/palette\.json`/);
      expect(section).toMatch(/`README_RENDERER\.md`/);
    });
  });

  describe('Layer Stack', () => {
    const section = getSection(md, 'Layer Stack');

    test('Describes four specific layers in numbered order, each labeled with Layer N', () => {
      expect(section).toBeTruthy();
      const items = Array.from(section.matchAll(/^\s*\d+\.\s+\*\*(.+?)\*\*.*?\(Layer\s*(\d+)\)/gmi));
      expect(items.length).toBe(4);

      const names = items.map(m => m[1].toLowerCase());
      const nums = items.map(m => m[2]);
      expect(nums).toEqual(['1', '2', '3', '4']);

      expect(names[0]).toContain('vesica');
      expect(names[1]).toContain('tree-of-life');
      expect(names[2]).toContain('fibonacci');
      expect(names[3]).toContain('double-helix');
    });
  });

  describe('Numerology Anchors', () => {
    const section = getSection(md, 'Numerology Anchors');

    test('Mentions sacred constants and their role', () => {
      expect(section).toBeTruthy();
      ['3','7','9','11','22','33','99','144'].forEach(n => {
        expect(section).toMatch(new RegExp(`\\b${n}\\b`));
      });
      expect(section).toMatch(/grid counts|sampling density|spacing units|strand turns/i);
    });
  });

  describe('Palette and Fallback', () => {
    const section = getSection(md, 'Palette and Fallback');

    test('Explains palette.json, fallback palette, and WCAG AA guidance', () => {
      expect(section).toBeTruthy();
      expect(section).toMatch(/data\/palette\.json/);
      expect(section).toMatch(/fallback palette/i);
      expect(section).toMatch(/WCAG\s*AA/i);
    });
  });

  describe('ND-safe Design Choices', () => {
    const section = getSection(md, 'ND-safe Design Choices');

    test('Includes safety commitments: no animation, calm contrast, lore preserved, pure functions', () => {
      expect(section).toBeTruthy();
      expect(section).toMatch(/No animation.*renders once/i);
      expect(section).toMatch(/Calm contrast/i);
      expect(section).toMatch(/Lore from the cosmology dataset/i);
      expect(section).toMatch(/Pure functions.*offline-friendly/i);
    });
  });

  describe('Offline Use', () => {
    const section = getSection(md, 'Offline Use');

    test('Provides at least four actionable steps including double-clicking index.html and file:// context note', () => {
      expect(section).toBeTruthy();
      const stepsCount = (section.match(/^\s*\d+\.\s+/gmi) || []).length;
      expect(stepsCount).toBeGreaterThanOrEqual(4);
      expect(section).toMatch(/Double-click\s+`?index\.html`?/i);
      expect(section).toMatch(/file:\/\//i);
    });
  });

  test('Closes with lightweight/no dependencies statement and pure functions emphasis', () => {
    expect(md).toMatch(/no workflows,\s*no dependencies,\s*and no background services/i);
    expect(md).toMatch(/Pure functions.*layered cosmology/i);
  });
});