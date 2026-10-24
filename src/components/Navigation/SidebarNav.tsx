import React from 'react'
import { cn } from '../../lib/utils'

export interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export function SidebarNav({ className, children, ...props }: SidebarNavProps) {
  return (
    <nav
      className={cn(
        'ui-nav glass-chrome flex flex-col gap-1 w-64 p-3 rounded-[var(--radius-2xl)] border border-[var(--glass-border)]',
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
    <div className={cn('flex flex-col gap-1 mb-2', className)}>
      {label && (
        <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[color-mix(in_srgb,var(--muted-foreground)_85%,transparent)]">
          {label}
        </span>
      )}
      {children}
    </div>
  )
}

export interface SidebarNavItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean
  icon?: React.ReactNode
  badge?: string | number
}

export function SidebarNavItem({
  className,
  active,
  icon,
  badge,
  children,
  ...props
}: SidebarNavItemProps) {
  return (
    <a
      aria-current={active ? 'page' : undefined}
      className={cn(
        'ui-nav-link flex items-center justify-between px-3 py-2 text-sm font-medium rounded-[var(--radius-md)] transition-colors cursor-pointer',
        className
      )}
      {...props}>
      <div className="flex items-center gap-2.5">
        {icon && <span className="inline-flex shrink-0 size-4">{icon}</span>}
        <span>{children}</span>
      </div>
      {badge !== undefined && (
        <span className="px-1.5 py-0.2 rounded-full text-xs font-semibold bg-[var(--muted)] text-[var(--muted-foreground)]">
          {badge}
        </span>
      )}
    </a>
  )
}
