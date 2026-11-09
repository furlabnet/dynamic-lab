'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * A ref that always holds the latest `value`, for reading in event handlers and effects without
 * re-subscribing when it changes. It's updated after render, so don't read it during render.
 */
export function useLatestRef<T>(value: T) {
  const ref = useRef(value)
  useLayoutEffect(() => {
    ref.current = value
  })
  return ref
}

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

  const onChangeRef = useLatestRef(onChange)

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next)
      onChangeRef.current?.(next)
    },
    [isControlled, onChangeRef]
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
  const onDismissRef = useLatestRef(onDismiss)
  const refsRef = useLatestRef(refs)

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
  }, [active, onDismissRef, refsRef])
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
  let next: number
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

/* --------------------------------------------------------- Async actions */

/**
 * The life of one async action, such as posting a comment or sending a report:
 * `idle` → `pending` → `success` or `error`, and back to `idle` with `reset` (or a new run).
 */
export type AsyncStatus = 'idle' | 'pending' | 'success' | 'error'

export interface AsyncActionState<Args extends unknown[]> {
  status: AsyncStatus
  /** What the last run threw or rejected with, while `status` is `error`. */
  error: unknown
  isPending: boolean
  /**
   * Runs the action and resolves to `true` when it succeeded, so callers can clear a field only
   * once the server has the text. A run while one is pending is ignored and resolves to `false`.
   */
  run: (...args: Args) => Promise<boolean>
  reset: () => void
}

/**
 * Tracks an action that may return a promise. Synchronous actions succeed at once, so components
 * that accept `() => void | Promise<void>` keep working for callers that don't return anything.
 * Results that arrive after unmount, or after `reset`, are dropped.
 */
export function useAsyncAction<Args extends unknown[]>(
  action: (...args: Args) => unknown
): AsyncActionState<Args> {
  const [state, setState] = useState<{ status: AsyncStatus; error: unknown }>({
    status: 'idle',
    error: undefined,
  })
  const actionRef = useLatestRef(action)
  const runId = useRef(0)
  const pending = useRef(false)

  useEffect(
    () => () => {
      runId.current += 1
    },
    []
  )

  const run = useCallback(
    async (...args: Args) => {
      if (pending.current) return false
      const id = ++runId.current
      pending.current = true
      setState({ status: 'pending', error: undefined })
      try {
        await actionRef.current(...args)
        if (id === runId.current) setState({ status: 'success', error: undefined })
        return id === runId.current
      } catch (error) {
        if (id === runId.current) setState({ status: 'error', error })
        return false
      } finally {
        if (id === runId.current) pending.current = false
      }
    },
    [actionRef]
  )

  const reset = useCallback(() => {
    runId.current += 1
    pending.current = false
    setState({ status: 'idle', error: undefined })
  }, [])

  return { ...state, isPending: state.status === 'pending', run, reset }
}

/* --------------------------------------------------------- Clipboard */

export type CopyStatus = 'idle' | 'copied' | 'failed'

/**
 * Copies text and reports honestly whether it worked: `copied` or `failed` (the clipboard is
 * blocked on insecure origins and by some permission settings), then back to `idle` after
 * `resetAfter` milliseconds. Copying again restarts the timer.
 */
export function useCopyToClipboard(resetAfter = 1600) {
  const [status, setStatus] = useState<CopyStatus>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  const copy = useCallback(
    async (text: string) => {
      let next: CopyStatus = 'copied'
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        next = 'failed'
      }
      if (timer.current) clearTimeout(timer.current)
      setStatus(next)
      timer.current = setTimeout(() => setStatus('idle'), resetAfter)
      return next === 'copied'
    },
    [resetAfter]
  )

  return { status, copy }
}
