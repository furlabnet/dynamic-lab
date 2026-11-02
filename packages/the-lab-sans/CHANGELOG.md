# Changelog

## 0.1.0-beta.5

### Patch Changes

- `@furlab/the-lab-sans/otf/*` resolves again: it pointed at a folder the package doesn't ship. The
  OpenType files are at `fonts/otf/` (also reachable as `otf/`) and the web fonts at `fonts/woff2/`.
- Prepare for release bump using the cli

## 0.1.0-beta.4

The first releases, 0.1.0-beta.1 to 0.1.0-beta.4, are listed together.

### Fixed

- Loading the package from source in the browser (the `@furlab/source` condition, as the apps in
  this repository do) no longer logs "Could not find or load the CSS module file." The build still
  bundles the stylesheet as before.

### Added

- First release: The Lab Sans in 8 weights (Thin 100 to Black 900), each with an italic.
- WOFF2 web fonts in `fonts/woff2/` and the OpenType originals in `fonts/otf/`.
- `@furlab/the-lab-sans/the-lab-sans.css`: an `@font-face` rule per style, plus a
  `--font-the-lab-sans` variable with the family and system fallbacks. Works with Next.js (App and
  Pages Router), Vite and Tailwind CSS v4.
- `fontFamily`, `fontStack`, `cssVariable`, `weights` and `faces` exports for JavaScript.
- Released under the MIT licence.
