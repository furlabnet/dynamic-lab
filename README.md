# Dynamic Lab by Furlab

The React component library for **The Furlab Project**: TypeScript, Tailwind CSS v4 and design tokens from Figma.

- Two brands: **Dynamic** for the public site and **Backstage** for the staff console
- Eight named colour themes, each in light and dark
- More than 90 components: from layout primitives, buttons and dialogs to a comic reader, a story reader and booru-style tags

**Site:** https://furlab.gitlab.io/dynamic-lab/ (landing page) · [showcase](https://furlab.gitlab.io/dynamic-lab/showcase/) · [docs](https://furlab.gitlab.io/dynamic-lab/docs/) · [The Lab Sans](https://furlab.gitlab.io/dynamic-lab/the-lab-sans/)

Install from npm: [`@furlab/dynamic-lab`](https://www.npmjs.com/package/@furlab/dynamic-lab) and [`@furlab/the-lab-sans`](https://www.npmjs.com/package/@furlab/the-lab-sans).

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
| `apps/docs` | `@furlab/docs` | The documentation site: guides, an index of every component, and live examples, source and props for each |
| `apps/playground` | `@furlab/playground` | A Furlab-style home feed built only from library components, for trying layouts at every screen size |
| `apps/the-lab-sans` | `@furlab/the-lab-sans-site` | The Lab Sans specimen: every weight, a type tester, OpenType features, glyphs and set-up guides |
| `tools/eslint` | `@vedla/eslint-config` | Shared ESLint flat configs: `base`, `react-internal` (React libraries) and `next-js`. TypeScript goes through typescript-eslint, and every rule is a warning |
| `tools/prettier` | `@vedla/prettier-config` | The shared Prettier config, used by every workspace and the root: house style plus sorted imports and sorted Tailwind classes |
| `tools/tailwind` | `@vedla/tailwind-config` | A Tailwind v4 theme stylesheet and PostCSS config. Not used by the apps yet, which take their tokens from the library |
| `tools/typescript-config` | `@vedla/tsconfig` | Shared tsconfig presets (`base`, `react-library`, `compiled-package`, `nextjs`). The tool packages extend them; the apps and packages still use `tsconfig.base.json` |

Both packages are published to this project's GitLab package registry and to npmjs.org (see [Releasing](#releasing)).

```
packages/
  dynamic-lab/
    src/components/   one folder per component
    src/theme/        ThemeProvider, palettes, tokens
    src/styles/       tokens.css plus one file per area (components, content, layout, platform, surfaces, widgets); dynamic-lab.css is the published entry
  the-lab-sans/
    fonts/            the font files: otf/ (OpenType) and woff2/ (web fonts), copied into dist/fonts/
    src/index.ts      family name, font stack and the list of faces
    src/hooks/        buildCSS.ts writes the @font-face stylesheet before tsdown bundles it
apps/
  landing/
  showcase/
  docs/src/examples/  live examples; each docs page shows this source
  the-lab-sans/
tools/                shared ESLint, Prettier, Tailwind and TypeScript configs (private, not published)
logos/                the Furlab logo and mark (the fox is FleskyFox), in ink and white
design.md             the design system the library and the sites share
scripts/
  assemble-pages.mjs  puts the built apps together in public/
  release.mjs         publishes a package to the GitLab registry or npmjs.org
  release-notes.mjs   a release's notes, from the package's changelog
  releases.mjs        which tag releases which package
  pending-releases.mjs  which package versions have no tag yet, for the release pipeline
  gitlab-release.mjs  creates the GitLab release and tag for each one
.changeset/           pending changesets, the Changesets config and pre-release state
```

The apps load `@furlab/dynamic-lab` from its TypeScript source (the `@furlab/source` export condition), so library edits show up in every app with hot reload and type-checking doesn't need a build first. Each app's stylesheet points Tailwind at `packages/dynamic-lab/src` with `@source`. The font stylesheet only exists once `@furlab/the-lab-sans` is built, so `yarn dev` builds the packages first (Turborepo caches it).

## Development

Requires Node 24 (see `.nvmrc`) and Yarn 4 (via Corepack).

| Command | What it does |
| --- | --- |
| `yarn dev` | Every app at once: landing on http://localhost:5170, showcase on http://localhost:5173, docs on http://localhost:5180, playground on http://localhost:5175, The Lab Sans on http://localhost:5190 |
| `yarn turbo run dev --filter=@furlab/showcase` | Just one app (likewise `@furlab/docs`, `@furlab/landing`, `@furlab/the-lab-sans-site`), with the packages it needs built first |
| `yarn build` | Every workspace. The library goes to `packages/dynamic-lab/dist/` (tsdown for ESM and CJS, `tsc` for declarations, the Tailwind CLI for `styles.css`); the font to `packages/the-lab-sans/dist/` (tsdown, with the stylesheet generated from the list of faces and the font files copied in); each app to its own `dist/` |
| `yarn pages` | Build the apps and assemble them into `public/`: landing at the root, then `showcase/`, `playground/`, `docs/` and `the-lab-sans/` |
| `yarn typecheck` | Type-check every workspace |
| `yarn format` | Check formatting with Prettier in every workspace and the root files |
| `yarn format:fix` | Format everything in place |
| `yarn lint` | ESLint (the library and the Tailwind config so far) |
| `yarn changeset` | Add a changeset for a change to a published package (see [Releasing](#releasing)) |

Turborepo caches `build`, `typecheck` and `lint`, so unchanged workspaces are skipped. Prettier and ESLint keep their own caches in each workspace's `.cache/`.

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

Releases go through [Changesets](https://github.com/changesets/changesets). Each package keeps its own changelog and tag:

| Tag | Package | Changelog |
| --- | --- | --- |
| `v1.2.3` | `@furlab/dynamic-lab` | [`packages/dynamic-lab/CHANGELOG.md`](./packages/dynamic-lab/CHANGELOG.md) |
| `the-lab-sans-v1.2.3` | `@furlab/the-lab-sans` | [`packages/the-lab-sans/CHANGELOG.md`](./packages/the-lab-sans/CHANGELOG.md) |

1. **With each change,** run `yarn changeset`: pick the package, the size of the bump, and write the changelog entry. Commit the file it adds in `.changeset/` with the change.
2. **On every push to `main`,** the `version-mr` job gathers the changesets into a **Version Packages** merge request: it bumps the versions in `package.json` and moves the entries into the changelogs under the new version. New changesets update the same merge request.
3. **To release, merge that merge request.** One pipeline then releases every package whose version moved: it type-checks and builds on each Node version, publishes, creates the GitLab release (which creates the tag) and deploys Pages.

The packages are in pre-release mode (`.changeset/pre.json`, tag `beta`), so every release is the next beta: `0.1.0-beta.5`, then `0.1.0-beta.6`. When you're ready for `0.1.0`, run `yarn changeset pre exit` in a merge request; `yarn changeset pre enter beta` starts a new pre-release line.

`yarn version-packages` does step 2 locally if you want to see the result. Don't bump versions or edit the version headings by hand: the release jobs run when a package's version changes on `main`, and `scripts/pending-releases.mjs` decides what's new by looking for the version's tag.

In the release pipeline:

- `plan` lists the versions that have no tag yet (`scripts/pending-releases.mjs`); the other jobs only act on those
- each package goes to this project's **GitLab package registry** (with the CI job token)
- and to **npmjs.org** with [trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC, with provenance), so there's no npm token to store. Until the package has a trusted publisher, npm refuses the job's OIDC token and the job exits with code 78 and is allowed to fail, so the rest of the release goes ahead
- `gitlab-release` creates a **GitLab release** and its tag on the release commit, with the changelog section as its description (`scripts/gitlab-release.mjs`)
- `pages` deploys the landing page, showcase, playground, docs and specimen to **GitLab Pages**

Tags don't start pipelines, so a release that ships both packages runs one pipeline. Pre-release versions (`1.0.0-beta.1`) go out under the `next` dist-tag. A failed release can be retried with **Build → Pipelines → Run pipeline** on `main`: versions already in a registry are skipped, and so are releases that exist.

#### Setting up the Version Packages merge request

The `version-mr` job pushes a branch and opens a merge request, which the CI job token can't do. Create a **project access token** (Settings → Access tokens) with the **Developer** role and the `api` and `write_repository` scopes, and add it as a CI/CD variable named `GITLAB_TOKEN`, **masked** and **protected**. Until it exists, the job exits with code 78 and is allowed to fail. Protect `main`, so only maintainers' merges release, and protect the `v*` and `the-lab-sans-v*` tags.

#### Setting up trusted publishing

npm only lets you add a trusted publisher to a package that exists, so publish each package's first version by hand (see below). Then, on npmjs.com, open the package's **Settings → Trusted publishing**, choose **GitLab CI/CD** and enter namespace `furlab`, project `dynamic-lab` and top-level CI file `.gitlab-ci.yml` (leave the environment empty). The first publish through it must happen within two days, or npm drops the configuration. Once it works, set **Publishing access** to require 2FA and disallow tokens. Trusted publishing only runs on GitLab.com shared runners.

### GitHub mirror

The repository is mirrored to GitHub. `.github/workflows/release.yml` runs when a release tag arrives from GitLab (or by hand): it type-checks and builds the tag, creates a **GitHub release** with the same notes and the packed package attached, and deploys to **GitHub Pages**. It never publishes to a registry. The `github-pages` environment must allow deployments from tags (**Settings → Environments → github-pages → Deployment branches and tags**).

Both pipelines test on the same Node versions: keep the `NODE_VERSION` matrix in `.gitlab-ci.yml` and `.github/workflows/release.yml` in sync.

### Publishing by hand

`scripts/release.mjs` works locally too, through each package's `release` script:

```bash
yarn workspace @furlab/dynamic-lab release --dry-run                        # check, list the contents, publish nothing
GITLAB_TOKEN=glpat-… yarn workspace @furlab/dynamic-lab release              # GitLab registry (token needs the api scope)
npm login && yarn workspace @furlab/the-lab-sans release --registry npm      # npmjs.org
```

For npmjs.org the script packs the package with Yarn and publishes the tarball with the npm CLI (11.5.1 or later), so it uses your `npm login` session locally and the job's OIDC token in CI.

`yarn release` at the root is short for the first package. The script refuses to publish when the working tree has uncommitted changes or the version is already in the registry (`--skip-published` makes that a success, as the pipeline uses it). Set `GITLAB_API_URL` and `GITLAB_PROJECT` for a self-managed GitLab or another project; in CI they come from GitLab. `node scripts/release-notes.mjs v0.2.0` prints a release's notes.

Merge requests get their own pipeline: `yarn typecheck`, `yarn lint`, `yarn format` and `yarn build` on Node 24, plus `mr:changeset`, which fails when a published package changed without a changeset (`yarn changeset status`). For a change nobody using the package would notice, add an empty changeset (`yarn changeset --empty`) or the **no changeset** label. When `GITLAB_TOKEN` is available to the pipeline, changesets-gitlab also comments with what the merge request will release. Pull requests on the GitHub mirror run the same typecheck, build, lint and formatting checks. After a release publishes, the `pages` job runs `yarn pages` and deploys `public/` to GitLab Pages (and GitHub Pages on the mirror), so the live docs always match a release.

## Licence

MIT © 2026 Vedla Creative and The Furlab Project. See [LICENSE](./LICENSE).

Author: Vedla Creative <code@vedla.ca>
