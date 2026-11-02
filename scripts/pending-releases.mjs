#!/usr/bin/env node
/**
 * Which packages are ready to release: those whose package.json version has no git tag yet on the
 * remote (v1.2.3 for @furlab/dynamic-lab, the-lab-sans-v1.2.3 for @furlab/the-lab-sans). Merging
 * the "Version Packages" merge request bumps the versions, so the pipeline on main finds them here.
 *
 *   node scripts/pending-releases.mjs                     print the pending tags, one per line
 *   node scripts/pending-releases.mjs --dotenv rel.env    also write PENDING_TAGS=v1.2.3,… for CI
 *
 * The dotenv value is comma-separated and unquoted: GitLab keeps quotes in dotenv values, so
 * PENDING_TAGS="" would arrive as two quote characters, not as empty.
 *   node scripts/pending-releases.mjs --remote upstream   check another remote (default origin)
 */
import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

import { RELEASES } from './releases.mjs'

const args = process.argv.slice(2)
const option = (name) => {
  const index = args.indexOf(name)
  return index >= 0 ? args[index + 1] : undefined
}
const remote = option('--remote') ?? 'origin'
const dotenv = option('--dotenv')

function tagExists(tag) {
  const result = spawnSync(
    'git',
    ['ls-remote', '--exit-code', '--tags', remote, `refs/tags/${tag}`],
    {
      encoding: 'utf8',
    }
  )
  // 0: found, 2: not found (--exit-code); anything else means we couldn't ask.
  if (result.status === 0) return true
  if (result.status === 2) return false
  console.error(
    `✖ Couldn't list tags on ${remote}: ${result.stderr.trim() || result.error?.message}`
  )
  process.exit(1)
}

const pending = []
for (const release of RELEASES) {
  const { version } = JSON.parse(
    readFileSync(new URL(`../${release.dir}/package.json`, import.meta.url), 'utf8')
  )
  const tag = `${release.tagPrefix}${version}`
  if (tagExists(tag)) {
    console.error(`• ${release.name} ${version} is already released (${tag})`)
  } else {
    console.error(`• ${release.name} ${version} is ready to release as ${tag}`)
    pending.push(tag)
  }
}

if (pending.length > 0) console.log(pending.join('\n'))
if (dotenv) writeFileSync(dotenv, `PENDING_TAGS=${pending.join(',')}\n`)
