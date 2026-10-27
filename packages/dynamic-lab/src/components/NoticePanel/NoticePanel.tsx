import React from 'react'
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react'
import { cn } from '../../lib/utils'

export type NoticeTone = 'info' | 'success' | 'warning' | 'destructive' | 'danger'

export interface NoticePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: NoticeTone
  title?: string
  icon?: React.ReactNode
  onDismiss?: () => void
}

const toneIcons: Record<string, React.ReactNode> = {
  info: <Info className="size-5 shrink-0 text-[var(--info)]" />,
  success: <CheckCircle2 className="size-5 shrink-0 text-[var(--status-success-ink)]" />,
  warning: <AlertTriangle className="size-5 shrink-0 text-[var(--status-warning-ink)]" />,
  destructive: <AlertCircle className="size-5 shrink-0 text-[var(--status-danger-ink)]" />,
  danger: <AlertCircle className="size-5 shrink-0 text-[var(--status-danger-ink)]" />,
}

export function NoticePanel({
  className,
  tone = 'info',
  title,
  icon,
  onDismiss,
  children,
  ...props
}: NoticePanelProps) {
  const resolvedTone = tone === 'danger' ? 'destructive' : tone

  return (
    <div
      role="alert"
      data-tone={resolvedTone}
      className={cn('notice-panel relative justify-between', className)}
      {...props}>
      <div className="flex items-start gap-3">
        {icon !== undefined ? icon : toneIcons[tone]}
        <div className="flex flex-col gap-0.5">
          {title && <h5 className="font-semibold text-sm leading-tight">{title}</h5>}
          <div className="text-sm opacity-95">{children}</div>
        </div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="inline-flex items-center justify-center -mr-1 -mt-1 size-6 rounded-md opacity-60 hover:opacity-100 hover:bg-[color-mix(in_srgb,var(--foreground)_10%,transparent)] transition-all">
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
