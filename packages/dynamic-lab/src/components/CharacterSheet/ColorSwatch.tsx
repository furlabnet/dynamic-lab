'use client'

import { useState } from 'react'

import { Check, Copy } from 'lucide-react'

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
  const [copied, setCopied] = useState(false)
  const content = (
    <>
      <span className="dl-swatch-chip" data-size={size} style={{ background: color }}>
        {copyable && (
          <span className="dl-swatch-copy" aria-hidden="true">
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
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
      aria-label={`${name ? `${name}, ` : ''}${color}. ${copied ? 'Copied' : 'Copy'}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(color)
          setCopied(true)
          setTimeout(() => setCopied(false), 1400)
        } catch {
          // Clipboard can be blocked (insecure context, permissions); the value is still visible.
        }
      }}>
      {content}
    </button>
  )
}
