import React from 'react'

import { ChevronRight } from 'lucide-react'

import { cn } from '../../lib/utils'

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  /** `inset` draws the list on a card surface with dividers; `plain` has neither. */
  variant?: 'plain' | 'divided' | 'inset'
  /** Tighter rows for dense screens. */
  dense?: boolean
  /** Optional heading shown above the list. */
  label?: React.ReactNode
}

/**
 * Rows of related items: settings, followers, notifications, chapters. Each row is a ListItem with
 * optional leading media, a title and description, and trailing content.
 */
export function List({
  className,
  variant = 'divided',
  dense = false,
  label,
  children,
  ...props
}: ListProps) {
  const labelId = React.useId()
  const list = (
    <ul
      role="list"
      aria-labelledby={label ? labelId : undefined}
      data-variant={variant}
      data-dense={dense || undefined}
      className={cn('dl-list', className)}
      {...props}>
      {children}
    </ul>
  )

  if (!label) return list

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div
        id={labelId}
        className="px-1 text-xs font-semibold tracking-[0.06em] text-[var(--muted-foreground)] uppercase">
        {label}
      </div>
      {list}
    </div>
  )
}

export interface ListItemProps extends Omit<
  React.LiHTMLAttributes<HTMLLIElement>,
  'title' | 'onClick'
> {
  /** Avatar, icon or thumbnail before the text. */
  leading?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  /** Content at the end of the row: a badge, a switch, a timestamp. */
  trailing?: React.ReactNode
  /** Makes the whole row a link. */
  href?: string
  /** Makes the whole row a button. */
  onClick?: React.MouseEventHandler<HTMLElement>
  /** Highlights the row, e.g. the open conversation or an unread notification. */
  selected?: boolean
  disabled?: boolean
  /** Show a chevron on interactive rows. Defaults to true for links. */
  chevron?: boolean
}

export function ListItem({
  className,
  leading,
  title,
  description,
  trailing,
  href,
  onClick,
  selected = false,
  disabled = false,
  chevron,
  ...props
}: ListItemProps) {
  const interactive = Boolean(href || onClick)
  const showChevron = chevron ?? Boolean(href)

  const content = (
    <>
      {leading && <span className="dl-list-leading">{leading}</span>}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-semibold text-[var(--foreground)]">{title}</span>
        {description && (
          <span className="line-clamp-2 text-[0.8125rem] text-[var(--muted-foreground)]">
            {description}
          </span>
        )}
      </span>
      {trailing && <span className="flex shrink-0 items-center gap-2">{trailing}</span>}
      {interactive && showChevron && (
        <ChevronRight
          aria-hidden="true"
          className="size-4 shrink-0 text-[var(--muted-foreground)]"
        />
      )}
    </>
  )

  return (
    <li
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
      className={cn('dl-list-item', className)}
      {...props}>
      {href && !disabled ? (
        <a
          href={href}
          onClick={onClick}
          aria-current={selected ? 'true' : undefined}
          className="dl-list-row dl-list-row-interactive">
          {content}
        </a>
      ) : onClick ? (
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-pressed={selected || undefined}
          className="dl-list-row dl-list-row-interactive">
          {content}
        </button>
      ) : (
        <div className="dl-list-row">{content}</div>
      )}
    </li>
  )
}
