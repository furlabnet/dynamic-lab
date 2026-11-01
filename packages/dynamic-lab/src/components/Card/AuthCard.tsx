import React from 'react'

import { cn } from '../../lib/utils'

export interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: React.ReactNode
  title?: string
  subtitle?: string
}

export function AuthCard({
  className,
  logo,
  title = 'Sign in',
  subtitle,
  children,
  ...props
}: AuthCardProps) {
  return (
    <div
      className={cn(
        'surface-card ui-auth-card mx-auto flex w-full max-w-md flex-col gap-5 rounded-[var(--radius-3xl)] p-7 shadow-2xl sm:p-9',
        className
      )}
      {...props}>
      {(logo || title || subtitle) && (
        <div className="flex flex-col gap-2">
          {logo && <div className="mb-2">{logo}</div>}
          {title && <h2 className="ui-page-title text-2xl font-bold tracking-tight">{title}</h2>}
          {subtitle && <p className="text-sm text-[var(--muted-foreground)]">{subtitle}</p>}
        </div>
      )}
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}
