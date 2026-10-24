import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Minus, Plus, Type } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button, IconButton } from '../Button'
import { Popover } from '../Popover'
import { SegmentedControl } from '../SegmentedControl'
import { Select } from '../Forms'

/* ------------------------------------------------------------ Progress */

/**
 * How far the reader has scrolled through `ref` (0–100): 0 when its top reaches the top of the
 * viewport (minus `topOffset`, the height of sticky chrome), 100 when its bottom reaches the bottom.
 */
export function useReadingProgress(ref: React.RefObject<HTMLElement | null>, topOffset = 96) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const total = rect.height - (window.innerHeight - topOffset)
        const read = topOffset - rect.top
        setProgress(total <= 0 ? (rect.top <= topOffset ? 100 : 0) : Math.min(100, Math.max(0, (read / total) * 100)))
      })
    }
    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    const observer = new ResizeObserver(measure)
    if (ref.current) observer.observe(ref.current)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      observer.disconnect()
    }
  }, [ref, topOffset])

  return progress
}

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
  const left = minutes !== undefined ? Math.max(0, Math.ceil(minutes * (1 - value / 100))) : undefined
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
          {Math.round(value)}%{left !== undefined && ` · ${value >= 100 ? 'finished' : `${left} min left`}`}
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

const FONT_STACKS: Record<ReaderFont, string> = {
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

/** Reader preferences persisted in localStorage (falls back to memory when storage is blocked). */
export function useReaderPrefs(storageKey = 'dynamic-lab-reader') {
  const [prefs, setPrefs] = useState<ReaderPrefs>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) return { ...DEFAULT_READER_PREFS, ...JSON.parse(saved) }
    } catch {
      // Storage unavailable: use defaults.
    }
    return DEFAULT_READER_PREFS
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(prefs))
    } catch {
      // Ignore: preferences just won't persist.
    }
  }, [prefs, storageKey])

  return [prefs, setPrefs] as const
}

export interface ReaderSettingsProps {
  value: ReaderPrefs
  onChange: (prefs: ReaderPrefs) => void
  minFontSize?: number
  maxFontSize?: number
  align?: 'start' | 'end'
}

/** "Aa" popover with font size, family, line spacing and column width. */
export function ReaderSettings({ value, onChange, minFontSize = 14, maxFontSize = 28, align = 'end' }: ReaderSettingsProps) {
  const set = <K extends keyof ReaderPrefs>(key: K, v: ReaderPrefs[K]) => onChange({ ...value, [key]: v })

  return (
    <Popover
      align={align}
      aria-label="Reading settings"
      className="ui-menu w-72 p-4!"
      trigger={
        <Button variant="secondary" size="sm" aria-label="Reading settings" leftIcon={<Type className="size-4" />}>
          Aa
        </Button>
      }>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="button-sm">Text size</span>
          <div className="flex items-center gap-2">
            <IconButton
              aria-label="Smaller text"
              size="icon"
              icon={<Minus className="size-4" />}
              disabled={value.fontSize <= minFontSize}
              onClick={() => set('fontSize', Math.max(minFontSize, value.fontSize - 1))}
            />
            <input
              type="range"
              min={minFontSize}
              max={maxFontSize}
              value={value.fontSize}
              aria-label="Text size"
              onChange={(e) => set('fontSize', Number(e.target.value))}
              className="ui-range flex-1"
            />
            <IconButton
              aria-label="Larger text"
              size="icon"
              icon={<Plus className="size-4" />}
              disabled={value.fontSize >= maxFontSize}
              onClick={() => set('fontSize', Math.min(maxFontSize, value.fontSize + 1))}
            />
            <span className="w-9 text-right text-sm tabular-nums text-[var(--muted-foreground)]">{value.fontSize}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="button-sm">Font</span>
          <SegmentedControl
            fullWidth
            aria-label="Font"
            value={value.fontFamily}
            onValueChange={(v) => set('fontFamily', v as ReaderFont)}
            options={[
              { value: 'serif', label: <span style={{ fontFamily: FONT_STACKS.serif }}>Serif</span> },
              { value: 'sans', label: 'Sans' },
              { value: 'mono', label: <span style={{ fontFamily: FONT_STACKS.mono }}>Mono</span> },
            ]}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="button-sm">Line spacing</span>
          <SegmentedControl
            fullWidth
            size="sm"
            aria-label="Line spacing"
            value={value.lineHeight}
            onValueChange={(v) => set('lineHeight', v as ReaderPrefs['lineHeight'])}
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'normal', label: 'Normal' },
              { value: 'relaxed', label: 'Relaxed' },
            ]}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="button-sm">Width</span>
          <SegmentedControl
            fullWidth
            size="sm"
            aria-label="Column width"
            value={value.width}
            onValueChange={(v) => set('width', v as ReaderPrefs['width'])}
            options={[
              { value: 'narrow', label: 'Narrow' },
              { value: 'wide', label: 'Wide' },
            ]}
          />
        </div>
        <Button size="sm" variant="ghost" className="self-start" onClick={() => onChange(DEFAULT_READER_PREFS)}>
          Reset to defaults
        </Button>
      </div>
    </Popover>
  )
}

/* ------------------------------------------------------------ Chapters */

export interface ChapterNavProps {
  chapters: Array<{ id: string; title: string }>
  current: number
  onChange: (index: number) => void
  /** `full` shows Previous / Next labels; `compact` is icons plus the picker. */
  variant?: 'full' | 'compact'
  className?: string
}

export function ChapterNav({ chapters, current, onChange, variant = 'full', className }: ChapterNavProps) {
  const prev = current > 0 ? current - 1 : null
  const next = current < chapters.length - 1 ? current + 1 : null

  return (
    <nav aria-label="Chapters" className={cn('flex items-center gap-2', className)}>
      {variant === 'full' ? (
        <Button variant="secondary" size="sm" leftIcon={<ChevronLeft className="size-4" />} disabled={prev === null} onClick={() => prev !== null && onChange(prev)}>
          Previous
        </Button>
      ) : (
        <IconButton aria-label="Previous chapter" size="icon" icon={<ChevronLeft className="size-4" />} disabled={prev === null} onClick={() => prev !== null && onChange(prev)} />
      )}
      <Select
        aria-label="Chapter"
        containerClassName="min-w-0 flex-1"
        className="h-[var(--control-compact)] py-0"
        value={String(current)}
        onChange={(e) => onChange(Number(e.target.value))}
        options={chapters.map((c, i) => ({ value: String(i), label: `${i + 1}. ${c.title}` }))}
      />
      {variant === 'full' ? (
        <Button variant="secondary" size="sm" rightIcon={<ChevronRight className="size-4" />} disabled={next === null} onClick={() => next !== null && onChange(next)}>
          Next
        </Button>
      ) : (
        <IconButton aria-label="Next chapter" size="icon" icon={<ChevronRight className="size-4" />} disabled={next === null} onClick={() => next !== null && onChange(next)} />
      )}
    </nav>
  )
}
