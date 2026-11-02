import React, { useEffect, useRef, useState } from 'react'

import { Input } from '@furlab/dynamic-lab'

import { Search } from 'lucide-react'

import type { ComponentDoc } from '../registry'
import { COMPONENTS, GROUPS } from '../registry'

/**
 * The first example of a component, shrunk into a card. It mounts once the card nears the
 * viewport, so the page doesn't render every example at once, and it's inert: the card is the link.
 */
function Thumbnail({ doc }: { doc: ComponentDoc }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const example = doc.examples[0]

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="docs-thumb" aria-hidden="true">
      {visible && example && (
        <div className="docs-thumb-stage" inert>
          <example.render />
        </div>
      )}
    </div>
  )
}

export function ComponentIndex({
  filter,
  onFilterChange,
  matches,
}: {
  filter: string
  onFilterChange: (value: string) => void
  matches: (doc: ComponentDoc) => boolean
}) {
  const shown = COMPONENTS.filter(matches)

  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="page-title">Components</h1>
        <p className="page-description text-[17px]">
          All {COMPONENTS.length} components, grouped by what they do. Each card shows the first
          example; open one for every example, its code and its props.
        </p>
        <div className="mt-2 max-w-sm">
          <Input
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            placeholder="Filter components"
            aria-label="Filter components"
            startIcon={<Search className="size-4" />}
          />
        </div>
      </header>

      {GROUPS.map((group) => {
        const items = shown.filter((c) => c.group === group)
        if (!items.length) return null
        return (
          <section key={group} className="flex flex-col gap-4" aria-label={group}>
            <h2 className="ui-section-title">
              {group}{' '}
              <span className="font-normal text-[var(--muted-foreground)]">{items.length}</span>
            </h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((c) => (
                <li key={c.id} className="flex">
                  <a href={`#/components/${c.id}`} className="docs-index-card">
                    <Thumbnail doc={c} />
                    <span className="flex flex-col gap-1 p-4">
                      <span className="docs-index-name font-bold">{c.name}</span>
                      <span className="body-sm line-clamp-2 text-[var(--muted-foreground)]">
                        {c.summary}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )
      })}

      {!shown.length && (
        <p className="text-[var(--muted-foreground)]">No components match “{filter}”.</p>
      )}
    </article>
  )
}
