import React, { useState } from 'react'
import { Heart, Lock, MessageCircle } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../Button'
import { ProfileAvatar } from '../ProfileAvatar'
import { Textarea } from '../Input'

export interface CommentAuthor {
  name: string
  avatarSrc?: string
  /** Small label after the name, e.g. "Creator". */
  badge?: React.ReactNode
  href?: string
}

export interface CommentData {
  id: string
  author: CommentAuthor
  body: string
  createdAt: string | Date
  likes?: number
  liked?: boolean
  replies?: CommentData[]
}

export function relativeTime(date: string | Date) {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export interface CommentComposerProps {
  onSubmit: (body: string) => void
  onCancel?: () => void
  placeholder?: string
  submitLabel?: string
  autoFocus?: boolean
  user?: CommentAuthor
}

export function CommentComposer({
  onSubmit,
  onCancel,
  placeholder = 'Add a comment…',
  submitLabel = 'Post',
  autoFocus,
  user,
}: CommentComposerProps) {
  const [body, setBody] = useState('')
  return (
    <form
      className="flex items-start gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        if (!body.trim()) return
        onSubmit(body.trim())
        setBody('')
      }}>
      {user && <ProfileAvatar src={user.avatarSrc} initials={initials(user.name)} size="md" />}
      <div className="flex flex-1 flex-col gap-2">
        <Textarea
          rows={2}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          autoFocus={autoFocus}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) e.currentTarget.form?.requestSubmit()
          }}
        />
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button size="sm" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button size="sm" type="submit" disabled={!body.trim()}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  )
}

interface CommentItemProps {
  comment: CommentData
  depth: number
  onReply?: (parentId: string, body: string) => void
  onLike?: (id: string) => void
  user?: CommentAuthor
}

function CommentItem({ comment, depth, onReply, onLike, user }: CommentItemProps) {
  const [replying, setReplying] = useState(false)
  const Name = (comment.author.href ? 'a' : 'span') as React.ElementType

  return (
    <li className="flex gap-3">
      <ProfileAvatar
        src={comment.author.avatarSrc}
        initials={initials(comment.author.name)}
        size={depth ? 'sm' : 'md'}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Name href={comment.author.href} className="font-semibold hover:underline">
            {comment.author.name}
          </Name>
          {comment.author.badge}
          <time
            dateTime={new Date(comment.createdAt).toISOString()}
            className="text-xs text-[var(--muted-foreground)]">
            {relativeTime(comment.createdAt)}
          </time>
        </div>
        <p className="whitespace-pre-line text-sm leading-relaxed">{comment.body}</p>
        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            aria-pressed={comment.liked}
            onClick={() => onLike?.(comment.id)}
            className={cn('ui-comment-action', comment.liked && 'text-[var(--destructive)]')}>
            <Heart className={cn('size-3.5', comment.liked && 'fill-current')} />
            {comment.likes ? comment.likes : 'Like'}
          </button>
          {onReply && depth === 0 && (
            <button
              type="button"
              onClick={() => setReplying((v) => !v)}
              className="ui-comment-action">
              <MessageCircle className="size-3.5" />
              Reply
            </button>
          )}
        </div>
        {replying && onReply && (
          <div className="mt-2">
            <CommentComposer
              autoFocus
              placeholder={`Reply to ${comment.author.name}…`}
              submitLabel="Reply"
              onCancel={() => setReplying(false)}
              onSubmit={(body) => {
                onReply(comment.id, body)
                setReplying(false)
              }}
            />
          </div>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <ul className="mt-3 flex flex-col gap-4 border-l-2 border-[var(--border)] pl-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                depth={depth + 1}
                onLike={onLike}
                user={user}
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  )
}

export interface CommentThreadProps {
  comments: CommentData[]
  /** Called with the new comment body, and the parent id for replies. */
  onAdd?: (body: string, parentId?: string) => void
  onLike?: (id: string) => void
  /** The signed-in user, shown next to the composer. */
  user?: CommentAuthor
  /** When true, existing comments show but nobody can add new ones. */
  closed?: boolean
  title?: string
  className?: string
}

export function CommentThread({
  comments,
  onAdd,
  onLike,
  user,
  closed = false,
  title = 'Comments',
  className,
}: CommentThreadProps) {
  const total = comments.reduce((n, c) => n + 1 + (c.replies?.length ?? 0), 0)
  return (
    <section className={cn('flex flex-col gap-5', className)} aria-label={title}>
      <h2 className="ui-section-title flex items-center gap-2">
        {title}
        <span className="ui-badge ui-badge-neutral">{total}</span>
      </h2>
      {closed ? (
        <p className="flex items-center gap-2 rounded-[var(--radius-lg)] bg-[var(--muted)] px-4 py-3 text-sm text-[var(--muted-foreground)]">
          <Lock className="size-4" /> The creator closed comments on this work.
        </p>
      ) : (
        onAdd && <CommentComposer user={user} onSubmit={(body) => onAdd(body)} />
      )}
      {comments.length === 0 ? (
        !closed && (
          <p className="body-sm text-[var(--muted-foreground)]">No comments yet. Be the first.</p>
        )
      ) : (
        <ul className="flex flex-col gap-6">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              depth={0}
              onReply={closed || !onAdd ? undefined : (parentId, body) => onAdd(body, parentId)}
              onLike={onLike}
              user={user}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
