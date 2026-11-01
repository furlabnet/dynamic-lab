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
        'ui-empty flex flex-col items-center justify-center gap-3 p-8 text-center sm:p-12',
        variant === 'panel' &&
          'rounded-[var(--radius-2xl)] border border-dashed border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_40%,transparent)]',
        variant === 'card' && 'surface-card',
        className
      )}
      {...props}>
      {icon && (
        <span className="ui-hero-icon mb-1 grid size-14 place-items-center rounded-2xl border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] bg-[color-mix(in_srgb,var(--primary)_12%,transparent)]">
          {icon}
        </span>
      )}
      <h4 className="ui-empty-title text-base font-bold text-[var(--foreground)] sm:text-lg">
        {title}
      </h4>
      {description && (
        <p className="ui-empty-description max-w-md text-sm text-[var(--muted-foreground)]">
          {description}
        </p>
      )}
      {action && <div className="ui-empty-action mt-2">{action}</div>}
    </div>
  )
}
