/**
 * The packages this repository releases, and how a git tag maps to each. Used by release.mjs (to
 * check the tag in CI) and release-notes.mjs (to find the changelog), in GitLab CI and GitHub Actions.
 *
 *   v1.2.3               @furlab/dynamic-lab 1.2.3
 *   the-lab-sans-v1.2.3  @furlab/the-lab-sans 1.2.3
 */
export const RELEASES = [
  {
    name: '@furlab/the-lab-sans',
    dir: 'packages/the-lab-sans',
    tagPrefix: 'the-lab-sans-v',
    changelog: 'packages/the-lab-sans/CHANGELOG.md',
  },
  {
    name: '@furlab/dynamic-lab',
    dir: 'packages/dynamic-lab',
    tagPrefix: 'v',
    changelog: 'CHANGELOG.md',
  },
]

const SEMVER = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/

/** The release a tag is for, and the version in it; null when the tag isn't a release tag. */
export function releaseForTag(tag) {
  // Longest prefix first, so "the-lab-sans-v1.0.0" isn't read as a "v" tag.
  const byPrefix = [...RELEASES].sort((a, b) => b.tagPrefix.length - a.tagPrefix.length)
  for (const release of byPrefix) {
    if (!tag.startsWith(release.tagPrefix)) continue
    const version = tag.slice(release.tagPrefix.length)
    return SEMVER.test(version) ? { ...release, version } : null
  }
  return null
}

export function releaseForPackage(name) {
  return RELEASES.find((release) => release.name === name) ?? null
}
