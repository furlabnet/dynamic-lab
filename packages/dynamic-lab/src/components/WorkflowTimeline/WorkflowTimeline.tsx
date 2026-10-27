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
        'workflow-timeline-item ui-panel p-4 rounded-[var(--radius-xl)] transition-all',
        className
      )}
      {...props}>
      <span
        className={cn(
          'workflow-timeline-marker',
          completed && 'bg-[var(--status-success-ink)] border-[var(--status-success-ink)]',
          !completed && !active && 'bg-[var(--muted)] border-[var(--border)] shadow-none'
        )}>
        {completed && <Check className="size-2 text-[var(--card)] stroke-[3]" />}
      </span>
      {(title || status || time) && (
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          {title && <h5 className="font-bold text-sm text-[var(--foreground)]">{title}</h5>}
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
