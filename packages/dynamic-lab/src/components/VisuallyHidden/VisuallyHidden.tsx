import React from 'react'

import { cn } from '../../lib/utils'

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Become visible when focused, for "Skip to content" links. */
  focusable?: boolean
}

/** Text for screen readers only, such as a label for an icon or extra context on a link. */
export function VisuallyHidden({ className, focusable = false, ...props }: VisuallyHiddenProps) {
  return (
    <span
      className={cn(
        'sr-only',
        focusable && 'focus-within:not-sr-only focus:not-sr-only',
        className
      )}
      {...props}
    />
  )
}

export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** id of the main content, without the #. */
  targetId?: string
}

/** "Skip to content": hidden until a keyboard user tabs to it, then pinned top-left. */
export function SkipLink({
  className,
  targetId = 'main',
  children = 'Skip to content',
  ...props
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-[var(--radius-control)] focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--primary-foreground)] focus:shadow-lg',
        className
      )}
      {...props}>
      {children}
    </a>
  )
}
