import React from 'react'

import type { LayoutBaseProps, Responsive, Space } from '../../lib/layout'
import { responsiveVars, toSpace, withVars } from '../../lib/layout'
import { cn } from '../../lib/utils'

export interface GridProps extends LayoutBaseProps {
  /** Number of equal columns. Responsive: `{ base: 1, sm: 2, lg: 4 }`. */
  cols?: Responsive<number>
  /**
   * Fit as many columns as there is room for, each at least this wide (e.g. '16rem'). Overrides
   * `cols`. Good for card grids that should reflow without breakpoints.
   */
  minChildWidth?: string
  /** Space between cells. Responsive. */
  gap?: Responsive<Space>
  /** Row gap, when it should differ from `gap`. */
  rowGap?: Space
  /** Line up items at the top, middle or bottom of each row. */
  alignItems?: 'start' | 'center' | 'end' | 'stretch'
}

/** A CSS grid of equal columns, either a fixed count per breakpoint or as many as fit. */
export const Grid = React.forwardRef<HTMLElement, GridProps>(
  (
    {
      as: Comp = 'div',
      className,
      style,
      cols = 1,
      minChildWidth,
      gap = 4,
      rowGap,
      alignItems,
      ...props
    },
    ref
  ) => {
    return (
      <Comp
        ref={ref}
        className={cn('dl-grid', minChildWidth && 'dl-grid-auto', className)}
        style={withVars(
          {
            ...(minChildWidth
              ? { '--grid-min': minChildWidth }
              : responsiveVars('grid-cols', cols, String)),
            ...responsiveVars('grid-gap', gap, toSpace),
            rowGap: rowGap === undefined ? undefined : toSpace(rowGap),
            alignItems,
          },
          style
        )}
        {...props}
      />
    )
  }
)

Grid.displayName = 'Grid'

type Span = number | 'full'

export interface GridItemProps extends LayoutBaseProps {
  /** Columns to span, or 'full' for the whole row. Responsive. */
  span?: Responsive<Span>
  /** Rows to span. */
  rowSpan?: number
}

const formatSpan = (s: Span) => (s === 'full' ? '1 / -1' : `span ${s} / span ${s}`)

/** A cell in a Grid that spans more than one column or row. */
export const GridItem = React.forwardRef<HTMLElement, GridItemProps>(
  ({ as: Comp = 'div', className, style, span, rowSpan, ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn('dl-grid-item', className)}
      style={withVars(
        {
          ...responsiveVars('grid-span', span, formatSpan),
          gridRow: rowSpan ? `span ${rowSpan} / span ${rowSpan}` : undefined,
        },
        style
      )}
      {...props}
    />
  )
)

GridItem.displayName = 'GridItem'
