import React from 'react'

import { cn } from '../../lib/utils'

export interface ReadingProgressProps {
  /** 0–100, e.g. from useReadingProgress. */
  value: number
  /** Estimated minutes for the whole text; shows "N min left". */
  minutes?: number
  label?: string
  className?: string
}

/** A thin bar pinned under the header that fills as you read. */
export function ReadingProgress({ value, minutes, label, className }: ReadingProgressProps) {
  const left =
    minutes !== undefined ? Math.max(0, Math.ceil(minutes * (1 - value / 100))) : undefined
  return (
    <div className={cn('ui-reading-progress', className)}>
      <div
        role="progressbar"
        aria-label={label ?? 'Reading progress'}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        className="ui-reading-progress-track">
        <div className="ui-reading-progress-fill" style={{ width: `${value}%` }} />
      </div>
      <div className="ui-reading-progress-meta">
        {label && <span className="truncate">{label}</span>}
        <span className="ml-auto tabular-nums">
          {Math.round(value)}%
          {left !== undefined && ` · ${value >= 100 ? 'finished' : `${left} min left`}`}
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ Settings */

export type ReaderFont = 'serif' | 'sans' | 'mono'

export interface ReaderPrefs {
  fontSize: number
  fontFamily: ReaderFont
  lineHeight: 'compact' | 'normal' | 'relaxed'
  width: 'narrow' | 'wide'
}

export const DEFAULT_READER_PREFS: ReaderPrefs = {
  fontSize: 19,
  fontFamily: 'serif',
  lineHeight: 'normal',
  width: 'narrow',
}

export const FONT_STACKS: Record<ReaderFont, string> = {
  serif: "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, 'Times New Roman', serif",
  sans: 'var(--font-sans)',
  mono: "ui-monospace, 'SF Mono', 'Cascadia Code', Menlo, Consolas, monospace",
}

const LINE_HEIGHTS = { compact: 1.5, normal: 1.75, relaxed: 2 }

/** Inline style for the text column, from the reader's preferences. */
export function readerStyle(prefs: ReaderPrefs): React.CSSProperties {
  return {
    fontSize: `${prefs.fontSize}px`,
    fontFamily: FONT_STACKS[prefs.fontFamily],
    lineHeight: LINE_HEIGHTS[prefs.lineHeight],
    maxWidth: prefs.width === 'narrow' ? '38rem' : '52rem',
  }
}
