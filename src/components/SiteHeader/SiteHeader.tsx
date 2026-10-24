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

export function SiteNav({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav aria-label="Main" className={cn('flex items-center gap-1', className)} {...props}>
      {children}
    </nav>
  )
}

export type SiteNavLinkProps = {
  active?: boolean
  icon?: React.ReactNode
} & (
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
)

/** A header nav link. Renders an anchor with `href`, otherwise a button (for client-side routing). */
export function SiteNavLink({ className, active, icon, children, ...props }: SiteNavLinkProps) {
  const classes = cn('ui-site-nav-link', className)
  const inner = (
    <>
      {icon && <span className="inline-flex shrink-0 [&>svg]:size-4">{icon}</span>}
      {children}
    </>
  )

  if (props.href !== undefined) {
    return (
      <a
        aria-current={active ? 'page' : undefined}
        className={classes}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {inner}
      </a>
    )
  }
  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      className={classes}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  )
}

export interface SiteFooterProps extends React.HTMLAttributes<HTMLElement> {
  start?: React.ReactNode
  end?: React.ReactNode
}

export function SiteFooter({ className, start, end, children, ...props }: SiteFooterProps) {
  return (
    <footer className={cn('ui-site-footer', className)} {...props}>
      <div className="mx-auto flex max-w-[var(--container-max)] flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-[var(--muted-foreground)] sm:flex-row sm:px-8">
        <div className="flex items-center gap-2">{start}</div>
        {children}
        <div className="flex items-center gap-2">{end}</div>
      </div>
    </footer>
  )
}
