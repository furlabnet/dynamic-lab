# Dynamic Lab by Furlab

The React component library for **The Furlab Project**: TypeScript, Tailwind CSS v4 and design tokens from Figma.

- Two brands: **Dynamic** for the public site and **Backstage** for the staff console
- Eight named colour themes, each in light and dark
- About 70 components: from buttons and dialogs to a comic reader, a story reader and booru-style tags

**Site:** https://furlab.gitlab.io/dynamic-lab/ (landing page) · [showcase](https://furlab.gitlab.io/dynamic-lab/showcase/) · [docs](https://furlab.gitlab.io/dynamic-lab/docs/)

To use the library in an app, see [`packages/dynamic-lab`](./packages/dynamic-lab/README.md).

---

## Repository layout

A [Turborepo](https://turborepo.com) monorepo with Yarn workspaces.

| Workspace | Package | What it is |
| --- | --- | --- |
| `packages/dynamic-lab` | `@furlab/dynamic-lab` | The component library, published to the GitLab package registry |
| `packages/the-lab-sans` | `@furlab/the-lab-sans` | The Lab Sans typeface: OpenType files and `@font-face` rules. Loaded by every app. Private, not published |
| `apps/landing` | `@furlab/landing` | The landing page: what the library is, with links to the showcase and docs |
| `apps/showcase` | `@furlab/showcase` | Two working apps (the Dynamic Lab public site and the Backstage console) built from the library |
| `apps/docs` | `@furlab/docs` | The documentation site: guides, live examples, source and props for every component |

```
packages/
  dynamic-lab/
    src/components/   one folder per component
    src/theme/        ThemeProvider, palettes, tokens
    src/styles/       tokens.css, components.css, content.css; dynamic-lab.css is the published entry
    scripts/          release.mjs publishes to the GitLab package registry
  the-lab-sans/       fonts/ and the-lab-sans.css
apps/
  landing/
  showcase/
  docs/src/examples/  live examples; each docs page shows this source
scripts/
  assemble-pages.mjs  puts the built apps together in public/
```

The apps load `@furlab/dynamic-lab` from its TypeScript source (the `@furlab/source` export condition), so library edits show up in every app with hot reload and type-checking doesn't need a build first. Each app's stylesheet points Tailwind at `packages/dynamic-lab/src` with `@source`.

## Development

Requires Node 24 (see `.nvmrc`) and Yarn 4 (via Corepack).

| Command | What it does |
| --- | --- |
| `yarn dev` | Every app at once: landing on http://localhost:5170, showcase on http://localhost:5173, docs on http://localhost:5180 |
| `yarn workspace @furlab/showcase dev` | Just one app (likewise `@furlab/docs`, `@furlab/landing`) |
| `yarn build` | Every workspace. The library goes to `packages/dynamic-lab/dist/` (tsdown for ESM and CJS, `tsc` for declarations, the Tailwind CLI for `styles.css`); each app to its own `dist/` |
| `yarn pages` | Build the apps and assemble them into `public/`: landing at the root, then `showcase/` and `docs/` |
| `yarn typecheck` | Type-check every workspace |
| `yarn format` | Prettier |

Turborepo caches `build` and `typecheck`, so unchanged workspaces are skipped.

### Environment variables

| Variable | Used by | Effect |
| --- | --- | --- |
| `VITE_THE_LAB_SANS=off` | showcase | Leave The Lab Sans out of the build and use the system font |
| `VITE_SHOWCASE_URL`, `VITE_DOCS_URL` | landing | Where the landing page links. Default: `./showcase/` and `./docs/` in a build, the local dev servers in `yarn dev` |
| `VITE_REPOSITORY_URL` | landing, docs | Source link. Default: the repository URL in `packages/dynamic-lab/package.json` |
| `VITE_REGISTRY_URL` | docs | Registry shown in the install guide. Default: `https://gitlab.com/api/v4/packages/npm/` |
| `PAGES_BASE` | every app | Absolute base path, if relative asset paths (`./`) won't do |

The showcase's sample images come from [Lorem Picsum](https://picsum.photos) and avatars from [pravatar.cc](https://pravatar.cc).

## Releasing

1. Bump `version` in `packages/dynamic-lab/package.json` and commit.
2. Tag and push: `git tag v0.2.0 && git push origin v0.2.0`.
3. The pipeline's `publish` job runs `yarn release` with the CI job token. Tags with a pre-release suffix (`v1.0.0-beta.1`) publish under the `next` dist-tag.

`yarn release` (from the root) also works locally:

```bash
yarn release --dry-run                 # check everything, list the package contents, publish nothing
GITLAB_TOKEN=glpat-… yarn release      # publish (token needs the api scope)
GITLAB_TOKEN=glpat-… yarn release --tag next
```

It refuses to publish when the tag doesn't match the version, the working tree has uncommitted changes, or the version is already in the registry. Set `GITLAB_API_URL` and `GITLAB_PROJECT` for a self-managed GitLab or another project.

On the default branch, the `pages` job runs `yarn pages` and deploys `public/` to GitLab Pages.

## Licence

MIT © 2026 Vedla Creative and The Furlab Project. See [LICENSE](./LICENSE).

Author: Vedla Creative <code@vedla.ca>
