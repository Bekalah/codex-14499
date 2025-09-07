# Codex 144:99 — Repository Map

This repo currently combines:

- **Renderer** (`index.html`, `js/`, `data/`) – static canvas for layered cosmology. Loads palette and geometry from JSON for offline tweaking.
- **API** (`api/`) – FastAPI service exposing codex nodes from `data/`. Intended for read-only queries by games or tools.
- **Docs** (`docs/`) – mirror of renderer for documentation or static hosting.

## Connections

- Renderer and docs both read from the shared `data/` folder.
- API serves an expanded node set (`data/codex_nodes_full.json` when available) for game engines or world-building utilities.

## Toward Multi‑Game, Complex Environments

- Keep JSON schemas stable so multiple engines can consume the same data.
- Expose additional endpoints in the API for tags, cultures, and safety profiles.
- Use the geometry and palette configs to theme different game worlds without altering core code.

## Outstanding Integration Tasks

- Expand node dataset to cover additional realms or settings.
- Define a plugin pattern where individual games contribute their own layers or palettes.
- Draft examples of using the API + renderer together for a world-building workflow.
