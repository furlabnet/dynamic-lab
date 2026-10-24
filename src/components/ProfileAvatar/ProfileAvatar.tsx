import React from 'react'
import { cn } from '../../lib/utils'

export interface ProfileAvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string
  alt?: string
  initials?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'busy' | 'away'
}

const sizeClasses = {
  sm: 'size-7 text-[10px]',
  md: 'size-9 text-xs',
  lg: 'size-12 text-sm',
  xl: 'size-16 text-base',
}

const statusClasses = {
  online: 'bg-[var(--status-success-ink)]',
  offline: 'bg-[var(--muted-foreground)]',
  busy: 'bg-[var(--status-danger-ink)]',
  away: 'bg-[var(--status-warning-ink)]',
}

export function ProfileAvatar({
  className,
  src,
  alt = 'Avatar',
  initials = 'DL',
  size = 'md',
  status,
  ...props
}: ProfileAvatarProps) {
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-[var(--primary)] font-bold overflow-hidden select-none shadow-xs',
          sizeClasses[size],
          className
        )}
        {...props}>
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </span>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-[var(--card)]',
            statusClasses[status]
          )}
        />
      )}
    </span>
  )
}
