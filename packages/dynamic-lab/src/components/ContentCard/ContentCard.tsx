import React from 'react'

import { Bookmark, EyeOff, FileText } from 'lucide-react'

import type { AgeRatingValue } from '../AgeRating'
import { cn } from '../../lib/utils'
import { AgeRating } from '../AgeRating'

export interface ContentCardStat {
  icon: React.ReactNode
  /** Already formatted, e.g. "1.2k". */
  value: React.ReactNode
  /** Accessible name, e.g. "saves". */
  label: string
}

export interface ContentCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode
  /**
   * `detailed` (the default) shows everything the card is given. `compact` is for dense grids and
   * small spaces: the cover, then the title and one quiet line (the byline, or the type when there
   * is none). The rating, cover fact and saved mark stay on the cover; the type label, byline
   * avatar, tags, stats and footer are left out.
   */
  variant?: 'detailed' | 'compact'
  /** Content type shown above the title, e.g. "Story". */
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
  /** Blur the cover image (e.g. Mature work for people who haven't opted in). Title and stats stay visible. */
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

/**
 * A browsable card for a creation: cover, rating, type, title, byline and key counts.
 *
 * The detailed card adapts to its own width: in a narrow column (under about 16rem) the tags step
 * aside and the padding tightens, so a crowded grid stays readable. Use `variant="compact"` when
 * every card in a grid should be small and quiet.
 */
export function ContentCard({
  className,
  title,
  variant = 'detailed',
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
  const compact = variant === 'compact'
  const Component = (href ? 'a' : onClick ? 'button' : 'article') as React.ElementType

  return (
    <Component
      href={href}
      onClick={onClick}
      type={Component === 'button' ? 'button' : undefined}
      data-variant={variant}
      className={cn(
        'ui-content-card surface-card group',
        compact && 'ui-content-card-compact',
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
            className={cn('size-full object-cover', blurCover && 'scale-110 blur-xl saturate-50')}
          />
        ) : (
          (cover ?? <span className="ui-content-card-icon">{icon}</span>)
        )}
        {blurCover && (
          <span className="absolute inset-0 grid place-items-center">
            <span className="ui-content-card-hidden">
              <EyeOff className="size-3.5" aria-hidden />
              {compact ? (
                <span className="sr-only">Hidden by your preferences</span>
              ) : (
                'Hidden by your preferences'
              )}
            </span>
          </span>
        )}
        {(rating || coverBadge) && (
          <span className="ui-content-card-badges">
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

      {compact ? (
        <div className="ui-content-card-body">
          <span className="ui-content-card-title">{title}</span>
          {(byline || type) && <span className="ui-content-card-byline">{byline ?? type}</span>}
        </div>
      ) : (
        <div className="ui-content-card-body">
          {type && <span className="ui-content-card-type">{type}</span>}
          <span className="ui-content-card-title">{title}</span>
          {byline && (
            <span className="ui-content-card-byline">
              {bylineAvatar && (
                <img
                  src={bylineAvatar}
                  alt=""
                  loading="lazy"
                  className="size-5 shrink-0 rounded-full object-cover"
                />
              )}
              <span className="truncate">{byline}</span>
            </span>
          )}
          {tags && tags.length > 0 && (
            <span className="ui-content-card-tags">
              {tags.map((t) => (
                <span key={t} className="ui-content-card-tag">
                  {t.replace(/_/g, ' ')}
                </span>
              ))}
            </span>
          )}
          {(stats?.length || footer) && (
            <span className="ui-content-card-stats">
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
      )}
    </Component>
  )
}
