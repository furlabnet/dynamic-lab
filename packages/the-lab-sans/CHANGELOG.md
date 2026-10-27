# Changelog

## Unreleased

### Added

- First release: The Lab Sans in 8 weights (Thin 100 to Black 900), each with an italic.
- WOFF2 web fonts in `fonts/`, generated from the OpenType files at build time, and the OpenType
  originals in `otf/`.
- `@furlab/the-lab-sans/the-lab-sans.css`: an `@font-face` rule per style, plus a
  `--font-the-lab-sans` variable with the family and system fallbacks. Works with Next.js (App and
  Pages Router), Vite and Tailwind CSS v4.
- `fontFamily`, `fontStack`, `cssVariable`, `weights` and `faces` exports for JavaScript.
- Released under the MIT licence.
