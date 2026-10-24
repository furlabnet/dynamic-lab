import React, { useEffect } from 'react'
import { useScrollLock } from '../../lib/hooks'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
  className,
}: DialogProps) {
  useScrollLock(open)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 ui-overlay dl-animate-fade">
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'ui-dialog dl-animate-pop relative flex flex-col gap-4 w-full sm:p-7',
          maxWidthClasses[maxWidth],
          className
        )}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            {title && <h3 className="ui-section-title font-bold text-lg">{title}</h3>}
            {description && <p className="body-sm text-[var(--muted-foreground)]">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            <X className="size-4" />
          </button>
        </div>

        {children && <div className="py-2 text-sm">{children}</div>}

        {footer && (
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
