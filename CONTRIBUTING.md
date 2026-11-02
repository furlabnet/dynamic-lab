# Contributing

Thanks for taking the time to contribute. Bug fixes, new components, documentation, accessibility
fixes and reports of anything that looks wrong are all welcome. If you are planning a larger change
(a new component family, a change to the tokens or to a component's props), open an issue first so
we can agree on the approach.

## Getting started

You need Node 24 (see `.nvmrc`) and Yarn 4 through Corepack:

```sh
corepack enable
yarn install
yarn dev
```

`yarn dev` starts every app: the landing page on http://localhost:5170, the showcase on
http://localhost:5173, the playground on http://localhost:5175, the docs on http://localhost:5180
and The Lab Sans specimen on http://localhost:5190. The apps load the library from its source, so
edits in `packages/dynamic-lab` show up everywhere with hot reload. The
[README](./README.md#development) lists the other commands.

## Making a change

1. Branch off `main`.
2. Make the change where it belongs:
   - **A component:** its folder in `packages/dynamic-lab/src/components/`, exported from
     `src/index.ts`. Styles go in the matching file in `src/styles/`, and every colour, font,
     spacing and motion value comes from a token in `src/styles/tokens.css`. Add a `'use client'`
     line only when the component needs the browser.
   - **Its documentation:** a live example in `apps/docs/src/examples/` and an entry (summary,
     examples, props) in `apps/docs/src/registry.ts`.
   - **The design system:** read [`design.md`](./design.md) first. It records the decisions the
     library and the sites share (solid surfaces, light frost only on floating chrome, one hue per
     palette, sentence-case labels).
3. Check it before you push. The merge request pipeline runs the same checks, but they're quicker
   locally:

   ```sh
   yarn typecheck
   yarn lint
   yarn format      # yarn format:fix writes the fixes
   yarn build
   ```

4. Look at the change in the showcase or the docs, in light and dark mode and in both brands
   (Dynamic and Backstage).

## Submitting changes

- Open a merge request against `main` on GitLab (the GitHub repository is a mirror) and fill in the
  template: what changed, why, and how you tested it.
- Keep changes focused; avoid unrelated formatting or refactors in the same merge request.
- Add a changeset when the change affects anyone using `@furlab/dynamic-lab` or
  `@furlab/the-lab-sans`: run `yarn changeset`, pick the package and the bump, and write the
  changelog entry for someone using the package (start it with **Breaking:** when they'll need to
  change their code). Commit the file it creates in `.changeset/`. Don't edit versions or the
  changelogs' version headings by hand; the release process does that (see
  [Releasing](./README.md#releasing)).
- Update the READMEs when a change affects installation, usage, scripts or environment variables.

## AI policy

AI-assisted contributions are allowed. You are still the author, so you are responsible for every
line you submit.

- **Disclose it.** In the merge request (or pull request on the GitHub mirror), say which tool you
  used (for example Claude Code, GitHub Copilot, or Cursor), which model (for example Claude Opus
  5.5 or GPT-5), and what you used it for.
- **Review and understand it.** Read every change before you submit it, and be ready to explain
  any part of it. Prompting a tool and submitting what comes back without reviewing it is not a
  contribution.
- **Explain why.** Tell us why the change is needed and why it is done this way, not only what it
  does.
- **Write the description yourself.** The title and description must be written by a person, not
  generated. Code, tests, and commit messages can be AI-assisted; the description is where you
  show that you understand the change.

Requests that skip the disclosure, or whose author cannot explain the change, may be closed. The
merge request and pull request templates have a section for this.

## Reporting issues

Open an issue on GitLab with:

- the package and version (`@furlab/dynamic-lab@0.1.0-beta.4`, say) and your React version
- the component, its props, and what you expected to happen
- the brand, mode and colour theme it happens in, if it's visual
- the browser, and a screenshot or a short recording when it helps
