#!/usr/bin/env node
/**
 * Publish the workspace package in the current directory (@furlab/dynamic-lab or
 * @furlab/the-lab-sans) to the GitLab package registry or to npmjs.org. Run it through the
 * package's own script, so it starts in the right folder:
 *
 *   yarn workspace @furlab/dynamic-lab release                  GitLab package registry
 *   yarn workspace @furlab/dynamic-lab release --registry npm   npmjs.org
 *
 * Options:
 *   --registry gitlab|npm   where to publish (default gitlab)
 *   --dry-run               check everything and list the files, publish nothing
 *   --tag <name>            dist-tag; defaults to "next" for pre-releases (1.0.0-beta.1), else "latest"
 *   --allow-dirty           skip the clean working tree check (local only)
 *
 * GitLab credentials, in order of preference:
 *   CI_JOB_TOKEN   set automatically in GitLab CI
 *   GITLAB_TOKEN   a personal, project or group access token with the `api` scope
 *                  (or a deploy token with `write_package_registry`)
 * GitLab project:
 *   CI_API_V4_URL / GITLAB_API_URL   default https://gitlab.com/api/v4
 *   CI_PROJECT_ID / GITLAB_PROJECT   numeric id or "group/project"; defaults to the path in
 *                                    package.json's repository URL
 *
 * npmjs.org credentials:
 *   NPM_TOKEN      a granular access token that can publish the @furlab packages. When it isn't set
 *                  the script exits with code 78, which the GitLab pipeline allows to fail.
 *   NPM_REGISTRY_URL   default https://registry.npmjs.org/
 *
 * In CI, the tag being built (CI_COMMIT_TAG) must match the package version: v1.2.3 for
 * @furlab/dynamic-lab, the-lab-sans-v1.2.3 for @furlab/the-lab-sans (see releases.mjs).
 */
import { execFileSync, spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { releaseForPackage } from './releases.mjs'

const args = process.argv.slice(2)
const option = (name) => {
  const index = args.indexOf(name)
  return index >= 0 ? args[index + 1] : undefined
}
const dryRun = args.includes('--dry-run')
const allowDirty = args.includes('--allow-dirty')
const target = option('--registry') ?? 'gitlab'

if (args.includes('--help') || args.includes('-h')) {
  const header = readFileSync(new URL(import.meta.url), 'utf8').split('*/')[0]
  console.log(header.replace(/^#!.*\n\/\*\*\n?/, '').replace(/^ \* ?/gm, ''))
  process.exit(0)
}

// 78 (EX_CONFIG) means "not configured": the npm jobs in .gitlab-ci.yml allow exactly this code to fail.
const NOT_CONFIGURED = 78
const fail = (message, code = 1) => {
  console.error(`\n✖ ${message}\n`)
  process.exit(code)
}
const step = (message) => console.log(`• ${message}`)

const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'))
const release = releaseForPackage(pkg.name)
if (!release)
  fail(
    `${pkg.name ?? process.cwd()} isn't a released package. Run this through its release script.`
  )
if (pkg.private) fail(`${pkg.name} is marked private in package.json.`)
if (target !== 'gitlab' && target !== 'npm')
  fail(`--registry must be "gitlab" or "npm", not "${target}".`)

const prerelease = pkg.version.includes('-')
const distTag = option('--tag') ?? (prerelease ? 'next' : undefined)
if (distTag !== undefined && !/^[a-z][a-z0-9-]*$/i.test(distTag))
  fail(`"${distTag}" isn't a valid dist-tag.`)

/* ------------------------------------------------------------ Settings */

const inCi = Boolean(process.env.CI)

function gitlabSettings() {
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

  if (!pkg.name.startsWith('@'))
    fail(`GitLab's npm registry needs a scoped package name; "${pkg.name}" has no @scope.`)
  if (!project)
    fail('Set GITLAB_PROJECT (e.g. furlab/dynamic-lab) or add a repository URL to package.json.')
  if (!token && !dryRun)
    fail(
      'No credentials. In CI, CI_JOB_TOKEN is used. Locally, set GITLAB_TOKEN to an access token with the api scope.'
    )

  return {
    label: 'GitLab package registry',
    registry: `${api}/projects/${projectRef}/packages/npm/`,
    token,
    access: 'restricted',
    // Refuse to publish a version that's already there (GitLab rejects it anyway, later and less clearly).
    async isPublished() {
      const headers = jobToken ? { 'JOB-TOKEN': jobToken } : { 'PRIVATE-TOKEN': token }
      const url = `${api}/projects/${projectRef}/packages?package_type=npm&package_name=${encodeURIComponent(pkg.name)}&per_page=100`
      const res = await fetch(url, { headers })
      if (res.status === 401 || res.status === 403)
        fail(
          `GitLab refused the token (${res.status}). It needs the api scope and access to ${project}.`
        )
      if (res.status === 404)
        fail(`Project "${project}" not found at ${api}. Check GITLAB_PROJECT / GITLAB_API_URL.`)
      if (!res.ok) return undefined
      const packages = await res.json()
      return packages.some((p) => p.name === pkg.name && p.version === pkg.version)
    },
  }
}

function npmSettings() {
  const token = process.env.NPM_TOKEN
  const registry = (process.env.NPM_REGISTRY_URL ?? 'https://registry.npmjs.org/').replace(
    /\/?$/,
    '/'
  )
  if (!token && !dryRun)
    fail(
      "NPM_TOKEN isn't set, so nothing was published to npmjs.org. Add it as a masked, protected CI/CD variable to publish there.",
      NOT_CONFIGURED
    )

  return {
    label: 'npmjs.org',
    registry,
    token,
    access: 'public',
    async isPublished() {
      const url = `${registry}${pkg.name.replace('/', '%2f')}/${pkg.version}`
      const res = await fetch(url, token ? { headers: { authorization: `Bearer ${token}` } } : {})
      if (res.status === 401 || res.status === 403)
        fail(`npmjs.org refused NPM_TOKEN (${res.status}). It needs publish access to ${pkg.name}.`)
      if (res.status === 404) return false
      return res.ok ? true : undefined
    },
  }
}

const settings = target === 'npm' ? npmSettings() : gitlabSettings()

console.log(
  `\nReleasing ${pkg.name}@${pkg.version} to ${settings.label}${dryRun ? ' (dry run)' : ''}`
)
step(`Registry: ${settings.registry}`)
step(`Dist-tag: ${distTag ?? 'latest'}`)

/* -------------------------------------------------------------- Checks */

// In CI, only release from the tag that matches the version, so the registry and git agree.
const ciTag = process.env.CI_COMMIT_TAG
const expectedTag = `${release.tagPrefix}${pkg.version}`
if (ciTag && ciTag !== expectedTag)
  fail(`Tag ${ciTag} doesn't match ${pkg.name} ${pkg.version}. Tag this release as ${expectedTag}.`)

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

if (settings.token || target === 'npm') {
  try {
    const published = await settings.isPublished()
    if (published)
      fail(`${pkg.name}@${pkg.version} is already on ${settings.label}. Bump "version" first.`)
    step(
      published === false
        ? `${pkg.version} is not published yet`
        : "Couldn't check existing versions; continuing"
    )
  } catch (error) {
    step(
      `Couldn't reach ${settings.label} to check existing versions (${error.message}); continuing`
    )
  }
}

/* ------------------------------------------------------------- Publish */

// Yarn reads these as config; they only apply to this command.
const env = {
  ...process.env,
  YARN_NPM_PUBLISH_REGISTRY: settings.registry,
  YARN_NPM_ALWAYS_AUTH: 'true',
  ...(settings.token ? { YARN_NPM_AUTH_TOKEN: settings.token } : {}),
}

const yarnArgs = dryRun
  ? ['pack', '--dry-run']
  : ['npm', 'publish', '--access', settings.access, ...(distTag ? ['--tag', distTag] : [])]
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
    : `\n✔ Published ${pkg.name}@${pkg.version} to ${settings.label}${distTag ? ` (${distTag})` : ''}.\n`
)
