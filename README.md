# Dynamic Lab by Furlab

The React component library for **The Furlab Project**: TypeScript, Tailwind CSS v4 and design tokens from Figma.

- Two brands: **Dynamic** for the public site and **Backstage** for the staff console
- Eight named colour themes, each in light and dark
- About 70 components: from buttons and dialogs to a comic reader, a story reader and booru-style tags

**Site:** https://furlab.gitlab.io/dynamic-lab/ (landing page) · [showcase](https://furlab.gitlab.io/dynamic-lab/showcase/) · [docs](https://furlab.gitlab.io/dynamic-lab/docs/) · [The Lab Sans](https://furlab.gitlab.io/dynamic-lab/the-lab-sans/)

To use the library in an app, see [`packages/dynamic-lab`](./packages/dynamic-lab/README.md). For the typeface, including in a Next.js site, see [`packages/the-lab-sans`](./packages/the-lab-sans/README.md).

---

## Repository layout

A [Turborepo](https://turborepo.com) monorepo with Yarn workspaces.

| Workspace | Package | What it is |
| --- | --- | --- |
| `packages/dynamic-lab` | `@furlab/dynamic-lab` | The component library |
| `packages/the-lab-sans` | `@furlab/the-lab-sans` | The Lab Sans typeface: WOFF2 web fonts built from the OpenType files, an `@font-face` stylesheet and a little JavaScript. Loaded by every app |
| `apps/landing` | `@furlab/landing` | The landing page: what the library is, with links to the showcase and docs |
| `apps/showcase` | `@furlab/showcase` | Two working apps (the Dynamic Lab public site and the Backstage console) built from the library |
| `apps/docs` | `@furlab/docs` | The documentation site: guides, live examples, source and props for every component |
| `apps/the-lab-sans` | `@furlab/the-lab-sans-site` | The Lab Sans specimen: every weight, a type tester, OpenType features, glyphs and set-up guides |

Both packages are published to this project's GitLab package registry and to npmjs.org (see [Releasing](#releasing)).

```
packages/
  dynamic-lab/
    src/components/   one folder per component
    src/theme/        ThemeProvider, palettes, tokens
    src/styles/       tokens.css, components.css, content.css; dynamic-lab.css is the published entry
  the-lab-sans/
    fonts/            the OpenType sources
    src/index.ts      family name, font stack and the list of faces
    scripts/          build-css.mjs writes dist/fonts/*.woff2 and dist/the-lab-sans.css
apps/
  landing/
  showcase/
  docs/src/examples/  live examples; each docs page shows this source
  the-lab-sans/
scripts/
  assemble-pages.mjs  puts the built apps together in public/
  release.mjs         publishes a package to the GitLab registry or npmjs.org
  release-notes.mjs   a release's notes, from the package's changelog
  releases.mjs        which tag releases which package
```

The apps load `@furlab/dynamic-lab` from its TypeScript source (the `@furlab/source` export condition), so library edits show up in every app with hot reload and type-checking doesn't need a build first. Each app's stylesheet points Tailwind at `packages/dynamic-lab/src` with `@source`. The font stylesheet only exists once `@furlab/the-lab-sans` is built, so `yarn dev` builds the packages first (Turborepo caches it).

## Development

Requires Node 24 (see `.nvmrc`) and Yarn 4 (via Corepack).

| Command | What it does |
| --- | --- |
| `yarn dev` | Every app at once: landing on http://localhost:5170, showcase on http://localhost:5173, docs on http://localhost:5180, The Lab Sans on http://localhost:5190 |
| `yarn turbo run dev --filter=@furlab/showcase` | Just one app (likewise `@furlab/docs`, `@furlab/landing`, `@furlab/the-lab-sans-site`), with the packages it needs built first |
| `yarn build` | Every workspace. The library goes to `packages/dynamic-lab/dist/` (tsdown for ESM and CJS, `tsc` for declarations, the Tailwind CLI for `styles.css`); the font to `packages/the-lab-sans/dist/` (`tsc`, then the OpenType files compressed to WOFF2); each app to its own `dist/` |
| `yarn pages` | Build the apps and assemble them into `public/`: landing at the root, then `showcase/`, `docs/` and `the-lab-sans/` |
| `yarn typecheck` | Type-check every workspace |
| `yarn format` | Prettier |

Turborepo caches `build` and `typecheck`, so unchanged workspaces are skipped.

### Environment variables

| Variable | Used by | Effect |
| --- | --- | --- |
| `VITE_THE_LAB_SANS=off` | showcase | Leave The Lab Sans out of the build and use the system font |
| `VITE_SHOWCASE_URL`, `VITE_DOCS_URL`, `VITE_FONT_URL` | landing | Where the landing page links. Default: `./showcase/`, `./docs/` and `./the-lab-sans/` in a build, the local dev servers in `yarn dev` |
| `VITE_LANDING_URL` | the-lab-sans | The specimen's link back to the landing page. Default: `../` in a build |
| `VITE_REPOSITORY_URL` | landing, docs, the-lab-sans | Source link. Default: the repository URL in the package's `package.json` |
| `VITE_REGISTRY_URL` | docs | Registry shown in the install guide. Default: `https://gitlab.com/api/v4/packages/npm/` |
| `PAGES_BASE` | every app | Absolute base path, if relative asset paths (`./`) won't do |

The showcase's sample images come from [Lorem Picsum](https://picsum.photos) and avatars from [pravatar.cc](https://pravatar.cc).

## Releasing

Each package is released from its own tag:

| Tag | Package | Changelog |
| --- | --- | --- |
| `v1.2.3` | `@furlab/dynamic-lab` | [`CHANGELOG.md`](./CHANGELOG.md) |
| `the-lab-sans-v1.2.3` | `@furlab/the-lab-sans` | [`packages/the-lab-sans/CHANGELOG.md`](./packages/the-lab-sans/CHANGELOG.md) |

1. Bump `version` in the package's `package.json`.
2. In its changelog, rename `## Unreleased` to the version (`## 0.2.0`, optionally with a date) and commit.
3. Tag and push: `git tag v0.2.0 && git push origin v0.2.0`.

The GitLab pipeline then:

- publishes the package to this project's **GitLab package registry** (with the CI job token)
- publishes it to **npmjs.org**, if the `NPM_TOKEN` CI/CD variable is set. Without it the npm job exits with code 78 and is allowed to fail, so the rest of the release goes ahead
- creates a **GitLab release** for the tag, with the changelog section as its description

Pre-release versions (`1.0.0-beta.1`) go out under the `next` dist-tag. Only the GitLab pipeline publishes. Make `NPM_TOKEN` a masked, protected variable and protect the `v*` and `the-lab-sans-v*` tags, so only maintainers' tags can publish.

### GitHub mirror

The repository is mirrored to GitHub. `.github/workflows/release.yml` type-checks and builds every push and pull request there, deploys to **GitHub Pages** on pushes to the default branch, and when a release tag arrives it creates a **GitHub release** with the same notes and the packed package attached. It never publishes to a registry.

Both pipelines test on the same Node versions: keep the `NODE_VERSION` matrix in `.gitlab-ci.yml` and `.github/workflows/release.yml` in sync.

### Publishing by hand

`scripts/release.mjs` works locally too, through each package's `release` script:

```bash
yarn workspace @furlab/dynamic-lab release --dry-run                        # check, list the contents, publish nothing
GITLAB_TOKEN=glpat-… yarn workspace @furlab/dynamic-lab release              # GitLab registry (token needs the api scope)
NPM_TOKEN=npm_… yarn workspace @furlab/the-lab-sans release --registry npm   # npmjs.org
```

`yarn release` at the root is short for the first package. The script refuses to publish when the CI tag doesn't match the version, the working tree has uncommitted changes, or the version is already in the registry. Set `GITLAB_API_URL` and `GITLAB_PROJECT` for a self-managed GitLab or another project; in CI they come from GitLab. `node scripts/release-notes.mjs v0.2.0` prints a release's notes.

On the default branch, the `pages` job runs `yarn pages` and deploys `public/` to GitLab Pages (and GitHub Pages on the mirror).

## Licence

MIT © 2026 Vedla Creative and The Furlab Project. See [LICENSE](./LICENSE).

Author: Vedla Creative <code@vedla.ca>
