#!/usr/bin/env node
/**
 * Second half of the build, after tsc has compiled src/ into dist/:
 * - compresses every fonts/*.otf into dist/fonts/*.woff2
 * - writes dist/the-lab-sans.css with one @font-face per face, plus the --font-the-lab-sans variable
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
  // await writeFile(new URL('dist/the-lab-sans.css', root), css)
  await writeFile(new URL('the-lab-sans.css', root), css)
  console.log(`✔ ${faces.length} faces → dist/fonts/*.woff2 and dist/the-lab-sans.css`)
}
