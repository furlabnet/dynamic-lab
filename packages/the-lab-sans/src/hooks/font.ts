export const fontFamily = 'The Lab Sans'

/** The family with system fallbacks, for `font-family` or a CSS variable. */
export const fontStack = `'${fontFamily}', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`

/** Name of the CSS variable the stylesheet sets on :root, holding `fontStack`. */
export const cssVariable = '--font-the-lab-sans'

export type FontWeightName =
  'Thin' | 'Light' | 'Regular' | 'Medium' | 'Semibold' | 'Bold' | 'Extrabold' | 'Black'

export interface TheLabSansFace {
  name: FontWeightName
  weight: 100 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  style: 'normal' | 'italic'
  /** File name without extension: `fonts/<file>.otf` in the package, `<file>.woff2` on the web. */
  file: string
}

export const weights: { name: FontWeightName; weight: TheLabSansFace['weight'] }[] = [
  { name: 'Thin', weight: 100 },
  { name: 'Light', weight: 300 },
  { name: 'Regular', weight: 400 },
  { name: 'Medium', weight: 500 },
  { name: 'Semibold', weight: 600 },
  { name: 'Bold', weight: 700 },
  { name: 'Extrabold', weight: 800 },
  { name: 'Black', weight: 900 },
]

// The source files don't follow one pattern for italics.
const italicFile: Partial<Record<FontWeightName, string>> = {
  Regular: 'TheLabSans-RegularIt',
  Medium: 'TheLabSans-MediumItalic',
}

export const faces: TheLabSansFace[] = weights.flatMap(({ name, weight }) => [
  { name, weight, style: 'normal' as const, file: `TheLabSans-${name}` },
  { name, weight, style: 'italic' as const, file: italicFile[name] ?? `TheLabSans-${name}It` },
])
