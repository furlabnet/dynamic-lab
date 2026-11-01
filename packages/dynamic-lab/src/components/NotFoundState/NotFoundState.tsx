import React from 'react'

import { cn } from '../../lib/utils'
import { Button } from '../Button'
import { Illustration404 } from './Illustration404'

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
        'surface-card mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 rounded-[var(--radius-3xl)] p-8 text-center sm:p-12',
        className
      )}
      {...props}>
      {showIllustration && (
        <div className="mb-2 w-full max-w-xs drop-shadow-md sm:max-w-sm">
          <Illustration404 />
        </div>
      )}

      <div className="flex max-w-md flex-col gap-2">
        <h2 className="page-title text-2xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-3xl">
          {title}
        </h2>
        <p className="body-sm leading-relaxed text-[var(--muted-foreground)]">{description}</p>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
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
