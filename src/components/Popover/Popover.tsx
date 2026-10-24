import React, { useCallback, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/utils'
import { useControllableState, useDismiss } from '../../lib/hooks'

export interface PopoverRenderApi {
  close: () => void
}

export interface PopoverProps {
  /** Element that toggles the popover. It receives onClick and the aria-expanded/controls props. */
  trigger: React.ReactElement<React.HTMLAttributes<HTMLElement>>
  children: React.ReactNode | ((api: PopoverRenderApi) => React.ReactNode)
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Preferred side; flips to the other one when there isn't room. */
  side?: 'top' | 'bottom'
  align?: 'start' | 'center' | 'end'
  /** ARIA role of the floating panel. */
  role?: 'dialog' | 'menu' | 'listbox'
  'aria-label'?: string
  className?: string
  containerClassName?: string
  /** Called once the panel is shown, with the panel element (useful to move focus). */
  onOpenAutoFocus?: (panel: HTMLDivElement) => void
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>
}

const GAP = 8
const VIEWPORT_MARGIN = 8

/**
 * A floating panel anchored to its trigger. The panel renders in a portal on document.body with
 * fixed positioning, so it's never clipped or covered by ancestors with overflow, transforms,
 * backdrop-filter or sticky positioning (which all create their own stacking contexts).
 */
export function Popover({
  trigger,
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side = 'bottom',
  align = 'start',
  role = 'dialog',
  className,
  containerClassName,
  onOpenAutoFocus,
  onKeyDown,
  ...props
}: PopoverProps) {
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange)
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  const [position, setPosition] = useState<{ top: number; left: number; side: 'top' | 'bottom' } | null>(null)

  const close = (restoreFocus = false) => {
    setOpen(false)
    if (restoreFocus) {
      containerRef.current?.querySelector<HTMLElement>('[data-popover-trigger]')?.focus()
    }
  }

  useDismiss([containerRef, panelRef], open, (reason) => close(reason === 'escape'))

  const place = useCallback(() => {
    const anchor = containerRef.current?.querySelector<HTMLElement>('[data-popover-trigger]') ?? containerRef.current
    const panel = panelRef.current
    if (!anchor || !panel) return
    const rect = anchor.getBoundingClientRect()
    const { offsetWidth: w, offsetHeight: h } = panel
    const vw = window.innerWidth
    const vh = window.innerHeight

    const roomBelow = vh - rect.bottom - GAP
    const roomAbove = rect.top - GAP
    const resolvedSide = side === 'bottom' ? (h > roomBelow && roomAbove > roomBelow ? 'top' : 'bottom') : h > roomAbove && roomBelow > roomAbove ? 'bottom' : 'top'
    let top = resolvedSide === 'bottom' ? rect.bottom + GAP : rect.top - GAP - h
    top = Math.max(VIEWPORT_MARGIN, Math.min(top, vh - h - VIEWPORT_MARGIN))

    let left = align === 'start' ? rect.left : align === 'end' ? rect.right - w : rect.left + rect.width / 2 - w / 2
    left = Math.max(VIEWPORT_MARGIN, Math.min(left, vw - w - VIEWPORT_MARGIN))

    setPosition((prev) => (prev && prev.top === top && prev.left === left && prev.side === resolvedSide ? prev : { top, left, side: resolvedSide }))
  }, [side, align])

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null)
      return
    }
    place()
    // Follow the trigger while the page or any scroll container moves, and when the panel resizes.
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    const observer = new ResizeObserver(place)
    if (panelRef.current) observer.observe(panelRef.current)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
      observer.disconnect()
    }
  }, [open, place])

  const triggerProps = trigger.props
  const clonedTrigger = React.cloneElement(trigger, {
    'aria-expanded': open,
    'aria-haspopup': role === 'dialog' ? 'dialog' : role,
    'aria-controls': open ? panelId : undefined,
    'data-popover-trigger': '',
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      triggerProps.onClick?.(e)
      if (!e.defaultPrevented) setOpen(!open)
    },
  } as React.HTMLAttributes<HTMLElement>)

  return (
    <div ref={containerRef} className={cn('relative inline-flex', containerClassName)}>
      {clonedTrigger}
      {open &&
        createPortal(
          <div
            id={panelId}
            role={role}
            aria-label={props['aria-label']}
            ref={(el) => {
              panelRef.current = el
              if (el && onOpenAutoFocus && !el.dataset.focused) {
                el.dataset.focused = 'true'
                onOpenAutoFocus(el)
              }
            }}
            onKeyDown={onKeyDown}
            data-side={position?.side ?? side}
            style={{
              position: 'fixed',
              top: position?.top ?? 0,
              left: position?.left ?? 0,
              // Hidden until measured, so it doesn't flash at the corner.
              visibility: position ? 'visible' : 'hidden',
            }}
            className={cn('ui-popover z-[80]', position && 'dl-animate-pop', className)}>
            {typeof children === 'function' ? children({ close: () => close(true) }) : children}
          </div>,
          document.body
        )}
    </div>
  )
}
