import React from 'react'
import { cn } from '../../lib/utils'

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  /** Optional text centred on a horizontal rule, e.g. "or". */
  label?: string
}

export function Separator({
  className,
  orientation = 'horizontal',
  label,
  ...props
}: SeparatorProps) {
  if (label && orientation === 'horizontal') {
    return (
      <div
        role="separator"
        className={cn(
          'flex items-center gap-3 text-xs font-medium text-[var(--muted-foreground)]',
          className
        )}
        {...props}>
        <span className="h-px flex-1 bg-[var(--border)]" />
        {label}
        <span className="h-px flex-1 bg-[var(--border)]" />
      </div>
    )
  }

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'shrink-0 bg-[var(--border)]',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px self-stretch',
        className
      )}
      {...props}
    />
  )
}
