import React from 'react'
import { FileText } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface ContentCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode
  /** Content type shown as an eyebrow above the title, e.g. "Story". */
  type?: string
  byline?: React.ReactNode
  /** Image URL, or any node (e.g. an illustration) for the cover. */
  cover?: string | React.ReactNode
  /** Icon shown on the tinted cover when there is no image. */
  icon?: React.ReactNode
  /** Small overlay on the cover's corner, e.g. a rating or "New" Badge. */
  coverBadge?: React.ReactNode
  href?: string
  aspect?: 'square' | 'portrait' | 'landscape'
}

const aspectClasses = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
}

/** A browsable card for a creation: cover, type, title and byline. */
export function ContentCard({
  className,
  title,
  type,
  byline,
  cover,
  icon = <FileText />,
  coverBadge,
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
      className={cn('ui-content-card surface-card group', interactive && 'ui-content-card-interactive', className)}
      {...props}>
      <div className={cn('ui-content-card-cover', aspectClasses[aspect])}>
        {typeof cover === 'string' ? (
          <img src={cover} alt="" className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        ) : (
          (cover ?? <span className="ui-content-card-icon">{icon}</span>)
        )}
        {coverBadge && <span className="absolute left-3 top-3">{coverBadge}</span>}
      </div>
      <div className="flex flex-col gap-1 p-5 text-left">
        {type && <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">{type}</span>}
        <span className="text-lg font-bold leading-snug tracking-tight text-[var(--foreground)]">{title}</span>
        {byline && <span className="mt-2 text-xs text-[var(--muted-foreground)]">{byline}</span>}
      </div>
    </Component>
  )
}
