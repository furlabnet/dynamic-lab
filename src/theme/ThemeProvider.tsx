import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import type { ThemeBrand, ThemeMode, FullTheme } from './tokens'

interface ThemeContextValue {
  brand: ThemeBrand
  mode: ThemeMode
  theme: FullTheme
  setBrand: (brand: ThemeBrand) => void
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
  toggleBrand: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export interface ThemeProviderProps {
  children: React.ReactNode
  defaultBrand?: ThemeBrand
  defaultMode?: ThemeMode
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultBrand = 'dynamic',
  defaultMode = 'light',
  storageKey = 'dynamic-lab-theme',
}: ThemeProviderProps) {
  const [brand, setBrandState] = useState<ThemeBrand>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${storageKey}-brand`) as ThemeBrand
      if (saved === 'dynamic' || saved === 'backstage') return saved
    }
    return defaultBrand
  })

  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${storageKey}-mode`) as ThemeMode
      if (saved === 'light' || saved === 'dark') return saved
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    }
    return defaultMode
  })

  const theme = useMemo<FullTheme>(() => `${brand}-${mode}`, [brand, mode])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.setAttribute('data-mode', mode)
    root.setAttribute('data-brand', brand)
    localStorage.setItem(`${storageKey}-brand`, brand)
    localStorage.setItem(`${storageKey}-mode`, mode)
  }, [theme, brand, mode, storageKey])

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
