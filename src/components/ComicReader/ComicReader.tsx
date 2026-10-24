import React, { useEffect, useMemo, useRef, useState } from 'react'
import { BookOpen, ChevronLeft, ChevronRight, Columns2, Maximize, Minimize, Rows3, Square } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useControllableState } from '../../lib/hooks'
import { IconButton } from '../Button'
import { SegmentedControl } from '../SegmentedControl'

export interface ComicPage {
  src: string
  alt?: string
}

export type ComicReaderMode = 'scroll' | 'book'

export interface ComicReaderProps {
  pages: ComicPage[]
  mode?: ComicReaderMode
  defaultMode?: ComicReaderMode
  onModeChange?: (mode: ComicReaderMode) => void
  /** In book mode, show two pages side by side (the cover stays alone). */
  defaultSpread?: boolean
  /** Reading direction for book mode; `rtl` for manga. */
  direction?: 'ltr' | 'rtl'
  /** Called with the zero-based page the reader is on. */
  onPageChange?: (page: number) => void
  className?: string
}

/** Groups page indexes into what's visible at once: [0], [1,2], [3,4]… or one per view. */
function buildViews(count: number, spread: boolean) {
  if (!spread) return Array.from({ length: count }, (_, i) => [i])
  const views: number[][] = [[0]]
  for (let i = 1; i < count; i += 2) views.push(i + 1 < count ? [i, i + 1] : [i])
  return views
}

/**
 * Multi-page comic viewer. `scroll` stacks pages vertically (webtoon style); `book` shows one page
 * or a two-page spread at a time, turned with arrow keys, swipes, clicking either half, or the
 * thumbnail strip.
 */
export function ComicReader({
  pages,
  mode: modeProp,
  defaultMode = 'book',
  onModeChange,
  defaultSpread = false,
  direction = 'ltr',
  onPageChange,
  className,
}: ComicReaderProps) {
  const [mode, setMode] = useControllableState(modeProp, defaultMode, onModeChange)
  const [spread, setSpread] = useState(defaultSpread)
  const [view, setView] = useState(0)
  const [turn, setTurn] = useState<'next' | 'prev'>('next')
  const [scrollPage, setScrollPage] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const scrollRefs = useRef<Array<HTMLDivElement | null>>([])
  const pointerStart = useRef<number | null>(null)

  const views = useMemo(() => buildViews(pages.length, spread), [pages.length, spread])
  const currentView = views[Math.min(view, views.length - 1)] ?? [0]
  const currentPage = mode === 'book' ? currentView[0] : scrollPage

  useEffect(() => {
    onPageChange?.(currentPage)
  }, [currentPage, onPageChange])

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(views.length - 1, next))
    if (clamped === view) return
    setTurn(clamped > view ? 'next' : 'prev')
    setView(clamped)
  }
  const forward = () => goTo(view + 1)
  const back = () => goTo(view - 1)
  const goToPage = (page: number) => goTo(views.findIndex((v) => v.includes(page)))

  // Keep the same page when toggling spreads.
  const toggleSpread = () => {
    const page = currentView[0]
    const nextViews = buildViews(pages.length, !spread)
    setSpread(!spread)
    setView(Math.max(0, nextViews.findIndex((v) => v.includes(page))))
  }

  useEffect(() => {
    if (mode !== 'book') return
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]')) return
      const rtl = direction === 'rtl'
      if (e.key === 'ArrowRight') (rtl ? back : forward)()
      else if (e.key === 'ArrowLeft') (rtl ? forward : back)()
      else if (e.key === 'Home') goTo(0)
      else if (e.key === 'End') goTo(views.length - 1)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // Track the page in view while scrolling.
  useEffect(() => {
    if (mode !== 'scroll') return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setScrollPage(Number((visible.target as HTMLElement).dataset.page))
      },
      { threshold: [0.3, 0.6] }
    )
    scrollRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [mode, pages.length])

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === rootRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.()
    else rootRef.current?.requestFullscreen?.().catch(() => {})
  }

  const pageLabel =
    mode === 'book' && currentView.length > 1
      ? `Pages ${currentView[0] + 1}–${currentView[1] + 1} of ${pages.length}`
      : `Page ${currentPage + 1} of ${pages.length}`

  const ordered = direction === 'rtl' ? [...currentView].reverse() : currentView

  return (
    <div ref={rootRef} className={cn('ui-comic-reader', fullscreen && 'ui-comic-reader-fullscreen', className)} data-mode={mode}>
      <div className="ui-comic-toolbar">
        <SegmentedControl
          size="sm"
          aria-label="Reading mode"
          value={mode}
          onValueChange={(v) => setMode(v as ComicReaderMode)}
          options={[
            { value: 'book', label: 'Book', icon: <BookOpen /> },
            { value: 'scroll', label: 'Scroll', icon: <Rows3 /> },
          ]}
        />
        <span className="text-sm font-medium tabular-nums text-[var(--muted-foreground)]" aria-live="polite">
          {pageLabel}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {mode === 'book' && (
            <IconButton
              aria-label={spread ? 'Show one page at a time' : 'Show two-page spreads'}
              title={spread ? 'Single page' : 'Two-page spread'}
              size="icon"
              variant="ghost"
              icon={spread ? <Square className="size-4" /> : <Columns2 className="size-4" />}
              onClick={toggleSpread}
              className="hidden md:inline-flex"
            />
          )}
          <IconButton
            aria-label={fullscreen ? 'Exit full screen' : 'Full screen'}
            size="icon"
            variant="ghost"
            icon={fullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
            onClick={toggleFullscreen}
          />
        </div>
      </div>

      {mode === 'book' ? (
        <>
          <div
            className="ui-comic-stage"
            onPointerDown={(e) => (pointerStart.current = e.clientX)}
            onPointerUp={(e) => {
              if (pointerStart.current === null) return
              const dx = e.clientX - pointerStart.current
              pointerStart.current = null
              const rtl = direction === 'rtl'
              if (Math.abs(dx) > 40) {
                // Swipe left = next page in ltr.
                ;(dx < 0) !== rtl ? forward() : back()
                return
              }
              // Tap: right half turns forward, left half goes back.
              const rect = e.currentTarget.getBoundingClientRect()
              const rightHalf = e.clientX > rect.left + rect.width / 2
              rightHalf !== rtl ? forward() : back()
            }}>
            <div key={view} className={cn('ui-comic-spread', turn === 'next' ? 'dl-page-next' : 'dl-page-prev')}>
              {ordered.map((i) => (
                <img
                  key={i}
                  src={pages[i].src}
                  alt={pages[i].alt ?? `Page ${i + 1}`}
                  draggable={false}
                  className={cn('ui-comic-page', currentView.length > 1 && 'ui-comic-page-half')}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Previous page"
              className="ui-comic-turn left-2"
              disabled={direction === 'rtl' ? view >= views.length - 1 : view === 0}
              onPointerUp={(e) => e.stopPropagation()}
              onClick={direction === 'rtl' ? forward : back}>
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next page"
              className="ui-comic-turn right-2"
              disabled={direction === 'rtl' ? view === 0 : view >= views.length - 1}
              onPointerUp={(e) => e.stopPropagation()}
              onClick={direction === 'rtl' ? back : forward}>
              <ChevronRight className="size-5" />
            </button>
          </div>
          <div className="ui-comic-progress" aria-hidden>
            <div style={{ width: `${((view + 1) / views.length) * 100}%` }} />
          </div>
          <div className="ui-comic-thumbs" role="tablist" aria-label="Pages">
            {pages.map((p, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={currentView.includes(i)}
                aria-label={`Page ${i + 1}`}
                onClick={() => goToPage(i)}
                className="ui-comic-thumb">
                <img src={p.src} alt="" loading="lazy" draggable={false} />
                <span>{i + 1}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="ui-comic-scroll">
          {pages.map((p, i) => (
            <div key={i} ref={(el) => {
                scrollRefs.current[i] = el
              }} data-page={i} className="relative">
              <img src={p.src} alt={p.alt ?? `Page ${i + 1}`} loading={i < 2 ? 'eager' : 'lazy'} className="block w-full" />
              <span className="ui-comic-page-number">{i + 1}</span>
            </div>
          ))}
          <p className="py-8 text-center text-sm text-[var(--muted-foreground)]">End of chapter</p>
        </div>
      )}
    </div>
  )
}
