#!/usr/bin/env node
/**
 * Publish the workspace package in the current directory (@furlab/dynamic-lab or
 * @furlab/the-lab-sans) to npmjs.org. Run it through the package's own script, so it starts in the
 * right folder:
 *
 *   yarn workspace @furlab/dynamic-lab release
 *
 * Options:
 *   --dry-run               check everything and list the files, publish nothing
 *   --tag <name>            dist-tag; defaults to "next" for pre-releases (1.0.0-beta.1), else "latest"
 *   --allow-dirty           skip the clean working tree check (local only)
 *   --skip-published        exit successfully, publishing nothing, when the version is already in
 *                           the registry (the release workflow uses this, so a re-run job passes)
 *
 * Credentials (no tokens; the package is packed by Yarn and published by the npm CLI, which needs to
 * be 11.5.1 or later):
 *   in GitHub Actions   trusted publishing: the job's OIDC token (the workflow needs
 *                       `id-token: write`) is exchanged for a short-lived publish token, and the
 *                       package is published with provenance. When there's no OIDC token, or npm
 *                       refuses it (no trusted publisher for the package yet), the script exits
 *                       with code 78, which the workflow reports without failing the release.
 *   locally             your `npm login` session (npm asks for 2FA as usual)
 *   NPM_REGISTRY_URL    default https://registry.npmjs.org/
 *
 * When CI builds a tag, it must match the package version: v1.2.3 for @furlab/dynamic-lab,
 * the-lab-sans-v1.2.3 for @furlab/the-lab-sans (see releases.mjs). The release workflow on main
 * has no tag yet; it creates the GitHub release and tag after publishing.
 */
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { releaseForPackage } from './releases.mjs'

const args = process.argv.slice(2)
const option = (name) => {
  const index = args.indexOf(name)
  return index >= 0 ? args[index + 1] : undefined
}
const dryRun = args.includes('--dry-run')
const allowDirty = args.includes('--allow-dirty')
const skipPublished = args.includes('--skip-published')

if (args.includes('--help') || args.includes('-h')) {
  const header = readFileSync(new URL(import.meta.url), 'utf8').split('*/')[0]
  console.log(header.replace(/^#!.*\n\/\*\*\n?/, '').replace(/^ \* ?/gm, ''))
  process.exit(0)
}

// 78 (EX_CONFIG) means "not configured": the release workflow reports exactly this code without failing.
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

const prerelease = pkg.version.includes('-')
const distTag = option('--tag') ?? (prerelease ? 'next' : undefined)
if (distTag !== undefined && !/^[a-z][a-z0-9-]*$/i.test(distTag))
  fail(`"${distTag}" isn't a valid dist-tag.`)

/* ------------------------------------------------------------ Settings */

const inCi = Boolean(process.env.CI)

const npm = (npmArgs, options = {}) =>
  spawnSync('npm', npmArgs, { encoding: 'utf8', shell: process.platform === 'win32', ...options })

/** GitHub Actions' OIDC token for npm, or NPM_ID_TOKEN when another CI provides one. */
async function oidcToken() {
  if (process.env.NPM_ID_TOKEN) return process.env.NPM_ID_TOKEN
  const { ACTIONS_ID_TOKEN_REQUEST_URL: url, ACTIONS_ID_TOKEN_REQUEST_TOKEN: token } = process.env
  if (!url || !token) return undefined
  const request = new URL(url)
  request.searchParams.set('audience', 'npm:registry.npmjs.org')
  const res = await fetch(request, { headers: { authorization: `Bearer ${token}` } })
  return res.ok ? (await res.json()).value : undefined
}

async function npmSettings() {
  const registry = (process.env.NPM_REGISTRY_URL ?? 'https://registry.npmjs.org/').replace(
    /\/?$/,
    '/'
  )

  if (!dryRun) {
    // Trusted publishing (OIDC) needs npm 11.5.1 or later.
    const version = npm(['--version']).stdout?.trim() ?? ''
    const [major, minor, patch] = version.split('.').map(Number)
    if (!(major > 11 || (major === 11 && (minor > 5 || (minor === 5 && patch >= 1)))))
      fail(`npm ${version || '(not found)'} is too old to publish; it needs 11.5.1 or later.`)

    if (inCi) {
      const idToken = await oidcToken()
      if (!idToken)
        fail(
          "There's no OIDC token, so nothing was published to npmjs.org. The workflow job needs `permissions: id-token: write`.",
          NOT_CONFIGURED
        )
      // Exchange it here rather than leaving it to npm, so a missing trusted publisher is "not
      // configured" (78) instead of a failed publish.
      const res = await fetch(
        `${registry}-/npm/v1/oidc/token/exchange/package/${pkg.name.replace('/', '%2f')}`,
        { method: 'POST', headers: { authorization: `Bearer ${idToken}` } }
      )
      const token = res.ok ? (await res.json()).token : undefined
      if (!token)
        fail(
          `npmjs.org refused the OIDC token (${res.status}), so nothing was published there. Add a trusted publisher for ${pkg.name} on npmjs.com (GitHub Actions, furlabnet/dynamic-lab, release.yml).`,
          NOT_CONFIGURED
        )
      step('Exchanged the OIDC token for an npm publish token')
      return { label: 'npmjs.org', registry, token, access: 'public', isPublished }
    } else {
      const whoami = npm(['whoami', '--registry', registry])
      if (whoami.status !== 0) fail(`You're not logged in to ${registry}. Run \`npm login\` first.`)
      step(`Logged in to npm as ${whoami.stdout.trim()}`)
    }
  }

  return { label: 'npmjs.org', registry, access: 'public', isPublished }

  async function isPublished() {
    const res = await fetch(`${registry}${pkg.name.replace('/', '%2f')}/${pkg.version}`)
    if (res.status === 404) return false
    return res.ok ? true : undefined
  }
}

const settings = await npmSettings()

console.log(
  `\nReleasing ${pkg.name}@${pkg.version} to ${settings.label}${dryRun ? ' (dry run)' : ''}`
)
step(`Registry: ${settings.registry}`)
step(`Dist-tag: ${distTag ?? 'latest'}`)

/* -------------------------------------------------------------- Checks */

// In CI, only release from the tag that matches the version, so the registry and git agree.
const ciTag = process.env.GITHUB_REF_TYPE === 'tag' ? process.env.GITHUB_REF_NAME : undefined
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

{
  try {
    const published = await settings.isPublished()
    if (published && skipPublished) {
      console.log(
        `\n✔ ${pkg.name}@${pkg.version} is already on ${settings.label}; nothing to do.\n`
      )
      process.exit(0)
    }
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

const yarn = (yarnArgs, env = process.env) => {
  const result = spawnSync('yarn', yarnArgs, {
    stdio: 'inherit',
    env,
    shell: process.platform === 'win32',
  })
  if (result.status !== 0)
    fail(`yarn ${yarnArgs.join(' ')} failed with exit code ${result.status}.`)
}
const publishArgs = ['--access', settings.access, ...(distTag ? ['--tag', distTag] : [])]

if (dryRun) {
  step('Building and listing the package contents (prepack runs the build)')
  yarn(['pack', '--dry-run'])
} else {
  // Yarn packs (resolving workspace: ranges), then npm publishes the tarball: with the exchanged
  // token and provenance in CI, with the `npm login` session locally.
  const dir = mkdtempSync(join(tmpdir(), 'furlab-release-'))
  const tarball = join(dir, 'package.tgz')
  const npmArgs = ['publish', tarball, '--registry', settings.registry, ...publishArgs]
  if (settings.token) {
    const userconfig = join(dir, '.npmrc')
    const host = settings.registry.replace(/^https?:/, '')
    writeFileSync(userconfig, `${host}:_authToken=${settings.token}\n`, { mode: 0o600 })
    npmArgs.push('--userconfig', userconfig, '--provenance')
  }
  try {
    step('Building and packing (prepack runs the build)')
    yarn(['pack', '--out', tarball])
    step('Publishing with npm')
    const result = npm(npmArgs, { stdio: 'inherit' })
    if (result.status !== 0) fail(`npm publish failed with exit code ${result.status}.`)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

console.log(
  dryRun
    ? `\n✔ Dry run complete. Run without --dry-run to publish ${pkg.name}@${pkg.version}.\n`
    : `\n✔ Published ${pkg.name}@${pkg.version} to ${settings.label}${distTag ? ` (${distTag})` : ''}.\n`
)
