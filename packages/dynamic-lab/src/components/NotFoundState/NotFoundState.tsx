import React from 'react'
import { Illustration404 } from './Illustration404'
import { Button } from '../Button'
import { cn } from '../../lib/utils'

export interface NotFoundStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  homeHref?: string
  onHomeClick?: () => void
  action?: React.ReactNode
  showIllustration?: boolean
}

export function NotFoundState({
  title = 'Page not found',
  description = 'Sorry, we couldn’t find the page or resource you’re looking for. It might have been moved or removed.',
  homeHref = '/',
  onHomeClick,
  action,
  showIllustration = true,
  className,
  ...props
}: NotFoundStateProps) {
  return (
    <div
      className={cn(
        'surface-card flex flex-col items-center justify-center text-center p-8 sm:p-12 max-w-2xl mx-auto rounded-[var(--radius-3xl)] gap-6',
        className
      )}
      {...props}>
      {showIllustration && (
        <div className="w-full max-w-xs sm:max-w-sm mb-2 drop-shadow-md">
          <Illustration404 />
        </div>
      )}

      <div className="flex flex-col gap-2 max-w-md">
        <h2 className="page-title text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
          {title}
        </h2>
        <p className="body-sm text-[var(--muted-foreground)] leading-relaxed">{description}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
        {action || (
          <Button
            variant="primary"
            onClick={onHomeClick}
            {...(homeHref ? { as: 'a', href: homeHref } : {})}>
            Back to Home
          </Button>
        )}
      </div>
    </div>
  )
}
