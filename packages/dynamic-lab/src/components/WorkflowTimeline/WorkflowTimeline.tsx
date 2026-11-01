import React from 'react'

import { Check } from 'lucide-react'

import { cn } from '../../lib/utils'

export interface WorkflowTimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  children: React.ReactNode
}

export function WorkflowTimeline({ className, children, ...props }: WorkflowTimelineProps) {
  return (
    <ol className={cn('workflow-timeline', className)} {...props}>
      {children}
    </ol>
  )
}

export interface WorkflowTimelineItemProps extends React.HTMLAttributes<HTMLLIElement> {
  title?: string
  status?: React.ReactNode
  time?: string
  completed?: boolean
  active?: boolean
}

export function WorkflowTimelineItem({
  className,
  title,
  status,
  time,
  completed = false,
  active = false,
  children,
  ...props
}: WorkflowTimelineItemProps) {
  return (
    <li
      className={cn(
        'workflow-timeline-item ui-panel rounded-[var(--radius-xl)] p-4 transition-all',
        className
      )}
      {...props}>
      <span
        className={cn(
          'workflow-timeline-marker',
          completed && 'border-[var(--status-success-ink)] bg-[var(--status-success-ink)]',
          !completed && !active && 'border-[var(--border)] bg-[var(--muted)] shadow-none'
        )}>
        {completed && <Check className="size-2 stroke-[3] text-[var(--card)]" />}
      </span>
      {(title || status || time) && (
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          {title && <h5 className="text-sm font-bold text-[var(--foreground)]">{title}</h5>}
          <div className="flex items-center gap-2">
            {time && <span className="text-xs text-[var(--muted-foreground)]">{time}</span>}
            {status}
          </div>
        </div>
      )}
      {children && <div className="text-sm text-[var(--foreground)]">{children}</div>}
    </li>
  )
}
