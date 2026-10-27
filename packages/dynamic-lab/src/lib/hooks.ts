import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * State that can be either controlled (value + onChange) or uncontrolled (defaultValue).
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
): [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? (value as T) : internal

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next)
      onChangeRef.current?.(next)
    },
    [isControlled]
  )

  return [current, setValue]
}

/**
 * Calls `onDismiss` on a pointer press outside every element in `refs`, or when Escape is pressed.
 * Pass several refs when part of the UI is portaled elsewhere (e.g. a trigger and its panel).
 */
export function useDismiss(
  refs: React.RefObject<HTMLElement | null> | Array<React.RefObject<HTMLElement | null>>,
  active: boolean,
  onDismiss: (reason: 'outside' | 'escape') => void
) {
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss
  const refsRef = useRef(refs)
  refsRef.current = refs

  useEffect(() => {
    if (!active) return

    function handlePointer(e: MouseEvent) {
      const list = Array.isArray(refsRef.current) ? refsRef.current : [refsRef.current]
      const inside = list.some((r) => r.current?.contains(e.target as Node))
      if (!inside) onDismissRef.current('outside')
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onDismissRef.current('escape')
    }

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [active])
}

/**
 * Locks page scroll while `active` is true. Nested locks are counted so closing one overlay
 * doesn't unlock the page under another.
 */
let scrollLocks = 0
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    scrollLocks += 1
    document.body.style.overflow = 'hidden'
    return () => {
      scrollLocks -= 1
      if (scrollLocks === 0) document.body.style.overflow = ''
    }
  }, [active])
}

/** Moves focus between `[role=menuitem]`-style children with arrow keys, Home and End. */
export function focusSibling(
  container: HTMLElement | null,
  selector: string,
  direction: 'next' | 'prev' | 'first' | 'last'
) {
  if (!container) return
  const items = Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-disabled') !== 'true'
  )
  if (items.length === 0) return
  const index = items.indexOf(document.activeElement as HTMLElement)
  let next = 0
  if (direction === 'first') next = 0
  else if (direction === 'last') next = items.length - 1
  else if (direction === 'next') next = index < 0 ? 0 : (index + 1) % items.length
  else next = index < 0 ? items.length - 1 : (index - 1 + items.length) % items.length
  items[next].focus()
}

export function isMacPlatform() {
  if (typeof navigator === 'undefined') return false
  return /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
}
