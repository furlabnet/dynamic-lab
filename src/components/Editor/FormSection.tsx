import React from 'react'
import { cn } from '../../lib/utils'

export interface FormSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  /** Actions on the right of the heading, e.g. "Add chapter". */
  actions?: React.ReactNode
}

/** A titled group of fields: heading and help on the left from lg up, fields on the right. */
export function FormSection({ title, description, actions, className, children, ...props }: FormSectionProps) {
  return (
    <section className={cn('ui-form-section', className)} {...props}>
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <h2 className="ui-section-title">{title}</h2>
          {actions && <div className="flex items-center gap-2 lg:hidden">{actions}</div>}
        </div>
        {description && <p className="body-sm text-[var(--muted-foreground)]">{description}</p>}
        {actions && <div className="mt-3 hidden flex-wrap gap-2 lg:flex">{actions}</div>}
      </div>
      <div className="flex min-w-0 flex-col gap-5">{children}</div>
    </section>
  )
}

export interface EditorActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** True when there are unsaved edits. */
  dirty?: boolean
  /** Overrides the default status text. */
  status?: React.ReactNode
}

/** A bar pinned to the bottom of the viewport with the save status and primary actions. */
export function EditorActionBar({ dirty = false, status, className, children, ...props }: EditorActionBarProps) {
  return (
    <div className={cn('ui-editor-bar glass-chrome', className)} {...props}>
      <div className="mx-auto flex max-w-[var(--container-max)] flex-wrap items-center gap-3 px-4 py-3 sm:px-8">
        <span className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]" aria-live="polite">
          <span className={cn('size-2 rounded-full', dirty ? 'bg-[var(--status-warning-ink)]' : 'bg-[var(--status-success-ink)]')} aria-hidden />
          {status ?? (dirty ? 'Unsaved changes' : 'All changes saved')}
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-2">{children}</div>
      </div>
    </div>
  )
}
