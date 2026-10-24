import React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'
import { DropdownMenu } from '../Menu'
import { ProfileAvatar } from '../ProfileAvatar'

export interface UserMenuProps {
  name: string
  email?: string
  initials?: string
  avatarSrc?: string
  /** Extra line under the name in the menu header, e.g. a role Badge. */
  meta?: React.ReactNode
  /** Hide the name next to the avatar (avatar-only trigger). */
  compact?: boolean
  align?: 'start' | 'end'
  className?: string
  /** MenuItem / MenuSeparator children. */
  children: React.ReactNode
}

function initialsFrom(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/** Avatar + name trigger that opens the account menu. */
export function UserMenu({
  name,
  email,
  initials,
  avatarSrc,
  meta,
  compact = false,
  align = 'end',
  className,
  children,
}: UserMenuProps) {
  const resolvedInitials = initials ?? initialsFrom(name)

  return (
    <DropdownMenu
      align={align}
      aria-label="Account"
      containerClassName={className}
      trigger={
        <button
          type="button"
          className={cn('ui-user-menu-trigger', compact && 'px-1')}
          aria-label={`Account menu for ${name}`}>
          <ProfileAvatar
            initials={resolvedInitials}
            src={avatarSrc}
            size="sm"
            className="ui-user-avatar"
          />
          {!compact && (
            <span className="hidden whitespace-nowrap text-sm font-semibold lg:inline">{name}</span>
          )}
          <ChevronDown className="size-3.5 opacity-70" aria-hidden />
        </button>
      }>
      <div className="flex items-center gap-3 px-3 pb-2 pt-2.5">
        <ProfileAvatar
          initials={resolvedInitials}
          src={avatarSrc}
          size="md"
          className="ui-user-avatar"
        />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold">{name}</span>
          {email && (
            <span className="truncate text-xs text-[var(--muted-foreground)]">{email}</span>
          )}
          {meta && <span className="mt-1">{meta}</span>}
        </div>
      </div>
      <div className="my-1 h-px bg-[var(--border)]" role="separator" />
      {children}
    </DropdownMenu>
  )
}
