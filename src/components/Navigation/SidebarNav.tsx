import React from 'react'
import { cn } from '../../lib/utils'

export interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  /** `card` is the floating glass panel used in dashboards; `plain` sits inside an AdminSidebar. */
  variant?: 'card' | 'plain'
}

export function SidebarNav({ className, children, variant = 'card', ...props }: SidebarNavProps) {
  return (
    <nav
      className={cn(
        'ui-nav flex flex-col gap-1',
        variant === 'card' && 'glass-chrome w-64 rounded-[var(--radius-2xl)] border border-[var(--glass-border)] p-3',
        className
      )}
      {...props}>
      {children}
    </nav>
  )
}

export interface SidebarNavGroupProps {
  label?: string
  children: React.ReactNode
  className?: string
}

export function SidebarNavGroup({ label, children, className }: SidebarNavGroupProps) {
  return (
    <div className={cn('ui-nav-group mb-2 flex flex-col gap-0.5', className)}>
      {label && <span className="ui-nav-label">{label}</span>}
      {children}
    </div>
  )
}

export type SidebarNavItemProps = {
  active?: boolean
  icon?: React.ReactNode
  badge?: string | number
} & (
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
)

/** A sidebar link. Renders an anchor with `href`, otherwise a button (for client-side routing). */
export function SidebarNavItem({ className, active, icon, badge, children, ...props }: SidebarNavItemProps) {
  const classes = cn('ui-nav-link w-full text-left cursor-pointer', className)
  const label = typeof children === 'string' ? children : undefined
  const inner = (
    <>
      {icon && <span className="inline-flex size-[18px] shrink-0 items-center [&>svg]:size-[18px]">{icon}</span>}
      <span className="ui-nav-text flex-1 truncate">{children}</span>
      {badge !== undefined && <span className="ui-nav-badge ui-nav-text">{badge}</span>}
    </>
  )

  if (props.href !== undefined) {
    return (
      <a
        aria-current={active ? 'page' : undefined}
        title={label}
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
      title={label}
      className={classes}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  )
}
