import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  side?: 'left' | 'right' | 'top' | 'bottom'
  title?: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function Drawer({
  open,
  onClose,
  side = 'right',
  title,
  description,
  children,
  footer,
  className,
}: DrawerProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  const sideClasses = {
    right: 'inset-y-0 right-0 h-full w-full max-w-md border-l border-[var(--glass-border)] animate-in slide-in-from-right duration-200',
    left: 'inset-y-0 left-0 h-full w-full max-w-md border-r border-[var(--glass-border)] animate-in slide-in-from-left duration-200',
    top: 'inset-x-0 top-0 w-full max-h-[80vh] border-b border-[var(--glass-border)] animate-in slide-in-from-top duration-200',
    bottom: 'inset-x-0 bottom-0 w-full max-h-[80vh] border-t border-[var(--glass-border)] rounded-t-[var(--radius-3xl)] animate-in slide-in-from-bottom duration-200',
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[color-mix(in_srgb,var(--background)_70%,transparent)] backdrop-blur-md transition-opacity duration-200"
      />

      {/* Drawer Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'fixed z-50 flex flex-col bg-[color-mix(in_srgb,var(--card)_92%,transparent)] backdrop-blur-[var(--blur-chrome)] shadow-2xl p-6 overflow-y-auto',
          sideClasses[side],
          className
        )}>
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div className="flex flex-col gap-1">
            {title && <h3 className="ui-section-title font-bold text-lg">{title}</h3>}
            {description && <p className="body-sm text-[var(--muted-foreground)]">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 py-4 text-sm">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
