import { defineConfig, defaultClientConditions } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * The Lab Sans specimen: the typeface in every weight, a type tester and how to use the package.
 * Served at the-lab-sans/ on the GitLab Pages site, next to the Dynamic Lab landing page.
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
    port: 5190,
  },
})
