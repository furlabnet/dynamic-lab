import React from 'react'
import { cn } from '../../lib/utils'
import { ProfileAvatar } from '../ProfileAvatar'

export interface ProfileStat {
  label: string
  value: string | number
  href?: string
  onClick?: () => void
}

export interface ProfileHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  name: string
  /** "@handle" line under the name. */
  handle?: string
  avatarSrc?: string
  /** Image URL for the banner. Without one, a tint of the brand colour is used. */
  bannerSrc?: string
  /** `lab` uses a square avatar, for Creator Labs and other groups. */
  variant?: 'user' | 'lab'
  /** Badges after the name, e.g. role or "Verified". */
  badges?: React.ReactNode
  bio?: React.ReactNode
  /** Small facts under the bio: location, join date, website… */
  meta?: React.ReactNode
  stats?: ProfileStat[]
  /** Follow / Message / Edit buttons. */
  actions?: React.ReactNode
}

function initialsFrom(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/** Banner, avatar, name, bio, stats and actions at the top of a profile or Lab page. */
export function ProfileHeader({
  name,
  handle,
  avatarSrc,
  bannerSrc,
  variant = 'user',
  badges,
  bio,
  meta,
  stats,
  actions,
  className,
  ...props
}: ProfileHeaderProps) {
  return (
    <header className={cn('ui-profile-header surface-card', className)} {...props}>
      <div className="ui-profile-banner">{bannerSrc && <img src={bannerSrc} alt="" />}</div>
      <div className="flex flex-col gap-4 px-5 pb-6 sm:px-8">
        <div className="-mt-14 flex flex-wrap items-end justify-between gap-4">
          <ProfileAvatar
            src={avatarSrc}
            initials={initialsFrom(name)}
            alt={name}
            size="2xl"
            shape={variant === 'lab' ? 'square' : 'circle'}
            className="ui-profile-avatar"
          />
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="flex flex-wrap items-center gap-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {name}
            {badges}
          </h1>
          {handle && <span className="text-sm text-[var(--muted-foreground)]">{handle}</span>}
        </div>
        {bio && (
          <div className="page-description max-w-2xl text-[15px] text-[var(--foreground)]">
            {bio}
          </div>
        )}
        {meta && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--muted-foreground)] [&_svg]:size-4">
            {meta}
          </div>
        )}
        {stats && stats.length > 0 && (
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {stats.map((s) => {
              const content = (
                <>
                  <span className="font-bold text-[var(--foreground)] tabular-nums">{s.value}</span>{' '}
                  <span className="text-[var(--muted-foreground)]">{s.label}</span>
                </>
              )
              return (
                <li key={s.label} className="text-sm">
                  {s.href ? (
                    <a href={s.href} className="hover:underline">
                      {content}
                    </a>
                  ) : s.onClick ? (
                    <button type="button" onClick={s.onClick} className="hover:underline">
                      {content}
                    </button>
                  ) : (
                    content
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </header>
  )
}
