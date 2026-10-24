import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { ProfileAvatar } from '../ProfileAvatar'

export interface LinkHubLink {
  id: string
  label: string
  href: string
  description?: string
  icon?: React.ReactNode
  /** Image shown on the left instead of an icon. */
  thumbnailSrc?: string
  /** Draw this link in the brand colour (e.g. a commission sheet). */
  featured?: boolean
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export interface LinkHubSocial {
  label: string
  href: string
  icon: React.ReactNode
}

export interface LinkHubProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  handle?: string
  avatarSrc?: string
  bio?: React.ReactNode
  links: LinkHubLink[]
  socials?: LinkHubSocial[]
  /** Content under the links, e.g. a "Made with Dynamic Lab" credit. */
  footer?: React.ReactNode
}

/** A link-in-bio page: avatar, short bio and a stack of big link buttons. */
export function LinkHub({
  name,
  handle,
  avatarSrc,
  bio,
  links,
  socials,
  footer,
  className,
  ...props
}: LinkHubProps) {
  return (
    <div className={cn('ui-link-hub', className)} {...props}>
      <div className="flex flex-col items-center gap-3 text-center">
        <ProfileAvatar
          src={avatarSrc}
          alt={name}
          size="2xl"
          initials={name
            .split(/\s+/)
            .map((p) => p[0])
            .join('')
            .slice(0, 2)}
          className="ui-profile-avatar"
        />
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-extrabold tracking-tight">{name}</h1>
          {handle && <span className="text-sm text-[var(--muted-foreground)]">{handle}</span>}
        </div>
        {bio && (
          <p className="max-w-sm text-[15px] leading-relaxed text-[var(--muted-foreground)]">
            {bio}
          </p>
        )}
        {socials && socials.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  title={s.label}
                  className="ui-link-hub-social"
                  target="_blank"
                  rel="noreferrer">
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <ul className="flex w-full flex-col gap-3">
        {links.map((link) => {
          const external = /^https?:/.test(link.href)
          return (
            <li key={link.id}>
              <a
                href={link.href}
                onClick={link.onClick}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                data-featured={link.featured || undefined}
                className="ui-link-hub-link">
                {link.thumbnailSrc ? (
                  <img
                    src={link.thumbnailSrc}
                    alt=""
                    className="ui-link-hub-thumb"
                    loading="lazy"
                  />
                ) : (
                  link.icon && <span className="ui-link-hub-icon">{link.icon}</span>
                )}
                <span className="flex min-w-0 flex-1 flex-col text-left">
                  <span className="truncate font-semibold">{link.label}</span>
                  {link.description && (
                    <span className="truncate text-xs opacity-75">{link.description}</span>
                  )}
                </span>
                <ArrowUpRight className="size-4 shrink-0 opacity-60" aria-hidden />
              </a>
            </li>
          )
        })}
      </ul>
      {footer && <div className="text-center text-xs text-[var(--muted-foreground)]">{footer}</div>}
    </div>
  )
}
