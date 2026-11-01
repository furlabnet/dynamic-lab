'use client'

import React, { useEffect, useId, useMemo, useRef, useState } from 'react'

import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { createPortal } from 'react-dom'

import { floatingStyle, useFloating } from '../../lib/floating'
import { toDateKey } from '../../lib/format'
import { useDismiss } from '../../lib/hooks'
import { cn } from '../../lib/utils'

/* ------------------------------------------------------------ Dates */

export interface DateRange {
  from: Date | null
  to: Date | null
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const addMonths = (d: Date, n: number) => {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1)
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last))
}
const sameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  Boolean(a && b) &&
  a!.getFullYear() === b!.getFullYear() &&
  a!.getMonth() === b!.getMonth() &&
  a!.getDate() === b!.getDate()

function localeWeekStart(locale?: string): number {
  try {
    const loc = new Intl.Locale(locale ?? navigator.language) as Intl.Locale & {
      weekInfo?: { firstDay: number }
      getWeekInfo?: () => { firstDay: number }
    }
    const first = loc.getWeekInfo?.().firstDay ?? loc.weekInfo?.firstDay
    if (first) return first % 7
  } catch {
    // Older engines: fall through.
  }
  return 1
}

/* ---------------------------------------------------------- Calendar */

interface CalendarBaseProps {
  /** Month shown first. Defaults to the selected date's month, or today's. */
  defaultMonth?: Date
  minDate?: Date
  maxDate?: Date
  /** Return true to make a day unpickable (fully booked, in the past…). */
  isDateDisabled?: (date: Date) => boolean
  /** Days with something on them get a dot; the number is read out, e.g. "2 releases". */
  events?: Record<string, number>
  /** What `events` counts, for screen readers. */
  eventLabel?: string
  /** BCP 47 locale for month and day names. Defaults to the browser's. */
  locale?: string
  /** 0 = Sunday … 6 = Saturday. Defaults to the locale's first day of the week. */
  weekStartsOn?: number
  className?: string
}

export interface CalendarSingleProps extends CalendarBaseProps {
  mode?: 'single'
  value?: Date | null
  defaultValue?: Date | null
  onValueChange?: (value: Date | null) => void
}

export interface CalendarRangeProps extends CalendarBaseProps {
  mode: 'range'
  value?: DateRange
  defaultValue?: DateRange
  onValueChange?: (value: DateRange) => void
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps

/**
 * A month grid for picking a day or a range: scheduling a release, booking a commission slot.
 * Arrow keys move by day and week, Page Up / Page Down by month (with Shift, by year), Home / End
 * to the start and end of the week.
 */
export function Calendar(props: CalendarProps) {
  const {
    defaultMonth,
    minDate,
    maxDate,
    isDateDisabled,
    events,
    eventLabel = 'events',
    locale,
    weekStartsOn,
    className,
  } = props
  const isRange = props.mode === 'range'
  const today = startOfDay(new Date())

  const [internalSingle, setInternalSingle] = useState<Date | null>(
    !isRange ? ((props as CalendarSingleProps).defaultValue ?? null) : null
  )
  const [internalRange, setInternalRange] = useState<DateRange>(
    isRange
      ? ((props as CalendarRangeProps).defaultValue ?? { from: null, to: null })
      : { from: null, to: null }
  )
  const single = !isRange
    ? (props as CalendarSingleProps).value !== undefined
      ? (props as CalendarSingleProps).value!
      : internalSingle
    : null
  const range = isRange
    ? ((props as CalendarRangeProps).value ?? internalRange)
    : { from: null, to: null }

  const anchor = single ?? range.from ?? defaultMonth ?? today
  const [month, setMonth] = useState(() => new Date(anchor.getFullYear(), anchor.getMonth(), 1))
  const [focused, setFocused] = useState<Date>(() => startOfDay(anchor))
  const [hovered, setHovered] = useState<Date | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const shouldFocus = useRef(false)
  const labelId = useId()

  const firstDay = weekStartsOn ?? localeWeekStart(locale)
  const fmtMonth = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
    [locale]
  )
  const fmtFull = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: 'full' }), [locale])
  const weekdays = useMemo(() => {
    const short = new Intl.DateTimeFormat(locale, { weekday: 'narrow' })
    const long = new Intl.DateTimeFormat(locale, { weekday: 'long' })
    // 2023-01-01 was a Sunday.
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(2023, 0, 1 + ((i + firstDay) % 7))
      return { short: short.format(d), long: long.format(d) }
    })
  }, [locale, firstDay])

  const disabled = (d: Date) =>
    (minDate && d < startOfDay(minDate)) ||
    (maxDate && d > startOfDay(maxDate)) ||
    Boolean(isDateDisabled?.(d))

  // Six weeks, starting on the first day of the week that contains the 1st.
  const days = useMemo(() => {
    const offset = (month.getDay() - firstDay + 7) % 7
    const start = addDays(month, -offset)
    return Array.from({ length: 42 }, (_, i) => addDays(start, i))
  }, [month, firstDay])

  const moveFocus = (d: Date) => {
    setFocused(d)
    if (d.getMonth() !== month.getMonth() || d.getFullYear() !== month.getFullYear()) {
      setMonth(new Date(d.getFullYear(), d.getMonth(), 1))
    }
    shouldFocus.current = true
  }

  useEffect(() => {
    if (!shouldFocus.current) return
    shouldFocus.current = false
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-day="${toDateKey(focused)}"]`)?.focus()
  }, [focused, month])

  const pick = (d: Date) => {
    if (disabled(d)) return
    setFocused(d)
    if (!isRange) {
      const p = props as CalendarSingleProps
      const next = sameDay(single, d) ? null : d
      if (p.value === undefined) setInternalSingle(next)
      p.onValueChange?.(next)
      return
    }
    const p = props as CalendarRangeProps
    let next: DateRange
    if (!range.from || range.to) next = { from: d, to: null }
    else if (d < range.from) next = { from: d, to: range.from }
    else next = { from: range.from, to: d }
    if (p.value === undefined) setInternalRange(next)
    p.onValueChange?.(next)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const map: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => addDays(focused, -((focused.getDay() - firstDay + 7) % 7)),
      End: () => addDays(focused, 6 - ((focused.getDay() - firstDay + 7) % 7)),
      PageUp: () => addMonths(focused, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focused, e.shiftKey ? 12 : 1),
    }
    const go = map[e.key]
    if (go) {
      e.preventDefault()
      moveFocus(go())
    }
  }

  const previewTo = isRange && range.from && !range.to ? hovered : null
  const inRange = (d: Date) => {
    const from = range.from
    const to = range.to ?? previewTo
    if (!from || !to) return false
    const [a, b] = from <= to ? [from, to] : [to, from]
    return d >= a && d <= b
  }

  const focusTarget = days.some((d) => sameDay(d, focused)) ? focused : month

  return (
    <div className={cn('dl-calendar', className)}>
      <div className="flex items-center justify-between gap-2 pb-2">
        <button
          type="button"
          className="icon-button border-0! bg-transparent!"
          aria-label="Previous month"
          onClick={() => setMonth(addMonths(month, -1))}>
          <ChevronLeft className="size-4" />
        </button>
        <div id={labelId} aria-live="polite" className="text-sm font-semibold capitalize">
          {fmtMonth.format(month)}
        </div>
        <button
          type="button"
          className="icon-button border-0! bg-transparent!"
          aria-label="Next month"
          onClick={() => setMonth(addMonths(month, 1))}>
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div
        ref={gridRef}
        role="grid"
        aria-labelledby={labelId}
        onKeyDown={onKeyDown}
        onMouseLeave={() => setHovered(null)}
        className="dl-calendar-grid">
        <div role="row" className="contents">
          {weekdays.map((w) => (
            <div
              key={w.long}
              role="columnheader"
              aria-label={w.long}
              className="dl-calendar-weekday">
              {w.short}
            </div>
          ))}
        </div>
        {Array.from({ length: 6 }, (_, row) => (
          <div role="row" key={row} className="contents">
            {days.slice(row * 7, row * 7 + 7).map((d) => {
              const key = toDateKey(d)
              const outside = d.getMonth() !== month.getMonth()
              const isDisabled = disabled(d)
              const isStart = isRange && sameDay(d, range.from)
              const isEnd = isRange && sameDay(d, range.to ?? previewTo)
              const selected = isRange ? isStart || isEnd : sameDay(d, single)
              const middle = isRange && inRange(d) && !isStart && !isEnd
              const count = events?.[key] ?? 0
              return (
                <div key={key} role="gridcell" aria-selected={selected || middle || undefined}>
                  <button
                    type="button"
                    data-day={key}
                    tabIndex={sameDay(d, focusTarget) ? 0 : -1}
                    disabled={isDisabled}
                    aria-current={sameDay(d, today) ? 'date' : undefined}
                    aria-label={`${fmtFull.format(d)}${count ? `, ${count} ${eventLabel}` : ''}`}
                    data-outside={outside || undefined}
                    data-selected={selected || undefined}
                    data-range-middle={middle || undefined}
                    data-range-start={(isStart && (range.to || previewTo)) || undefined}
                    data-range-end={
                      (isEnd && !sameDay(range.from, range.to ?? previewTo)) || undefined
                    }
                    onClick={() => pick(d)}
                    onMouseEnter={() => setHovered(d)}
                    onFocus={() => setFocused(d)}
                    className="dl-calendar-day">
                    {d.getDate()}
                    {count > 0 && <span className="dl-calendar-dot" aria-hidden="true" />}
                  </button>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------- DatePicker */

interface DatePickerBaseProps {
  label?: React.ReactNode
  placeholder?: string
  /** Show a clear button when something is picked. */
  clearable?: boolean
  disabled?: boolean
  error?: boolean
  id?: string
  className?: string
  /** Format of the date in the field. */
  dateStyle?: 'short' | 'medium' | 'long' | 'full'
}

export type DatePickerProps = DatePickerBaseProps &
  (Omit<CalendarSingleProps, 'className'> | Omit<CalendarRangeProps, 'className'>)

/** A field that opens a Calendar. Picking a day (or the end of a range) closes it. */
export function DatePicker(props: DatePickerProps) {
  // Everything that isn't a field prop goes on to the Calendar.
  const {
    label,
    placeholder,
    clearable = true,
    disabled = false,
    error = false,
    id,
    className,
    dateStyle = 'medium',
    ...calendarProps
  } = props
  const { locale } = props
  const isRange = props.mode === 'range'
  const autoId = useId()
  const fieldId = id ?? autoId
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const position = useFloating(anchorRef, panelRef, open, { align: 'start' })
  useDismiss([anchorRef, panelRef], open, (reason) => {
    setOpen(false)
    if (reason === 'escape') triggerRef.current?.focus()
  })

  const [internalSingle, setInternalSingle] = useState<Date | null>(
    !isRange ? ((props as CalendarSingleProps).defaultValue ?? null) : null
  )
  const [internalRange, setInternalRange] = useState<DateRange>(
    isRange
      ? ((props as CalendarRangeProps).defaultValue ?? { from: null, to: null })
      : { from: null, to: null }
  )
  const single = !isRange
    ? (props as CalendarSingleProps).value !== undefined
      ? (props as CalendarSingleProps).value!
      : internalSingle
    : null
  const range = isRange ? ((props as CalendarRangeProps).value ?? internalRange) : null

  const fmt = new Intl.DateTimeFormat(locale, { dateStyle })
  const text = isRange
    ? range?.from
      ? `${fmt.format(range.from)} – ${range.to ? fmt.format(range.to) : '…'}`
      : ''
    : single
      ? fmt.format(single)
      : ''
  const hasValue = Boolean(text)

  const setSingle = (d: Date | null) => {
    const p = props as CalendarSingleProps
    if (p.value === undefined) setInternalSingle(d)
    p.onValueChange?.(d)
  }
  const setRange = (r: DateRange) => {
    const p = props as CalendarRangeProps
    if (p.value === undefined) setInternalRange(r)
    p.onValueChange?.(r)
  }

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium">
          {label}
        </label>
      )}
      <div ref={anchorRef} className="relative">
        <button
          ref={triggerRef}
          id={fieldId}
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={error || undefined}
          onClick={() => setOpen(!open)}
          className={cn(
            'form-input flex items-center gap-2 text-left',
            clearable && hasValue && 'pr-10',
            disabled && 'cursor-not-allowed opacity-50'
          )}>
          <CalendarDays
            className="size-4 shrink-0 text-[var(--muted-foreground)]"
            aria-hidden="true"
          />
          <span className={cn('truncate', !hasValue && 'text-[var(--muted-foreground)]')}>
            {text || placeholder || (isRange ? 'Pick dates' : 'Pick a date')}
          </span>
        </button>
        {clearable && hasValue && !disabled && (
          <button
            type="button"
            aria-label="Clear date"
            className="absolute top-1/2 right-2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-[var(--muted-foreground)] hover:bg-[color-mix(in_srgb,var(--foreground)_8%,transparent)] hover:text-[var(--foreground)]"
            onClick={() => (isRange ? setRange({ from: null, to: null }) : setSingle(null))}>
            <X className="size-3.5" />
          </button>
        )}
      </div>
      {open &&
        createPortal(
          <div
            ref={(el) => {
              panelRef.current = el
              if (el && !el.dataset.focused) {
                el.dataset.focused = 'true'
                requestAnimationFrame(() =>
                  el.querySelector<HTMLButtonElement>('.dl-calendar-day[tabindex="0"]')?.focus()
                )
              }
            }}
            role="dialog"
            aria-label={typeof label === 'string' ? label : 'Choose a date'}
            style={floatingStyle(position)}
            className={cn('ui-menu z-[80] p-3!', position && 'dl-animate-pop')}>
            {isRange ? (
              <Calendar
                {...(calendarProps as Omit<CalendarRangeProps, 'className'>)}
                mode="range"
                value={range!}
                onValueChange={(r) => {
                  setRange(r)
                  if (r.from && r.to) {
                    setOpen(false)
                    triggerRef.current?.focus()
                  }
                }}
              />
            ) : (
              <Calendar
                {...(calendarProps as Omit<CalendarSingleProps, 'className'>)}
                mode="single"
                value={single}
                onValueChange={(d) => {
                  setSingle(d)
                  setOpen(false)
                  triggerRef.current?.focus()
                }}
              />
            )}
          </div>,
          document.body
        )}
    </div>
  )
}
