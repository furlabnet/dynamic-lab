import React from 'react'

import { Check, Minus } from 'lucide-react'

import { cn } from '../../lib/utils'

export type TierStatus = 'open' | 'limited' | 'waitlist' | 'closed' | 'sold-out'

export interface TierFeature {
  label: React.ReactNode
  /** false shows the feature crossed out, for comparing tiers. */
  included?: boolean
}

export interface TierCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  name: React.ReactNode
  /** Formatted price, e.g. "$5" or "from $40". */
  price: React.ReactNode
  /** e.g. "/ month", "per character". */
  period?: React.ReactNode
  description?: React.ReactNode
  features?: Array<TierFeature | string>
  /** Sample art or an icon across the top. */
  image?: string
  /** Highlights the card, e.g. "Most popular". */
  highlight?: React.ReactNode
  status?: TierStatus
  /** Slots left out of `slotsTotal`, for commissions. Shows a meter. */
  slotsLeft?: number
  slotsTotal?: number
  /** The call to action, usually a Button. Disable it yourself for closed or sold-out tiers. */
  action?: React.ReactNode
  /** Small print under the action: turnaround, terms. */
  footnote?: React.ReactNode
}

const STATUS: Record<TierStatus, { label: string; tone: string }> = {
  open: { label: 'Open', tone: 'success' },
  limited: { label: 'Few slots left', tone: 'warning' },
  waitlist: { label: 'Waitlist', tone: 'info' },
  closed: { label: 'Closed', tone: 'neutral' },
  'sold-out': { label: 'Sold out', tone: 'danger' },
}

/**
 * A commission type or supporter tier: name, price, what's included, open/closed status and
 * remaining slots. Lay several out with Grid.
 */
export function TierCard({
  className,
  name,
  price,
  period,
  description,
  features = [],
  image,
  highlight,
  status,
  slotsLeft,
  slotsTotal,
  action,
  footnote,
  ...props
}: TierCardProps) {
  const unavailable = status === 'closed' || status === 'sold-out'
  const hasSlots = slotsLeft !== undefined && slotsTotal !== undefined && slotsTotal > 0
  const nameId = React.useId()

  return (
    <article
      aria-labelledby={nameId}
      data-highlight={highlight ? true : undefined}
      data-unavailable={unavailable || undefined}
      className={cn('dl-tier surface-card', className)}
      {...props}>
      {highlight && <div className="dl-tier-highlight">{highlight}</div>}
      {image && (
        <div className="dl-tier-image">
          <img src={image} alt="" loading="lazy" />
        </div>
      )}
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 id={nameId} className="text-base font-[650] tracking-[-0.01em]">
            {name}
          </h3>
          {status && (
            <span className="status-pill" data-tone={STATUS[status].tone}>
              {STATUS[status].label}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-[750] tracking-[-0.03em] tabular-nums">{price}</span>
          {period && <span className="text-sm text-[var(--muted-foreground)]">{period}</span>}
        </div>
        {description && <p className="text-sm text-[var(--muted-foreground)]">{description}</p>}
        {hasSlots && (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span>
                {slotsLeft} of {slotsTotal} slots left
              </span>
            </div>
            <div
              role="meter"
              aria-label="Slots left"
              aria-valuemin={0}
              aria-valuemax={slotsTotal}
              aria-valuenow={slotsLeft}
              className="h-1.5 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--foreground)_10%,transparent)]">
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-[width]"
                style={{ width: `${(Math.max(0, slotsLeft) / slotsTotal) * 100}%` }}
              />
            </div>
          </div>
        )}
        {features.length > 0 && (
          <ul role="list" className="flex flex-col gap-2 text-sm">
            {features.map((f, i) => {
              const feature = typeof f === 'string' ? { label: f } : f
              const included = feature.included !== false
              return (
                <li
                  key={i}
                  className={cn(
                    'flex items-start gap-2',
                    !included && 'text-[var(--muted-foreground)] line-through decoration-1'
                  )}>
                  {included ? (
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-[var(--primary)]"
                      aria-hidden="true"
                    />
                  ) : (
                    <Minus className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  )}
                  <span>
                    {feature.label}
                    {!included && <span className="sr-only"> (not included)</span>}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
        {(action || footnote) && (
          <div className="mt-auto flex flex-col gap-2 pt-2 [&>a]:w-full [&>button]:w-full">
            {action}
            {footnote && (
              <p className="text-center text-xs text-[var(--muted-foreground)]">{footnote}</p>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
