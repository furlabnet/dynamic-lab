import React from 'react'
import { cn } from '../../lib/utils'

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Menu({ className, children, ...props }: MenuProps) {
  return (
    <div
      role="menu"
      className={cn(
        'ui-menu surface-card flex flex-col p-1.5 rounded-[var(--radius-xl)] border border-[var(--glass-border)] shadow-xl backdrop-blur-[var(--blur-chrome)] w-60',
        className
      )}
      {...props}>
      {children}
    </div>
  )
}

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  danger?: boolean
  icon?: React.ReactNode
  subtitle?: string
}

export function MenuItem({
  className,
  danger = false,
  icon,
  subtitle,
  children,
  ...props
}: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        'ui-menu-item flex items-center justify-between w-full px-3 py-2 text-left rounded-[var(--radius-md)] text-sm font-medium transition-colors cursor-pointer select-none',
        danger
          ? 'text-[var(--destructive)] hover:bg-[color-mix(in_srgb,var(--destructive)_12%,transparent)]'
          : 'text-[var(--foreground)] hover:bg-[var(--muted)]',
        className
      )}
      {...props}>
      <div className="flex items-center gap-2.5">
        {icon && <span className="inline-flex shrink-0 size-4">{icon}</span>}
        <div className="flex flex-col">
          <span>{children}</span>
          {subtitle && (
            <span className="text-xs text-[var(--muted-foreground)] font-normal">{subtitle}</span>
          )}
        </div>
      </div>
    </button>
  )
}

export function MenuSeparator({ className }: { className?: string }) {
  return <div className={cn('my-1 h-px bg-[var(--border)]', className)} role="separator" />
}
