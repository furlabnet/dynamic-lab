import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CornerDownLeft, Search, SearchX } from 'lucide-react'
import { cn } from '../../lib/utils'
import { isMacPlatform, useScrollLock } from '../../lib/hooks'
import { Kbd } from '../Kbd'

export interface CommandItem {
  id: string
  label: string
  group?: string
  description?: string
  icon?: React.ReactNode
  /** Extra words that should match, e.g. ["preferences"] for "Site settings". */
  keywords?: string[]
  shortcut?: string[]
  onSelect: () => void
}

export interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: CommandItem[]
  placeholder?: string
  emptyMessage?: string
  /** Register ⌘K / Ctrl+K to toggle the palette. Default true. */
  hotkey?: boolean
}

function matches(item: CommandItem, query: string) {
  if (!query) return true
  const haystack = [item.label, item.group, item.description, ...(item.keywords ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((word) => haystack.includes(word))
}

/** A ⌘K quick-jump dialog: type to filter, arrow keys to move, Enter to run. */
export function CommandPalette({
  open,
  onOpenChange,
  items,
  placeholder = 'Jump to a page or action…',
  emptyMessage = 'Nothing matches that search.',
  hotkey = true,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const listId = useId()

  useScrollLock(open)

  useEffect(() => {
    if (!hotkey) return
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hotkey, open, onOpenChange])

  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement as HTMLElement | null
      setQuery('')
      setActiveIndex(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    } else {
      restoreFocusRef.current?.focus?.()
    }
  }, [open])

  const filtered = useMemo(
    () => items.filter((item) => matches(item, query.trim())),
    [items, query]
  )

  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>()
    for (const item of filtered) {
      const key = item.group ?? ''
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(item)
    }
    return Array.from(map.entries())
  }, [filtered])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  if (!open) return null

  const run = (item: CommandItem | undefined) => {
    if (!item) return
    onOpenChange(false)
    item.onSelect()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(filtered[activeIndex])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onOpenChange(false)
    }
  }

  let index = -1

  return createPortal(
    <div
      className="ui-overlay dl-animate-fade fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false)
      }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={onKeyDown}
        className="ui-dialog dl-animate-pop flex w-full max-w-xl flex-col overflow-hidden p-0!">
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4">
          <Search className="size-4 shrink-0 text-[var(--muted-foreground)]" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={
              filtered[activeIndex] ? `${listId}-${filtered[activeIndex].id}` : undefined
            }
            className="h-14 flex-1 bg-transparent text-[15px] text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
          />
          <Kbd>Esc</Kbd>
        </div>

        <div
          ref={listRef}
          id={listId}
          role="listbox"
          className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center text-sm text-[var(--muted-foreground)]">
              <SearchX className="size-6" aria-hidden />
              {emptyMessage}
            </div>
          ) : (
            groups.map(([group, groupItems]) => (
              <div
                key={group || 'default'}
                role="group"
                aria-label={group || undefined}
                className="mb-1">
                {group && (
                  <div className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    {group}
                  </div>
                )}
                {groupItems.map((item) => {
                  index += 1
                  const itemIndex = index
                  const active = itemIndex === activeIndex
                  return (
                    <div
                      key={item.id}
                      id={`${listId}-${item.id}`}
                      role="option"
                      aria-selected={active}
                      data-index={itemIndex}
                      onMouseMove={() => setActiveIndex(itemIndex)}
                      onClick={() => run(item)}
                      className={cn('ui-command-item', active && 'ui-command-item-active')}>
                      {item.icon && <span className="ui-command-item-icon">{item.icon}</span>}
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium">{item.label}</span>
                        {item.description && (
                          <span className="truncate text-xs text-[var(--muted-foreground)]">
                            {item.description}
                          </span>
                        )}
                      </span>
                      {item.shortcut ? (
                        <Kbd keys={item.shortcut} />
                      ) : (
                        active && (
                          <CornerDownLeft
                            className="size-3.5 text-[var(--muted-foreground)]"
                            aria-hidden
                          />
                        )
                      )}
                    </div>
                  )
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-[var(--border)] px-4 py-2.5 text-xs text-[var(--muted-foreground)]">
          <span className="inline-flex items-center gap-1.5">
            <Kbd keys={['↑', '↓']} /> to move
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Kbd>↵</Kbd> to open
          </span>
        </div>
      </div>
    </div>,
    document.body
  )
}

export interface CommandTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
}

/** The "Jump to… ⌘K" search-styled button that opens a CommandPalette. */
export function CommandTrigger({ className, label = 'Jump to…', ...props }: CommandTriggerProps) {
  const [mac, setMac] = useState(true)
  useEffect(() => setMac(isMacPlatform()), [])

  return (
    <button type="button" className={cn('ui-command-trigger', className)} {...props}>
      <Search className="size-4 shrink-0" aria-hidden />
      <span className="ui-nav-text flex-1 truncate text-left">{label}</span>
      <Kbd className="ui-nav-text">{mac ? '⌘K' : 'Ctrl K'}</Kbd>
    </button>
  )
}
