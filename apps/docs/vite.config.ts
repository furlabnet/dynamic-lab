import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defaultClientConditions, defineConfig } from 'vite'

/**
 * Documentation site. Routing is hash-based, so every page is served from index.html and relative
 * asset paths ("./") work at any URL; PAGES_BASE overrides that.
 */
export default defineConfig({
  base: process.env.PAGES_BASE ?? './',
  plugins: [react(), tailwindcss()],
  resolve: {
    // Load workspace packages from source: edits to the library show up here with HMR, no rebuild.
    conditions: ['@furlab/source', ...defaultClientConditions],
  },
  build: {
    // The docs import the whole library on purpose; one ~550 kB chunk is fine for a docs site.
    chunkSizeWarningLimit: 800,
  },
  server: {
    port: 5180,
  },
})
