import React from 'react'
import { cn } from '../../lib/utils'

export interface PillNavProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export function PillNav({ className, children, ...props }: PillNavProps) {
  return (
    <nav className={cn('pill-nav surface-card inline-flex p-1 gap-1', className)} {...props}>
      {children}
    </nav>
  )
}

export type PillNavLinkProps = {
  active?: boolean
  icon?: React.ReactNode
} & (
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
)

/** A pill link. Renders an anchor with `href`, otherwise a button (for client-side routing). */
export function PillNavLink({ className, active, icon, children, ...props }: PillNavLinkProps) {
  const shared = {
    'aria-current': active ? ('page' as const) : undefined,
    'data-active': active ? 'true' : undefined,
    className: cn('pill-nav-link cursor-pointer', className),
  }
  const inner = (
    <>
      {icon && <span className="inline-flex shrink-0 items-center size-4">{icon}</span>}
      <span>{children}</span>
    </>
  )

  if (props.href !== undefined) {
    return (
      <a {...shared} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {inner}
      </a>
    )
  }
  return (
    <button type="button" {...shared} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  )
}
