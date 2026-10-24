import React from 'react'
import { FolderSearch } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  variant?: 'panel' | 'card' | 'plain'
}

export function EmptyState({
  className,
  icon = <FolderSearch className="size-7 text-[var(--primary)]" />,
  title,
  description,
  action,
  variant = 'panel',
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-variant={variant}
      className={cn(
        'ui-empty flex flex-col items-center justify-center text-center p-8 sm:p-12 gap-3',
        variant === 'panel' &&
          'border border-dashed border-[var(--border)] rounded-[var(--radius-2xl)] bg-[color-mix(in_srgb,var(--card)_40%,transparent)]',
        variant === 'card' && 'surface-card',
        className
      )}
      {...props}>
      {icon && (
        <span className="ui-hero-icon grid size-14 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] mb-1">
          {icon}
        </span>
      )}
      <h4 className="ui-empty-title text-base sm:text-lg font-bold text-[var(--foreground)]">{title}</h4>
      {description && (
        <p className="ui-empty-description text-sm text-[var(--muted-foreground)] max-w-md">
          {description}
        </p>
      )}
      {action && <div className="ui-empty-action mt-2">{action}</div>}
    </div>
  )
}
