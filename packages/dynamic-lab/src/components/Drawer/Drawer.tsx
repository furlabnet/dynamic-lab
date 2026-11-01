'use client'

import React, { useEffect } from 'react'

import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

import { useScrollLock } from '../../lib/hooks'
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

  const sideClasses = {
    right:
      'inset-y-0 right-0 h-full w-full max-w-md border-l border-[var(--glass-border)] dl-animate-slide-right',
    left: 'inset-y-0 left-0 h-full w-full max-w-md border-r border-[var(--glass-border)] dl-animate-slide-left',
    top: 'inset-x-0 top-0 w-full max-h-[80vh] border-b border-[var(--glass-border)] dl-animate-slide-top',
    bottom:
      'inset-x-0 bottom-0 w-full max-h-[80vh] border-t border-[var(--glass-border)] rounded-t-[var(--radius-3xl)] dl-animate-slide-bottom',
  }

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div onClick={onClose} className="ui-overlay dl-animate-fade fixed inset-0" />

      {/* Drawer Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'ui-drawer fixed z-50 flex flex-col overflow-y-auto p-6',
          sideClasses[side],
          className
        )}>
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div className="flex flex-col gap-1">
            {title && <h3 className="ui-section-title text-lg font-bold">{title}</h3>}
            {description && <p className="body-sm text-[var(--muted-foreground)]">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="inline-flex size-8 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 py-4 text-sm">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] pt-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
