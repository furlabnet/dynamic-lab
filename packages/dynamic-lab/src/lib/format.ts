/*
 * Pure formatters, kept out of the client components that use them so Server Components can call
 * them too (a function exported from a 'use client' module is only a reference on the server).
 */

/** "1.2K", "34K", "1.5M" in the reader's locale. */
export function formatCount(n: number, locale?: string) {
  return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}

/** "just now", "5m ago", "3h ago", "2d ago", then a date after 30 days. */
export function relativeTime(date: string | Date) {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** "2026-10-31" in local time, for keying events by day. */
export function toDateKey(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}
