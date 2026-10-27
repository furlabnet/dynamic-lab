import React from 'react'
import { cn } from '../../lib/utils'

export interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  title: string
  description?: string
  actions?: React.ReactNode
}

export function PageHeader({ className, title, description, actions, ...props }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'ui-page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]',
        className
      )}
      {...props}>
      <div className="min-w-0">
        <h2 className="ui-page-title text-2xl font-bold tracking-tight">{title}</h2>
        {description && <p className="ui-page-description text-sm">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  )
}

export interface PageHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string
  title: string
  description?: string
}

export function PageHeading({
  className,
  eyebrow,
  title,
  description,
  ...props
}: PageHeadingProps) {
  return (
    <div className={cn('page-heading flex flex-col gap-2', className)} {...props}>
      {eyebrow && <span className="page-eyebrow">{eyebrow}</span>}
      <h1 className="page-title text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h1>
      {description && (
        <p className="page-description text-base text-[var(--muted-foreground)] max-w-2xl">
          {description}
        </p>
      )}
    </div>
  )
}
