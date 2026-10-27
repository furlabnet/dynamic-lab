#!/usr/bin/env node
/**
 * Publish @furlab/dynamic-lab to the GitLab package registry (npm).
 *
 *   yarn release              build (via prepack) and publish the version in package.json
 *   yarn release --dry-run    check everything and list the files, publish nothing
 *   yarn release --tag next   publish under a dist-tag other than "latest"
 *
 * Credentials, in order of preference:
 *   CI_JOB_TOKEN   set automatically in GitLab CI
 *   GITLAB_TOKEN   a personal, project or group access token with the `api` scope
 *                  (or a deploy token with `write_package_registry`)
 *
 * Where to publish:
 *   CI_API_V4_URL / GITLAB_API_URL   default https://gitlab.com/api/v4
 *   CI_PROJECT_ID / GITLAB_PROJECT   numeric id or "group/project"; defaults to the path in
 *                                    package.json's repository URL
 */
import { execFileSync, spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const allowDirty = args.includes('--allow-dirty')
const tagIndex = args.indexOf('--tag')
const distTag = tagIndex >= 0 ? args[tagIndex + 1] : undefined

if (args.includes('--help') || args.includes('-h')) {
  const header = readFileSync(new URL(import.meta.url), 'utf8').split('*/')[0]
  console.log(header.replace(/^#!.*\n\/\*\*\n?/, '').replace(/^ \* ?/gm, ''))
  process.exit(0)
}

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const fail = (message) => {
  console.error(`\n✖ ${message}\n`)
  process.exit(1)
}
const step = (message) => console.log(`• ${message}`)

/* ------------------------------------------------------------ Settings */

const inCi = Boolean(process.env.CI)
const jobToken = process.env.CI_JOB_TOKEN
const token = jobToken ?? process.env.GITLAB_TOKEN
const api = (
  process.env.CI_API_V4_URL ??
  process.env.GITLAB_API_URL ??
  'https://gitlab.com/api/v4'
).replace(/\/$/, '')
const repoPath = String(pkg.repository?.url ?? '')
  .replace(/^.*?gitlab\.[^/]+\//, '')
  .replace(/\.git$/, '')
const project = process.env.CI_PROJECT_ID ?? process.env.GITLAB_PROJECT ?? repoPath
const projectRef = encodeURIComponent(project)
const registry = `${api}/projects/${projectRef}/packages/npm/`

if (!pkg.name?.startsWith('@'))
  fail(`GitLab's npm registry needs a scoped package name; "${pkg.name}" has no @scope.`)
if (!project)
  fail('Set GITLAB_PROJECT (e.g. furlab/dynamic-lab) or add a repository URL to package.json.')
if (!token && !dryRun)
  fail(
    'No credentials. In CI, CI_JOB_TOKEN is used. Locally, set GITLAB_TOKEN to an access token with the api scope.'
  )
if (distTag !== undefined && !/^[a-z][a-z0-9-]*$/i.test(distTag))
  fail(`"${distTag}" isn't a valid dist-tag.`)

console.log(`\nReleasing ${pkg.name}@${pkg.version}${dryRun ? ' (dry run)' : ''}`)
step(`Registry: ${registry}`)

/* -------------------------------------------------------------- Checks */

// In CI, only release from a tag that matches the version, so the registry and git agree.
const ciTag = process.env.CI_COMMIT_TAG
if (ciTag && ciTag !== `v${pkg.version}`)
  fail(
    `Tag ${ciTag} doesn't match package.json version ${pkg.version}. Tag releases as v${pkg.version}.`
  )

if (!inCi && !allowDirty) {
  try {
    const status = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim()
    if (status)
      fail('The working tree has uncommitted changes. Commit them first, or pass --allow-dirty.')
  } catch (error) {
    if (error?.status === 1 || error?.code === 'ENOENT')
      step('git not available; skipping the clean-tree check')
    else throw error
  }
}

// Refuse to publish a version that's already in the registry (GitLab rejects it anyway, later and less clearly).
if (token) {
  const headers = jobToken ? { 'JOB-TOKEN': jobToken } : { 'PRIVATE-TOKEN': token }
  const url = `${api}/projects/${projectRef}/packages?package_type=npm&package_name=${encodeURIComponent(pkg.name)}&per_page=100`
  try {
    const res = await fetch(url, { headers })
    if (res.ok) {
      const packages = await res.json()
      if (packages.some((p) => p.name === pkg.name && p.version === pkg.version)) {
        fail(
          `${pkg.name}@${pkg.version} is already published. Bump "version" in package.json first.`
        )
      }
      step(`${pkg.version} is not published yet`)
    } else if (res.status === 401 || res.status === 403) {
      fail(
        `GitLab refused the token (${res.status}). It needs the api scope and access to ${project}.`
      )
    } else if (res.status === 404) {
      fail(`Project "${project}" not found at ${api}. Check GITLAB_PROJECT / GITLAB_API_URL.`)
    } else {
      step(`Couldn't check existing versions (HTTP ${res.status}); continuing`)
    }
  } catch (error) {
    step(`Couldn't reach GitLab to check existing versions (${error.message}); continuing`)
  }
}

/* ------------------------------------------------------------- Publish */

// Yarn reads these as config; they only apply to this command.
const env = {
  ...process.env,
  YARN_NPM_PUBLISH_REGISTRY: registry,
  YARN_NPM_ALWAYS_AUTH: 'true',
  ...(token ? { YARN_NPM_AUTH_TOKEN: token } : {}),
}

const yarnArgs = dryRun
  ? ['pack', '--dry-run']
  : ['npm', 'publish', '--access', 'restricted', ...(distTag ? ['--tag', distTag] : [])]
step(
  dryRun
    ? 'Building and listing the package contents (prepack runs the build)'
    : 'Building and publishing (prepack runs the build)'
)

const result = spawnSync('yarn', yarnArgs, {
  stdio: 'inherit',
  env,
  shell: process.platform === 'win32',
})
if (result.status !== 0) fail(`yarn ${yarnArgs.join(' ')} failed with exit code ${result.status}.`)

console.log(
  dryRun
    ? `\n✔ Dry run complete. Run without --dry-run to publish ${pkg.name}@${pkg.version}.\n`
    : `\n✔ Published ${pkg.name}@${pkg.version}${distTag ? ` (${distTag})` : ''}.\n  Install with: yarn add ${pkg.name}@${pkg.version}\n`
)
