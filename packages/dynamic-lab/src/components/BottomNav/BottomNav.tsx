import React from 'react'

import { cn } from '../../lib/utils'

export interface BottomNavProps extends React.HTMLAttributes<HTMLElement> {
  /** Accessible name for the navigation landmark. */
  label?: string
  /** Hide from md up, where the site header's navigation takes over. */
  mobileOnly?: boolean
}

/**
 * The tab bar along the bottom of the screen on phones: Home, Explore, Create, Inbox, Profile.
 * It is fixed to the bottom and respects the home-indicator safe area; leave room for it with
 * bottom padding on the page (about 4.5rem).
 */
export function BottomNav({
  className,
  label = 'Main',
  mobileOnly = true,
  children,
  ...props
}: BottomNavProps) {
  return (
    <nav
      aria-label={label}
      className={cn('dl-bottom-nav glass-chrome', mobileOnly && 'md:hidden', className)}
      {...props}>
      <ul role="list" className="dl-bottom-nav-list">
        {children}
      </ul>
    </nav>
  )
}

export interface BottomNavItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: React.ReactNode
  label: React.ReactNode
  active?: boolean
  /** Small count or dot on the icon. A number shows a count; true shows a dot. */
  badge?: number | boolean
}

export function BottomNavItem({
  className,
  icon,
  label,
  active = false,
  badge,
  ...props
}: BottomNavItemProps) {
  const showBadge = badge === true || (typeof badge === 'number' && badge > 0)
  return (
    <li className="flex flex-1">
      <a
        aria-current={active ? 'page' : undefined}
        className={cn('dl-bottom-nav-item', className)}
        {...props}>
        <span className="dl-bottom-nav-icon">
          {icon}
          {showBadge && (
            <span className="dl-bottom-nav-badge" aria-hidden="true">
              {typeof badge === 'number' ? (badge > 99 ? '99+' : badge) : null}
            </span>
          )}
        </span>
        <span className="dl-bottom-nav-label">{label}</span>
        {typeof badge === 'number' && badge > 0 && <span className="sr-only">({badge} new)</span>}
      </a>
    </li>
  )
}
