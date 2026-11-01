'use client'

import React, { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react'

import type { Palette } from './palettes'
import type { FullTheme, ThemeBrand, ThemeMode } from './tokens'
import { DEFAULT_PALETTE_ID, PALETTES, paletteTokens } from './palettes'
import { DEFAULT_THEME_STORAGE_KEY } from './ThemeScript'

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
const DARK_QUERY = '(prefers-color-scheme: dark)'

const subscribeNever = () => () => {}

/** A media query as external state; false on the server and while hydrating. */
function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false
  )
}

/**
 * Choices come from three places, most important first: what the user picked in this session,
 * what was saved in localStorage, and the defaults. Saved choices aren't read on the server or
 * while hydrating, so the first client render matches the server's HTML; ThemeScript has already
 * applied them to <html> by then, so nothing flashes. A client-only app reads them straight away.
 */
export function ThemeProvider({
  children,
  defaultBrand = 'dynamic',
  defaultMode = 'light',
  defaultTransparency = 'system',
  defaultPalette = DEFAULT_PALETTE_ID,
  palettes = PALETTES,
  paletteBrands = ['dynamic'],
  storageKey = DEFAULT_THEME_STORAGE_KEY,
}: ThemeProviderProps) {
  // True on the server and during hydration, false afterwards and in client-only renders.
  const hydrating = useSyncExternalStore(
    subscribeNever,
    () => false,
    () => true
  )
  const saved = (name: string) => (hydrating ? null : readStorage(`${storageKey}-${name}`))

  const [chosenPalette, setChosenPalette] = useState<string | null>(null)
  const [chosenBrand, setChosenBrand] = useState<ThemeBrand | null>(null)
  const [chosenMode, setChosenMode] = useState<ThemeMode | null>(null)
  const [chosenTransparency, setChosenTransparency] = useState<TransparencyPreference | null>(null)
  const systemDark = useMediaQuery(DARK_QUERY)
  const systemReduced = useMediaQuery(REDUCED_TRANSPARENCY_QUERY)

  const savedPalette = saved('palette')
  const palette =
    chosenPalette ??
    (savedPalette && palettes.some((p) => p.id === savedPalette) ? savedPalette : defaultPalette)

  const savedBrand = saved('brand')
  const brand: ThemeBrand =
    chosenBrand ??
    (savedBrand === 'dynamic' || savedBrand === 'backstage' ? savedBrand : defaultBrand)

  const savedMode = saved('mode')
  const mode: ThemeMode =
    chosenMode ??
    (savedMode === 'light' || savedMode === 'dark' ? savedMode : systemDark ? 'dark' : defaultMode)

  const savedTransparency = saved('transparency')
  const transparency: TransparencyPreference =
    chosenTransparency ??
    (savedTransparency === 'system' ||
    savedTransparency === 'full' ||
    savedTransparency === 'reduced' ||
    savedTransparency === 'off'
      ? savedTransparency
      : defaultTransparency)

  const resolvedTransparency: TransparencyLevel =
    transparency === 'system' ? (systemReduced ? 'reduced' : 'full') : transparency

  const theme: FullTheme = `${brand}-${mode}`

  // While hydrating, the values above are the defaults; leave <html> as ThemeScript set it.
  useEffect(() => {
    if (hydrating) return
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.setAttribute('data-mode', mode)
    root.setAttribute('data-brand', brand)
    root.setAttribute('data-transparency', resolvedTransparency)
  }, [hydrating, theme, brand, mode, resolvedTransparency])

  const paletteActive = paletteBrands.includes(brand)

  // Palettes are applied as inline custom properties on <html>, so they outrank the theme CSS.
  // Outside `paletteBrands` they're removed and the brand's own tokens show through.
  useEffect(() => {
    if (hydrating) return
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
  }, [hydrating, palette, palettes, paletteActive, mode])

  // Choices are saved when they're made, never from an effect, so a render with the defaults
  // (on the server, or while hydrating) can't overwrite what was saved.
  const choose =
    <T extends string>(name: string, set: (value: T) => void) =>
    (value: T) => {
      set(value)
      writeStorage(`${storageKey}-${name}`, value)
    }
  const setBrandState = choose<ThemeBrand>('brand', setChosenBrand)
  const setModeState = choose<ThemeMode>('mode', setChosenMode)
  const setTransparencyState = choose<TransparencyPreference>('transparency', setChosenTransparency)
  const setPaletteState = choose<string>('palette', setChosenPalette)

  const setBrand = (newBrand: ThemeBrand) => setBrandState(newBrand)
  const setMode = (newMode: ThemeMode) => setModeState(newMode)
  const toggleMode = () => setModeState(mode === 'light' ? 'dark' : 'light')
  const toggleBrand = () => setBrandState(brand === 'dynamic' ? 'backstage' : 'dynamic')

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
