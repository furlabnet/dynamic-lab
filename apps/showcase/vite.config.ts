import { defineConfig, defaultClientConditions } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Showcase: two working apps (the Dynamic Lab public site and the Backstage console) built from the
 * library. State-based navigation, so relative asset paths work wherever it is served.
 */
export default defineConfig({
  base: process.env.PAGES_BASE ?? './',
  plugins: [react(), tailwindcss()],
  resolve: {
    // Load workspace packages from source: edits to the library show up here with HMR, no rebuild.
    conditions: ['@furlab/source', ...defaultClientConditions],
  },
  build: {
    chunkSizeWarningLimit: 800,
  },
  server: {
    port: 5173,
  },
})
