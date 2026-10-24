import React from 'react'
import { cn } from '../../lib/utils'

export type StatusTone = 'neutral' | 'warning' | 'success' | 'danger' | 'info'

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone
  pulse?: boolean
  showDot?: boolean
}

const toneDotColors: Record<StatusTone, string> = {
  neutral: 'bg-[var(--muted-foreground)]',
  warning: 'bg-[var(--status-warning-ink)]',
  success: 'bg-[var(--status-success-ink)]',
  danger: 'bg-[var(--status-danger-ink)]',
  info: 'bg-[var(--info)]',
}

export function StatusBadge({
  className,
  tone = 'neutral',
  pulse = false,
  showDot = true,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span data-tone={tone} className={cn('status-pill select-none', className)} {...props}>
      {showDot && (
        <span className="relative flex size-2 items-center justify-center mr-1">
          {pulse && (
            <span
              className={cn(
                'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                toneDotColors[tone]
              )}
            />
          )}
          <span className={cn('relative inline-flex size-1.5 rounded-full', toneDotColors[tone])} />
        </span>
      )}
      <span>{children}</span>
    </span>
  )
}
