import React from 'react'

import { cn } from '../../lib/utils'

export function MenuSeparator({ className }: { className?: string }) {
  return <div className={cn('my-1 h-px bg-[var(--border)]', className)} role="separator" />
}

export function MenuLabel({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'px-3 pt-2 pb-1 text-[11px] font-bold tracking-wider text-[var(--muted-foreground)] uppercase',
        className
      )}>
      {children}
    </div>
  )
}
