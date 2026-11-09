'use client'

import React, { useEffect, useRef, useState } from 'react'

import { cn } from '../../lib/utils'

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  side?: 'top' | 'bottom' | 'left' | 'right'
  delayDuration?: number
  className?: string
}

export function Tooltip({
  content,
  children,
  side = 'top',
  delayDuration = 200,
  className,
}: TooltipProps) {
  // Two independent reasons to show: the pointer resting on the trigger (after the delay) and
  // keyboard focus (at once). Losing one doesn't hide a tooltip the other still holds open, and
  // Escape hides it until the next hover or focus.
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const isVisible = (hovered || focused) && !dismissed
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setDismissed(false)
    timerRef.current = setTimeout(() => setHovered(true), delayDuration)
  }

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setHovered(false)
  }

  useEffect(() => {
    if (!isVisible) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDismissed(true)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isVisible])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const sideClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => {
        setDismissed(false)
        setFocused(true)
      }}
      onBlur={() => setFocused(false)}>
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'animate-in fade-in-0 zoom-in-95 pointer-events-none absolute z-50 rounded-[var(--radius-md)] border border-[var(--glass-border)] bg-[color-mix(in_srgb,var(--card)_95%,transparent)] px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-[var(--foreground)] shadow-lg backdrop-blur-[var(--blur-chrome)] duration-150',
            sideClasses[side],
            className
          )}>
          {content}
        </div>
      )}
    </div>
  )
}
