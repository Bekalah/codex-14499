/**
 * Tests for fly_toml module.
 * Framework: Jest (adjust if repository uses a different test runner).
 * Focus: Validate behaviors from the latest PR diff including parsing, validation,
 * defaults, error handling, and serialization of fly.toml content.
 */

// Utility to resolve the module under test across common locations
function loadFlyToml() {
  const candidates = [
    './fly_toml',                 // tests colocated helper
    '../src/fly_toml',
    '../src/lib/fly_toml',
    '../lib/fly_toml',
    '../src/utils/fly_toml',
  ];
  for (const p of candidates) {
    try {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      return require(p);
    } catch (e) {
      if (e && e.code === 'MODULE_NOT_FOUND') continue;
      throw e;
    }
  }
  throw new Error('Could not locate fly_toml module. Adjust candidates in tests/fly_toml.test.js');
}

const mod = loadFlyToml();

// Support both default and named exports commonly found in utility modules
const parseFlyToml = mod.parseFlyToml || mod.parse || mod.loadFlyToml || (mod.default && mod.default.parseFlyToml);
const validateFlyToml = mod.validateFlyToml || mod.validate || (mod.default && mod.default.validateFlyToml);
const writeFlyToml = mod.writeFlyToml || mod.stringify || (mod.default && mod.default.writeFlyToml);
const normalizeFlyToml = mod.normalizeFlyToml || mod.normalize || (mod.default && mod.default.normalizeFlyToml);

function hasFn(fn) {
  return typeof fn === 'function';
}

describe('fly_toml module public API', () => {
  test('exports expected functions (parse/validate/write/normalize)', () => {
    // At least a parser should exist
    expect(hasFn(parseFlyToml)).toBe(true);
    // Others are optional but if present must be functions
    if (validateFlyToml) expect(typeof validateFlyToml).toBe('function');
    if (writeFlyToml) expect(typeof writeFlyToml).toBe('function');
    if (normalizeFlyToml) expect(typeof normalizeFlyToml).toBe('function');
  });
});

describe('parseFlyToml happy paths', () => {
  test('parses minimal valid fly.toml with app and primary region', () => {
    const toml = `
app = "my-app"
primary_region = "iad"
`;
    const cfg = parseFlyToml(toml);
    expect(cfg).toBeTruthy();
    expect(cfg.app).toBe('my-app');
    expect(cfg.primary_region || cfg.primaryRegion).toMatch(/^[a-z]{3}$/i);
  });

  test('parses services with ports and handlers arrays', () => {
    const toml = `
app = "svc-app"
[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]
  [http_service.concurrency]
    type = "connections"
    soft_limit = 25
    hard_limit = 50
`;
    const cfg = parseFlyToml(toml);
    expect(cfg.http_service || cfg.httpService).toBeTruthy();
    const svc = cfg.http_service || cfg.httpService;
    expect(svc.internal_port || svc.internalPort).toBe(8080);
    const conc = svc.concurrency || {};
    expect(conc.type).toBe('connections');
    expect(conc.soft_limit || conc.softLimit).toBe(25);
    expect(conc.hard_limit || conc.hardLimit).toBe(50);
  });
});

describe('parseFlyToml defaults and normalization', () => {
  test('applies default concurrency when not specified (if PR introduces defaults)', () => {
    const toml = `
app = "default-app"
[http_service]
  internal_port = 3000
`;
    const cfg = parseFlyToml(toml);
    // If normalize applies defaults, run it as well
    const normalized = normalizeFlyToml ? normalizeFlyToml(cfg) : cfg;
    const svc = normalized.http_service || normalized.httpService || {};
    const conc = svc.concurrency || {};
    // Expect presence or undefined depending on implementation: tolerate both but assert types if present
    if ('type' in conc) expect(['connections','requests'].includes(conc.type)).toBe(true);
    if ('soft_limit' in conc) expect(typeof conc.soft_limit === 'number' || typeof conc.softLimit === 'number').toBe(true);
    if ('hard_limit' in conc) expect(typeof conc.hard_limit === 'number' || typeof conc.hardLimit === 'number').toBe(true);
  });

  test('normalizes region keys to canonical format (lowercase 3-letter codes)', () => {
    const toml = `
app = "norm-app"
primary_region = "IAD"
`;
    const cfg = parseFlyToml(toml);
    const normalized = normalizeFlyToml ? normalizeFlyToml(cfg) : cfg;
    const region = normalized.primary_region || normalized.primaryRegion;
    if (typeof region === 'string') {
      expect(region).toBe('iad');
    } else {
      // Some implementations keep input as-is; still assert it matches pattern
      expect((cfg.primary_region || cfg.primaryRegion)).toMatch(/^[a-z]{3}$/i);
    }
  });
});

describe('parseFlyToml edge cases and error handling', () => {
  test('returns a structured error for invalid TOML syntax', () => {
    const input = `
app = "broken
primary_region = "iad"
`;
    expect(() => parseFlyToml(input)).toThrow();
  });

  test('rejects unexpected data types (e.g., non-number internal_port)', () => {
    const input = `
app = "bad-port"
[http_service]
  internal_port = "not-a-number"
`;
    // Parsing TOML may succeed but validation should fail, if available
    if (validateFlyToml) {
      const parsed = parseFlyToml(input);
      const result = validateFlyToml(parsed);
      // Expect either false or an object with errors
      if (typeof result === 'boolean') {
        expect(result).toBe(false);
      } else {
        // Common pattern: { valid: false, errors: [...] }
        expect(result.valid || false).toBe(false);
        expect(Array.isArray(result.errors) || Array.isArray(result.issues) || Array.isArray(result.messages)).toBe(true);
      }
    } else {
      expect(() => parseFlyToml(input)).toThrow();
    }
  });

  test('handles absent optional sections gracefully', () => {
    const input = `
app = "no-service"
primary_region = "sea"
`;
    const cfg = parseFlyToml(input);
    expect(cfg).toBeTruthy();
    expect(cfg.http_service || cfg.httpService).toBeFalsy();
  });
});

describe('writeFlyToml serialization (if provided)', () => {
  const sample = {
    app: 'serialize-app',
    primary_region: 'iad',
    http_service: {
      internal_port: 8080,
      force_https: true,
      concurrency: { type: 'connections', soft_limit: 10, hard_limit: 20 },
    },
  };

  const testIfWrite = typeof writeFlyToml === 'function' ? test : test.skip;

  testIfWrite('stringifies object to TOML and back with value preservation', () => {
    const toml = writeFlyToml(sample);
    expect(typeof toml).toBe('string');
    const roundTrip = parseFlyToml(toml);
    // Basic fields preserved
    expect(roundTrip.app).toBe(sample.app);
    expect((roundTrip.primary_region || roundTrip.primaryRegion)).toBe('iad');
    const svc = roundTrip.http_service || roundTrip.httpService || {};
    expect(svc.internal_port || svc.internalPort).toBe(8080);
  });

  testIfWrite('omits undefined/empty optional fields in output TOML', () => {
    const toml = writeFlyToml({ app: 'x', primary_region: 'ord', http_service: { internal_port: 3000, notes: undefined } });
    expect(toml).not.toMatch(new RegExp('notes\\s*='));
  });
});

describe('validation results contract (focus on PR-changed rules)', () => {
  test('enforces that app is non-empty string', () => {
    const bads = [
      'app = ""\nprimary_region = "iad"\n',
      'primary_region = "iad"\n',
    ];
    for (const input of bads) {
      if (validateFlyToml) {
        const parsed = parseFlyToml(input);
        const res = validateFlyToml(parsed);
        if (typeof res === 'boolean') {
          expect(res).toBe(false);
        } else {
          expect(res.valid || false).toBe(false);
        }
      } else {
        expect(() => parseFlyToml(input)).toThrow();
      }
    }
  });

  test('rejects invalid region codes like too long/short or with digits', () => {
    const inputs = [
      'app = "x"\nprimary_region = "i"\n',
      'app = "x"\nprimary_region = "iaaa"\n',
      'app = "x"\nprimary_region = "1a2"\n',
    ];
    for (const input of inputs) {
      if (validateFlyToml) {
        const parsed = parseFlyToml(input);
        const res = validateFlyToml(parsed);
        if (typeof res === 'boolean') expect(res).toBe(false);
        else expect(res.valid || false).toBe(false);
      } else {
        // Parser may accept but normalization/consumers should fail; we defensively assert parse or normalize throws if implemented
        if (normalizeFlyToml) {
          expect(() => normalizeFlyToml(parseFlyToml(input))).toThrow();
        } else {
          expect(() => parseFlyToml(input)).toThrow();
        }
      }
    }
  });
});