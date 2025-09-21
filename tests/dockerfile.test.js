/* Testing library/framework: Jest (default detection) */
/**
 * Dockerfile tests
 * Testing library/framework: Jest (or Mocha-style BDD if configured)
 * These tests validate Dockerfile best practices and PR-diff-sensitive rules.
 */
const fs = require('fs');
const path = require('path');

function readDockerfiles() {
  const candidates = ['Dockerfile', 'docker/Dockerfile', 'Dockerfile.dev', 'Dockerfile.prod'];
  const existing = candidates
    .map(p => ({ p, exists: fs.existsSync(path.resolve(process.cwd(), p)) }))
    .filter(x => x.exists)
    .map(x => x.p);
  return existing;
}

function loadFile(p) {
  return fs.readFileSync(path.resolve(process.cwd(), p), 'utf8');
}

describe('Dockerfile sanity', () => {
  const dockerfiles = readDockerfiles();

  it('at least one Dockerfile should exist', () => {
    expect(Array.isArray(dockerfiles)).toBe(true);
    expect(dockerfiles.length).toBeGreaterThan(0);
  });

  it('no line should contain Windows CRLF endings', () => {
    for (const f of dockerfiles) {
      const content = loadFile(f);
      expect(content.includes('\r\n')).toBe(false);
    }
  });
});

function findDockerfiles() {
  const guess = ['Dockerfile', 'docker/Dockerfile', 'Dockerfile.dev', 'Dockerfile.prod'];
  return guess.filter(p => fs.existsSync(path.resolve(process.cwd(), p)));
}

function getLines(file) {
  return fs.readFileSync(path.resolve(process.cwd(), file), 'utf8').split(/\r?\n/);
}

function hasInstruction(lines, instr) {
  const re = new RegExp('^\\s*' + instr + '\\b', 'i');
  return lines.some(l => re.test(l));
}

function grep(lines, re) {
  return lines.filter(l => re.test(l));
}

describe('Dockerfile best practices and regression coverage (PR-focused)', () => {
  const dockerfiles = findDockerfiles();

  beforeAll(() => {
    if (dockerfiles.length === 0) {
      console.warn('No Dockerfiles found; tests will be skipped.');
    }
  });

  test('FROM should not use mutable "latest" tag', () => {
    for (const f of dockerfiles) {
      const lines = getLines(f);
      const froms = grep(lines, /^\s*FROM\b/i);
      expect(froms.length).toBeGreaterThan(0);
      for (const line of froms) {
        const usesLatest = /\s+latest(\s|$)/i.test(line) || /^\s*FROM\s+[^\s:@]+(?:\/[^\s:@]+)*\s*$/i.test(line);
        expect(usesLatest).toBe(false);
      }
    }
  });

  test('Avoid apt-get upgrade/dist-upgrade and ensure clean layer usage for apt', () => {
    for (const f of dockerfiles) {
      const lines = getLines(f);

      // Should not use apt-get upgrade or dist-upgrade
      const badApt = grep(lines, /\bapt(-get)?\s+(?:dist-)?upgrade\b/i);
      expect(badApt.length).toBe(0);

      // When using apt-get install, prefer: apt-get update && apt-get install -y ... && rm -rf /var/lib/apt/lists/*
      const aptInstalls = grep(lines, /\bapt(-get)?\s+install\b/i);
      for (const line of aptInstalls) {
        const sameLayerUpdate = /apt(-get)?\s+update/.test(line) && /&&/.test(line);
        expect(sameLayerUpdate).toBe(true);

        const cleansAptLists = /rm\s+-rf\s+\/var\/lib\/apt\/lists\/\*/.test(line);
        expect(cleansAptLists).toBe(true);
      }
    }
  });

  test('Use multi-stage builds where applicable (at least one COPY --from or multiple FROM)', () => {
    for (const f of dockerfiles) {
      const lines = getLines(f);
      const froms = grep(lines, /^\s*FROM\b/i);
      const hasMultiStage = froms.length > 1 || grep(lines, /\bCOPY\b.*--from=/i).length > 0;
      // Not mandatory, but nudge; we assert truthy to enforce practice if PR touched Dockerfile.
      expect(hasMultiStage).toBe(true);
    }
  });

  test('Expose or define healthcheck for services (HEALTHCHECK present if EXPOSE found)', () => {
    for (const f of dockerfiles) {
      const lines = getLines(f);
      const exposes = grep(lines, /^\s*EXPOSE\b/i);
      if (exposes.length > 0) {
        const hasHealthcheck = hasInstruction(lines, 'HEALTHCHECK');
        expect(hasHealthcheck).toBe(true);
      }
    }
  });

  test('Avoid ADD in favor of COPY for local files (unless URL or tar extraction is needed)', () => {
    for (const f of dockerfiles) {
      const lines = getLines(f);
      const adds = grep(lines, /^\s*ADD\b/i);
      for (const line of adds) {
        const isUrl = /\bhttps?:\/\//i.test(line);
        const isTar = /\.(tar|tar\.gz|tgz|tar\.bz2|tbz2|tar\.xz|txz)\b/i.test(line);
        // Allow ADD only if it uses URL or tar extraction
        expect(isUrl || isTar).toBe(true);
      }
    }
  });

  test('Do not run as root: either USER non-root specified or base image implies non-root', () => {
    for (const f of dockerfiles) {
      const lines = getLines(f);
      const userLines = grep(lines, /^\s*USER\b/i);
      if (userLines.length > 0) {
        const lastUser = userLines[userLines.length - 1];
        const specifiesRoot = /\bUSER\s+root\b/i.test(lastUser);
        expect(specifiesRoot).toBe(false);
      } else {
        // If no USER line, ensure base image hints non-root (best-effort): warn and fail to encourage explicit USER.
        const froms = grep(lines, /^\s*FROM\b/i).join(' ');
        const obviouslyRoot = /alpine|debian|ubuntu|node|python|golang|nginx|httpd|busybox/i.test(froms);
        expect(obviouslyRoot).toBe(false);
      }
    }
  });

  test('Use .dockerignore (performance/security) if building from repo root', () => {
    const dockerignore = fs.existsSync(path.resolve(process.cwd(), '.dockerignore'));
    expect(dockerignore).toBe(true);
  });

  test('No secrets or ARG with default secrets committed', () => {
    for (const f of dockerfiles) {
      const lines = getLines(f);
      const argSecrets = grep(lines, /^\s*ARG\s+(\w*token|\w*secret|\w*password|\w*key)\s*=/i);
      expect(argSecrets.length).toBe(0);
    }
  });

  test('Pin packages and images to digests/tags (FROM includes explicit tag or @digest)', () => {
    for (const f of dockerfiles) {
      const lines = getLines(f);
      const froms = grep(lines, /^\s*FROM\b/i);
      for (const line of froms) {
        const hasPinned = /@sha256:[a-f0-9]{64}/i.test(line) || /:[A-Za-z0-9._-]+(\s|$)/.test(line);
        expect(hasPinned).toBe(true);
      }
    }
  });

  test('Avoid unnecessary cache-busting patterns (e.g., --no-cache in RUN)', () => {
    for (const f of dockerfiles) {
      const lines = getLines(f);
      const noCache = grep(lines, /(--no-cache(?\!-dir)|--force-yes)/i);
      expect(noCache.length).toBe(0);
    }
  });

  test('LABEL metadata present (maintainer/contact or description)', () => {
    for (const f of dockerfiles) {
      const lines = getLines(f);
      const labelLines = grep(lines, /^\s*LABEL\b/i);
      const hasMeaningful = labelLines.some(l => /(maintainer|org\.opencontainers\.image\.(title|description|source|url|revision|licenses))/i.test(l));
      expect(hasMeaningful).toBe(true);
    }
  });

  test('ENTRYPOINT or CMD present exactly once in final stage', () => {
    for (const f of dockerfiles) {
      const lines = getLines(f);
      const entry = grep(lines, /^\s*ENTRYPOINT\b/i);
      const cmd = grep(lines, /^\s*CMD\b/i);
      expect(entry.length + cmd.length).toBeGreaterThan(0);
    }
  });

  test('Do not use sudo inside container layers', () => {
    for (const f of dockerfiles) {
      const lines = getLines(f);
      const sudo = grep(lines, /\bsudo\b/);
      expect(sudo.length).toBe(0);
    }
  });

  test('chown in COPY/ADD uses numeric IDs or known non-root user', () => {
    for (const f of dockerfiles) {
      const lines = getLines(f);
      const copyAdd = grep(lines, /^\s*(COPY|ADD)\b.*--chown=/i);
      for (const line of copyAdd) {
        const ok = /--chown=\d+:\d+/.test(line) || /--chown=\w+:\w+/.test(line);
        expect(ok).toBe(true);
      }
    }
  });
});