import pkg from '@furlab/dynamic-lab/package.json'

/**
 * Where the landing page sends people. On GitLab Pages the showcase and docs are built into
 * showcase/, docs/ and the-lab-sans/ beside this page; in development each app runs on its own port.
 * VITE_SHOWCASE_URL, VITE_DOCS_URL, VITE_FONT_URL and VITE_REPOSITORY_URL override them.
 */
const env = import.meta.env

export const SHOWCASE_URL =
  env.VITE_SHOWCASE_URL ?? (env.DEV ? 'http://localhost:5173/' : './showcase/')
export const DOCS_URL = env.VITE_DOCS_URL ?? (env.DEV ? 'http://localhost:5180/' : './docs/')
export const FONT_URL =
  env.VITE_FONT_URL ?? (env.DEV ? 'http://localhost:5190/' : './the-lab-sans/')
export const REPOSITORY_URL = env.VITE_REPOSITORY_URL ?? pkg.repository.url
