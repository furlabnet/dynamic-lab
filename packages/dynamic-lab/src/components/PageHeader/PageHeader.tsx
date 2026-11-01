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
        'ui-page-header flex flex-col justify-between gap-4 border-b border-[var(--border)] pb-4 sm:flex-row sm:items-center',
        className
      )}
      {...props}>
      <div className="min-w-0">
        <h2 className="ui-page-title text-2xl font-bold tracking-tight">{title}</h2>
        {description && <p className="ui-page-description text-sm">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
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
      <h1 className="page-title text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
      {description && (
        <p className="page-description max-w-2xl text-base text-[var(--muted-foreground)]">
          {description}
        </p>
      )}
    </div>
  )
}
