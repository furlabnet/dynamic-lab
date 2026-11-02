#!/usr/bin/env node
/**
 * Create the GitLab release (and with it the tag) for each tag given, on the commit being built,
 * with the notes from the package's changelog. Run in GitLab CI after the packages are published:
 *
 *   node scripts/gitlab-release.mjs v1.2.3 the-lab-sans-v1.2.3
 *   node scripts/gitlab-release.mjs "$PENDING_TAGS"     (comma-separated, as plan writes it)
 *
 * Uses the job token (CI_JOB_TOKEN) and the CI_API_V4_URL, CI_PROJECT_ID and CI_COMMIT_SHA that
 * GitLab sets. A release that already exists is left alone, so a retried job doesn't fail.
 */
import { execFileSync } from 'node:child_process'

import { releaseForTag } from './releases.mjs'

// Accept tags as separate arguments or comma-separated, and ignore stray quotes and blanks.
const tags = process.argv
  .slice(2)
  .flatMap((arg) => arg.split(','))
  .map((tag) => tag.trim().replace(/^["']+|["']+$/g, ''))
  .filter(Boolean)

if (tags.length === 0) {
  console.log('Nothing to release.')
  process.exit(0)
}
const {
  CI_API_V4_URL: api,
  CI_PROJECT_ID: project,
  CI_COMMIT_SHA: ref,
  CI_JOB_TOKEN: token,
} = process.env

if (!api || !project || !ref || !token) {
  console.error(
    '✖ Run this in GitLab CI: it needs CI_API_V4_URL, CI_PROJECT_ID, CI_COMMIT_SHA and CI_JOB_TOKEN.'
  )
  process.exit(1)
}

const releases = `${api}/projects/${encodeURIComponent(project)}/releases`
const headers = { 'JOB-TOKEN': token, 'content-type': 'application/json' }

for (const tag of tags) {
  if (!releaseForTag(tag)) {
    console.error(`✖ ${tag} isn't a release tag.`)
    process.exit(1)
  }

  const existing = await fetch(`${releases}/${encodeURIComponent(tag)}`, { headers })
  if (existing.ok) {
    console.log(`• The ${tag} release already exists; leaving it.`)
    continue
  }

  const description = execFileSync(
    'node',
    [new URL('./release-notes.mjs', import.meta.url).pathname, tag],
    {
      encoding: 'utf8',
    }
  )
  const res = await fetch(releases, {
    method: 'POST',
    headers,
    body: JSON.stringify({ tag_name: tag, name: tag, ref, description }),
  })
  if (!res.ok) {
    console.error(`✖ GitLab refused the ${tag} release (${res.status}): ${await res.text()}`)
    process.exit(1)
  }
  console.log(`✔ Released ${tag} on ${ref.slice(0, 8)}`)
}
