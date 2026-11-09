'use client'

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'

import { cn } from '../../lib/utils'

export type ToastTone = 'default' | 'success' | 'warning' | 'destructive' | 'info'

export interface ToastOptions {
  id?: string
  title?: string
  description: string
  tone?: ToastTone
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastOptions[]>([])
  // Each toast is shown → (paused while hovered or focused) → dismissed. Its timer lives here so
  // dismissing early, pausing or unmounting never leaves one running.
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  const stopTimer = useCallback((id: string) => {
    const timer = timers.current.get(id)
    if (timer) clearTimeout(timer)
    timers.current.delete(id)
  }, [])

  const dismiss = useCallback(
    (id: string) => {
      stopTimer(id)
      setToasts((prev) => prev.filter((t) => t.id !== id))
    },
    [stopTimer]
  )

  const startTimer = useCallback(
    (id: string, duration: number) => {
      stopTimer(id)
      if (duration > 0)
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), duration)
        )
    },
    [dismiss, stopTimer]
  )

  useEffect(() => {
    const map = timers.current
    return () => {
      map.forEach(clearTimeout)
      map.clear()
    }
  }, [])

  const toast = useCallback(
    ({ duration = 4000, ...options }: ToastOptions) => {
      const id = options.id || Math.random().toString(36).substring(2, 9)
      const newToast: ToastOptions = { ...options, id, duration }

      // Showing a toast with an id already on screen replaces it rather than stacking a copy.
      setToasts((prev) => [...prev.filter((t) => t.id !== id), newToast])
      startTimer(id, duration)
    },
    [startTimer]
  )

  // Leaving restarts the full duration: someone who stopped to read gets the whole time again.
  const pause = (t: ToastOptions) => t.id && stopTimer(t.id)
  const resume = (t: ToastOptions) => t.id && startTimer(t.id, t.duration ?? 4000)

  const toneIcons: Record<ToastTone, React.ReactNode> = {
    default: null,
    success: <CheckCircle2 className="size-5 shrink-0 text-[var(--status-success-ink)]" />,
    warning: <AlertTriangle className="size-5 shrink-0 text-[var(--status-warning-ink)]" />,
    destructive: <AlertCircle className="size-5 shrink-0 text-[var(--status-danger-ink)]" />,
    info: <Info className="size-5 shrink-0 text-[var(--info)]" />,
  }

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {/* Toast viewport */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-2.5">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            onPointerEnter={() => pause(t)}
            onPointerLeave={(e) => {
              if (!e.currentTarget.contains(document.activeElement)) resume(t)
            }}
            onFocus={() => pause(t)}
            onBlur={(e) => {
              const to = e.relatedTarget as Node | null
              if (!e.currentTarget.contains(to) && !e.currentTarget.matches(':hover')) resume(t)
            }}
            className={cn(
              'dl-animate-toast pointer-events-auto flex items-start justify-between gap-3 rounded-[var(--radius-xl)] border border-[var(--glass-border)] bg-[color-mix(in_srgb,var(--card)_92%,transparent)] p-4 shadow-2xl backdrop-blur-[var(--blur-chrome)] select-none'
            )}>
            <div className="flex min-w-0 flex-1 items-start gap-3">
              {t.tone && toneIcons[t.tone]}
              <div className="flex flex-col gap-0.5">
                {t.title && (
                  <h5 className="text-sm leading-tight font-bold text-[var(--foreground)]">
                    {t.title}
                  </h5>
                )}
                <p className="text-xs leading-snug text-[var(--muted-foreground)]">
                  {t.description}
                </p>
                {t.action && (
                  <button
                    type="button"
                    onClick={() => {
                      t.action?.onClick()
                      if (t.id) dismiss(t.id)
                    }}
                    className="mt-1 text-left text-xs font-bold text-[var(--primary)] hover:underline">
                    {t.action.label}
                  </button>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => t.id && dismiss(t.id)}
              aria-label="Dismiss notification"
              className="inline-flex size-5 items-center justify-center rounded-md opacity-50 transition-opacity hover:bg-[var(--muted)] hover:opacity-100">
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
