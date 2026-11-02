'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Paperclip, SendHorizontal } from 'lucide-react'

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
  /** Called with the trimmed text. Clears the field afterwards. */
  onSend: (text: string) => void
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
  ...props
}: MessageComposerProps) {
  const [text, setText] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    const line = parseFloat(getComputedStyle(el).lineHeight) || 20
    el.style.height = `${Math.min(el.scrollHeight, line * maxRows + 16)}px`
  }, [text, maxRows])

  const send = () => {
    const t = text.trim()
    if (!t || disabled) return
    onSend(t)
    setText('')
  }

  return (
    <form
      className={cn('dl-composer', className)}
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
        onChange={(e) => setText(e.target.value)}
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
        aria-label="Send"
        disabled={disabled || !text.trim()}
        className="dl-composer-send">
        <SendHorizontal className="size-4" />
      </button>
    </form>
  )
}
