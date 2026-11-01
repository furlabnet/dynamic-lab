import React from 'react'

import type { LayoutBaseProps, Space } from '../../lib/layout'
import { toSpace, withVars } from '../../lib/layout'
import { cn } from '../../lib/utils'

const surfaceClasses = {
  none: '',
  card: 'surface-card',
  panel: 'ui-panel',
  glass: 'glass-chrome rounded-[var(--radius-2xl)]',
  muted: 'bg-[var(--muted)] rounded-[var(--radius-xl)]',
  outline: 'border border-[var(--border)] rounded-[var(--radius-xl)]',
} as const

export interface BoxProps extends LayoutBaseProps {
  /** Padding on all sides. A number is a 4px step (4 = 16px); a string is any CSS length. */
  p?: Space
  /** Horizontal padding. */
  px?: Space
  /** Vertical padding. */
  py?: Space
  /** One of the library's surfaces. `panel` brings its own padding. */
  surface?: keyof typeof surfaceClasses
}

/** The most basic building block: a div (or `as` element) with optional padding and a surface. */
export const Box = React.forwardRef<HTMLElement, BoxProps>(
  ({ as: Comp = 'div', className, style, p, px, py, surface = 'none', ...props }, ref) => {
    const padX = px ?? p
    const padY = py ?? p
    return (
      <Comp
        ref={ref}
        className={cn(surfaceClasses[surface], className)}
        style={withVars(
          {
            paddingInline: padX === undefined ? undefined : toSpace(padX),
            paddingBlock: padY === undefined ? undefined : toSpace(padY),
          },
          style
        )}
        {...props}
      />
    )
  }
)

Box.displayName = 'Box'

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fixed size instead of filling the free space. */
  size?: Space
}

/** Pushes siblings apart inside a Stack or HStack. With `size`, a fixed gap instead. */
export function Spacer({ className, style, size, ...props }: SpacerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(size === undefined && 'flex-1 self-stretch', 'shrink-0', className)}
      style={size === undefined ? style : { flexBasis: toSpace(size), ...style }}
      {...props}
    />
  )
}

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width divided by height, e.g. 16 / 9 or 1. */
  ratio?: number
}

/** Keeps its content at a fixed shape. Images and video inside fill it. */
export function AspectRatio({ className, style, ratio = 1, ...props }: AspectRatioProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden [&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover',
        className
      )}
      style={{ aspectRatio: String(ratio), ...style }}
      {...props}
    />
  )
}
