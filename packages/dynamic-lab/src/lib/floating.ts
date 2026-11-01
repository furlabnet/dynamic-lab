'use client'

import { useCallback, useLayoutEffect, useState } from 'react'

const GAP = 8
const VIEWPORT_MARGIN = 8

export interface FloatingOptions {
  /** Preferred side; flips when there isn't room. */
  side?: 'top' | 'bottom'
  align?: 'start' | 'center' | 'end'
  /** Make the panel at least as wide as the anchor (comboboxes, date fields). */
  matchWidth?: boolean
}

export interface FloatingPosition {
  top: number
  left: number
  side: 'top' | 'bottom'
  minWidth?: number
}

/**
 * Positions a fixed panel (rendered in a portal) next to an anchor, the same way Popover does:
 * flips to the other side when there isn't room, stays inside the viewport, and follows the anchor
 * on scroll and resize. Returns null until first measured, so callers can hide the panel until then.
 */
export function useFloating(
  anchorRef: React.RefObject<HTMLElement | null>,
  panelRef: React.RefObject<HTMLElement | null>,
  open: boolean,
  { side = 'bottom', align = 'start', matchWidth = false }: FloatingOptions = {}
): FloatingPosition | null {
  const [position, setPosition] = useState<FloatingPosition | null>(null)

  const place = useCallback(() => {
    const anchor = anchorRef.current
    const panel = panelRef.current
    if (!anchor || !panel) return
    const rect = anchor.getBoundingClientRect()
    const w = Math.max(panel.offsetWidth, matchWidth ? rect.width : 0)
    const h = panel.offsetHeight
    const vw = window.innerWidth
    const vh = window.innerHeight

    const roomBelow = vh - rect.bottom - GAP
    const roomAbove = rect.top - GAP
    const resolved: 'top' | 'bottom' =
      side === 'bottom'
        ? h > roomBelow && roomAbove > roomBelow
          ? 'top'
          : 'bottom'
        : h > roomAbove && roomBelow > roomAbove
          ? 'bottom'
          : 'top'
    let top = resolved === 'bottom' ? rect.bottom + GAP : rect.top - GAP - h
    top = Math.max(VIEWPORT_MARGIN, Math.min(top, vh - h - VIEWPORT_MARGIN))

    let left =
      align === 'start'
        ? rect.left
        : align === 'end'
          ? rect.right - w
          : rect.left + rect.width / 2 - w / 2
    left = Math.max(VIEWPORT_MARGIN, Math.min(left, vw - w - VIEWPORT_MARGIN))
    const minWidth = matchWidth ? rect.width : undefined

    setPosition((prev) =>
      prev &&
      prev.top === top &&
      prev.left === left &&
      prev.side === resolved &&
      prev.minWidth === minWidth
        ? prev
        : { top, left, side: resolved, minWidth }
    )
  }, [anchorRef, panelRef, side, align, matchWidth])

  useLayoutEffect(() => {
    // While closed the panel isn't rendered; the last position is re-measured before the next paint.
    if (!open) return
    place()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    const observer = new ResizeObserver(place)
    if (panelRef.current) observer.observe(panelRef.current)
    if (anchorRef.current) observer.observe(anchorRef.current)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
      observer.disconnect()
    }
  }, [open, place, anchorRef, panelRef])

  return position
}

/** Inline style for a panel positioned by useFloating. */
export function floatingStyle(position: FloatingPosition | null): React.CSSProperties {
  return {
    position: 'fixed',
    top: position?.top ?? 0,
    left: position?.left ?? 0,
    minWidth: position?.minWidth,
    visibility: position ? 'visible' : 'hidden',
  }
}
