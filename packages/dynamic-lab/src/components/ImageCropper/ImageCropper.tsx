'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { ZoomIn, ZoomOut } from 'lucide-react'

import { useLatestRef } from '../../lib/hooks'
import { cn } from '../../lib/utils'
import { Slider } from '../Slider'

/** The part of the original image to keep, in the image's own pixels. */
export interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export interface ImageCropperProps {
  /** Image URL or object URL (URL.createObjectURL(file)). */
  src: string
  /** Width / height of the crop: 1 for avatars, 3 for banners. */
  aspect?: number
  /** Show a round guide, for avatars. The crop itself is still a rectangle. */
  shape?: 'rect' | 'circle'
  maxZoom?: number
  /** Called whenever the crop changes, with the area in the image's pixels. */
  onCropChange?: (area: CropArea) => void
  /** Hide the zoom slider (pinch, scroll and +/- keys still zoom). */
  hideZoom?: boolean
  className?: string
  /** Accessible name for the crop area. */
  label?: string
}

interface Size {
  w: number
  h: number
}

/**
 * Frame part of an image by dragging and zooming, for avatars and banners. Drag or use the arrow
 * keys to move, and scroll, pinch, the slider or + / - to zoom. Pair with `cropImage` to get the
 * result as a Blob for upload.
 */
export function ImageCropper({
  src,
  aspect = 1,
  shape = 'rect',
  maxZoom = 4,
  onCropChange,
  hideZoom = false,
  className,
  label = 'Crop area. Drag or use arrow keys to move, plus and minus to zoom.',
}: ImageCropperProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [frame, setFrame] = useState<Size>({ w: 0, h: 0 })
  const [natural, setNatural] = useState<Size>({ w: 0, h: 0 })
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinch = useRef<{ dist: number; zoom: number } | null>(null)
  const onCropRef = useLatestRef(onCropChange)

  const base = natural.w && frame.w ? Math.max(frame.w / natural.w, frame.h / natural.h) : 1
  const scale = base * zoom
  const dw = natural.w * scale
  const dh = natural.h * scale

  const clamp = useCallback(
    (o: { x: number; y: number }, z = zoom) => {
      const s = base * z
      const mx = Math.max(0, (natural.w * s - frame.w) / 2)
      const my = Math.max(0, (natural.h * s - frame.h) / 2)
      return { x: Math.max(-mx, Math.min(mx, o.x)), y: Math.max(-my, Math.min(my, o.y)) }
    },
    [base, natural, frame, zoom]
  )

  const setZoomClamped = useCallback(
    (z: number) => {
      const next = Math.max(1, Math.min(maxZoom, z))
      setZoom(next)
      setOffset((o) => clamp(o, next))
    },
    [maxZoom, clamp]
  )

  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const r = entry!.contentRect
      setFrame({ w: r.width, h: r.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Reset when the image changes (adjusting state during render, so there's no extra pass).
  const [prevSrc, setPrevSrc] = useState(src)
  if (src !== prevSrc) {
    setPrevSrc(src)
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }

  // Scroll to zoom. A native listener, because React's wheel listener is passive.
  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      setZoomClamped(zoom * Math.exp(-e.deltaY * 0.0015))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoom, setZoomClamped])

  useEffect(() => {
    if (!natural.w || !frame.w) return
    onCropRef.current?.({
      x: Math.round(((dw - frame.w) / 2 - offset.x) / scale),
      y: Math.round(((dh - frame.h) / 2 - offset.y) / scale),
      width: Math.round(frame.w / scale),
      height: Math.round(frame.h / scale),
    })
  }, [offset, scale, dw, dh, frame, natural, onCropRef])

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      pinch.current = { dist: Math.hypot(a!.x - b!.x, a!.y - b!.y), zoom }
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId)
    if (!prev) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()]
      const dist = Math.hypot(a!.x - b!.x, a!.y - b!.y)
      setZoomClamped((pinch.current.zoom * dist) / pinch.current.dist)
      return
    }
    setOffset((o) => clamp({ x: o.x + e.clientX - prev.x, y: o.y + e.clientY - prev.y }))
  }

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinch.current = null
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 40 : 10
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [step, 0],
      ArrowRight: [-step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
    }
    if (moves[e.key]) {
      e.preventDefault()
      const [dx, dy] = moves[e.key]!
      setOffset((o) => clamp({ x: o.x + dx, y: o.y + dy }))
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault()
      setZoomClamped(zoom * 1.15)
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault()
      setZoomClamped(zoom / 1.15)
    }
  }

  return (
    <div className={cn('flex w-full flex-col gap-3', className)}>
      <div
        ref={frameRef}
        role="application"
        aria-label={label}
        aria-roledescription="image cropper"
        tabIndex={0}
        data-shape={shape}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className="dl-cropper"
        style={{ aspectRatio: String(aspect) }}>
        <img
          src={src}
          alt=""
          draggable={false}
          onLoad={(e) =>
            setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
          }
          className="dl-cropper-image"
          style={{
            width: dw || undefined,
            height: dh || undefined,
            transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
          }}
        />
        <div className="dl-cropper-guide" aria-hidden="true" />
      </div>
      {!hideZoom && (
        <div className="flex items-center gap-3">
          <ZoomOut className="size-4 shrink-0 text-[var(--muted-foreground)]" aria-hidden="true" />
          <Slider
            aria-label="Zoom"
            min={1}
            max={maxZoom}
            step={0.01}
            value={zoom}
            onValueChange={setZoomClamped}
          />
          <ZoomIn className="size-4 shrink-0 text-[var(--muted-foreground)]" aria-hidden="true" />
        </div>
      )}
    </div>
  )
}

export interface CropImageOptions {
  /** Output width in pixels; height follows the crop's shape. Defaults to the crop's own width. */
  width?: number
  /** e.g. 'image/webp'. Defaults to 'image/png'. */
  type?: string
  /** 0–1, for lossy types. */
  quality?: number
}

/**
 * Cuts `area` out of the image at `src` and returns it as a Blob, ready to upload. The image must
 * be same-origin or served with CORS headers, or the browser won't let the canvas export it.
 */
export async function cropImage(
  src: string,
  area: CropArea,
  { width, type = 'image/png', quality }: CropImageOptions = {}
): Promise<Blob> {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = src
  await img.decode()
  const outW = Math.round(width ?? area.width)
  const outH = Math.round((outW * area.height) / area.width)
  const canvas = document.createElement('canvas')
  canvas.width = outW
  canvas.height = outH
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D is not available')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, outW, outH)
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Could not export image'))),
      type,
      quality
    )
  )
}
