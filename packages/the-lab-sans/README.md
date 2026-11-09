# @furlab/the-lab-sans

The Lab Sans, the Furlab typeface: 8 weights from Thin 100 to Black 900, each with a true italic.
It covers 1,034 characters (Latin, Greek, Cyrillic and Vietnamese) and has OpenType features such
as small caps, old-style and tabular figures, fractions and a slashed zero.

**Specimen:** https://furlab.gitlab.io/dynamic-lab/the-lab-sans/

The package contains:

- `fonts/woff2/*.woff2`: the web fonts
- `the-lab-sans.css`: one `@font-face` rule per style, plus a `--font-the-lab-sans` variable
  holding the family with system fallbacks
- `fonts/otf/*.otf`: the OpenType originals, for desktop apps
- a little JavaScript: the family name, font stack and list of faces

## Install

```bash
yarn add @furlab/the-lab-sans
# or: npm install @furlab/the-lab-sans
```

The package is on [npm](https://www.npmjs.com/package/@furlab/the-lab-sans), and every release is
also in the GitLab package registry.

### From a CDN

Without a bundler, link the stylesheet from
[jsDelivr](https://www.jsdelivr.com/package/npm/@furlab/the-lab-sans?path=dist). The WOFF2 files
load from the CDN beside it. Pin an exact version:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@furlab/the-lab-sans@0.1.0/dist/the-lab-sans.min.css" />
<style>
  body { font-family: 'The Lab Sans', system-ui, sans-serif; }
</style>
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
faces. A face's web font is at `@furlab/the-lab-sans/fonts/woff2/<file>.woff2` and its OpenType
file at `@furlab/the-lab-sans/fonts/otf/<file>.otf`.

## Development

`yarn build` runs tsdown. Before it bundles, `src/hooks/buildCSS.ts` writes `src/the-lab-sans.css`
(one `@font-face` per face in `src/hooks/font.ts`); tsdown then compiles `src/` to ESM and CJS,
bundles the stylesheet into `dist/the-lab-sans.css` and copies `fonts/` (the OpenType and WOFF2
files, both kept in the repository) into `dist/fonts/`.
Releases are tagged `the-lab-sans-v<version>`; see the repository README.

## Licence

MIT © 2026 Vedla Creative and The Furlab Project. See [LICENSE](./LICENSE).
