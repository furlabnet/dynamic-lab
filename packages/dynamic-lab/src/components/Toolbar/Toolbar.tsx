import React from 'react'

import { cn } from '../../lib/utils'

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
}

export function Toolbar({ className, label, children, ...props }: ToolbarProps) {
  return (
    <div
      role="toolbar"
      className={cn(
        'ui-toolbar surface-card flex flex-wrap items-center gap-3 rounded-[var(--radius-xl)] p-2.5 sm:p-3',
        className
      )}
      {...props}>
      {label && (
        <span className="ui-toolbar-label px-2 text-xs font-semibold text-[var(--muted-foreground)]">
          {label}
        </span>
      )}
      {children}
    </div>
  )
}
