'use client'

import React, { useEffect, useId, useRef, useState } from 'react'

import { createPortal } from 'react-dom'

import { floatingStyle, useFloating } from '../../lib/floating'
import { cn } from '../../lib/utils'

export interface HoverCardProps {
  /** The link or name that shows the card. Keep it a real link so the card is only a preview. */
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>
  /** What the card shows. */
  content: React.ReactNode
  /** Milliseconds before it opens on hover. */
  openDelay?: number
  /** Milliseconds before it closes after the pointer leaves. */
  closeDelay?: number
  side?: 'top' | 'bottom'
  align?: 'start' | 'center' | 'end'
  className?: string
}

/**
 * A preview that appears when you hover or keyboard-focus a link, such as a creator's profile
 * card on their name. It is supplementary: the link still goes somewhere, and touch screens,
 * which can't hover, just follow the link.
 */
export function HoverCard({
  children,
  content,
  openDelay = 450,
  closeDelay = 200,
  side = 'bottom',
  align = 'start',
  className,
}: HoverCardProps) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLSpanElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const id = useId()
  const position = useFloating(anchorRef, panelRef, open, { side, align })

  const schedule = (next: boolean, delay: number) => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(next), delay)
  }
  const cancel = () => {
    if (timer.current) clearTimeout(timer.current)
  }

  useEffect(() => cancel, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const hoverHandlers = {
    onPointerEnter: (e: React.PointerEvent) =>
      e.pointerType === 'mouse' && schedule(true, openDelay),
    onPointerLeave: (e: React.PointerEvent) =>
      e.pointerType === 'mouse' && schedule(false, closeDelay),
  }

  const child = React.cloneElement(children, {
    'aria-describedby': open ? id : undefined,
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      children.props.onFocus?.(e)
      schedule(true, 0)
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      children.props.onBlur?.(e)
      schedule(false, closeDelay)
    },
  } as React.HTMLAttributes<HTMLElement>)

  return (
    <span ref={anchorRef} className="inline-flex" {...hoverHandlers}>
      {child}
      {open &&
        createPortal(
          <div
            ref={panelRef}
            id={id}
            role="tooltip"
            style={floatingStyle(position)}
            {...hoverHandlers}
            onPointerEnter={(e) => e.pointerType === 'mouse' && cancel()}
            className={cn(
              'ui-menu z-[80] w-72 max-w-[calc(100vw-1rem)] p-4!',
              position && 'dl-animate-pop',
              className
            )}>
            {content}
          </div>,
          document.body
        )}
    </span>
  )
}
