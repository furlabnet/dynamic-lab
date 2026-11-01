import React from 'react'

import { X } from 'lucide-react'

import { cn } from '../../lib/utils'

export interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  count?: number | string
  icon?: React.ReactNode
  onDismiss?: () => void
}

export const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(
  ({ className, active = false, count, icon, onDismiss, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={active}
        data-active={active ? 'true' : undefined}
        className={cn(
          'filter-chip group',
          active &&
            'border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] font-semibold text-[var(--primary)] shadow-xs',
          className
        )}
        {...props}>
        {icon && (
          <span className="inline-flex size-4 shrink-0 items-center opacity-80">{icon}</span>
        )}
        <span>{children}</span>
        {count !== undefined && (
          <span
            className={cn(
              'py-0.2 inline-flex items-center justify-center rounded-full px-1.5 text-xs font-semibold',
              active
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                : 'bg-[var(--muted)] text-[var(--muted-foreground)] group-hover:bg-[var(--border)]'
            )}>
            {count}
          </span>
        )}
        {onDismiss && (
          <span
            role="button"
            aria-label="Remove filter"
            onClick={(e) => {
              e.stopPropagation()
              onDismiss()
            }}
            className="-mr-1 ml-0.5 inline-flex size-4 items-center justify-center rounded-full transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_15%,transparent)]">
            <X className="size-3" />
          </span>
        )}
      </button>
    )
  }
)

FilterChip.displayName = 'FilterChip'
