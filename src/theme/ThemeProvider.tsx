import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import type { ThemeBrand, ThemeMode, FullTheme } from './tokens'

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
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export interface ThemeProviderProps {
  children: React.ReactNode
  defaultBrand?: ThemeBrand
  defaultMode?: ThemeMode
  defaultTransparency?: TransparencyPreference
  storageKey?: string
}

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
  storageKey = 'dynamic-lab-theme',
}: ThemeProviderProps) {
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
      if (saved === 'system' || saved === 'full' || saved === 'reduced' || saved === 'off') return saved
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
