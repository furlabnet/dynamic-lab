import React, { useEffect } from 'react'
import { ThemeProvider, ToastProvider, useTheme } from '../index'
import { ShowcaseProvider, useShowcase } from './state'
import { LabApp } from './lab/LabApp'
import { BackstageApp } from './backstage/BackstageApp'

/**
 * The showcase is two apps built from the same library:
 * - Dynamic Lab: the public site (top navigation, roomy, blue)
 * - Backstage: the staff console (sidebar shell, dense, violet)
 * The AppSwitcher moves between them; the route (#/lab/… or #/backstage/…) picks the theme brand.
 */
function Root() {
  const { app } = useShowcase()
  const { brand, setBrand } = useTheme()

  useEffect(() => {
    const next = app === 'backstage' ? 'backstage' : 'dynamic'
    if (brand !== next) setBrand(next)
  }, [app, brand, setBrand])

  return app === 'backstage' ? <BackstageApp /> : <LabApp />
}

export function App() {
  return (
    <ThemeProvider defaultBrand="dynamic" defaultMode="light">
      <ToastProvider>
        <ShowcaseProvider>
          <Root />
        </ShowcaseProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
