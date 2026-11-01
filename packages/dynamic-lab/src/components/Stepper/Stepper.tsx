import React from 'react'

import { Check } from 'lucide-react'

import { cn } from '../../lib/utils'

export interface StepperStep {
  label: React.ReactNode
  description?: React.ReactNode
  /** Mark a step as failed, e.g. a rejected upload. */
  error?: boolean
}

export interface StepperProps extends Omit<React.HTMLAttributes<HTMLOListElement>, 'onChange'> {
  steps: StepperStep[]
  /** Index of the current step. Steps before it show as done. */
  current: number
  orientation?: 'horizontal' | 'vertical'
  /** Makes finished steps clickable, to go back and edit them. */
  onStepClick?: (index: number) => void
}

/**
 * Progress through a multi-step flow: publishing a chapter, onboarding, applying to a Lab.
 * Horizontal steps stack vertically on narrow screens.
 */
export function Stepper({
  className,
  steps,
  current,
  orientation = 'horizontal',
  onStepClick,
  ...props
}: StepperProps) {
  return (
    <ol
      data-orientation={orientation}
      className={cn('dl-stepper', className)}
      aria-label={props['aria-label'] ?? 'Progress'}
      {...props}>
      {steps.map((step, i) => {
        const state = step.error
          ? 'error'
          : i < current
            ? 'done'
            : i === current
              ? 'current'
              : 'upcoming'
        const clickable = Boolean(onStepClick) && i < current

        const marker = (
          <span className="dl-stepper-marker" aria-hidden="true">
            {state === 'done' ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
          </span>
        )
        const text = (
          <span className="flex min-w-0 flex-col">
            <span className="dl-stepper-label">{step.label}</span>
            {step.description && (
              <span className="text-xs text-[var(--muted-foreground)]">{step.description}</span>
            )}
          </span>
        )

        return (
          <li
            key={i}
            data-state={state}
            aria-current={state === 'current' ? 'step' : undefined}
            className="dl-stepper-step">
            {clickable ? (
              <button
                type="button"
                className="dl-stepper-content dl-stepper-button"
                onClick={() => onStepClick?.(i)}>
                {marker}
                {text}
              </button>
            ) : (
              <span className="dl-stepper-content">
                {marker}
                {text}
              </span>
            )}
            <span className="sr-only">
              {state === 'done' ? '(completed)' : state === 'error' ? '(failed)' : ''}
            </span>
            {i < steps.length - 1 && <span className="dl-stepper-connector" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}
