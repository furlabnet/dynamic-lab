'use client'

import { Check, Copy, X } from 'lucide-react'

import { useCopyToClipboard } from '../../lib/hooks'
import { cn } from '../../lib/utils'

export interface Swatch {
  /** Any CSS colour; hex is what people copy. */
  color: string
  /** e.g. "Main fur", "Eyes". */
  name?: string
}

export interface ColorSwatchProps extends Swatch {
  size?: 'sm' | 'md' | 'lg'
  /** Click copies the colour. */
  copyable?: boolean
  className?: string
}

/** One colour chip with its name and value. Click to copy the value. */
export function ColorSwatch({
  color,
  name,
  size = 'md',
  copyable = true,
  className,
}: ColorSwatchProps) {
  const { status, copy } = useCopyToClipboard(1400)
  const Icon = { idle: Copy, copied: Check, failed: X }[status]
  const content = (
    <>
      <span className="dl-swatch-chip" data-size={size} style={{ background: color }}>
        {copyable && (
          <span className="dl-swatch-copy" aria-hidden="true">
            <Icon className="size-3.5" />
          </span>
        )}
      </span>
      <span className="flex min-w-0 flex-col text-left">
        {name && <span className="truncate text-xs font-semibold">{name}</span>}
        <span className="truncate font-mono text-xs text-[var(--muted-foreground)]">{color}</span>
      </span>
    </>
  )

  if (!copyable) return <div className={cn('dl-swatch', className)}>{content}</div>

  return (
    <button
      type="button"
      className={cn('dl-swatch', className)}
      data-status={status}
      aria-label={`${name ? `${name}, ` : ''}${color}. ${{ idle: 'Copy', copied: 'Copied', failed: 'Couldn’t copy; the value is shown' }[status]}`}
      onClick={() => copy(color)}>
      {content}
    </button>
  )
}
