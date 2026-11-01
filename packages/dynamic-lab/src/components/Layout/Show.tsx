import React from 'react'

import type { Breakpoint } from '../../lib/layout'
import { cn } from '../../lib/utils'

/* Written out in full so Tailwind finds every class. */
const HIDE_BELOW: Record<Breakpoint, string> = {
  sm: 'max-sm:hidden',
  md: 'max-md:hidden',
  lg: 'max-lg:hidden',
  xl: 'max-xl:hidden',
}

const HIDE_ABOVE: Record<Breakpoint, string> = {
  sm: 'sm:hidden',
  md: 'md:hidden',
  lg: 'lg:hidden',
  xl: 'xl:hidden',
}

export interface ShowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Only show from this breakpoint up. */
  above?: Breakpoint
  /** Only show below this breakpoint. */
  below?: Breakpoint
}

/**
 * Shows its children only at some screen sizes. The wrapper is `display: contents`, so it doesn't
 * affect the layout around it. The content stays in the DOM; it is hidden with CSS.
 */
export function Show({ className, above, below, ...props }: ShowProps) {
  return (
    <div
      className={cn('contents', above && HIDE_BELOW[above], below && HIDE_ABOVE[below], className)}
      {...props}
    />
  )
}

/** The opposite of Show: hides its children at some screen sizes. */
export function Hide({ className, above, below, ...props }: ShowProps) {
  return (
    <div
      className={cn('contents', above && HIDE_ABOVE[above], below && HIDE_BELOW[below], className)}
      {...props}
    />
  )
}
