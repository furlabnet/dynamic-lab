import React from 'react'

import type { Space } from '../../lib/layout'
import { toSpace, withVars } from '../../lib/layout'
import { cn } from '../../lib/utils'

export interface SidebarLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The side column: filters, a table of contents, profile details. */
  sidebar: React.ReactNode
  /** Which side the sidebar sits on. */
  side?: 'left' | 'right'
  /** Sidebar width. Any CSS length. */
  sidebarWidth?: string
  /** Space between the sidebar and the main column. */
  gap?: Space
  /** Keep the sidebar in view while the main column scrolls. */
  sticky?: boolean
  /** Distance from the top of the viewport when sticky, e.g. the header height. */
  stickyTop?: string
  /** Below this breakpoint the sidebar stacks above (or below, on the right) the content. */
  collapseBelow?: 'md' | 'lg'
  /** Accessible name for the sidebar landmark. */
  sidebarLabel?: string
}

/**
 * A main column with a sidebar beside it, for content pages, settings and profiles. For the full
 * staff console with navigation, use AdminShell instead.
 */
export function SidebarLayout({
  className,
  style,
  sidebar,
  side = 'left',
  sidebarWidth = '16rem',
  gap = 8,
  sticky = false,
  stickyTop = '5rem',
  collapseBelow = 'lg',
  sidebarLabel,
  children,
  ...props
}: SidebarLayoutProps) {
  return (
    <div
      data-side={side}
      data-collapse={collapseBelow}
      className={cn('dl-sidebar-layout', className)}
      style={withVars(
        {
          '--sidebar-layout-width': sidebarWidth,
          '--sidebar-layout-gap': toSpace(gap),
          '--sidebar-layout-top': stickyTop,
        },
        style
      )}
      {...props}>
      <aside
        aria-label={sidebarLabel}
        className={cn('dl-sidebar-layout-aside min-w-0', sticky && 'dl-sidebar-layout-sticky')}>
        {sidebar}
      </aside>
      <div className="dl-sidebar-layout-main min-w-0">{children}</div>
    </div>
  )
}
