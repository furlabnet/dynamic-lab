import React from 'react'

import { Check, CheckCheck, Clock } from 'lucide-react'

import { cn } from '../../lib/utils'
import { ProfileAvatar } from '../ProfileAvatar'

export interface MessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Messages from the viewer sit on the right in the primary colour. */
  own?: boolean
  author?: string
  avatar?: string
  initials?: string
  /** Formatted time, e.g. "14:02". */
  time?: React.ReactNode
  status?: 'sending' | 'sent' | 'read'
  /**
   * Position in a run of messages from the same person. The avatar and name show only on the
   * first, and corners tighten between them.
   */
  grouping?: 'single' | 'first' | 'middle' | 'last'
  /** Images or files under the text. */
  attachments?: React.ReactNode
}

const statusIcon = {
  sending: <Clock className="size-3" aria-label="Sending" />,
  sent: <Check className="size-3" aria-label="Sent" />,
  read: <CheckCheck className="size-3" aria-label="Read" />,
}

export function MessageBubble({
  className,
  own = false,
  author,
  avatar,
  initials,
  time,
  status,
  grouping = 'single',
  attachments,
  children,
  ...props
}: MessageBubbleProps) {
  const showHeader = grouping === 'single' || grouping === 'first'
  const showAvatar = !own && (grouping === 'single' || grouping === 'last')
  return (
    <div
      data-own={own || undefined}
      data-grouping={grouping}
      className={cn('dl-message', className)}
      {...props}>
      {!own && (
        <span className="dl-message-avatar">
          {showAvatar && <ProfileAvatar src={avatar} initials={initials} alt={author} size="sm" />}
        </span>
      )}
      <div className="flex max-w-[min(32rem,80%)] min-w-0 flex-col gap-1">
        {showHeader && !own && author && <span className="dl-message-author">{author}</span>}
        {children && <div className="dl-message-bubble">{children}</div>}
        {attachments && <div className="flex flex-wrap gap-1.5">{attachments}</div>}
        {(time || status) && (grouping === 'single' || grouping === 'last') && (
          <span className="dl-message-meta">
            {time}
            {own && status && statusIcon[status]}
          </span>
        )}
      </div>
    </div>
  )
}

/** A centred label between messages: "Today", "12 March". */
export function MessageDivider({ children }: { children: React.ReactNode }) {
  return (
    <div role="separator" className="dl-message-divider">
      <span>{children}</span>
    </div>
  )
}

/* -------------------------------------------------- Conversation list */

export interface ConversationItemProps extends Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'title'
> {
  name: React.ReactNode
  avatar?: string
  initials?: string
  /** Last message, shown on one line. */
  preview?: React.ReactNode
  time?: React.ReactNode
  unread?: number
  online?: boolean
  active?: boolean
}

/** One row in the inbox: avatar, name, last message, time and unread count. */
export function ConversationItem({
  className,
  name,
  avatar,
  initials,
  preview,
  time,
  unread = 0,
  online,
  active = false,
  ...props
}: ConversationItemProps) {
  return (
    <a
      aria-current={active ? 'true' : undefined}
      data-unread={unread > 0 || undefined}
      className={cn('dl-conversation', className)}
      {...props}>
      <ProfileAvatar
        src={avatar}
        initials={initials}
        size="lg"
        status={online === undefined ? undefined : online ? 'online' : 'offline'}
      />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate text-sm font-semibold">{name}</span>
          {time && <span className="shrink-0 text-xs text-[var(--muted-foreground)]">{time}</span>}
        </span>
        <span className="flex items-center justify-between gap-2">
          <span className="dl-conversation-preview truncate text-[0.8125rem] text-[var(--muted-foreground)]">
            {preview}
          </span>
          {unread > 0 && (
            <span className="dl-conversation-unread">
              {unread > 99 ? '99+' : unread}
              <span className="sr-only"> unread</span>
            </span>
          )}
        </span>
      </span>
    </a>
  )
}
