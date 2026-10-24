import React, { useId, useState } from 'react'
import { ChevronLeft, ChevronRight, ImagePlus, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { DragHandle, SortableList } from './SortableList'

export interface UploadedImage {
  id: string
  src: string
  name?: string
  size?: number
}

export interface ImageUploaderProps {
  value: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  label?: string
  helperText?: string
  error?: string
  multiple?: boolean
  max?: number
  accept?: string
  aspect?: 'portrait' | 'square' | 'video' | 'page'
  /** Badge on the first image, e.g. "Cover". Omit to hide. */
  firstLabel?: string
  /** Number each image, e.g. comic pages. */
  numbered?: boolean
  /** Word used in labels: "image", "page", "screenshot"… */
  noun?: string
  className?: string
}

const aspectClasses = {
  portrait: 'aspect-[3/4]',
  square: 'aspect-square',
  video: 'aspect-video',
  page: 'aspect-[5/7]',
}

function toUploads(files: FileList | File[]): UploadedImage[] {
  return Array.from(files)
    .filter((f) => f.type.startsWith('image/'))
    .map((file) => ({
      id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 7)}`,
      src: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }))
}

/**
 * Multi-image picker with previews: drop or browse to add, drag (or arrow keys on the handle) to
 * reorder, × to remove. Previews use object URLs; upload the files yourself on save.
 */
export function ImageUploader({
  value,
  onChange,
  label,
  helperText,
  error,
  multiple = true,
  max,
  accept = 'image/*',
  aspect = 'portrait',
  firstLabel,
  numbered = false,
  noun = 'image',
  className,
}: ImageUploaderProps) {
  const inputId = useId()
  const [dragging, setDragging] = useState(false)
  const full = max !== undefined && value.length >= max

  const add = (files: FileList | File[] | null) => {
    if (!files) return
    let next = toUploads(files)
    if (!multiple) next = next.slice(0, 1)
    const combined = multiple ? [...value, ...next] : next
    onChange(max ? combined.slice(0, max) : combined)
  }

  const remove = (id: string) => {
    const image = value.find((v) => v.id === id)
    if (image?.src.startsWith('blob:')) URL.revokeObjectURL(image.src)
    onChange(value.filter((v) => v.id !== id))
  }

  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {label && (
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor={inputId} className="button-sm text-[var(--foreground)]">
            {label}
          </label>
          {value.length > 0 && (
            <span className="text-xs text-[var(--muted-foreground)]">
              {value.length}
              {max ? ` / ${max}` : ''} {value.length === 1 ? noun : `${noun}s`}
            </span>
          )}
        </div>
      )}

      {value.length > 0 && (
        <SortableList
          layout="grid"
          className={
            aspect === 'video'
              ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-3 sm:grid-cols-5 xl:grid-cols-6'
          }
          items={value}
          getKey={(i) => i.id}
          getLabel={(_i, idx) => `${noun} ${idx + 1}`}
          onReorder={onChange}
          renderItem={(image, api) => (
            <figure className={cn('ui-upload-tile', aspectClasses[aspect])}>
              <img
                src={image.src}
                alt={image.name ?? `${noun} ${api.index + 1}`}
                draggable={false}
              />
              <div className="ui-upload-tile-top">
                <DragHandle {...api.handleProps} className="ui-upload-tile-button" />
                {api.index === 0 && firstLabel ? (
                  <span className="ui-badge ui-badge-solid ui-badge-sm">{firstLabel}</span>
                ) : numbered ? (
                  <span className="ui-badge ui-badge-sm bg-black/60 text-white">
                    {api.index + 1}
                  </span>
                ) : null}
                <button
                  type="button"
                  aria-label={`Remove ${noun} ${api.index + 1}`}
                  onClick={() => remove(image.id)}
                  className="ui-upload-tile-button ml-auto">
                  <X className="size-3.5" />
                </button>
              </div>
              <div className="ui-upload-tile-bottom">
                <button
                  type="button"
                  aria-label="Move earlier"
                  disabled={api.isFirst}
                  onClick={api.moveUp}
                  className="ui-upload-tile-button">
                  <ChevronLeft className="size-3.5" />
                </button>
                {numbered && firstLabel && api.index > 0 && (
                  <span className="text-[11px] font-bold text-white">{api.index + 1}</span>
                )}
                <button
                  type="button"
                  aria-label="Move later"
                  disabled={api.isLast}
                  onClick={api.moveDown}
                  className="ui-upload-tile-button">
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </figure>
          )}
        />
      )}

      {!full && (
        <label
          htmlFor={inputId}
          data-dragging={dragging || undefined}
          onDragOver={(e) => {
            // Only react to files, not to tiles being reordered.
            if (!e.dataTransfer.types.includes('Files')) return
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            if (!e.dataTransfer.files.length) return
            e.preventDefault()
            setDragging(false)
            add(e.dataTransfer.files)
          }}
          className={cn(
            'ui-dropzone',
            value.length > 0 && 'py-5!',
            error && 'border-[var(--destructive)]'
          )}>
          <input
            id={inputId}
            type="file"
            accept={accept}
            multiple={multiple}
            className="sr-only"
            onChange={(e) => {
              add(e.target.files)
              e.target.value = ''
            }}
          />
          <ImagePlus className="size-6 text-[var(--primary)]" aria-hidden />
          <span className="text-sm font-semibold">
            {value.length
              ? multiple
                ? `Add more ${noun}s`
                : `Replace ${noun}`
              : `Drop ${multiple ? `${noun}s` : `a ${noun}`} here or `}
            {!value.length && <span className="text-[var(--primary)]">browse</span>}
          </span>
          {helperText && (
            <span className="text-xs text-[var(--muted-foreground)]">{helperText}</span>
          )}
        </label>
      )}
      {error && <p className="text-xs font-medium text-[var(--destructive)]">{error}</p>}
    </div>
  )
}
