import React from 'react'

import { formatCount } from '../../lib/format'
import { cn } from '../../lib/utils'
import { Sparkline } from './Charts'

export interface StatTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: number
  /** Change vs. the previous period, as a fraction: 0.12 = +12%. */
  delta?: number
  /** The period the delta compares to: "vs last week". */
  deltaLabel?: string
  /** Set false when going down is good (e.g. refunds). */
  upIsGood?: boolean
  /** Recent values for a sparkline. */
  trend?: number[]
  format?: (value: number) => string
  locale?: string
}

/** A headline number with its change and a sparkline, for creator analytics. */
export function StatTile({
  className,
  label,
  value,
  delta,
  deltaLabel,
  upIsGood = true,
  trend,
  format,
  locale,
  ...props
}: StatTileProps) {
  const fmt = format ?? ((v: number) => formatCount(v, locale))
  const good = delta === undefined ? undefined : delta === 0 ? undefined : delta > 0 === upIsGood
  const pct =
    delta === undefined
      ? ''
      : new Intl.NumberFormat(locale, {
          style: 'percent',
          maximumFractionDigits: 1,
          signDisplay: 'exceptZero',
        }).format(delta)
  return (
    <div className={cn('surface-card flex flex-col gap-3 p-5', className)} {...props}>
      <span className="text-sm font-medium text-[var(--muted-foreground)]">{label}</span>
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-semibold tracking-[-0.02em] tabular-nums">
            {fmt(value)}
          </span>
          {delta !== undefined && (
            <span className="text-xs">
              <span
                className={cn(
                  'font-semibold',
                  good === true && 'text-[var(--status-success-ink)]',
                  good === false && 'text-[var(--status-danger-ink)]',
                  good === undefined && 'text-[var(--muted-foreground)]'
                )}>
                {delta > 0 ? '▲' : delta < 0 ? '▼' : ''} {pct}
              </span>{' '}
              {deltaLabel && <span className="text-[var(--muted-foreground)]">{deltaLabel}</span>}
            </span>
          )}
        </div>
        {trend && trend.length > 1 && (
          // Only a caller's own formatter is passed on: Sparkline is a client component, so a
          // function created here in a Server Component couldn't be.
          <Sparkline
            values={trend}
            label={label}
            className="w-28"
            height={36}
            format={format}
            locale={locale}
          />
        )}
      </div>
    </div>
  )
}
