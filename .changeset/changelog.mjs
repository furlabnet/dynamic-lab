/**
 * Changelog lines for `changeset version`: each changeset's text as written, as one list item, with
 * no commit hashes. Keep changesets in the changelog's voice: what changed for someone using the
 * package, with **Breaking:** in front of anything that needs a code change.
 */
const changelog = {
  getReleaseLine: async (changeset) => {
    const [first, ...rest] = changeset.summary
      .trim()
      .split('\n')
      .map((line) => line.trimEnd())
    return [`- ${first}`, ...rest.map((line) => (line ? `  ${line}` : ''))].join('\n')
  },
  getDependencyReleaseLine: async (_changesets, dependencies) =>
    dependencies.length === 0
      ? ''
      : dependencies.map((d) => `- Uses ${d.name} ${d.newVersion}.`).join('\n'),
}

export default changelog
