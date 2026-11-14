import React from 'react'

import { BadgeCheck, CircleCheck, Heart, ShieldCheck, Tag } from 'lucide-react'

import { cn } from '../../lib/utils'

/**
 * What a badge says about an account. Each tone has its own colour and default icon:
 * `official` (the platform's own accounts), `staff`, `verified` (identity confirmed), `supporter`
 * (backs the project) and `neutral` for anything else.
 */
export type AccountBadgeTone = 'official' | 'staff' | 'verified' | 'supporter' | 'neutral'

/** `icon` shows only the icon (bylines, cards, comments); `label` adds the name (profile headers). */
export type AccountBadgeDisplay = 'icon' | 'label'

const toneIcons: Record<AccountBadgeTone, React.ComponentType<{ 'aria-hidden'?: boolean }>> = {
  official: BadgeCheck,
  staff: ShieldCheck,
  verified: CircleCheck,
  supporter: Heart,
  neutral: Tag,
}

export interface AccountBadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'title'> {
  /** The badge's name, such as "Official account". Always announced; shown with `display="label"`. */
  label: string
  tone?: AccountBadgeTone
  /** A longer explanation shown on hover, such as "Run by the Furlab team". */
  description?: string | null
  /** Replaces the tone's default icon. */
  icon?: React.ReactNode
  display?: AccountBadgeDisplay
  size?: 'sm' | 'md'
}

/**
 * A mark next to a person's name that says who they are to the platform: official, staff,
 * verified, supporter. Renders without client JavaScript. For workflow states use StatusBadge, and
 * for categories and counts use Badge.
 */
export function AccountBadge({
  label,
  tone = 'neutral',
  description,
  icon,
  display = 'icon',
  size = 'md',
  className,
  ...props
}: AccountBadgeProps) {
  const Icon = toneIcons[tone]
  const hint = description ? `${label}: ${description}` : label
  return (
    <span
      data-tone={tone}
      data-display={display}
      data-size={size}
      title={hint}
      className={cn('ui-account-badge', className)}
      {...props}>
      <span className="ui-account-badge-icon">{icon ?? <Icon aria-hidden />}</span>
      {display === 'label' ? <span>{label}</span> : <span className="sr-only">{label}</span>}
    </span>
  )
}

/** One badge as data, for lists that come from an API. */
export interface AccountBadgeItem {
  /** A stable identifier, used as the React key. */
  key: string
  label: string
  tone?: AccountBadgeTone
  description?: string | null
  icon?: React.ReactNode
}

export interface AccountBadgesProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** In the order to show them; put the most important first. */
  badges: readonly AccountBadgeItem[]
  display?: AccountBadgeDisplay
  size?: 'sm' | 'md'
  /** Show at most this many; the rest fold into a "+N" count that lists them on hover. */
  max?: number
}

/** A row of AccountBadge marks. Renders nothing when `badges` is empty. */
export function AccountBadges({
  badges,
  display = 'icon',
  size = 'md',
  max,
  className,
  ...props
}: AccountBadgesProps) {
  if (badges.length === 0) return null
  const shown = max !== undefined && max >= 0 ? badges.slice(0, max) : badges
  const hidden = badges.slice(shown.length)
  return (
    <span className={cn('ui-account-badges', className)} {...props}>
      {shown.map(({ key, ...badge }) => (
        <AccountBadge key={key} {...badge} display={display} size={size} />
      ))}
      {hidden.length > 0 && (
        <span
          className="ui-account-badge"
          data-tone="neutral"
          data-display="label"
          data-size={size}
          title={hidden.map((badge) => badge.label).join(', ')}>
          <span aria-hidden>+{hidden.length}</span>
          <span className="sr-only">{hidden.map((badge) => badge.label).join(', ')}</span>
        </span>
      )}
    </span>
  )
}
