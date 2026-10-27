import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
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
        'metric-card surface-card flex flex-col justify-between p-5 min-h-[140px] rounded-[var(--radius-3xl)] transition-all',
        href && 'cursor-pointer hover:-translate-y-1 hover:shadow-lg',
        className
      )}
      {...(props as any)}>
      <div className="flex items-center justify-between gap-2">
        <span className="body-sm text-[var(--muted-foreground)] font-medium">{label}</span>
        {delta && (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full',
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

      <div className="flex flex-col gap-1 mt-2">
        <span className="page-title text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
          {value}
        </span>
        {subtext && <span className="text-xs text-[var(--muted-foreground)]">{subtext}</span>}
      </div>
    </Component>
  )
}
