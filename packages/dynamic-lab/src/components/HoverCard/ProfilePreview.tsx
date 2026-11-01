import React from 'react'

import { cn } from '../../lib/utils'
import { ProfileAvatar } from '../ProfileAvatar'

export interface ProfilePreviewProps {
  name: React.ReactNode
  handle?: string
  avatar?: string
  initials?: string
  /** Short bio. */
  bio?: React.ReactNode
  /** e.g. [{ label: 'followers', value: '1.2k' }] */
  stats?: Array<{ label: string; value: React.ReactNode }>
  /** A follow button or similar. */
  action?: React.ReactNode
  /** Banner image across the top. */
  banner?: string
}

/** The standard content for a creator HoverCard: banner, avatar, name, bio, stats and an action. */
export function ProfilePreview({
  name,
  handle,
  avatar,
  initials,
  bio,
  stats,
  action,
  banner,
}: ProfilePreviewProps) {
  return (
    <div className="flex flex-col gap-3">
      {banner && (
        <div
          className="-mx-4 -mt-4 mb-[-2.25rem] h-20 rounded-t-[inherit] bg-cover bg-center"
          style={{ backgroundImage: `url("${banner}")` }}
        />
      )}
      <div className="flex items-end justify-between gap-3">
        <ProfileAvatar
          src={avatar}
          initials={initials}
          size="lg"
          className={cn(banner && 'ring-4 ring-[var(--popover)]')}
        />
        {action}
      </div>
      <div className="flex flex-col">
        <span className="leading-tight font-semibold">{name}</span>
        {handle && <span className="text-sm text-[var(--muted-foreground)]">@{handle}</span>}
      </div>
      {bio && <p className="line-clamp-3 text-sm">{bio}</p>}
      {stats && stats.length > 0 && (
        <div className="flex gap-4 text-sm">
          {stats.map((s) => (
            <span key={s.label}>
              <strong className="font-semibold tabular-nums">{s.value}</strong>{' '}
              <span className="text-[var(--muted-foreground)]">{s.label}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
