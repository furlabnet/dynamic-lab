# @furlab/the-lab-sans

The Lab Sans, the Furlab typeface: 8 weights from Thin 100 to Black 900, each with a true italic.
It covers 1,034 characters (Latin, Greek, Cyrillic and Vietnamese) and has OpenType features such
as small caps, old-style and tabular figures, fractions and a slashed zero.

**Specimen:** https://furlab.gitlab.io/dynamic-lab/the-lab-sans/

The package contains:

- `fonts/*.woff2`: web fonts, compressed from the OpenType files at build time
- `the-lab-sans.css`: one `@font-face` rule per style, plus a `--font-the-lab-sans` variable
  holding the family with system fallbacks
- `otf/*.otf`: the OpenType originals, for desktop apps
- a little JavaScript: the family name, font stack and list of faces

## Install

```bash
yarn add @furlab/the-lab-sans
```

## Next.js

Import the stylesheet once in the root layout. Next.js copies the WOFF2 files into
`_next/static/media` and serves them from your own domain. This works with the App Router on
Turbopack and on webpack.

```tsx
// app/layout.tsx
import '@furlab/the-lab-sans/the-lab-sans.css'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

```css
/* app/globals.css */
body {
  font-family: var(--font-the-lab-sans);
}
```

With the Pages Router, import the stylesheet in `pages/_app.tsx` instead.

## Tailwind CSS v4

```css
@import 'tailwindcss';
@import '@furlab/the-lab-sans/the-lab-sans.css';

@theme {
  --font-sans: var(--font-the-lab-sans);
}
```

Every `font-sans` utility, and Tailwind's default body font, then use The Lab Sans.

## Vite and other bundlers

```ts
import '@furlab/the-lab-sans/the-lab-sans.css'
```

Any bundler that handles CSS imports and package `exports` works the same way.

## With Dynamic Lab

`@furlab/dynamic-lab` lists `'The Lab Sans'` first in `--font-sans` and `--font-display`, so
loading the stylesheet is all it takes.

## JavaScript

```ts
import { fontFamily, fontStack, cssVariable, weights, faces } from '@furlab/the-lab-sans'

fontFamily // 'The Lab Sans'
fontStack // "'The Lab Sans', ui-sans-serif, system-ui, …"
cssVariable // '--font-the-lab-sans'
faces // [{ name: 'Thin', weight: 100, style: 'normal', file: 'TheLabSans-Thin' }, …]
```

Use these for canvas, charts, emails or anything else that needs the family name or the list of
faces. A face's web font is at `@furlab/the-lab-sans/fonts/<file>.woff2` and its OpenType file at
`@furlab/the-lab-sans/otf/<file>.otf`.

## Development

`yarn build` compiles `src/` with `tsc`, then `scripts/build-css.mjs` compresses `fonts/*.otf` to
`dist/fonts/*.woff2` and writes `dist/the-lab-sans.css` from the list of faces in `src/index.ts`.
Releases are tagged `the-lab-sans-v<version>`; see the repository README.

## Licence

MIT © 2026 Vedla Creative and The Furlab Project. See [LICENSE](./LICENSE).
