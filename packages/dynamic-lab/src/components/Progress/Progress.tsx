import React from 'react'
import { cn } from '../../lib/utils'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–100. Leave undefined for an indeterminate bar. */
  value?: number
  label?: string
  showValue?: boolean
  tone?: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md'
}

const toneClasses = {
  primary: 'bg-[var(--primary)]',
  success: 'bg-[var(--status-success-ink)]',
  warning: 'bg-[var(--status-warning-ink)]',
  danger: 'bg-[var(--status-danger-ink)]',
}

export function Progress({
  className,
  value,
  label,
  showValue = false,
  tone = 'primary',
  size = 'md',
  ...props
}: ProgressProps) {
  const indeterminate = value === undefined
  const clamped = indeterminate ? 0 : Math.min(100, Math.max(0, value))

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)} {...props}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="font-medium text-[var(--foreground)]">{label}</span>}
          {showValue && !indeterminate && (
            <span className="tabular-nums text-[var(--muted-foreground)]">
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : clamped}
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-[var(--muted)]',
          size === 'sm' ? 'h-1.5' : 'h-2.5'
        )}>
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-300 ease-out',
            toneClasses[tone],
            indeterminate && 'dl-progress-indeterminate w-1/3'
          )}
          style={indeterminate ? undefined : { width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
