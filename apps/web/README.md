# Cathedral of Circuits — Web App

This directory contains the React + Vite front-end prepared for Cloudflare Pages.

## Local development

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
```

Deploy with Cloudflare Pages using:

- **Framework preset:** Vite
- **Root directory:** `apps/web`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Environment variables (optional):**
  - `NODE_VERSION=20`
  - `VITE_BASE=/` (or `/cathedral/` if deploying under a subpath)

Static JSON and other runtime assets should live under `public/`. Fetch them using
root-relative URLs such as `/registry/arcana.json`.
