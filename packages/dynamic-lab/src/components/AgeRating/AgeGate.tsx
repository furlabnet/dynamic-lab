'use client'

import React, { useState } from 'react'

import { EyeOff } from 'lucide-react'

import type { AgeRatingValue } from './AgeRating'
import { cn } from '../../lib/utils'
import { Button } from '../Button'
import { AGE_RATING_INFO, AgeRating } from './AgeRating'

export interface AgeGateProps {
  rating: AgeRatingValue
  /** Ratings shown without the gate. Defaults to general and suggestive. */
  allowed?: AgeRatingValue[]
  children: React.ReactNode
  className?: string
}

/** Blurs content above the viewer's allowed rating until they choose to reveal it. */
export function AgeGate({
  rating,
  allowed = ['general', 'suggestive'],
  children,
  className,
}: AgeGateProps) {
  const [revealed, setRevealed] = useState(false)
  const gated = !allowed.includes(rating) && !revealed

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(gated && 'pointer-events-none blur-2xl saturate-50 select-none')}
        aria-hidden={gated || undefined}>
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
              {AGE_RATING_INFO[rating].description} It’s hidden by your content preferences.
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
