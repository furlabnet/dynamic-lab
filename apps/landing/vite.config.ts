import { defineConfig, defaultClientConditions } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Landing page: what Dynamic Lab is, with a way into the showcase and the docs. Served at the root
 * of the GitLab Pages site; the showcase and docs sit beside it in showcase/ and docs/.
 * Asset paths are relative ("./") so the build works at any URL; PAGES_BASE overrides that.
 */
export default defineConfig({
  base: process.env.PAGES_BASE ?? './',
  plugins: [react(), tailwindcss()],
  resolve: {
    // Load workspace packages from source: edits to the library show up here with HMR, no rebuild.
    conditions: ['@furlab/source', ...defaultClientConditions],
  },
  server: {
    port: 5170,
  },
})
