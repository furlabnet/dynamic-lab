import React from 'react'

import { cn } from '../../lib/utils'

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
export function SidebarNavItem({
  className,
  active,
  icon,
  badge,
  children,
  ...props
}: SidebarNavItemProps) {
  const classes = cn('ui-nav-link w-full cursor-pointer text-left', className)
  const label = typeof children === 'string' ? children : undefined
  const inner = (
    <>
      {icon && (
        <span className="inline-flex size-[18px] shrink-0 items-center [&>svg]:size-[18px]">
          {icon}
        </span>
      )}
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
