import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useScrollLock } from '../../lib/hooks'

export interface MediaItem {
  src: string
  /** Larger image for the lightbox; falls back to `src`. */
  fullSrc?: string
  alt?: string
  caption?: string
}

export interface LightboxProps {
  items: MediaItem[]
  index: number | null
  onIndexChange: (index: number | null) => void
}

/** Full-screen image viewer with arrow-key and button navigation. */
export function Lightbox({ items, index, onIndexChange }: LightboxProps) {
  const open = index !== null
  useScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onIndexChange(null)
      else if (e.key === 'ArrowRight') onIndexChange(((index ?? 0) + 1) % items.length)
      else if (e.key === 'ArrowLeft') onIndexChange(((index ?? 0) - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, index, items.length, onIndexChange])

  if (index === null) return null
  const item = items[index]

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.alt ?? 'Image viewer'}
      className="dl-animate-fade fixed inset-0 z-[70] flex flex-col bg-black/90"
      onClick={(e) => e.target === e.currentTarget && onIndexChange(null)}>
      <div className="flex items-center justify-between p-4 text-sm text-white/80">
        <span className="tabular-nums">
          {index + 1} / {items.length}
        </span>
        <button type="button" aria-label="Close" onClick={() => onIndexChange(null)} className="ui-lightbox-button">
          <X className="size-5" />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4" onClick={(e) => e.target === e.currentTarget && onIndexChange(null)}>
        <img key={index} src={item.fullSrc ?? item.src} alt={item.alt ?? ''} className="dl-animate-pop max-h-full max-w-full rounded-[var(--radius-lg)] object-contain" />
        {items.length > 1 && (
          <>
            <button type="button" aria-label="Previous image" onClick={() => onIndexChange((index - 1 + items.length) % items.length)} className="ui-lightbox-button absolute left-4 top-1/2 -translate-y-1/2">
              <ChevronLeft className="size-6" />
            </button>
            <button type="button" aria-label="Next image" onClick={() => onIndexChange((index + 1) % items.length)} className="ui-lightbox-button absolute right-4 top-1/2 -translate-y-1/2">
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </div>
      {item.caption && <p className="px-4 pb-6 text-center text-sm text-white/80">{item.caption}</p>}
    </div>
    ,
    document.body
  )
}

export interface MediaGalleryProps {
  items: MediaItem[]
  /** Thumbnail columns from md up (two on small screens). */
  columns?: 2 | 3 | 4
  aspect?: 'video' | 'square' | 'portrait'
  className?: string
}

const columnClasses = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' }
const aspectClasses = { video: 'aspect-video', square: 'aspect-square', portrait: 'aspect-[3/4]' }

/** A grid of thumbnails that open in a Lightbox. */
export function MediaGallery({ items, columns = 3, aspect = 'video', className }: MediaGalleryProps) {
  const [index, setIndex] = useState<number | null>(null)
  return (
    <>
      <div className={cn('grid grid-cols-2 gap-3', columnClasses[columns], className)}>
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Open ${item.alt ?? `image ${i + 1}`}`}
            className={cn('ui-media-thumb', aspectClasses[aspect])}>
            <img src={item.src} alt={item.alt ?? ''} loading="lazy" />
          </button>
        ))}
      </div>
      <Lightbox items={items} index={index} onIndexChange={setIndex} />
    </>
  )
}
