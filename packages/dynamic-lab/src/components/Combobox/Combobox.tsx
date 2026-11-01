'use client'

import React, { useEffect, useId, useMemo, useRef, useState } from 'react'

import { Check, ChevronDown, Loader2, Plus, X } from 'lucide-react'
import { createPortal } from 'react-dom'

import { floatingStyle, useFloating } from '../../lib/floating'
import { useDismiss } from '../../lib/hooks'
import { cn } from '../../lib/utils'

export interface ComboboxOption {
  value: string
  label: string
  description?: string
  /** Icon or avatar before the label. */
  icon?: React.ReactNode
  /** Options with the same group are listed under a heading. */
  group?: string
  disabled?: boolean
}

interface ComboboxBaseProps {
  options: ComboboxOption[]
  placeholder?: string
  /** Shown when nothing matches. */
  emptyText?: React.ReactNode
  /** Visible label above the field. */
  label?: React.ReactNode
  'aria-label'?: string
  /** The text typed into the field, for loading options from a server as the user types. */
  inputValue?: string
  onInputChange?: (value: string) => void
  /**
   * How options are matched to the text. Pass `false` when you filter on the server and `options`
   * already holds the matches. The default matches label and description, ignoring case and accents.
   */
  filter?: false | ((option: ComboboxOption, query: string) => boolean)
  /** Show a spinner in the list, e.g. while results load. */
  loading?: boolean
  /** Offer to create the typed text when no option matches it exactly (new tags, new names). */
  onCreate?: (label: string) => void
  disabled?: boolean
  error?: boolean
  id?: string
  className?: string
}

export interface ComboboxSingleProps extends ComboboxBaseProps {
  multiple?: false
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
}

export interface ComboboxMultipleProps extends ComboboxBaseProps {
  multiple: true
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** Most options that can be picked. */
  max?: number
}

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps

const normalise = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const defaultFilter = (o: ComboboxOption, q: string) => {
  const query = normalise(q.trim())
  return !query || normalise(`${o.label} ${o.description ?? ''}`).includes(query)
}

/**
 * A text field with a filtered list of options: pick a tag, a creator, a species. Type to filter,
 * arrow keys to move, Enter to pick. With `multiple`, picks show as chips in the field; with
 * `onCreate`, people can add an option that isn't in the list.
 */
export function Combobox(props: ComboboxProps) {
  const {
    options,
    placeholder = 'Search…',
    emptyText = 'No matches',
    label,
    inputValue: inputProp,
    onInputChange,
    filter = defaultFilter,
    loading = false,
    onCreate,
    disabled = false,
    error = false,
    id,
    className,
  } = props

  const autoId = useId()
  const inputId = id ?? autoId
  const listId = `${inputId}-list`

  // Selection, controlled or not, normalised to an array.
  const [internal, setInternal] = useState<string[]>(() => {
    const d = props.defaultValue
    return Array.isArray(d) ? d : d ? [d] : []
  })
  const controlled = props.value !== undefined
  const selected: string[] = controlled
    ? Array.isArray(props.value)
      ? props.value
      : props.value
        ? [props.value]
        : []
    : internal

  const commit = (next: string[]) => {
    if (!controlled) setInternal(next)
    if (props.multiple) props.onValueChange?.(next)
    else props.onValueChange?.(next[0] ?? null)
  }

  const [query, setQueryState] = useState('')
  const text = inputProp ?? query
  const setQuery = (q: string) => {
    setActive(0)
    if (inputProp === undefined) setQueryState(q)
    onInputChange?.(q)
  }

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  /** Opens the list with the first option highlighted. */
  const openList = () => {
    if (open) return
    setActive(0)
    setOpen(true)
  }
  const fieldRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const position = useFloating(fieldRef, panelRef, open, { matchWidth: true })

  useDismiss([fieldRef, panelRef], open, () => {
    setOpen(false)
    if (!props.multiple) setQuery('')
  })

  const byValue = useMemo(() => new Map(options.map((o) => [o.value, o])), [options])
  const selectedLabel = !props.multiple && selected[0] ? byValue.get(selected[0])?.label : undefined

  const filtered = useMemo(
    () => (filter === false ? options : options.filter((o) => filter(o, text))),
    [options, filter, text]
  )
  const trimmed = text.trim()
  const canCreate =
    Boolean(onCreate) &&
    trimmed.length > 0 &&
    !options.some((o) => normalise(o.label) === normalise(trimmed))
  const atMax = props.multiple && props.max !== undefined && selected.length >= props.max

  // Rows in display order: options (grouped), then the "create" row.
  const rows: Array<{ kind: 'option'; option: ComboboxOption } | { kind: 'create' }> =
    useMemo(() => {
      const groups = new Map<string, ComboboxOption[]>()
      for (const o of filtered) {
        const g = o.group ?? ''
        groups.set(g, [...(groups.get(g) ?? []), o])
      }
      const list: Array<{ kind: 'option'; option: ComboboxOption } | { kind: 'create' }> = []
      for (const opts of groups.values())
        for (const o of opts) list.push({ kind: 'option', option: o })
      if (canCreate) list.push({ kind: 'create' })
      return list
    }, [filtered, canCreate])

  // Options can shrink under the highlight (e.g. results from a server), so keep it in range.
  const highlighted = Math.min(active, Math.max(rows.length - 1, 0))

  useEffect(() => {
    if (!open) return
    panelRef.current
      ?.querySelector(`[data-index="${highlighted}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [highlighted, open])

  const choose = (row: (typeof rows)[number] | undefined) => {
    if (!row) return
    if (row.kind === 'create') {
      onCreate?.(trimmed)
      setQuery('')
      return
    }
    const { option } = row
    if (option.disabled) return
    if (props.multiple) {
      const has = selected.includes(option.value)
      if (!has && atMax) return
      commit(has ? selected.filter((v) => v !== option.value) : [...selected, option.value])
      setQuery('')
    } else {
      commit([option.value])
      setQuery('')
      setOpen(false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) openList()
      else setActive((a) => Math.min(a + 1, rows.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      if (open && rows.length) {
        e.preventDefault()
        choose(rows[highlighted])
      }
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault()
        setOpen(false)
      }
    } else if (e.key === 'Backspace' && props.multiple && !text && selected.length) {
      commit(selected.slice(0, -1))
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  let lastGroup: string | undefined
  const activeRow = rows[highlighted]
  const activeId = open && activeRow ? `${listId}-${highlighted}` : undefined

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </label>
      )}
      <div
        ref={fieldRef}
        data-open={open || undefined}
        aria-invalid={error || undefined}
        className={cn('form-input dl-combobox-field', disabled && 'cursor-not-allowed opacity-50')}
        onMouseDown={(e) => {
          if (disabled) return
          if (e.target !== inputRef.current) e.preventDefault()
          inputRef.current?.focus()
          openList()
        }}>
        {props.multiple &&
          selected.map((v) => {
            const o = byValue.get(v)
            return (
              <span key={v} className="dl-combobox-chip">
                {o?.icon && <span className="inline-flex [&>svg]:size-3.5">{o.icon}</span>}
                {o?.label ?? v}
                <button
                  type="button"
                  aria-label={`Remove ${o?.label ?? v}`}
                  disabled={disabled}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => commit(selected.filter((x) => x !== v))}>
                  <X className="size-3" />
                </button>
              </span>
            )
          })}
        <input
          ref={inputRef}
          id={inputId}
          role="combobox"
          aria-label={props['aria-label']}
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          autoComplete="off"
          disabled={disabled}
          value={open || props.multiple ? text : (selectedLabel ?? '')}
          placeholder={props.multiple && selected.length ? '' : (selectedLabel ?? placeholder)}
          onChange={(e) => {
            setQuery(e.target.value)
            openList()
          }}
          onFocus={openList}
          onKeyDown={onKeyDown}
          className="dl-combobox-input"
        />
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'size-4 shrink-0 text-[var(--muted-foreground)] transition-transform',
            open && 'rotate-180'
          )}
        />
      </div>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            style={floatingStyle(position)}
            className={cn(
              'ui-menu z-[80] max-w-[min(28rem,calc(100vw-1rem))]',
              position && 'dl-animate-pop'
            )}>
            <ul
              id={listId}
              role="listbox"
              aria-multiselectable={props.multiple || undefined}
              aria-label={typeof label === 'string' ? label : props['aria-label']}
              className="max-h-72 overflow-y-auto overscroll-contain">
              {rows.map((row, i) => {
                if (row.kind === 'create') {
                  return (
                    <li
                      key="__create"
                      id={`${listId}-${i}`}
                      data-index={i}
                      role="option"
                      aria-selected={false}
                      data-active={i === highlighted || undefined}
                      onMouseEnter={() => setActive(i)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => choose(row)}
                      className="ui-menu-item dl-combobox-option">
                      <Plus className="size-4 text-[var(--primary)]" />
                      <span>
                        Create <strong>“{trimmed}”</strong>
                      </span>
                    </li>
                  )
                }
                const { option } = row
                const isSelected = selected.includes(option.value)
                const showGroup = option.group && option.group !== lastGroup
                lastGroup = option.group
                const blocked = option.disabled || (!isSelected && atMax)
                return (
                  <React.Fragment key={option.value}>
                    {showGroup && (
                      <li role="presentation" className="dl-combobox-group">
                        {option.group}
                      </li>
                    )}
                    <li
                      id={`${listId}-${i}`}
                      data-index={i}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={blocked || undefined}
                      data-active={i === highlighted || undefined}
                      onMouseEnter={() => setActive(i)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => !blocked && choose(row)}
                      className={cn(
                        'ui-menu-item dl-combobox-option',
                        blocked && 'cursor-not-allowed opacity-45'
                      )}>
                      {option.icon && <span className="ui-menu-item-icon">{option.icon}</span>}
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate">{option.label}</span>
                        {option.description && (
                          <span className="truncate text-xs text-[var(--muted-foreground)]">
                            {option.description}
                          </span>
                        )}
                      </span>
                      {isSelected && <Check className="size-4 shrink-0 text-[var(--primary)]" />}
                    </li>
                  </React.Fragment>
                )
              })}
            </ul>
            {loading && (
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--muted-foreground)]">
                <Loader2 className="size-4 animate-spin" /> Loading…
              </div>
            )}
            {!loading && rows.length === 0 && (
              <div className="px-3 py-2 text-sm text-[var(--muted-foreground)]">{emptyText}</div>
            )}
          </div>,
          document.body
        )}
    </div>
  )
}
