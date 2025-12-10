import { defineConfig } from 'vite'
<<<<<<< origin
=======
<<<<<<< HEAD
>>>>>>> modified
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
<<<<<<< origin
=======
=======

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  define: {
    __CODEX_VERSION__: JSON.stringify('144:99'),
    __CATHEDRAL_VERSION__: JSON.stringify('2.0.0'),
    __LIVING_ARCANAE_COUNT__: 22,
    __FUSION_COMBINATIONS__: 231
  },
  optimizeDeps: {
    include: ['@cathedral/cathedral-game-engine']
  }
>>>>>>> 238560e80e8a371b7ddac79f30ccbecd9fca80b0
>>>>>>> modified
})
