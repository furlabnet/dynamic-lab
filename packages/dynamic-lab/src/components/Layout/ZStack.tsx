import React from 'react'

import type { LayoutBaseProps } from '../../lib/layout'
import { cn } from '../../lib/utils'

export type ZPosition =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'
  | 'fill'

/** [align-self, justify-self] for each position. */
const PLACE: Record<ZPosition, [string, string]> = {
  'top-left': ['start', 'start'],
  top: ['start', 'center'],
  'top-right': ['start', 'end'],
  left: ['center', 'start'],
  center: ['center', 'center'],
  right: ['center', 'end'],
  'bottom-left': ['end', 'start'],
  bottom: ['end', 'center'],
  'bottom-right': ['end', 'end'],
  fill: ['stretch', 'stretch'],
}

export interface ZStackProps extends LayoutBaseProps {
  /** Where children sit unless a ZStackItem says otherwise. */
  align?: ZPosition
}

/**
 * Layers children on top of each other in the same space, later children in front. The stack is
 * as big as its largest child, so there is no absolute positioning to manage. Good for captions
 * over images, badges on avatars and hero text over artwork.
 */
export const ZStack = React.forwardRef<HTMLElement, ZStackProps>(
  ({ as: Comp = 'div', className, style, align = 'fill', ...props }, ref) => {
    const [alignItems, justifyItems] = PLACE[align]
    return (
      <Comp
        ref={ref}
        className={cn('dl-zstack', className)}
        style={{ alignItems, justifyItems, ...style }}
        {...props}
      />
    )
  }
)

ZStack.displayName = 'ZStack'

export interface ZStackItemProps extends LayoutBaseProps {
  /** Where this layer sits in the ZStack. */
  position?: ZPosition
  /** Gap from the edges it is pinned to. Any CSS length. */
  inset?: string
}

/** One layer in a ZStack, pinned to an edge, a corner or the centre. */
export const ZStackItem = React.forwardRef<HTMLElement, ZStackItemProps>(
  ({ as: Comp = 'div', className, style, position = 'fill', inset, ...props }, ref) => {
    const [alignSelf, justifySelf] = PLACE[position]
    return (
      <Comp
        ref={ref}
        className={cn('min-w-0', className)}
        style={{ alignSelf, justifySelf, margin: inset, ...style }}
        {...props}
      />
    )
  }
)

ZStackItem.displayName = 'ZStackItem'
