'use client'

import React, { useState } from 'react'

import { Menu as MenuIcon, X } from 'lucide-react'

import { cn } from '../../lib/utils'

export interface SiteHeaderProps extends React.HTMLAttributes<HTMLElement> {
  brand?: React.ReactNode
  /** Primary navigation, usually a SiteNav. Collapses into a menu button below md. */
  nav?: React.ReactNode
  actions?: React.ReactNode
  sticky?: boolean
}

/** The top bar of the public site: brand, primary nav and actions on frosted chrome. */
export function SiteHeader({
  className,
  brand,
  nav,
  actions,
  sticky = true,
  ...props
}: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className={cn('ui-site-header glass-chrome', sticky && 'sticky top-0 z-40', className)}
      {...props}>
      <div className="mx-auto flex h-16 max-w-[var(--container-max)] items-center gap-6 px-4 sm:px-8">
        {nav && (
          <button
            type="button"
            className="icon-button md:hidden"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X className="size-4" /> : <MenuIcon className="size-4" />}
          </button>
        )}
        {brand}
        {nav && <div className="hidden md:flex">{nav}</div>}
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">{actions}</div>
      </div>
      {nav && mobileOpen && (
        <div
          className="border-t border-[var(--glass-border)] px-4 py-3 md:hidden [&_nav]:flex-col [&_nav]:items-stretch"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('a, button')) setMobileOpen(false)
          }}>
          {nav}
        </div>
      )}
    </header>
  )
}
