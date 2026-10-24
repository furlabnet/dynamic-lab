import React from 'react'
import { cn } from '../../lib/utils'

export interface PillNavProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export function PillNav({ className, children, ...props }: PillNavProps) {
  return (
    <nav
      className={cn('pill-nav surface-card inline-flex p-1 gap-1', className)}
      role="navigation"
      {...props}>
      {children}
    </nav>
  )
}

export interface PillNavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean
  icon?: React.ReactNode
}

export function PillNavLink({ className, active, icon, children, ...props }: PillNavLinkProps) {
  return (
    <a
      aria-current={active ? 'page' : undefined}
      data-active={active ? 'true' : undefined}
      className={cn('pill-nav-link cursor-pointer', className)}
      {...props}>
      {icon && <span className="inline-flex shrink-0 items-center size-4">{icon}</span>}
      <span>{children}</span>
    </a>
  )
}
