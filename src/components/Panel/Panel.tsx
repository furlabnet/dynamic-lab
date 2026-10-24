import React from 'react'
import { cn } from '../../lib/utils'

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  actions?: React.ReactNode
}

export function Panel({ className, title, description, actions, children, ...props }: PanelProps) {
  return (
    <section className={cn('ui-panel flex flex-col', className)} {...props}>
      {(title || description || actions) && (
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex flex-col">
            {title && <h3 className="ui-section-title font-bold text-base sm:text-lg">{title}</h3>}
            {description && (
              <p className="body-sm text-[var(--muted-foreground)] mt-0.5">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}
