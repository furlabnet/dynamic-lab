import React, { useState } from 'react'
import { EyeOff } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../Button'

export type AgeRatingValue = 'general' | 'teen' | 'mature'

export const AGE_RATING_INFO: Record<AgeRatingValue, { label: string; short: string; description: string }> = {
  general: { label: 'General', short: 'G', description: 'Suitable for everyone.' },
  teen: { label: 'Teen', short: 'T', description: 'Mild violence, language or suggestive themes.' },
  mature: { label: 'Mature', short: 'M', description: 'For adults only. Strong themes or explicit content.' },
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
    <span data-rating={rating} className={cn('ui-age-rating', className)} title={info.description} {...props}>
      {info.label}
    </span>
  )
}

export interface AgeGateProps {
  rating: AgeRatingValue
  /** Ratings shown without the gate. Defaults to general and teen. */
  allowed?: AgeRatingValue[]
  children: React.ReactNode
  className?: string
}

/** Blurs content above the viewer's allowed rating until they choose to reveal it. */
export function AgeGate({ rating, allowed = ['general', 'teen'], children, className }: AgeGateProps) {
  const [revealed, setRevealed] = useState(false)
  const gated = !allowed.includes(rating) && !revealed

  return (
    <div className={cn('relative', className)}>
      <div className={cn(gated && 'pointer-events-none select-none blur-2xl saturate-50')} aria-hidden={gated || undefined}>
        {children}
      </div>
      {gated && (
        <div className="absolute inset-0 grid place-items-center p-6">
          <div className="ui-dialog flex max-w-sm flex-col items-center gap-3 text-center">
            <span className="ui-hero-icon size-12!">
              <EyeOff className="size-5" />
            </span>
            <AgeRating rating={rating} />
            <p className="body-sm text-[var(--muted-foreground)]">
              {AGE_RATING_INFO[rating].description} It's hidden by your content preferences.
            </p>
            <Button size="sm" variant="secondary" onClick={() => setRevealed(true)}>
              Show anyway
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
