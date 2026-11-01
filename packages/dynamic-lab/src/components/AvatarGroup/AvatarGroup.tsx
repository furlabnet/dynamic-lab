import React from 'react'

import type { ProfileAvatarProps } from '../ProfileAvatar'
import { cn } from '../../lib/utils'
import { ProfileAvatar } from '../ProfileAvatar'

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The people to show, in order. */
  avatars: Array<Pick<ProfileAvatarProps, 'src' | 'alt' | 'initials'>>
  /** How many avatars to show before a "+N" counter. */
  max?: number
  size?: ProfileAvatarProps['size']
  /** Total count when it is larger than `avatars` (e.g. 1,204 followers, 5 loaded). */
  total?: number
}

const overlap = {
  sm: '-ml-2',
  md: '-ml-2.5',
  lg: '-ml-3.5',
  xl: '-ml-5',
  '2xl': '-ml-8',
}

const counterSize = {
  sm: 'size-7 text-[10px]',
  md: 'size-9 text-xs',
  lg: 'size-12 text-sm',
  xl: 'size-16 text-base',
  '2xl': 'size-28 text-2xl',
}

/** Overlapping avatars for collaborators, followers and Lab members, with a "+N" for the rest. */
export function AvatarGroup({
  className,
  avatars,
  max = 4,
  size = 'md',
  total,
  ...props
}: AvatarGroupProps) {
  const shown = avatars.slice(0, max)
  const rest = (total ?? avatars.length) - shown.length
  const names = avatars.map((a) => a.alt).filter(Boolean)

  return (
    <div
      role="group"
      aria-label={
        names.length
          ? `${names.slice(0, max).join(', ')}${rest > 0 ? ` and ${rest} more` : ''}`
          : undefined
      }
      className={cn('flex items-center', className)}
      {...props}>
      {shown.map((a, i) => (
        <span
          key={i}
          className={cn(
            'rounded-full bg-[var(--card)] ring-2 ring-[var(--card)]',
            i > 0 && overlap[size]
          )}>
          <ProfileAvatar {...a} size={size} aria-hidden="true" />
        </span>
      ))}
      {rest > 0 && (
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-[var(--muted)] font-semibold text-[var(--muted-foreground)] tabular-nums ring-2 ring-[var(--card)]',
            counterSize[size],
            overlap[size]
          )}>
          +{rest > 99 ? '99' : rest}
        </span>
      )}
    </div>
  )
}
