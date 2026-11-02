#!/usr/bin/env node
/**
 * Runs before tsdown bundles (the build:prepare hook in tsdown.config.ts): writes src/the-lab-sans.css
 * with one @font-face per face, plus the --font-the-lab-sans variable. tsdown bundles it into
 * dist/the-lab-sans.css and copies fonts/ (otf/ and woff2/, both kept in the repository) into
 * dist/fonts/, where the url()s below point.
 */
import { writeFile } from 'node:fs/promises'

import { cssVariable, faces, fontFamily, fontStack } from './font'

export async function buildCSS() {
  const root = new URL('../', import.meta.url)

  const rules = faces.map(
    ({ file, weight, style }) => `@font-face {
  font-family: '${fontFamily}';
  src: url('./fonts/woff2/${file}.woff2') format('woff2');
  font-weight: ${weight};
  font-style: ${style};
  font-display: swap;
}`
  )

  const css = `/* ${fontFamily}: @furlab/the-lab-sans. Auto-generated on build; don't edit. */
${rules.join('\n')}
:root {
  ${cssVariable}: ${fontStack};
}
`
  await writeFile(new URL('the-lab-sans.css', root), css)
  console.log(`✔ ${faces.length} faces → src/the-lab-sans.css`)
}
