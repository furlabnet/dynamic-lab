'use client'

import React, { useState } from 'react'

import { Heart, SmilePlus } from 'lucide-react'

import type { Reaction, ReactionChoice } from './reactionList'
import { formatCount } from '../../lib/format'
import { useControllableState } from '../../lib/hooks'
import { cn } from '../../lib/utils'
import { Popover } from '../Popover'
import { DEFAULT_REACTIONS } from './reactionList'

export interface LikeButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange'
> {
  liked?: boolean
  defaultLiked?: boolean
  onLikedChange?: (liked: boolean) => void
  /** Count before the viewer's own like; the button adds one while liked. */
  count?: number
  /** Icon to use instead of a heart (a star, a paw). */
  icon?: React.ReactNode
  /** What is being liked, for the accessible name: "Like The lighthouse keeper". */
  label?: string
  size?: 'sm' | 'md'
}

/**
 * A like toggle with a count and a small burst when it is switched on. The burst is skipped for
 * people who prefer reduced motion.
 */
export function LikeButton({
  className,
  liked: likedProp,
  defaultLiked = false,
  onLikedChange,
  count,
  icon,
  label = 'Like',
  size = 'md',
  onClick,
  ...props
}: LikeButtonProps) {
  const [liked, setLiked] = useControllableState(likedProp, defaultLiked, onLikedChange)
  const [burst, setBurst] = useState(0)
  const shown = count === undefined ? undefined : count + (liked ? 1 : 0)

  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={shown === undefined ? label : `${label}, ${shown}`}
      data-liked={liked || undefined}
      data-size={size}
      className={cn('dl-like', className)}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        if (!liked) setBurst((b) => b + 1)
        setLiked(!liked)
      }}
      {...props}>
      <span className="dl-like-icon" aria-hidden="true">
        {icon ?? <Heart />}
        {liked && burst > 0 && <span key={burst} className="dl-like-burst" />}
      </span>
      {shown !== undefined && (
        <span className="dl-like-count tabular-nums" aria-hidden="true">
          {formatCount(shown)}
        </span>
      )}
    </button>
  )
}

/* ----------------------------------------------------------- Reactions */

export interface ReactionBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onToggle'> {
  reactions: Reaction[]
  /** Called with a reaction's id when the viewer toggles it, including one picked from the picker. */
  onToggle: (id: string) => void
  /** Reactions offered in the picker, and the icons and labels for the chips. */
  choices?: ReactionChoice[]
  /** Hide the add-reaction button. */
  readOnly?: boolean
}

/** Reactions under a work or comment: icon chips with counts, plus a picker to add one. */
export function ReactionBar({
  className,
  reactions,
  onToggle,
  choices = DEFAULT_REACTIONS,
  readOnly = false,
  ...props
}: ReactionBarProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)} {...props}>
      {reactions
        .filter((r) => r.count > 0)
        .map((r) => {
          const choice = choices.find((c) => c.id === r.id)
          const Icon = choice?.icon
          return (
            <button
              key={r.id}
              type="button"
              aria-pressed={r.reacted || false}
              aria-label={`${r.label ?? choice?.label ?? r.id}, ${r.count}`}
              disabled={readOnly}
              onClick={() => onToggle(r.id)}
              data-reacted={r.reacted || undefined}
              className="dl-reaction">
              {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
              <span className="tabular-nums" aria-hidden="true">
                {formatCount(r.count)}
              </span>
            </button>
          )
        })}
      {!readOnly && <ReactionPicker choices={choices} onPick={onToggle} />}
    </div>
  )
}

export interface ReactionPickerProps {
  /** Called with the picked reaction's id. */
  onPick: (id: string) => void
  choices?: ReactionChoice[]
  /** Custom trigger; defaults to a small smiley-plus button. */
  trigger?: React.ReactElement<React.HTMLAttributes<HTMLElement>>
}

/** A grid of reaction icons in a popover. */
export function ReactionPicker({
  onPick,
  choices = DEFAULT_REACTIONS,
  trigger,
}: ReactionPickerProps) {
  return (
    <Popover
      aria-label="Add a reaction"
      trigger={
        trigger ?? (
          <button type="button" className="dl-reaction dl-reaction-add" aria-label="Add a reaction">
            <SmilePlus className="size-4" />
          </button>
        )
      }
      className="ui-menu p-2!"
      onOpenAutoFocus={(panel) => panel.querySelector<HTMLElement>('button')?.focus()}>
      {({ close }) => (
        <div className="grid grid-cols-5 gap-0.5">
          {choices.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className="dl-reaction-choice"
              aria-label={label}
              title={label}
              onClick={() => {
                onPick(id)
                close()
              }}>
              <Icon className="size-5" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </Popover>
  )
}
