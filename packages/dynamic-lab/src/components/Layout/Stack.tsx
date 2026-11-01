import React from 'react'

import type { AlignValue, JustifyValue, LayoutBaseProps, Responsive, Space } from '../../lib/layout'
import { ALIGN, JUSTIFY, responsiveVars, toSpace, withVars } from '../../lib/layout'
import { cn } from '../../lib/utils'

const DIRECTION = {
  row: 'row',
  column: 'column',
  'row-reverse': 'row-reverse',
  'column-reverse': 'column-reverse',
} as const

export interface StackProps extends LayoutBaseProps {
  /** Main axis. Responsive, so `{ base: 'column', md: 'row' }` stacks on phones and lines up on desktop. */
  direction?: Responsive<keyof typeof DIRECTION>
  /** Space between children. A number is a 4px step; a string is any CSS length. Responsive. */
  gap?: Responsive<Space>
  /** Cross-axis alignment. */
  align?: AlignValue
  /** Main-axis distribution. */
  justify?: JustifyValue
  /** Let children wrap onto new lines. */
  wrap?: boolean
  /** Render as inline-flex so the stack only takes the width it needs. */
  inline?: boolean
}

/**
 * Lays children out in a line with even spacing. Most layouts are stacks of stacks. HStack and
 * VStack are the same component with the direction set.
 */
export const Stack = React.forwardRef<HTMLElement, StackProps>(
  (
    {
      as: Comp = 'div',
      className,
      style,
      direction = 'column',
      gap = 4,
      align,
      justify,
      wrap = false,
      inline = false,
      ...props
    },
    ref
  ) => {
    return (
      <Comp
        ref={ref}
        className={cn('dl-stack', inline && 'dl-stack-inline', className)}
        style={withVars(
          {
            ...responsiveVars('stack-dir', direction, (d) => DIRECTION[d]),
            ...responsiveVars('stack-gap', gap, toSpace),
            '--stack-align': align && ALIGN[align],
            '--stack-justify': justify && JUSTIFY[justify],
            '--stack-wrap': wrap ? 'wrap' : undefined,
          },
          style
        )}
        {...props}
      />
    )
  }
)

Stack.displayName = 'Stack'

export type HStackProps = Omit<StackProps, 'direction'> & { reverse?: boolean }

/** Children side by side, vertically centred. */
export const HStack = React.forwardRef<HTMLElement, HStackProps>(
  ({ reverse, align = 'center', gap = 3, ...props }, ref) => (
    <Stack
      ref={ref}
      direction={reverse ? 'row-reverse' : 'row'}
      align={align}
      gap={gap}
      {...props}
    />
  )
)

HStack.displayName = 'HStack'

export type VStackProps = Omit<StackProps, 'direction'> & { reverse?: boolean }

/** Children one above the other, full width. */
export const VStack = React.forwardRef<HTMLElement, VStackProps>(({ reverse, ...props }, ref) => (
  <Stack ref={ref} direction={reverse ? 'column-reverse' : 'column'} {...props} />
))

VStack.displayName = 'VStack'
