import React from 'react'

import { TrendingDown, TrendingUp } from 'lucide-react'

import { cn } from '../../lib/utils'

export interface MetricCardProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string
  value: string | number
  delta?: {
    value: string | number
    direction?: 'up' | 'down'
    label?: string
  }
  subtext?: string
}

export function MetricCard({
  className,
  label,
  value,
  delta,
  subtext,
  href,
  ...props
}: MetricCardProps) {
  const Component = href ? 'a' : 'div'

  return (
    <Component
      href={href}
      className={cn(
        'metric-card surface-card flex min-h-[140px] flex-col justify-between rounded-[var(--radius-3xl)] p-5',
        href && 'cursor-pointer',
        className
      )}
      {...(props as React.HTMLAttributes<HTMLElement>)}>
      <div className="flex items-center justify-between gap-2">
        <span className="body-sm font-medium text-[var(--muted-foreground)]">{label}</span>
        {delta && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
              delta.direction === 'up'
                ? 'bg-[var(--status-success-bg)] text-[var(--status-success-ink)]'
                : 'bg-[var(--status-danger-bg)] text-[var(--status-danger-ink)]'
            )}>
            {delta.direction === 'up' ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            {delta.value}
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-col gap-1">
        <span className="page-title text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
          {value}
        </span>
        {subtext && <span className="text-xs text-[var(--muted-foreground)]">{subtext}</span>}
      </div>
    </Component>
  )
}
