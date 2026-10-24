import React, { useId, useState } from 'react'
import { UploadCloud, X } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  helperText?: string
  error?: string
  /** `dropzone` draws a large drag-and-drop target; `inline` is the compact native-style picker. */
  variant?: 'inline' | 'dropzone'
  onFilesChange?: (files: File[]) => void
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    { label, helperText, error, variant = 'inline', onFilesChange, className, id, multiple, accept, disabled, ...props },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id || generatedId
    const [files, setFiles] = useState<File[]>([])
    const [dragging, setDragging] = useState(false)

    const update = (list: FileList | null) => {
      const next = list ? Array.from(list) : []
      setFiles(next)
      onFilesChange?.(next)
    }

    const describedBy = error || helperText ? `${inputId}-help` : undefined

    return (
      <div className={cn('flex w-full flex-col gap-1.5', className)}>
        {label && (
          <label htmlFor={inputId} className="button-sm text-[var(--foreground)]">
            {label}
          </label>
        )}

        {variant === 'inline' ? (
          <input
            ref={ref}
            id={inputId}
            type="file"
            multiple={multiple}
            accept={accept}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            onChange={(e) => update(e.target.files)}
            className="ui-file-input"
            {...props}
          />
        ) : (
          <label
            htmlFor={inputId}
            data-dragging={dragging || undefined}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              if (!disabled) update(e.dataTransfer.files)
            }}
            className={cn('ui-dropzone', error && 'border-[var(--destructive)]', disabled && 'pointer-events-none opacity-50')}>
            <input
              ref={ref}
              id={inputId}
              type="file"
              multiple={multiple}
              accept={accept}
              disabled={disabled}
              aria-invalid={Boolean(error)}
              aria-describedby={describedBy}
              onChange={(e) => update(e.target.files)}
              className="sr-only"
              {...props}
            />
            <span className="ui-hero-icon size-12! rounded-[var(--radius-xl)]!">
              <UploadCloud className="size-5" />
            </span>
            <span className="text-sm font-semibold text-[var(--foreground)]">
              Drop {multiple ? 'files' : 'a file'} here or <span className="text-[var(--primary)]">browse</span>
            </span>
            {accept && <span className="text-xs text-[var(--muted-foreground)]">{accept.split(',').join(', ')}</span>}
          </label>
        )}

        {variant === 'dropzone' && files.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {files.map((file, i) => (
              <li
                key={`${file.name}-${i}`}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm">
                <span className="truncate font-medium">{file.name}</span>
                <span className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                  {formatSize(file.size)}
                  <button
                    type="button"
                    aria-label={`Remove ${file.name}`}
                    onClick={() => {
                      const next = files.filter((_, j) => j !== i)
                      setFiles(next)
                      onFilesChange?.(next)
                    }}
                    className="inline-flex size-6 items-center justify-center rounded-md hover:bg-[var(--muted)]">
                    <X className="size-3.5" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}

        {error ? (
          <p id={describedBy} className="text-xs font-medium text-[var(--destructive)]">
            {error}
          </p>
        ) : helperText ? (
          <p id={describedBy} className="text-xs text-[var(--muted-foreground)]">
            {helperText}
          </p>
        ) : null}
      </div>
    )
  }
)

FileInput.displayName = 'FileInput'
