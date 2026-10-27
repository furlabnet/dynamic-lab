import React from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface SiteBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: 'warning' | 'info' | 'primary' | 'danger'
  icon?: React.ReactNode
  action?: React.ReactNode
  onDismiss?: () => void
}

/** A full-width strip above the site chrome, e.g. "Maintenance mode is on". */
export function SiteBanner({
  className,
  tone = 'warning',
  icon,
  action,
  onDismiss,
  children,
  ...props
}: SiteBannerProps) {
  return (
    <div
      role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
      data-tone={tone}
      className={cn('ui-site-banner', className)}
      {...props}>
      <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-center gap-2.5 px-4">
        {icon && <span className="inline-flex shrink-0 [&>svg]:size-4">{icon}</span>}
        <span>{children}</span>
        {action}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss banner"
          className="absolute right-3 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md opacity-80 hover:bg-black/10 hover:opacity-100">
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}
