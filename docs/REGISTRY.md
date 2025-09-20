# Oracle of Constants Registry

Codex 144:99 now exposes a dedicated registry for sacred numbers, correspondences, and lattice nodes. The data is curated offline and published as static JSON so sibling repos can reference the same numerology without divergence.

## Directory Map

- `registry/constants/` — Versioned JSON datasets for numbers, tarot paths, angelic choirs, chthonic allies, and the thirty-three spine nodes.
- `schemas/` — Pinned JSON Schema descriptors. Each dataset links to a schema so contributors can validate structure without guessing field names.
- `dist/codex.min.json` — Minified bundle assembled from the constants directory. Intended for CDN mirroring or direct static hosting.
- `core/health-check.html` — Simple 200 OK status page used by uptime probes.

## Import Contract

1. Other repositories may perform **read-only** fetches against `/dist/codex.min.json` or individual files under `registry/constants/`.
2. Do not write to these paths from automated jobs. Updates happen inside this repository via manual, trauma-informed review.
3. Consumers should cache data locally for offline use and respect the version tag embedded in each dataset.
4. When new constants are required, open an issue here rather than duplicating values downstream.

## Bundling Process (Offline)

```sh
npm run build
```

The build script composes all registry JSON into a single minified payload at `dist/codex.min.json`. No network access is required; the command reads local files and rewrites the bundle.

## Validation Tips

- Compare datasets against the schemas in `/schemas/` using your preferred JSON Schema validator.
- Each file maintains `version` and `updated` metadata so bridges can detect incompatible shifts.
- Numerology references only use the canonical constants (3, 7, 9, 11, 22, 33, 99, 144) to preserve layered geometry.

## Bridge Link

`tesseract-bridge/registry/realm_links.json` publishes the live URL for this registry. Downstream bridges read that map to discover the minified bundle.

All content respects the ND-safe mandate: gentle contrast, no automation, no flattened lore.
