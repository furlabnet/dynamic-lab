# Agent Instructions

## Pull Requests and Commits

Contributors may use AI tools, under the AI policy in `CONTRIBUTING.md`. Agents working here must
follow it too:

- **NEVER** write a pull request title or description, and never add a
  "Generated with" line, robot emoji, or other AI attribution to one. The description must be
  written by the person submitting the change. If you are asked to open one, give the person the
  facts they need in chat (what changed, why, how it was tested) and let them write it.
- Commit messages may be written by you. A `Co-Authored-By` trailer naming the tool is fine, but it
  does not replace the disclosure in the pull request.
- When you finish a change, remind the person that the pull request must state the tool, the
  model, and what it was used for, and that they must review and understand every change first.

## Working in this repository

- Keep the `NODE_VERSION` matrix in `.github/workflows/ci.yml` and `.github/workflows/release.yml` in sync.
- Add a changeset (`.changeset/<name>.md`, or `yarn changeset`) for any change to a published
  package, written for someone using it. Never bump versions or edit the changelogs' version
  headings by hand; the Version Packages pull request does that.
- Update the READMEs when a change affects usage, components, tokens, scripts, release tags or
  environment variables.
- Read `design.md` before changing the library's look or the sites' layouts.
