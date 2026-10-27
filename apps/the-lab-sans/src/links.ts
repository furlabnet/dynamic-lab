import pkg from '@furlab/the-lab-sans/package.json'

/**
 * On GitLab Pages this site is built into the-lab-sans/, one level below the Dynamic Lab landing
 * page; in development the landing page runs on its own port. VITE_LANDING_URL and
 * VITE_REPOSITORY_URL override them.
 */
const env = import.meta.env

export const LANDING_URL = env.VITE_LANDING_URL ?? (env.DEV ? 'http://localhost:5170/' : '../')
export const REPOSITORY_URL = env.VITE_REPOSITORY_URL ?? pkg.repository.url
