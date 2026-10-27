import React from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

/** Booru-style tag categories (as on e621), each with its own colour. */
export type TagCategory =
  'artist' | 'copyright' | 'character' | 'species' | 'general' | 'lore' | 'meta'

export interface TagItem {
  name: string
  category?: TagCategory
  count?: number
  href?: string
}

export const TAG_CATEGORY_LABELS: Record<TagCategory, string> = {
  artist: 'Artist',
  copyright: 'Copyright',
  character: 'Character',
  species: 'Species',
  general: 'General',
  lore: 'Lore',
  meta: 'Meta',
}

const CATEGORY_ORDER: TagCategory[] = [
  'artist',
  'copyright',
  'character',
  'species',
  'general',
  'lore',
  'meta',
]

/** "red_fox" → "red fox". Tags are stored with underscores and shown with spaces. */
export function formatTagName(name: string) {
  return name.replace(/_/g, ' ')
}

function formatCount(count: number) {
  return count >= 1000 ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k` : String(count)
}

export interface TagProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  name: string
  category?: TagCategory
  count?: number
  href?: string
  onClick?: (name: string) => void
  onRemove?: (name: string) => void
}

export function Tag({
  name,
  category = 'general',
  count,
  href,
  onClick,
  onRemove,
  className,
  ...props
}: TagProps) {
  const interactive = Boolean(href || onClick)
  const Component = (href ? 'a' : onClick ? 'button' : 'span') as React.ElementType
  return (
    <span
      data-category={category}
      className={cn('ui-tag', interactive && 'ui-tag-interactive', className)}
      {...props}>
      <Component
        href={href}
        type={Component === 'button' ? 'button' : undefined}
        onClick={onClick ? () => onClick(name) : undefined}
        className="ui-tag-label">
        {formatTagName(name)}
      </Component>
      {count !== undefined && <span className="ui-tag-count">{formatCount(count)}</span>}
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove tag ${formatTagName(name)}`}
          onClick={() => onRemove(name)}
          className="ui-tag-remove">
          <X className="size-3" />
        </button>
      )}
    </span>
  )
}

export interface TagListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  tags: TagItem[]
  /** Show tags in labelled sections per category, like a booru sidebar. */
  grouped?: boolean
  onTagClick?: (tag: TagItem) => void
}

export function TagList({ tags, grouped = false, onTagClick, className, ...props }: TagListProps) {
  const render = (tag: TagItem) => (
    <Tag
      key={`${tag.category}-${tag.name}`}
      name={tag.name}
      category={tag.category}
      count={tag.count}
      href={tag.href}
      onClick={onTagClick ? () => onTagClick(tag) : undefined}
    />
  )

  if (!grouped) {
    return (
      <div className={cn('flex flex-wrap gap-1.5', className)} {...props}>
        {tags.map(render)}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4', className)} {...props}>
      {CATEGORY_ORDER.map((category) => {
        const inCategory = tags.filter((t) => (t.category ?? 'general') === category)
        if (inCategory.length === 0) return null
        return (
          <section
            key={category}
            className="flex flex-col gap-1.5"
            aria-label={`${TAG_CATEGORY_LABELS[category]} tags`}>
            <h4 className="ui-tag-heading" data-category={category}>
              {TAG_CATEGORY_LABELS[category]}
            </h4>
            <div className="flex flex-wrap gap-1.5">{inCategory.map(render)}</div>
          </section>
        )
      })}
    </div>
  )
}
