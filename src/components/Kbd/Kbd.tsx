import React from 'react'
import { cn } from '../../lib/utils'

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /** Render several keys, e.g. ['⌘', 'K']. */
  keys?: string[]
}

export function Kbd({ className, keys, children, ...props }: KbdProps) {
  if (keys) {
    return (
      <span className={cn('inline-flex items-center gap-1', className)} {...props}>
        {keys.map((key) => (
          <kbd key={key} className="ui-kbd">
            {key}
          </kbd>
        ))}
      </span>
    )
  }
  return (
    <kbd className={cn('ui-kbd', className)} {...props}>
      {children}
    </kbd>
  )
}
