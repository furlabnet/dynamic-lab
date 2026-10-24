import React, { useId, useMemo, useRef, useState } from 'react'
import { cn } from '../../lib/utils'
import { Tag, TAG_CATEGORY_LABELS, formatTagName, type TagCategory, type TagItem } from '../Tag'

const CATEGORIES = Object.keys(TAG_CATEGORY_LABELS) as TagCategory[]

/** "Species:Red Fox" → { category: 'species', name: 'red_fox' }. Unknown prefixes stay in the name. */
export function parseTag(raw: string, defaultCategory: TagCategory = 'general'): TagItem | null {
  let text = raw.trim().toLowerCase()
  if (!text) return null
  let category = defaultCategory
  const match = text.match(/^([a-z]+):(.+)$/)
  if (match && (CATEGORIES as string[]).includes(match[1])) {
    category = match[1] as TagCategory
    text = match[2]
  }
  const name = text.trim().replace(/\s+/g, '_').replace(/[^\p{L}\p{N}_()'\-.]/gu, '')
  return name ? { name, category } : null
}

export interface TagInputProps {
  value: TagItem[]
  onChange: (tags: TagItem[]) => void
  /** Known tags offered while typing (e.g. the site's most used tags). */
  suggestions?: TagItem[]
  label?: string
  placeholder?: string
  /** Shows a reminder until this many tags are added. */
  minTags?: number
  maxTags?: number
  defaultCategory?: TagCategory
  error?: string
  id?: string
  className?: string
}

/**
 * Booru-style tag entry. Type a tag and press Enter, comma or Tab. Prefix with a category
 * (`artist:`, `character:`, `species:`, `copyright:`, `lore:`, `meta:`) to file it there.
 * Backspace in an empty field removes the last tag.
 */
export function TagInput({
  value,
  onChange,
  suggestions = [],
  label,
  placeholder = 'Add tags…',
  minTags,
  maxTags,
  defaultCategory = 'general',
  error,
  id,
  className,
}: TagInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const listId = `${inputId}-list`
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  const full = maxTags !== undefined && value.length >= maxTags
  const typed = parseTag(text, defaultCategory)

  const matches = useMemo(() => {
    if (!typed) return []
    const prefixed = /^[a-z]+:/.test(text.trim().toLowerCase())
    return suggestions
      .filter((s) => !value.some((v) => v.name === s.name))
      .filter((s) => s.name.includes(typed.name) && (!prefixed || s.category === typed.category))
      .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
      .slice(0, 8)
  }, [typed, text, suggestions, value])

  const merge = (current: TagItem[], tags: TagItem[]) =>
    tags.reduce((list, tag) => {
      if (maxTags !== undefined && list.length >= maxTags) return list
      const existing = list.findIndex((v) => v.name === tag.name)
      // Re-adding a tag with a different category moves it.
      return existing >= 0 ? list.map((v, i) => (i === existing ? { ...v, category: tag.category } : v)) : [...list, tag]
    }, current)

  const add = (tag: TagItem | null) => {
    if (!tag || full) return
    onChange(merge(value, [tag]))
    setText('')
    setActive(-1)
  }

  /** Pasted (or otherwise inserted) text with commas or newlines becomes several tags at once. */
  const onTextChange = (next: string) => {
    if (/[,\n]/.test(next)) {
      const parts = next.split(/[,\n]/)
      const rest = parts.pop() ?? ''
      const tags = parts.map((p) => parseTag(p, defaultCategory)).filter((t): t is TagItem => t !== null)
      if (tags.length) onChange(merge(value, tags))
      setText(rest)
    } else {
      setText(next)
    }
    setOpen(true)
    setActive(-1)
  }

  const remove = (name: string) => onChange(value.filter((v) => v.name !== name))

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && matches.length) {
      e.preventDefault()
      setOpen(true)
      setActive((i) => (i + 1) % matches.length)
    } else if (e.key === 'ArrowUp' && matches.length) {
      e.preventDefault()
      setActive((i) => (i <= 0 ? matches.length - 1 : i - 1))
    } else if (e.key === 'Enter' || e.key === ',' || (e.key === 'Tab' && text.trim())) {
      if (!text.trim()) return
      e.preventDefault()
      add(open && active >= 0 && matches[active] ? matches[active] : typed)
    } else if (e.key === 'Backspace' && !text && value.length) {
      remove(value[value.length - 1].name)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const needMore = minTags !== undefined && value.length < minTags

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="button-sm text-[var(--foreground)]">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className={cn('ui-tag-input', error && 'border-[var(--destructive)]')}
          onClick={() => inputRef.current?.focus()}>
          {value.map((tag) => (
            <Tag key={tag.name} name={tag.name} category={tag.category} onRemove={remove} />
          ))}
          <input
            ref={inputRef}
            id={inputId}
            value={text}
            disabled={full}
            onChange={(e) => onTextChange(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            placeholder={full ? `Limit of ${maxTags} reached` : value.length ? '' : placeholder}
            role="combobox"
            aria-expanded={open && matches.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
            aria-invalid={Boolean(error)}
            className="min-w-[8rem] flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-[var(--muted-foreground)]"
          />
        </div>
        {open && matches.length > 0 && (
          <ul id={listId} role="listbox" className="ui-menu dl-animate-pop absolute inset-x-0 top-full z-40 mt-1 max-h-64 overflow-y-auto">
            {matches.map((s, i) => (
              <li
                key={`${s.category}-${s.name}`}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => {
                  e.preventDefault()
                  add(s)
                }}
                onMouseMove={() => setActive(i)}
                className={cn('ui-menu-item justify-between', i === active && 'bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)]')}>
                <span className="ui-tag border-0! bg-transparent! p-0!" data-category={s.category}>
                  {formatTagName(s.name)}
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {TAG_CATEGORY_LABELS[s.category ?? 'general']}
                  {s.count !== undefined && ` · ${s.count.toLocaleString()}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error ? (
        <p className="text-xs font-medium text-[var(--destructive)]">{error}</p>
      ) : (
        <p className={cn('text-xs', needMore ? 'text-[var(--status-warning-ink)]' : 'text-[var(--muted-foreground)]')}>
          {value.length} {value.length === 1 ? 'tag' : 'tags'}
          {needMore && ` · add at least ${minTags} so people can find this`}
          {' · '}prefix with <code>artist:</code>, <code>character:</code>, <code>species:</code>, <code>copyright:</code>, <code>lore:</code> or <code>meta:</code>
        </p>
      )}
    </div>
  )
}
