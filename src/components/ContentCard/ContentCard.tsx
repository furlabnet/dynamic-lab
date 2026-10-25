import React from 'react'

import { Bookmark, EyeOff, FileText } from 'lucide-react'

import { cn } from '../../lib/utils'
import { AgeRating, type AgeRatingValue } from '../AgeRating'

export interface ContentCardStat {
  icon: React.ReactNode
  /** Already formatted, e.g. "1.2k". */
  value: React.ReactNode
  /** Accessible name, e.g. "saves". */
  label: string
}

export interface ContentCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode
  /** Content type shown as an eyebrow above the title, e.g. "Story". */
  type?: string
  byline?: React.ReactNode
  /** Small avatar image next to the byline. */
  bylineAvatar?: string
  /** Image URL, or any node (e.g. an illustration) for the cover. */
  cover?: string | React.ReactNode
  /** Icon shown on the tinted cover when there is no image. */
  icon?: React.ReactNode
  /** Age rating badge on the cover's top-left corner. */
  rating?: AgeRatingValue
  /** Blur the cover image (e.g. Explicit work for people who haven't opted in). Title and stats stay visible. */
  blurCover?: boolean
  /** Short fact on the cover's bottom-right, e.g. "24 pages", "3 chapters", "v1.2". */
  coverMeta?: React.ReactNode
  /** Extra overlay on the cover's top-left, after the rating (e.g. a "New" Badge). */
  coverBadge?: React.ReactNode
  /** Marks the card as saved by the viewer. */
  saved?: boolean
  /** Counts under the title: saves, views, comments… */
  stats?: ContentCardStat[]
  /** A few tag names, shown as plain chips. */
  tags?: string[]
  /** Anything else for the footer, e.g. platform icons. */
  footer?: React.ReactNode
  href?: string
  aspect?: 'square' | 'portrait' | 'landscape'
}

const aspectClasses = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
}

/** A browsable card for a creation: cover, rating, type, title, byline and key counts. */
export function ContentCard({
  className,
  title,
  type,
  byline,
  bylineAvatar,
  cover,
  icon = <FileText />,
  rating,
  blurCover = false,
  coverMeta,
  coverBadge,
  saved = false,
  stats,
  tags,
  footer,
  href,
  aspect = 'landscape',
  onClick,
  ...props
}: ContentCardProps) {
  const interactive = Boolean(href || onClick)
  const Component = (href ? 'a' : onClick ? 'button' : 'article') as React.ElementType

  return (
    <Component
      href={href}
      onClick={onClick}
      type={Component === 'button' ? 'button' : undefined}
      className={cn(
        'ui-content-card surface-card group',
        interactive && 'ui-content-card-interactive',
        className
      )}
      {...props}>
      <div className={cn('ui-content-card-cover', aspectClasses[aspect])}>
        {typeof cover === 'string' ? (
          <img
            src={cover}
            alt=""
            loading="lazy"
            className={cn(
              'size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]',
              blurCover && 'scale-110 blur-xl saturate-50 group-hover:scale-110'
            )}
          />
        ) : (
          (cover ?? <span className="ui-content-card-icon">{icon}</span>)
        )}
        {blurCover && (
          <span className="absolute inset-0 grid place-items-center">
            <span className="flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white">
              <EyeOff className="size-3.5" aria-hidden /> Hidden by your preferences
            </span>
          </span>
        )}
        {(rating || coverBadge) && (
          <span className="absolute left-3 top-3 flex items-center gap-1.5">
            {rating && <AgeRating rating={rating} className="ui-content-card-rating" />}
            {coverBadge}
          </span>
        )}
        {saved && (
          <span className="ui-content-card-saved" title="Saved to your Library">
            <Bookmark className="size-3.5 fill-current" aria-hidden />
            <span className="sr-only">Saved</span>
          </span>
        )}
        {coverMeta && <span className="ui-content-card-meta">{coverMeta}</span>}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5 text-left">
        {type && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            {type}
          </span>
        )}
        <span className="text-lg font-bold leading-snug tracking-tight text-[var(--foreground)]">
          {title}
        </span>
        {byline && (
          <span className="mt-1 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            {bylineAvatar && (
              <img
                src={bylineAvatar}
                alt=""
                loading="lazy"
                className="size-5 rounded-full object-cover"
              />
            )}
            <span className="truncate">{byline}</span>
          </span>
        )}
        {tags && tags.length > 0 && (
          <span className="mt-2 flex flex-wrap gap-1">
            {tags.map((t) => (
              <span key={t} className="ui-content-card-tag">
                {t.replace(/_/g, ' ')}
              </span>
            ))}
          </span>
        )}
        {(stats?.length || footer) && (
          <span className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 text-xs text-[var(--muted-foreground)]">
            {stats?.map((s) => (
              <span
                key={s.label}
                className="inline-flex items-center gap-1 tabular-nums"
                title={`${s.value} ${s.label}`}>
                <span className="inline-flex [&>svg]:size-3.5" aria-hidden>
                  {s.icon}
                </span>
                {s.value}
                <span className="sr-only">{s.label}</span>
              </span>
            ))}
            {footer && <span className="ml-auto inline-flex items-center gap-1.5">{footer}</span>}
          </span>
        )}
      </div>
    </Component>
  )
}
