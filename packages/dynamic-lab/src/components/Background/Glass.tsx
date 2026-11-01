import React from 'react'

import type { LayoutBaseProps } from '../../lib/layout'
import { cn } from '../../lib/utils'

export interface GlassProps extends LayoutBaseProps {
  /** How see-through it is: 'clear' shows the most of what's behind, 'frosted' the least. */
  opacity?: 'clear' | 'regular' | 'frosted'
  /** Blur strength. */
  blur?: 'sm' | 'md' | 'lg' | 'xl'
  /** Tint the glass with the theme's primary colour. */
  tint?: 'none' | 'primary'
  /** The bright rim along the top-left edge. */
  edge?: boolean
  /** A fine grain, like real frosted glass. */
  grain?: boolean
  /** Lift slightly with a stronger shadow on hover, for clickable glass. */
  interactive?: boolean
  /** Corner radius. */
  radius?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
}

/**
 * A frosted glass surface you can tune: transparency, blur, tint, rim light and grain. Looks best
 * over something colourful (a Background, an image). Every setting follows the user's
 * transparency preference, so "off" still gives a solid, readable surface.
 */
export const Glass = React.forwardRef<HTMLElement, GlassProps>(
  (
    {
      as: Comp = 'div',
      className,
      style,
      opacity = 'regular',
      blur = 'md',
      tint = 'none',
      edge = true,
      grain = false,
      interactive = false,
      radius = '2xl',
      ...props
    },
    ref
  ) => (
    <Comp
      ref={ref}
      data-opacity={opacity}
      data-blur={blur}
      data-tint={tint === 'none' ? undefined : tint}
      data-edge={edge || undefined}
      data-grain={grain || undefined}
      data-interactive={interactive || undefined}
      className={cn('dl-glass', className)}
      style={{ borderRadius: `var(--radius-${radius})`, ...style }}
      {...props}
    />
  )
)

Glass.displayName = 'Glass'
