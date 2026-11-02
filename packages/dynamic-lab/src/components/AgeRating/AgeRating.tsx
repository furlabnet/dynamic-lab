import React from 'react'

import { cn } from '../../lib/utils'

export type AgeRatingValue = 'general' | 'suggestive' | 'mature'

export const AGE_RATING_INFO: Record<
  AgeRatingValue,
  { label: string; short: string; description: string }
> = {
  general: { label: 'General', short: 'G', description: 'Suitable for everyone.' },
  suggestive: {
    label: 'Suggestive',
    short: 'S',
    description: 'Mild violence, language or suggestive themes.',
  },
  mature: {
    label: 'Mature',
    short: 'M',
    description: 'For adults only. Strong themes or explicit content.',
  },
}

export interface AgeRatingProps extends React.HTMLAttributes<HTMLSpanElement> {
  rating: AgeRatingValue
  /** `badge` is a compact pill; `full` adds the description underneath. */
  variant?: 'badge' | 'full'
}

export function AgeRating({ rating, variant = 'badge', className, ...props }: AgeRatingProps) {
  const info = AGE_RATING_INFO[rating]
  if (variant === 'full') {
    return (
      <span data-rating={rating} className={cn('ui-age-rating-full', className)} {...props}>
        <span className="ui-age-rating" data-rating={rating} aria-hidden>
          {info.short}
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-semibold">Rated {info.label}</span>
          <span className="text-xs text-[var(--muted-foreground)]">{info.description}</span>
        </span>
      </span>
    )
  }
  return (
    <span
      data-rating={rating}
      className={cn('ui-age-rating', className)}
      title={info.description}
      {...props}>
      {info.label}
    </span>
  )
}
