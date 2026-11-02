'use client'

import React, { useMemo, useState } from 'react'

import { formatCount } from '../../lib/format'
import { cn } from '../../lib/utils'

/** Round tick values (0 / 1K / 2K…) covering 0..max. */
function niceTicks(max: number, count = 4): number[] {
  if (max <= 0) return [0]
  const raw = max / count
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw
  const top = Math.ceil(max / step) * step
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step)
}

/* ---------------------------------------------------------- Sparkline */

export interface SparklineProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  values: number[]
  /** Labels for each point (dates…), shown in the tooltip. */
  labels?: string[]
  /** What the line measures, for screen readers and the tooltip: "Views". */
  label: string
  /** Fill under the line with a light wash. */
  area?: boolean
  /** Dot on the latest value. */
  endDot?: boolean
  /** Crosshair and tooltip on hover. */
  interactive?: boolean
  /** Formats values in the tooltip. */
  format?: (value: number) => string
  /** Locale for the default number format. */
  locale?: string
  height?: number
}

/**
 * A small line showing a trend, for stat tiles and table rows. It has no axes; the tooltip and the
 * screen-reader summary carry the values.
 */
export function Sparkline({
  className,
  values,
  labels,
  label,
  area = true,
  endDot = true,
  interactive = true,
  format,
  locale,
  height = 40,
  ...props
}: SparklineProps) {
  const fmt = format ?? ((v: number) => v.toLocaleString(locale))
  const [hover, setHover] = useState<number | null>(null)
  const n = values.length
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  // Inset 3 units top and bottom so the 2px line and end dot aren't clipped.
  const y = (v: number) => 3 + (1 - (v - min) / span) * 94
  const x = (i: number) => (n <= 1 ? 50 : (i / (n - 1)) * 100)

  const line = values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')
  const fill = `${line} L${x(n - 1)},100 L${x(0)},100 Z`
  const active = hover ?? (endDot ? n - 1 : null)

  if (n === 0) return null

  const summary = `${label}: from ${fmt(values[0]!)} to ${fmt(values[n - 1]!)}, low ${fmt(min)}, high ${fmt(max)}`

  return (
    <div
      role="img"
      aria-label={summary}
      className={cn('dl-sparkline', className)}
      style={{ height }}
      onPointerMove={
        interactive
          ? (e) => {
              const r = e.currentTarget.getBoundingClientRect()
              const i = Math.round(((e.clientX - r.left) / r.width) * (n - 1))
              setHover(Math.max(0, Math.min(n - 1, i)))
            }
          : undefined
      }
      onPointerLeave={interactive ? () => setHover(null) : undefined}
      {...props}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="size-full overflow-visible">
        {area && <path d={fill} className="dl-chart-area" />}
        <path d={line} className="dl-chart-line" vectorEffect="non-scaling-stroke" />
        {hover !== null && (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={0}
            y2={100}
            className="dl-chart-crosshair"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
      {active !== null && (
        <span
          className="dl-chart-dot"
          aria-hidden="true"
          style={{ left: `${x(active)}%`, top: `${y(values[active]!)}%` }}
        />
      )}
      {hover !== null && (
        <span
          className="dl-chart-tooltip"
          aria-hidden="true"
          data-flip={hover > n / 2 || undefined}
          style={{ left: `${x(hover)}%` }}>
          <strong>{fmt(values[hover]!)}</strong>
          <span>{labels?.[hover] ?? label}</span>
        </span>
      )}
    </div>
  )
}

/* ----------------------------------------------------------- BarChart */

export interface BarDatum {
  label: string
  value: number
}

export interface BarChartProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  data: BarDatum[]
  /** What the bars measure: "Views per day". Used as the accessible name and table caption. */
  label: string
  /** Index of a bar to label at its cap and draw in full colour; others are a lighter step. */
  highlight?: number
  /** Chart height in pixels, excluding the category labels. */
  height?: number
  /** Formats tick and tooltip values. Ticks default to compact (1K). */
  format?: (value: number) => string
  /** Show every category label. When false, only the first, last and highlighted show. */
  showAllLabels?: boolean
  locale?: string
}

/**
 * Columns comparing values across categories or days: views per day, earnings per month. Hover or
 * focus a bar for its value; a hidden table gives screen readers every number.
 */
export function BarChart({
  className,
  data,
  label,
  highlight,
  height = 180,
  format,
  showAllLabels,
  locale,
  ...props
}: BarChartProps) {
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(0, ...data.map((d) => d.value))
  const ticks = useMemo(() => niceTicks(max), [max])
  const top = ticks[ticks.length - 1] || 1
  const fmtTick = format ?? ((v: number) => formatCount(v, locale))
  const fmtValue = format ?? ((v: number) => v.toLocaleString(locale))
  const allLabels = showAllLabels ?? data.length <= 8

  return (
    <figure className={cn('dl-bar-chart', className)} {...props}>
      <div className="dl-bar-chart-plot" style={{ height }}>
        <div className="dl-bar-chart-ticks" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} style={{ bottom: `${(t / top) * 100}%` }}>
              <span className="dl-bar-chart-tick-label">{fmtTick(t)}</span>
            </span>
          ))}
        </div>
        <div className="dl-bar-chart-bars" role="list" aria-label={label}>
          {data.map((d, i) => {
            const h = (Math.max(0, d.value) / top) * 100
            const emphasised = highlight === undefined || highlight === i
            return (
              <div
                key={`${d.label}-${i}`}
                role="listitem"
                tabIndex={0}
                aria-label={`${d.label}: ${fmtValue(d.value)}`}
                className="dl-bar-chart-slot"
                data-active={hover === i || undefined}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}>
                <span
                  className="dl-bar-chart-bar"
                  data-muted={!emphasised || undefined}
                  style={{ height: `${h}%` }}>
                  {highlight === i && (
                    <span className="dl-bar-chart-cap" aria-hidden="true">
                      {fmtTick(d.value)}
                    </span>
                  )}
                </span>
                {hover === i && (
                  <span
                    className="dl-chart-tooltip"
                    aria-hidden="true"
                    data-flip={i > data.length / 2 || undefined}
                    style={{ left: '50%', bottom: `calc(${h}% + 0.5rem)`, top: 'auto' }}>
                    <strong>{fmtValue(d.value)}</strong>
                    <span>{d.label}</span>
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="dl-bar-chart-labels" aria-hidden="true">
        {data.map((d, i) => (
          <span key={`${d.label}-${i}`}>
            {allLabels || i === 0 || i === data.length - 1 || i === highlight ? d.label : ''}
          </span>
        ))}
      </div>
      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <th scope="row">{d.label}</th>
              <td>{fmtValue(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
