import React from 'react'

import { cn } from '../../lib/utils'

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Which way it scrolls. */
  orientation?: 'vertical' | 'horizontal' | 'both'
  /** Maximum height before it scrolls. Any CSS length. */
  maxHeight?: string
  /** Fade the content out at the scrolling edges. */
  fade?: boolean
}

/**
 * A scrolling region with thin, themed scrollbars. It is focusable so keyboard users can scroll
 * it; give it an aria-label when its purpose isn't obvious from the content.
 */
export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    { className, style, orientation = 'vertical', maxHeight, fade = false, tabIndex = 0, ...props },
    ref
  ) => (
    <div
      ref={ref}
      tabIndex={tabIndex}
      data-orientation={orientation}
      data-fade={fade || undefined}
      className={cn(
        'dl-scroll-area',
        orientation === 'vertical' && 'overflow-x-hidden overflow-y-auto',
        orientation === 'horizontal' && 'overflow-x-auto overflow-y-hidden',
        orientation === 'both' && 'overflow-auto',
        className
      )}
      style={{ maxHeight, ...style }}
      {...props}
    />
  )
)

ScrollArea.displayName = 'ScrollArea'
