import React from 'react'
import { cn } from '../../lib/utils'

export interface LocalDateTimeProps extends React.HTMLAttributes<HTMLSpanElement> {
  date: string | Date | number
  label?: string
  format?: 'short' | 'medium' | 'long'
}

export function LocalDateTime({
  date,
  label,
  format = 'medium',
  className,
  ...props
}: LocalDateTimeProps) {
  const d = React.useMemo(() => new Date(date), [date])

  const formatted = React.useMemo(() => {
    try {
      if (format === 'short') {
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
      }
      if (format === 'long') {
        return d.toLocaleString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })
      }
      return d.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    } catch {
      return String(date)
    }
  }, [d, format, date])

  const iso = d.toISOString()

  return (
    <span
      className={cn(
        'body-sm text-[var(--muted-foreground)] inline-flex items-center gap-1.5',
        className
      )}
      {...props}>
      {label && <span>{label}</span>}
      <time dateTime={iso} className="font-medium text-[var(--foreground)]">
        {formatted}
      </time>
    </span>
  )
}
