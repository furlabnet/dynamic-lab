import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

/**
 * Documentation site (separate from the showcase). Builds to public/ for GitLab Pages.
 * Asset paths are relative ("./"), so the same build works at the root of a Pages unique domain
 * (e.g. https://<project>-<id>.gitlab.io/) and under a path (https://furlab.gitlab.io/dynamic-lab/).
 * Routing is hash-based, so every page is served from index.html at that one location.
 * DOCS_BASE overrides it if you ever need an absolute prefix.
 */
export default defineConfig({
  root: path.resolve(import.meta.dirname, 'docs'),
  base: process.env.DOCS_BASE ?? './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@furlab/dynamic-lab': path.resolve(import.meta.dirname, './src/index.ts'),
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    outDir: path.resolve(import.meta.dirname, 'public'),
    emptyOutDir: true,
    // The docs import the whole library on purpose; one ~550 kB chunk is fine for a docs site.
    chunkSizeWarningLimit: 800,
  },
  server: {
    port: 5180,
  },
})
