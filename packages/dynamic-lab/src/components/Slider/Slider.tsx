'use client'

import React from 'react'

import { useControllableState } from '../../lib/hooks'
import { cn } from '../../lib/utils'

export interface SliderProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'size'
> {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  /** Visible label above the track. */
  label?: React.ReactNode
  /** Show the current value beside the label. A function formats it, e.g. (v) => `${v}%`. */
  showValue?: boolean | ((value: number) => React.ReactNode)
  /** Text under the track at the min and max ends. */
  marks?: [React.ReactNode, React.ReactNode]
}

/** Pick a number from a range: reader font size, volume, price, panel zoom. A styled native range input. */
export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      style,
      value,
      defaultValue,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      label,
      showValue = false,
      marks,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const autoId = React.useId()
    const inputId = id ?? autoId
    const [current, setCurrent] = useControllableState(value, defaultValue ?? min, onValueChange)
    const percent = max === min ? 0 : ((current - min) / (max - min)) * 100
    const display = typeof showValue === 'function' ? showValue(current) : current

    return (
      <div className={cn('flex w-full flex-col gap-2', disabled && 'opacity-50', className)}>
        {(label || showValue) && (
          <div className="flex items-center justify-between gap-3 text-sm">
            {label && (
              <label htmlFor={inputId} className="font-medium">
                {label}
              </label>
            )}
            {showValue && (
              <span className="text-[var(--muted-foreground)] tabular-nums">{display}</span>
            )}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          disabled={disabled}
          onChange={(e) => setCurrent(Number(e.target.value))}
          className="dl-slider"
          style={{ '--slider-fill': `${percent}%`, ...style } as React.CSSProperties}
          {...props}
        />
        {marks && (
          <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
            <span>{marks[0]}</span>
            <span>{marks[1]}</span>
          </div>
        )}
      </div>
    )
  }
)

Slider.displayName = 'Slider'
