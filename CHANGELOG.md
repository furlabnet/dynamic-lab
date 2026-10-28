# Changelog

## Unreleased

### Changed

- The repository is now a Turborepo monorepo. The library moved to `packages/dynamic-lab`; the
  showcase and docs are their own apps in `apps/showcase` and `apps/docs`. The published package,
  its exports and its stylesheet are unchanged.
- Root commands now run across every workspace through Turborepo: `yarn dev` starts every app,
  `yarn build` and `yarn typecheck` cover every workspace. `yarn docs:dev`, `yarn docs:build` and
  `yarn preview` are gone; use `yarn workspace @furlab/docs dev` and friends instead.
- GitLab Pages now serves a landing page at the root, with the showcase at `showcase/` and the docs
  at `docs/`. Links to the old docs root (`…/dynamic-lab/#/…`) need `docs/` added.
- Version bumps for releases go in `packages/dynamic-lab/package.json`, and the release script
  moved to `scripts/release.mjs`.
- Releases are now also published to npmjs.org, with trusted publishing (OIDC) from the GitLab
  pipeline instead of an npm token; `npm login` covers publishing by hand. Without a trusted
  publisher that job is allowed to fail. Pre-release versions default to the `next` dist-tag.
- A tag that looks like a release tag but doesn't match a package version (such as
  `the-lab-sans-v0.1.0.beta.1`) now fails the pipeline instead of skipping the publish jobs.
- Tagged releases create a GitLab release, with this changelog's section for the version as the
  description.
- CI type-checks and builds on Node 22 and 24.
- The GitLab pipeline and the GitHub mirror's workflow only run for release tags. GitLab Pages and
  GitHub Pages are deployed from release tags instead of every push to `main`.

### Added

- `apps/landing`: a landing page that introduces the library and links to the showcase and docs.
  Its header has the same GitLab and npm ("Soon") links as the docs.
- `packages/the-lab-sans` (`@furlab/the-lab-sans`): The Lab Sans as its own package, released
  from `the-lab-sans-v*` tags with its own changelog. The landing page, showcase and docs load it
  from here.
- `apps/the-lab-sans`: a specimen site for The Lab Sans, served at `the-lab-sans/` on Pages and
  linked from the landing page.
- `.github/workflows/release.yml` for the GitHub mirror: type-checks and builds every push and pull
  request, deploys the documentation to GitHub Pages on `main`, and creates a GitHub release for each
  release tag. It doesn't publish packages.
- `scripts/release-notes.mjs` prints a release's notes from its changelog.
- `VITE_THE_LAB_SANS=off` leaves the font out of the showcase build.
- `yarn pages` builds the apps and assembles them into `public/`.
- Docs header: a Dynamic / Backstage switch that previews the docs and every example in either
  brand, the GitLab logo on the source link, and an npm link ("Soon").

### Fixed

- The docs header no longer runs off the screen on tablets and phones: the search box and version
  badge collapse below 1280px, and the GitLab and npm links move out of the way on phones.
- The showcase asked for `TheLabSans-ExtraBold.otf`, which doesn't exist (`Extrabold`), so
  extra-bold text fell back to a synthesised weight.
