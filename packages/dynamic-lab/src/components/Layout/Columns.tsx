import React from 'react'

import type { AlignValue, LayoutBaseProps, Space } from '../../lib/layout'
import { ALIGN, toSpace, withVars } from '../../lib/layout'
import { cn } from '../../lib/utils'

const FRACTIONS = {
  '1/2': 1 / 2,
  '1/3': 1 / 3,
  '2/3': 2 / 3,
  '1/4': 1 / 4,
  '3/4': 3 / 4,
  '1/5': 1 / 5,
  '2/5': 2 / 5,
  '3/5': 3 / 5,
  '4/5': 4 / 5,
} as const

export type ColumnWidth = 'fill' | 'content' | keyof typeof FRACTIONS | (string & {})

export interface ColumnsProps extends LayoutBaseProps {
  /** Space between columns, and between rows once they stack. */
  gap?: Space
  /** Below this breakpoint the columns stack vertically. 'none' keeps them side by side. */
  collapseBelow?: 'sm' | 'md' | 'lg' | 'none'
  /** Vertical alignment of the columns. */
  align?: AlignValue
  /** When stacked, show the last column first (e.g. a sidebar that should come after content). */
  reverseWhenStacked?: boolean
}

/**
 * Side-by-side columns of set widths (fractions, fixed, fill or fit-content) that stack on small
 * screens. Widths are on each Column. Use Grid instead when every cell is the same width.
 */
export const Columns = React.forwardRef<HTMLElement, ColumnsProps>(
  (
    {
      as: Comp = 'div',
      className,
      style,
      gap = 6,
      collapseBelow = 'md',
      align,
      reverseWhenStacked = false,
      ...props
    },
    ref
  ) => (
    <Comp
      ref={ref}
      data-collapse={collapseBelow}
      data-reverse={reverseWhenStacked || undefined}
      className={cn('dl-columns', className)}
      style={withVars(
        { '--columns-gap': toSpace(gap), '--columns-align': align && ALIGN[align] },
        style
      )}
      {...props}
    />
  )
)

Columns.displayName = 'Columns'

export interface ColumnProps extends LayoutBaseProps {
  /**
   * 'fill' shares the free space (default), 'content' fits its content, a fraction like '1/3'
   * takes that share of the row, and any CSS length ('18rem') is fixed.
   */
  width?: ColumnWidth
}

function flexFor(width: ColumnWidth): string {
  if (width === 'fill') return '1 1 0%'
  if (width === 'content') return '0 0 auto'
  if (width in FRACTIONS) {
    const f = FRACTIONS[width as keyof typeof FRACTIONS]
    // Fractions that add up to 1 fill the row exactly once each column gives back its share of the gaps.
    return `0 0 calc(${f * 100}% - var(--columns-gap) * ${1 - f})`
  }
  return `0 0 ${width}`
}

/** One column inside Columns. */
export const Column = React.forwardRef<HTMLElement, ColumnProps>(
  ({ as: Comp = 'div', className, style, width = 'fill', ...props }, ref) => (
    <Comp
      ref={ref}
      className={cn('dl-column', className)}
      style={withVars({ '--column-flex': flexFor(width) }, style)}
      {...props}
    />
  )
)

Column.displayName = 'Column'
