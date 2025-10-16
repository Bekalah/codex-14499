import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⚑ IMPORTANT
// - Put runtime-loadable JSON (palettes, arcana, mods, etc.) in apps/web/public/
//   e.g. apps/web/public/registry/palettes.json  → fetch('/registry/palettes.json')
// - If you deploy under a subpath (e.g. /cathedral), set env var VITE_BASE=/cathedral/
//   in Cloudflare Pages → Project → Settings → Environment variables.

export default defineConfig({
  plugins: [react()],

  // Base path (supports both root domain and subpath deployments)
  base: process.env.VITE_BASE || '/',

  // Handy aliases (adjust to your tree). If you don’t have /packages/brain, remove this.
  resolve: {
    alias: {
      '@src': '/src',
      '@public': '/public',
      '@brain': '/packages/brain',   // shared logic (if you use a monorepo)
    },
  },

  // Let Vite treat shaders/wasm as static assets you can import or fetch
  assetsInclude: ['**/*.glsl', '**/*.wgsl', '**/*.shader', '**/*.wasm'],

  // Good defaults for debugging production issues without huge files
  build: {
    sourcemap: true,
    outDir: 'dist',  // Cloudflare Pages: set "Build output directory" = dist
  },

  // Local dev quality-of-life
  server: {
    port: 5173,
    open: false,
  },
})
