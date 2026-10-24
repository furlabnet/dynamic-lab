import React, { useId, useRef, useState } from 'react'
import { Bold, Heading2, Italic, Link2, List, Minus, Quote } from 'lucide-react'
import { cn } from '../../lib/utils'
import { SegmentedControl } from '../SegmentedControl'

/* --------------------------------------------------------- Rendering */

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  // **bold**, *italic*, [label](url). Only http(s), mailto and in-page (#) links are kept.
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g)
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={key}>{part.slice(2, -2)}</strong>
    if (/^\*[^*]+\*$/.test(part)) return <em key={key}>{part.slice(1, -1)}</em>
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
    if (link) {
      const safe = /^(https?:|mailto:|#)/.test(link[2])
      return safe ? (
        <a key={key} href={link[2]} className="text-[var(--primary)] underline" target={link[2].startsWith('#') ? undefined : '_blank'} rel="noreferrer">
          {link[1]}
        </a>
      ) : (
        link[1]
      )
    }
    return part
  })
}

/** Renders a small Markdown subset (headings, quotes, lists, rules, bold, italic, links) as React nodes. No HTML is injected. */
export function renderMarkdown(source: string): React.ReactNode {
  const blocks = source.replace(/\r\n/g, '\n').split(/\n{2,}/).map((b) => b.trim()).filter(Boolean)
  return blocks.map((block, i) => {
    const key = `b${i}`
    if (/^-{3,}$/.test(block)) return <hr key={key} />
    if (block.startsWith('### ')) return <h3 key={key}>{renderInline(block.slice(4), key)}</h3>
    if (block.startsWith('## ') || block.startsWith('# ')) return <h2 key={key}>{renderInline(block.replace(/^#+\s/, ''), key)}</h2>
    if (block.split('\n').every((l) => l.startsWith('> ')))
      return <blockquote key={key}>{renderInline(block.split('\n').map((l) => l.slice(2)).join(' '), key)}</blockquote>
    if (block.split('\n').every((l) => /^[-*] /.test(l)))
      return (
        <ul key={key} className="list-disc pl-6">
          {block.split('\n').map((l, j) => (
            <li key={j}>{renderInline(l.slice(2), `${key}-${j}`)}</li>
          ))}
        </ul>
      )
    return <p key={key}>{renderInline(block.replace(/\n/g, ' '), key)}</p>
  })
}

export function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

/* ------------------------------------------------------------ Editor */

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
  const ref = useRef<HTMLTextAreaElement>(null)

  /** Wraps the selection (or inserts a placeholder) and restores a sensible selection. */
  const apply = (kind: 'bold' | 'italic' | 'heading' | 'quote' | 'list' | 'rule' | 'link') => {
    const el = ref.current
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
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
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
                onClick={() => apply(t.kind)}
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
            ref={ref}
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
                apply(tool.kind)
              }
            }}
            className="ui-md-textarea"
          />
        ) : (
          <div className={cn('ui-prose ui-md-preview', previewClassName)} style={previewStyle}>
            {value.trim() ? renderMarkdown(value) : <p className="text-[var(--muted-foreground)]">Nothing to preview yet.</p>}
          </div>
        )}
      </div>
      <div className="flex justify-between gap-3 text-xs">
        {error ? (
          <span className="font-medium text-[var(--destructive)]">{error}</span>
        ) : (
          <span className="text-[var(--muted-foreground)]">{helperText}</span>
        )}
        {showWordCount && <span className="shrink-0 tabular-nums text-[var(--muted-foreground)]">{countWords(value).toLocaleString()} words</span>}
      </div>
    </div>
  )
}
