'use client'

import React, { useState } from 'react'

import { Heart, SmilePlus } from 'lucide-react'

import { formatCount } from '../../lib/format'
import { useControllableState } from '../../lib/hooks'
import { cn } from '../../lib/utils'
import { Popover } from '../Popover'

/* --------------------------------------------------------- LikeButton */

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

export interface Reaction {
  emoji: string
  count: number
  /** The viewer has reacted with this one. */
  reacted?: boolean
  /** Name for screen readers, e.g. "heart eyes". */
  label?: string
}

export interface ReactionBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onToggle'> {
  reactions: Reaction[]
  /** Called when the viewer toggles a reaction, including one picked from the picker. */
  onToggle: (emoji: string) => void
  /** Emoji offered in the picker. */
  choices?: string[]
  /** Hide the add-reaction button. */
  readOnly?: boolean
}

export const DEFAULT_REACTIONS = [
  '❤️',
  '😂',
  '😮',
  '😢',
  '🔥',
  '👏',
  '🎉',
  '🐾',
  '✨',
  '🥺',
  '😍',
  '🙏',
]

/** Emoji reactions under a work or comment: chips with counts, plus a picker to add one. */
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
        .map((r) => (
          <button
            key={r.emoji}
            type="button"
            aria-pressed={r.reacted || false}
            aria-label={`${r.label ?? r.emoji}, ${r.count}`}
            disabled={readOnly}
            onClick={() => onToggle(r.emoji)}
            data-reacted={r.reacted || undefined}
            className="dl-reaction">
            <span aria-hidden="true">{r.emoji}</span>
            <span className="tabular-nums" aria-hidden="true">
              {formatCount(r.count)}
            </span>
          </button>
        ))}
      {!readOnly && <ReactionPicker choices={choices} onPick={onToggle} />}
    </div>
  )
}

export interface ReactionPickerProps {
  onPick: (emoji: string) => void
  choices?: string[]
  /** Custom trigger; defaults to a small smiley-plus button. */
  trigger?: React.ReactElement<React.HTMLAttributes<HTMLElement>>
}

/** A grid of emoji in a popover. */
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
        <div className="grid grid-cols-6 gap-0.5">
          {choices.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="dl-reaction-choice"
              aria-label={emoji}
              onClick={() => {
                onPick(emoji)
                close()
              }}>
              {emoji}
            </button>
          ))}
        </div>
      )}
    </Popover>
  )
}
