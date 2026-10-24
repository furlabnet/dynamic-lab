import React, { useRef, useState } from 'react'
import { GripVertical } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface SortableItemApi {
  index: number
  isFirst: boolean
  isLast: boolean
  isDragging: boolean
  moveUp: () => void
  moveDown: () => void
  /** Spread on the drag handle; it also moves the item with arrow keys. */
  handleProps: React.ButtonHTMLAttributes<HTMLButtonElement> & { 'data-sortable-handle': string }
}

export interface SortableListProps<T> {
  items: T[]
  getKey: (item: T) => string
  onReorder: (items: T[]) => void
  renderItem: (item: T, api: SortableItemApi) => React.ReactNode
  /** Accessible name for an item, used in move announcements. */
  getLabel?: (item: T, index: number) => string
  layout?: 'list' | 'grid'
  className?: string
  itemClassName?: string
}

function move<T>(items: T[], from: number, to: number) {
  const next = items.slice()
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

/**
 * Reorderable items: drag by the handle, or focus the handle and use the arrow keys.
 * Dragging only starts from the handle, so inputs inside an item stay selectable.
 */
export function SortableList<T>({
  items,
  getKey,
  onReorder,
  renderItem,
  getLabel = (_item, i) => `Item ${i + 1}`,
  layout = 'list',
  className,
  itemClassName,
}: SortableListProps<T>) {
  const [armed, setArmed] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)

  const moveTo = (from: number, to: number, refocus = false) => {
    if (to < 0 || to >= items.length || from === to) return
    const key = getKey(items[from])
    onReorder(move(items, from, to))
    setAnnouncement(`${getLabel(items[from], from)} moved to position ${to + 1} of ${items.length}`)
    if (refocus) {
      requestAnimationFrame(() =>
        rootRef.current?.querySelector<HTMLElement>(`[data-sortable-key="${CSS.escape(key)}"] [data-sortable-handle]`)?.focus()
      )
    }
  }

  const prevKey = layout === 'grid' ? ['ArrowLeft', 'ArrowUp'] : ['ArrowUp']
  const nextKey = layout === 'grid' ? ['ArrowRight', 'ArrowDown'] : ['ArrowDown']

  return (
    <div ref={rootRef} className={cn(layout === 'grid' ? 'grid gap-3' : 'flex flex-col gap-2', className)}>
      {items.map((item, index) => {
        const key = getKey(item)
        const api: SortableItemApi = {
          index,
          isFirst: index === 0,
          isLast: index === items.length - 1,
          isDragging: dragging === key,
          moveUp: () => moveTo(index, index - 1),
          moveDown: () => moveTo(index, index + 1),
          handleProps: {
            type: 'button',
            'data-sortable-handle': '',
            'aria-label': `Reorder ${getLabel(item, index)}. Use arrow keys to move.`,
            onPointerDown: () => setArmed(key),
            onPointerUp: () => setArmed(null),
            onKeyDown: (e) => {
              if (prevKey.includes(e.key)) {
                e.preventDefault()
                moveTo(index, index - 1, true)
              } else if (nextKey.includes(e.key)) {
                e.preventDefault()
                moveTo(index, index + 1, true)
              }
            },
          },
        }
        return (
          <div
            key={key}
            data-sortable-key={key}
            draggable={armed === key}
            onDragStart={(e) => {
              setDragging(key)
              e.dataTransfer.effectAllowed = 'move'
              e.dataTransfer.setData('text/plain', key)
            }}
            onDragOver={(e) => {
              if (!dragging) return
              e.preventDefault()
              const from = items.findIndex((i) => getKey(i) === dragging)
              if (from !== index && from >= 0) moveTo(from, index)
            }}
            onDrop={(e) => e.preventDefault()}
            onDragEnd={() => {
              setDragging(null)
              setArmed(null)
            }}
            className={cn('ui-sortable-item', dragging === key && 'ui-sortable-dragging', itemClassName)}>
            {renderItem(item, api)}
          </div>
        )
      })}
      <span className="sr-only" aria-live="assertive">
        {announcement}
      </span>
    </div>
  )
}

/** A ready-made drag handle for SortableList items. */
export function DragHandle({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={cn('ui-drag-handle', className)}>
      <GripVertical className="size-4" />
    </button>
  )
}
