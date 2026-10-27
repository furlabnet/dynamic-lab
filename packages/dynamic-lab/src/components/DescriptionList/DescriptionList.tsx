import React from 'react'
import { cn } from '../../lib/utils'

export interface DescriptionItem {
  label: React.ReactNode
  value: React.ReactNode
  icon?: React.ReactNode
}

export interface DescriptionListProps extends React.HTMLAttributes<HTMLDListElement> {
  items: DescriptionItem[]
  /** `rows` puts label and value side by side; `stacked` puts the label above. */
  layout?: 'rows' | 'stacked'
}

/** Label / value pairs for metadata: engine, version, release date, dimensions… */
export function DescriptionList({
  items,
  layout = 'rows',
  className,
  ...props
}: DescriptionListProps) {
  return (
    <dl className={cn('ui-description-list', className)} data-layout={layout} {...props}>
      {items.map((item, i) => (
        <div key={i} className="ui-description-item">
          <dt>
            {item.icon && <span className="inline-flex shrink-0 [&>svg]:size-4">{item.icon}</span>}
            {item.label}
          </dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
