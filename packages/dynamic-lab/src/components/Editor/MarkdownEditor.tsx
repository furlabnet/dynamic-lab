'use client'

import React, { useId, useState } from 'react'

import { Bold, Heading2, Italic, Link2, List, Minus, Quote } from 'lucide-react'

import { cn } from '../../lib/utils'
import { SegmentedControl } from '../SegmentedControl'
import { countWords, renderMarkdown } from './markdown'

export interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  rows?: number
  helperText?: string
  error?: string
  /** Class for the preview pane, e.g. to match the reader's typography. */
  previewClassName?: string
  previewStyle?: React.CSSProperties
  showWordCount?: boolean
  id?: string
  className?: string
}

/** A Markdown textarea with a formatting toolbar and a live preview. */
export function MarkdownEditor({
  value,
  onChange,
  label,
  placeholder = 'Write here… Markdown works: **bold**, *italic*, ## Heading, > quote',
  rows = 12,
  helperText,
  error,
  previewClassName,
  previewStyle,
  showWordCount = true,
  id,
  className,
}: MarkdownEditorProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const [view, setView] = useState('write')
  /**
   * Wraps the selection (or inserts a placeholder) and restores a sensible selection. Takes the
   * textarea from the event, so the toolbar and the keyboard shortcuts share it without a ref.
   */
  const apply = (
    kind: 'bold' | 'italic' | 'heading' | 'quote' | 'list' | 'rule' | 'link',
    el: HTMLTextAreaElement | null | undefined
  ) => {
    if (!el) return
    const { selectionStart: start, selectionEnd: end } = el
    const selected = value.slice(start, end)
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    let next = value
    let selStart = start
    let selEnd = end

    const wrap = (mark: string, fallback: string) => {
      const inner = selected || fallback
      next = value.slice(0, start) + mark + inner + mark + value.slice(end)
      selStart = start + mark.length
      selEnd = selStart + inner.length
    }
    const prefixLines = (prefix: string) => {
      const block = value.slice(lineStart, end) || 'Text'
      const prefixed = block
        .split('\n')
        .map((l) => (l.startsWith(prefix) ? l : prefix + l))
        .join('\n')
      next = value.slice(0, lineStart) + prefixed + value.slice(end)
      selStart = lineStart
      selEnd = lineStart + prefixed.length
    }

    if (kind === 'bold') wrap('**', 'bold text')
    else if (kind === 'italic') wrap('*', 'italic text')
    else if (kind === 'heading') prefixLines('## ')
    else if (kind === 'quote') prefixLines('> ')
    else if (kind === 'list') prefixLines('- ')
    else if (kind === 'rule') {
      next = `${value.slice(0, end)}\n\n---\n\n${value.slice(end)}`
      selStart = selEnd = end + 7
    } else if (kind === 'link') {
      const text = selected || 'link text'
      const insert = `[${text}](https://)`
      next = value.slice(0, start) + insert + value.slice(end)
      selStart = start + text.length + 3
      selEnd = selStart + 8
    }

    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(selStart, selEnd)
    })
  }

  const tools = [
    { kind: 'bold' as const, label: 'Bold', icon: <Bold />, shortcut: 'b' },
    { kind: 'italic' as const, label: 'Italic', icon: <Italic />, shortcut: 'i' },
    { kind: 'heading' as const, label: 'Heading', icon: <Heading2 /> },
    { kind: 'quote' as const, label: 'Quote', icon: <Quote /> },
    { kind: 'list' as const, label: 'List', icon: <List /> },
    { kind: 'link' as const, label: 'Link', icon: <Link2 />, shortcut: 'k' },
    { kind: 'rule' as const, label: 'Scene break', icon: <Minus /> },
  ]

  return (
    <div data-md-editor="" className={cn('flex w-full flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="button-sm text-[var(--foreground)]">
          {label}
        </label>
      )}
      <div className={cn('ui-md-editor', error && 'border-[var(--destructive)]')}>
        <div className="ui-md-toolbar">
          {view === 'write' &&
            tools.map((t) => (
              <button
                key={t.kind}
                type="button"
                title={t.shortcut ? `${t.label} (Ctrl/⌘ ${t.shortcut.toUpperCase()})` : t.label}
                aria-label={t.label}
                onClick={(e) =>
                  apply(
                    t.kind,
                    e.currentTarget.closest('[data-md-editor]')?.querySelector('textarea')
                  )
                }
                className="ui-md-tool">
                {t.icon}
              </button>
            ))}
          <SegmentedControl
            size="sm"
            className="ml-auto"
            aria-label="Editor view"
            value={view}
            onValueChange={setView}
            options={[
              { value: 'write', label: 'Write' },
              { value: 'preview', label: 'Preview' },
            ]}
          />
        </div>
        {view === 'write' ? (
          <textarea
            id={inputId}
            rows={rows}
            value={value}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (!(e.metaKey || e.ctrlKey)) return
              const tool = tools.find((t) => t.shortcut === e.key.toLowerCase())
              if (tool) {
                e.preventDefault()
                apply(tool.kind, e.currentTarget)
              }
            }}
            className="ui-md-textarea"
          />
        ) : (
          <div className={cn('ui-prose ui-md-preview', previewClassName)} style={previewStyle}>
            {value.trim() ? (
              renderMarkdown(value)
            ) : (
              <p className="text-[var(--muted-foreground)]">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-between gap-3 text-xs">
        {error ? (
          <span className="font-medium text-[var(--destructive)]">{error}</span>
        ) : (
          <span className="text-[var(--muted-foreground)]">{helperText}</span>
        )}
        {showWordCount && (
          <span className="shrink-0 text-[var(--muted-foreground)] tabular-nums">
            {countWords(value).toLocaleString()} words
          </span>
        )}
      </div>
    </div>
  )
}
