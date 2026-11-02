# Changesets

Every change to a published package (`@furlab/dynamic-lab`, `@furlab/the-lab-sans`) comes with a
changeset: a small Markdown file here that says which packages it changes, how big the bump is, and
the changelog entry. Add one with:

```sh
yarn changeset
```

Write the entry for someone using the package, in the changelog's voice, and start it with
**Breaking:** when they'll need to change their code. While the packages are in pre-release (see
`pre.json`), any bump gives the next beta; use `minor` for features and breaking changes and
`patch` for fixes.

Merge requests that change a published package without a changeset fail the `mr:changeset` check.
If the change doesn't need a release (a test, a comment, internal tooling), add an empty one with
`yarn changeset --empty`, or label the merge request **no changeset**.

On `main`, the pipeline gathers the changesets into a "Version Packages" merge request that bumps
the versions and writes the changelogs. Merging it releases. The repository README has the details.
