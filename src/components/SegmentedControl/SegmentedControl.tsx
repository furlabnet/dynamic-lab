import React, { useRef } from 'react'
import { cn } from '../../lib/utils'
import { focusSibling, useControllableState } from '../../lib/hooks'

export interface SegmentedOption {
  value: string
  label: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
}

export interface SegmentedControlProps {
  options: SegmentedOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  size?: 'sm' | 'md'
  'aria-label'?: string
  className?: string
  /** Stretch to the container's width with equal segments. */
  fullWidth?: boolean
}

/** A single-choice toggle group, for switching views or modes (e.g. Grid / List). */
export function SegmentedControl({
  options,
  value,
  defaultValue,
  onValueChange,
  size = 'md',
  className,
  fullWidth = false,
  ...props
}: SegmentedControlProps) {
  const [current, setCurrent] = useControllableState(
    value,
    defaultValue ?? options[0]?.value ?? '',
    onValueChange
  )
  const ref = useRef<HTMLDivElement>(null)

  const onKeyDown = (e: React.KeyboardEvent) => {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 'next' : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? 'prev' : null
    if (!dir) return
    e.preventDefault()
    focusSibling(ref.current, '[role="radio"]', dir)
    const focused = document.activeElement as HTMLElement | null
    if (focused?.dataset.value) setCurrent(focused.dataset.value)
  }

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={props['aria-label']}
      onKeyDown={onKeyDown}
      className={cn('ui-segmented', fullWidth && 'flex w-full', size === 'sm' && 'ui-segmented-sm', className)}>
      {options.map((opt) => {
        const selected = opt.value === current
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            data-value={opt.value}
            tabIndex={selected ? 0 : -1}
            disabled={opt.disabled}
            onClick={() => setCurrent(opt.value)}
            className={cn('ui-segmented-item', fullWidth && 'flex-1')}>
            {opt.icon && <span className="inline-flex shrink-0 [&>svg]:size-4">{opt.icon}</span>}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
