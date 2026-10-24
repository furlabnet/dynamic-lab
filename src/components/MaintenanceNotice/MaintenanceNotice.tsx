import React from 'react'
import { Wrench } from 'lucide-react'
import { Button } from '../Button'
import { cn } from '../../lib/utils'

export interface MaintenanceNoticeProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
  description?: string
  actionText?: string
  onAction?: () => void
  icon?: React.ReactNode
}

export function MaintenanceNotice({
  className,
  title = "We'll be right back",
  description = 'Dynamic Lab is undergoing scheduled platform maintenance and system updates. We will be back online shortly.',
  actionText = 'Refresh status',
  onAction,
  icon,
  ...props
}: MaintenanceNoticeProps) {
  return (
    <section
      aria-labelledby="maintenance-title"
      className={cn(
        'relative flex min-h-[380px] w-full flex-col items-center justify-center overflow-hidden rounded-[var(--radius-3xl)] border border-[var(--border)] bg-gradient-to-br from-[color-mix(in_srgb,var(--primary)_25%,transparent)] via-[color-mix(in_srgb,var(--primary)_8%,transparent)] to-[var(--background)] p-8 text-center shadow-lg',
        className
      )}
      {...props}>
      <div className="relative z-10 flex flex-col items-center max-w-lg gap-4">
        <div className="grid size-16 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] border border-[color-mix(in_srgb,var(--primary)_25%,transparent)] text-[var(--primary)] shadow-sm">
          {icon || <Wrench className="size-8" />}
        </div>
        <h2
          id="maintenance-title"
          className="page-title text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
          {title}
        </h2>
        <p className="body-sm text-[var(--muted-foreground)] max-w-md">{description}</p>
        {actionText && (
          <Button variant="primary" onClick={onAction} className="mt-2">
            {actionText}
          </Button>
        )}
      </div>
    </section>
  )
}
