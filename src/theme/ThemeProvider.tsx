import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import type { ThemeBrand, ThemeMode, FullTheme } from './tokens'
import { DEFAULT_PALETTE_ID, PALETTES, paletteTokens, type Palette } from './palettes'

/**
 * How see-through glass surfaces are. `system` follows the OS "reduce transparency" setting.
 * - full: frosted glass with blur
 * - reduced: mostly opaque surfaces, light blur
 * - off: solid surfaces, no blur, no background glows
 */
export type TransparencyPreference = 'system' | 'full' | 'reduced' | 'off'
export type TransparencyLevel = Exclude<TransparencyPreference, 'system'>

interface ThemeContextValue {
  brand: ThemeBrand
  mode: ThemeMode
  theme: FullTheme
  setBrand: (brand: ThemeBrand) => void
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
  toggleBrand: () => void
  /** What the user picked. */
  transparency: TransparencyPreference
  /** What's applied after resolving `system`. */
  resolvedTransparency: TransparencyLevel
  setTransparency: (transparency: TransparencyPreference) => void
  /** Id of the chosen colour theme, e.g. "fiery-fox". */
  palette: string
  setPalette: (id: string) => void
  /** Every theme on offer (built-ins plus any passed to the provider). */
  palettes: Palette[]
  /** True when the current brand uses palettes (see `paletteBrands`). */
  paletteActive: boolean
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export interface ThemeProviderProps {
  children: React.ReactNode
  defaultBrand?: ThemeBrand
  defaultMode?: ThemeMode
  defaultTransparency?: TransparencyPreference
  /** Initial colour theme id. Defaults to Midnight Wolf. */
  defaultPalette?: string
  /** Replace the built-in themes (spread PALETTES to extend them instead). */
  palettes?: Palette[]
  /**
   * Brands that colour themes apply to. Defaults to the public "dynamic" brand only, so Backstage
   * keeps its fixed console look.
   */
  paletteBrands?: ThemeBrand[]
  storageKey?: string
}

const PALETTE_KEYS = Object.keys(paletteTokens(PALETTES[0], 'light'))

function readStorage(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Storage blocked (private mode, sandboxed iframe): the choice just won't persist.
  }
}

const REDUCED_TRANSPARENCY_QUERY = '(prefers-reduced-transparency: reduce)'

export function ThemeProvider({
  children,
  defaultBrand = 'dynamic',
  defaultMode = 'light',
  defaultTransparency = 'system',
  defaultPalette = DEFAULT_PALETTE_ID,
  palettes = PALETTES,
  paletteBrands = ['dynamic'],
  storageKey = 'dynamic-lab-theme',
}: ThemeProviderProps) {
  const [palette, setPaletteState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = readStorage(`${storageKey}-palette`)
      if (saved && palettes.some((p) => p.id === saved)) return saved
    }
    return defaultPalette
  })

  const [brand, setBrandState] = useState<ThemeBrand>(() => {
    if (typeof window !== 'undefined') {
      const saved = readStorage(`${storageKey}-brand`)
      if (saved === 'dynamic' || saved === 'backstage') return saved
    }
    return defaultBrand
  })

  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = readStorage(`${storageKey}-mode`)
      if (saved === 'light' || saved === 'dark') return saved
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    }
    return defaultMode
  })

  const [transparency, setTransparencyState] = useState<TransparencyPreference>(() => {
    if (typeof window !== 'undefined') {
      const saved = readStorage(`${storageKey}-transparency`)
      if (saved === 'system' || saved === 'full' || saved === 'reduced' || saved === 'off')
        return saved
    }
    return defaultTransparency
  })

  const [systemReduced, setSystemReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(REDUCED_TRANSPARENCY_QUERY).matches
  )

  useEffect(() => {
    const query = window.matchMedia(REDUCED_TRANSPARENCY_QUERY)
    const onChange = () => setSystemReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const resolvedTransparency: TransparencyLevel =
    transparency === 'system' ? (systemReduced ? 'reduced' : 'full') : transparency

  const theme = useMemo<FullTheme>(() => `${brand}-${mode}`, [brand, mode])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.setAttribute('data-mode', mode)
    root.setAttribute('data-brand', brand)
    root.setAttribute('data-transparency', resolvedTransparency)
    writeStorage(`${storageKey}-brand`, brand)
    writeStorage(`${storageKey}-mode`, mode)
    writeStorage(`${storageKey}-transparency`, transparency)
  }, [theme, brand, mode, transparency, resolvedTransparency, storageKey])

  const paletteActive = paletteBrands.includes(brand)

  // Palettes are applied as inline custom properties on <html>, so they outrank the theme CSS.
  // Outside `paletteBrands` they're removed and the brand's own tokens show through.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const root = document.documentElement
    const selected = palettes.find((p) => p.id === palette) ?? palettes[0]
    if (paletteActive && selected) {
      const tokens = paletteTokens(selected, mode)
      PALETTE_KEYS.forEach((key) => root.style.setProperty(key, tokens[key]))
      root.setAttribute('data-palette', selected.id)
    } else {
      PALETTE_KEYS.forEach((key) => root.style.removeProperty(key))
      root.removeAttribute('data-palette')
    }
    writeStorage(`${storageKey}-palette`, palette)
  }, [palette, palettes, paletteActive, mode, storageKey])

  const setBrand = (newBrand: ThemeBrand) => setBrandState(newBrand)
  const setMode = (newMode: ThemeMode) => setModeState(newMode)
  const toggleMode = () => setModeState((prev) => (prev === 'light' ? 'dark' : 'light'))
  const toggleBrand = () => setBrandState((prev) => (prev === 'dynamic' ? 'backstage' : 'dynamic'))

  return (
    <ThemeContext.Provider
      value={{
        brand,
        mode,
        theme,
        setBrand,
        setMode,
        toggleMode,
        toggleBrand,
        transparency,
        resolvedTransparency,
        setTransparency: setTransparencyState,
        palette,
        setPalette: setPaletteState,
        palettes,
        paletteActive,
      }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
