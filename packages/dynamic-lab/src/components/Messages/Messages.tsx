'use client'

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

import { Loader2, Paperclip, SendHorizontal } from 'lucide-react'

import { useAsyncAction } from '../../lib/hooks'
import { cn } from '../../lib/utils'

export interface MessageThreadProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Keep scrolled to the newest message as messages arrive (unless the reader scrolled up). */
  stickToBottom?: boolean
}

/**
 * The scrolling list of messages in a conversation. Messages are announced politely to screen
 * readers as they arrive.
 */
export function MessageThread({
  className,
  stickToBottom = true,
  children,
  ...props
}: MessageThreadProps) {
  const ref = useRef<HTMLDivElement>(null)
  const atBottom = useRef(true)
  const count = React.Children.count(children)

  useLayoutEffect(() => {
    const el = ref.current
    if (el && stickToBottom && atBottom.current) el.scrollTop = el.scrollHeight
  }, [count, stickToBottom])

  return (
    <div
      ref={ref}
      role="log"
      aria-live="polite"
      tabIndex={0}
      onScroll={(e) => {
        const el = e.currentTarget
        atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48
      }}
      className={cn('dl-scroll-area flex flex-col gap-1 overflow-y-auto p-4', className)}
      {...props}>
      {children}
    </div>
  )
}

/* ----------------------------------------------------------- Composer */

export interface MessageComposerProps extends Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'onSubmit'
> {
  /**
   * Called with the trimmed text. The field clears once it succeeds: at once for a plain function,
   * or when a returned promise resolves. On a rejection the text stays and an error shows.
   */
  onSend: (text: string) => void | Promise<unknown>
  /** Shown when `onSend` rejects. */
  errorText?: React.ReactNode
  placeholder?: string
  /** Show an attach button. */
  onAttach?: () => void
  disabled?: boolean
  /** Rows the field grows to before it scrolls. */
  maxRows?: number
}

/** The message field: grows as you type, Enter sends, Shift+Enter adds a line. */
export function MessageComposer({
  className,
  onSend,
  placeholder = 'Write a message…',
  onAttach,
  disabled = false,
  maxRows = 6,
  errorText = 'Not sent. Your message is still here; try again.',
  ...props
}: MessageComposerProps) {
  const [text, setText] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)
  const sending = useAsyncAction(onSend)
  const errorId = `${useId()}-error`

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    const line = parseFloat(getComputedStyle(el).lineHeight) || 20
    el.style.height = `${Math.min(el.scrollHeight, line * maxRows + 16)}px`
  }, [text, maxRows])

  const send = async () => {
    const t = text.trim()
    if (!t || disabled) return
    if (await sending.run(t)) setText('')
  }

  return (
    <form
      className={cn('dl-composer', className)}
      data-status={sending.status}
      aria-busy={sending.isPending || undefined}
      onSubmit={(e) => {
        e.preventDefault()
        send()
      }}
      {...props}>
      {onAttach && (
        <button
          type="button"
          className="icon-button border-0! bg-transparent!"
          aria-label="Attach a file"
          onClick={onAttach}
          disabled={disabled}>
          <Paperclip className="size-4" />
        </button>
      )}
      <textarea
        ref={ref}
        rows={1}
        value={text}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={placeholder}
        readOnly={sending.isPending}
        aria-invalid={sending.status === 'error' || undefined}
        aria-describedby={sending.status === 'error' ? errorId : undefined}
        onChange={(e) => {
          setText(e.target.value)
          if (sending.status === 'error') sending.reset()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault()
            send()
          }
        }}
        className="dl-composer-input"
      />
      <button
        type="submit"
        aria-label={sending.isPending ? 'Sending' : 'Send'}
        disabled={disabled || sending.isPending || !text.trim()}
        className="dl-composer-send">
        {sending.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <SendHorizontal className="size-4" />
        )}
      </button>
      {sending.status === 'error' && (
        <p id={errorId} role="alert" className="dl-composer-error">
          {errorText}
        </p>
      )}
    </form>
  )
}
