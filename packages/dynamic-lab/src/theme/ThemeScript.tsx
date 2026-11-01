import React from 'react'

import type { Palette } from './palettes'
import type { ThemeBrand, ThemeMode } from './tokens'
import { DEFAULT_PALETTE_ID, PALETTES, paletteTokens } from './palettes'

/** Where ThemeProvider and ThemeScript keep choices, unless `storageKey` says otherwise. */
export const DEFAULT_THEME_STORAGE_KEY = 'dynamic-lab-theme'

export interface ThemeScriptProps {
  /** Must match the ThemeProvider's. */
  storageKey?: string
  defaultBrand?: ThemeBrand
  defaultMode?: ThemeMode
  defaultTransparency?: 'system' | 'full' | 'reduced' | 'off'
  defaultPalette?: string
  palettes?: Palette[]
  paletteBrands?: ThemeBrand[]
  /** Content-Security-Policy nonce for the inline script. */
  nonce?: string
}

/**
 * Runs in the browser before first paint: reads the saved choices and sets the same attributes and
 * palette variables on <html> that ThemeProvider sets later, so server-rendered pages don't flash
 * the default theme. Kept in step with ThemeProvider's `resolve` logic by hand.
 */
function applyTheme(
  key: string,
  d: { brand: string; mode: string; transparency: string; palette: string },
  palettes: Record<string, Record<string, Record<string, string>>>,
  paletteBrands: string[]
) {
  try {
    const read = (name: string) => {
      try {
        return localStorage.getItem(`${key}-${name}`)
      } catch {
        return null
      }
    }
    let brand = read('brand')
    if (brand !== 'dynamic' && brand !== 'backstage') brand = d.brand
    let mode = read('mode')
    if (mode !== 'light' && mode !== 'dark')
      mode = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : d.mode
    let transparency = read('transparency')
    if (!['system', 'full', 'reduced', 'off'].includes(transparency ?? ''))
      transparency = d.transparency
    if (transparency === 'system')
      transparency = matchMedia('(prefers-reduced-transparency: reduce)').matches
        ? 'reduced'
        : 'full'
    const root = document.documentElement
    root.setAttribute('data-theme', `${brand}-${mode}`)
    root.setAttribute('data-mode', mode)
    root.setAttribute('data-brand', brand)
    root.setAttribute('data-transparency', transparency as string)
    let palette = read('palette')
    if (!palette || !palettes[palette]) palette = d.palette
    const tokens = palettes[palette]?.[mode]
    if (paletteBrands.includes(brand) && tokens) {
      for (const name in tokens) root.style.setProperty(name, tokens[name] as string)
      root.setAttribute('data-palette', palette)
    }
  } catch {
    // Never let theming break the page.
  }
}

/**
 * Put this in <head> when the page is rendered on the server (Next.js and similar), with the same
 * props as your ThemeProvider. It sets the theme before the first paint. Add
 * suppressHydrationWarning to <html>, since the script changes its attributes.
 */
export function ThemeScript({
  storageKey = DEFAULT_THEME_STORAGE_KEY,
  defaultBrand = 'dynamic',
  defaultMode = 'light',
  defaultTransparency = 'system',
  defaultPalette = DEFAULT_PALETTE_ID,
  palettes = PALETTES,
  paletteBrands = ['dynamic'],
  nonce,
}: ThemeScriptProps) {
  const tokens = Object.fromEntries(
    palettes.map((p) => [
      p.id,
      { light: paletteTokens(p, 'light'), dark: paletteTokens(p, 'dark') },
    ])
  )
  const args = [
    storageKey,
    {
      brand: defaultBrand,
      mode: defaultMode,
      transparency: defaultTransparency,
      palette: defaultPalette,
    },
    tokens,
    paletteBrands,
  ]
  // JSON is valid JavaScript; escaping "<" keeps "</script>" in a value from ending the tag.
  const json = JSON.stringify(args).replace(/</g, '\\u003c')
  const code = `(${applyTheme.toString()})(...${json})`
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: code }} />
}
