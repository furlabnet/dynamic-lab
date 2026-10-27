import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg'
  /** Accessible label, read by screen readers. Shown next to the spinner when `showLabel` is set. */
  label?: string
  showLabel?: boolean
}

const sizeClasses = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-8',
}

export function Spinner({
  className,
  size = 'md',
  label = 'Loading',
  showLabel = false,
  ...props
}: SpinnerProps) {
  return (
    <span
      role="status"
      className={cn('inline-flex items-center gap-2 text-[var(--muted-foreground)]', className)}
      {...props}>
      <Loader2
        className={cn('animate-spin text-[var(--primary)]', sizeClasses[size])}
        aria-hidden
      />
      <span className={showLabel ? 'text-sm' : 'sr-only'}>{label}</span>
    </span>
  )
}
