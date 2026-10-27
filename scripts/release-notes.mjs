#!/usr/bin/env node
/**
 * Print the release notes for a git tag, as Markdown: the package's changelog section for that
 * version, plus how to install it. GitLab CI and GitHub Actions use it for the release description.
 *
 *   node scripts/release-notes.mjs v0.2.0
 *   node scripts/release-notes.mjs the-lab-sans-v0.2.0 > release-notes.md
 *
 * The changelog section is the one headed "## 0.2.0" (also "## [0.2.0]", "## v0.2.0" or with a date
 * after it, "## 0.2.0 - 2026-11-01"). Exits with an error for a tag that isn't a release tag.
 */
import { existsSync, readFileSync } from 'node:fs'
import { releaseForTag } from './releases.mjs'

const tag = process.argv[2]
const release = tag && releaseForTag(tag)
if (!release) {
  console.error(`✖ "${tag ?? ''}" isn't a release tag (v1.2.3 or the-lab-sans-v1.2.3).`)
  process.exit(1)
}

const { name, version, changelog } = release
const file = new URL(`../${changelog}`, import.meta.url)
const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const heading = new RegExp(`^## \\[?v?${escaped}\\]?(\\s|$)`)

let section = ''
if (existsSync(file)) {
  const lines = readFileSync(file, 'utf8').split('\n')
  const start = lines.findIndex((line) => heading.test(line))
  if (start >= 0) {
    const end = lines.findIndex((line, i) => i > start && line.startsWith('## '))
    section = lines
      .slice(start + 1, end < 0 ? undefined : end)
      .join('\n')
      .trim()
  }
}

console.log(`${section || `No changelog entry for ${version}; see ${changelog}.`}

### Install

\`\`\`sh
yarn add ${name}@${version}
\`\`\`
`)
