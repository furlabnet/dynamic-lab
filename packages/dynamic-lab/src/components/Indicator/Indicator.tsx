import React from 'react'

import { cn } from '../../lib/utils'

export interface IndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** A number shows a count; leave it out for a plain dot. 0 hides the indicator unless `showZero`. */
  count?: number
  /** Counts above this show as "max+". */
  max?: number
  showZero?: boolean
  /** Hide it without unmounting the child. */
  hidden?: boolean
  tone?: 'primary' | 'danger' | 'success' | 'neutral'
  /** Which corner it sits on. */
  placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  /** Read out after the child, e.g. "3 unread notifications". */
  label?: string
}

const toneClasses = {
  primary: 'bg-[var(--primary)] text-[var(--primary-foreground)]',
  danger: 'bg-[var(--destructive)] text-[var(--destructive-foreground)]',
  success: 'bg-[var(--status-success-ink)] text-[var(--background)]',
  neutral: 'bg-[var(--muted-foreground)] text-[var(--background)]',
}

const placementClasses = {
  'top-right': 'top-0 right-0 translate-x-1/3 -translate-y-1/3',
  'top-left': 'top-0 left-0 -translate-x-1/3 -translate-y-1/3',
  'bottom-right': 'bottom-0 right-0 translate-x-1/3 translate-y-1/3',
  'bottom-left': 'bottom-0 left-0 -translate-x-1/3 translate-y-1/3',
}

/** A dot or count pinned to the corner of an icon button or avatar: unread messages, new activity. */
export function Indicator({
  className,
  count,
  max = 99,
  showZero = false,
  hidden = false,
  tone = 'danger',
  placement = 'top-right',
  label,
  children,
  ...props
}: IndicatorProps) {
  const isDot = count === undefined
  const visible = !hidden && (isDot || count > 0 || showZero)

  return (
    <span className={cn('relative inline-flex shrink-0', className)} {...props}>
      {children}
      {visible && (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute z-10 inline-flex items-center justify-center rounded-full font-bold tabular-nums ring-2 ring-[var(--background)]',
            isDot ? 'size-2.5' : 'h-[1.125rem] min-w-[1.125rem] px-1 text-[0.6875rem] leading-none',
            toneClasses[tone],
            placementClasses[placement]
          )}>
          {!isDot && (count > max ? `${max}+` : count)}
        </span>
      )}
      {visible && label && <span className="sr-only">{label}</span>}
    </span>
  )
}
