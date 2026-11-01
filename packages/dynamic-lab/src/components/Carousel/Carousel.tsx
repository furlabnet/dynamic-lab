'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { Responsive, Space } from '../../lib/layout'
import { responsiveVars, toSpace, withVars } from '../../lib/layout'
import { cn } from '../../lib/utils'

export interface CarouselProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Heading for a "shelf" of items, e.g. "Trending comics". */
  title?: React.ReactNode
  /** Link or button beside the title, e.g. "See all". */
  action?: React.ReactNode
  /** How many items fit across. Fractions show a peek of the next one. Responsive. */
  perView?: Responsive<number>
  /** Space between items. */
  gap?: Space
  /** Previous / next buttons. Hidden on touch screens, where people swipe. */
  arrows?: boolean
  /** Dots under the track, one per page. */
  dots?: boolean
  /** Accessible name when there is no title. */
  label?: string
  children: React.ReactNode
}

/**
 * A row of items that scrolls sideways: featured works, a shelf of comics, a creator's gallery.
 * Built on native scroll snapping, so it swipes on touch, scrolls with a trackpad and works with
 * the keyboard (Tab into an item, or arrow keys on the track).
 */
export function Carousel({
  className,
  style,
  title,
  action,
  perView = { base: 1.2, sm: 2.2, lg: 4 },
  gap = 4,
  arrows = true,
  dots = false,
  label,
  children,
  ...props
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const titleId = React.useId()
  const [edges, setEdges] = useState({ start: true, end: false })
  const [page, setPage] = useState({ index: 0, count: 1 })
  const items = React.Children.toArray(children)

  const measure = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 })
    const count = Math.max(1, Math.round(el.scrollWidth / el.clientWidth))
    const index = max <= 0 ? 0 : Math.round((el.scrollLeft / max) * (count - 1))
    setPage((p) => (p.index === index && p.count === count ? p : { index, count }))
  }, [])

  useEffect(() => {
    measure()
    const el = trackRef.current
    if (!el) return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [measure, items.length])

  const scrollByPage = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: smooth ? 'smooth' : 'auto' })
  }

  const goTo = (i: number) => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    el.scrollTo({ left: page.count > 1 ? (max * i) / (page.count - 1) : 0, behavior: 'smooth' })
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-labelledby={title ? titleId : undefined}
      aria-label={title ? undefined : label}
      className={cn('flex min-w-0 flex-col gap-3', className)}
      {...props}>
      {(title || action || arrows) && (
        <div className="flex items-center justify-between gap-3">
          {title ? (
            <h2 id={titleId} className="text-lg font-[650] tracking-[-0.015em]">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            {action}
            {arrows && (
              <div className="hidden gap-1.5 [@media(hover:hover)]:flex">
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Previous"
                  disabled={edges.start}
                  onClick={() => scrollByPage(-1)}>
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Next"
                  disabled={edges.end}
                  onClick={() => scrollByPage(1)}>
                  <ChevronRight className="size-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <div
        ref={trackRef}
        tabIndex={0}
        onScroll={measure}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            scrollByPage(1)
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault()
            scrollByPage(-1)
          }
        }}
        data-edge-start={edges.start || undefined}
        data-edge-end={edges.end || undefined}
        className="dl-carousel-track"
        style={withVars(
          { ...responsiveVars('carousel-per', perView, String), '--carousel-gap': toSpace(gap) },
          style
        )}>
        {items.map((child, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}`}
            className="dl-carousel-item">
            {child}
          </div>
        ))}
      </div>
      {dots && page.count > 1 && (
        <div className="flex justify-center gap-1.5" role="group" aria-label="Pages">
          {Array.from({ length: page.count }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Page ${i + 1}`}
              aria-current={i === page.index || undefined}
              onClick={() => goTo(i)}
              className="dl-carousel-dot"
            />
          ))}
        </div>
      )}
    </section>
  )
}
