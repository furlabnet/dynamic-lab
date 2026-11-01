import React from 'react'

import { cn } from '../../lib/utils'

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
