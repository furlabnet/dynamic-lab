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
- Version bumps for releases go in `packages/dynamic-lab/package.json`.

### Added

- `apps/landing`: a landing page that introduces the library and links to the showcase and docs.
  Its header has the same GitLab and npm ("Soon") links as the docs.
- `packages/the-lab-sans` (`@furlab/the-lab-sans`, private): The Lab Sans as OpenType files and
  `@font-face` rules for all 8 weights and their italics. The landing page, showcase and docs load it from here.
- `VITE_THE_LAB_SANS=off` leaves the font out of the showcase build.
- `yarn pages` builds the apps and assembles them into `public/`.
- Docs header: a Dynamic / Backstage switch that previews the docs and every example in either
  brand, the GitLab logo on the source link, and an npm link ("Soon").

### Fixed

- The docs header no longer runs off the screen on tablets and phones: the search box and version
  badge collapse below 1280px, and the GitLab and npm links move out of the way on phones.
- The showcase asked for `TheLabSans-ExtraBold.otf`, which doesn't exist (`Extrabold`), so
  extra-bold text fell back to a synthesised weight.
