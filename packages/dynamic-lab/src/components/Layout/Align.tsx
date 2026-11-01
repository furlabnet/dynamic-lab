import React from 'react'

import type { LayoutBaseProps, Space } from '../../lib/layout'
import { toSpace, withVars } from '../../lib/layout'
import { cn } from '../../lib/utils'

const X = {
  left: 'flex-start',
  start: 'flex-start',
  center: 'center',
  right: 'flex-end',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
} as const

const Y = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
} as const

const TEXT = {
  left: 'left',
  start: 'start',
  center: 'center',
  right: 'right',
  end: 'end',
} as const

export interface AlignProps extends LayoutBaseProps {
  /** Horizontal placement: left, center, right, or spread out with between / around / evenly. */
  x?: keyof typeof X
  /** Vertical placement inside the box. Give the box a height to see it. */
  y?: keyof typeof Y
  /** Space between children. */
  gap?: Space
  /** Let children wrap onto new lines. */
  wrap?: boolean
}

/**
 * Places its children left, right or centre (and top, middle or bottom). Use it for button rows,
 * footers, and anything that hugs one side.
 */
export const Align = React.forwardRef<HTMLElement, AlignProps>(
  (
    {
      as: Comp = 'div',
      className,
      style,
      x = 'left',
      y = 'center',
      gap = 3,
      wrap = true,
      ...props
    },
    ref
  ) => {
    const textAlign = x in TEXT ? TEXT[x as keyof typeof TEXT] : undefined
    return (
      <Comp
        ref={ref}
        className={cn('flex', wrap && 'flex-wrap', className)}
        style={withVars(
          {
            justifyContent: X[x],
            alignItems: Y[y],
            gap: toSpace(gap),
            textAlign,
          },
          style
        )}
        {...props}
      />
    )
  }
)

Align.displayName = 'Align'

export interface CenterProps extends LayoutBaseProps {
  /** inline-flex instead of flex, e.g. around an icon. */
  inline?: boolean
}

/** Centres its content on both axes. */
export const Center = React.forwardRef<HTMLElement, CenterProps>(
  ({ as: Comp = 'div', className, inline = false, ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn(
        inline ? 'inline-flex' : 'flex',
        'items-center justify-center text-center',
        className
      )}
      {...props}
    />
  )
)

Center.displayName = 'Center'
