import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { CommentData, StatusTone } from '../index'
import { SEED_COMMENTS } from './details'
import {
  seedContent,
  seedReports,
  seedUsers,
  type ContentRecord,
  type ReportRecord,
  type UserRecord,
} from './data'

export type AppId = 'lab' | 'backstage'

export interface ActivityEntry {
  id: string
  text: string
  at: string
  tone: StatusTone
}

interface ShowcaseState {
  /** Current hash route without the leading "#/", e.g. "backstage/content". */
  path: string
  app: AppId
  page: string
  navigate: (path: string) => void
  content: ContentRecord[]
  updateContent: (ids: string[], patch: Partial<ContentRecord>) => void
  addContent: (record: ContentRecord) => void
  removeContent: (ids: string[]) => void
  users: UserRecord[]
  setUsers: React.Dispatch<React.SetStateAction<UserRecord[]>>
  reports: ReportRecord[]
  setReports: React.Dispatch<React.SetStateAction<ReportRecord[]>>
  maintenance: boolean
  setMaintenance: (on: boolean) => void
  activity: ActivityEntry[]
  log: (text: string, tone?: StatusTone) => void
  saved: string[]
  setSaved: (id: string, saved: boolean) => void
  comments: Record<string, CommentData[]>
  addComment: (contentId: string, comment: CommentData, parentId?: string) => void
  likeComment: (contentId: string, commentId: string) => void
  /** Files a report; it shows up in Backstage → Moderation. */
  report: (contentId: string, reason: string, reporter: string) => void
}

const ShowcaseContext = createContext<ShowcaseState | null>(null)

export const DEFAULT_PAGES: Record<AppId, string> = {
  lab: 'components',
  backstage: 'overview',
}

function readHash() {
  return window.location.hash.replace(/^#\/?/, '')
}

export function ShowcaseProvider({ children }: { children: React.ReactNode }) {
  const [path, setPath] = useState(readHash)

  useEffect(() => {
    const onHash = () => {
      setPath(readHash())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = useCallback((next: string) => {
    window.location.hash = `/${next}`
  }, [])

  const [first, ...rest] = path.split('/')
  const app: AppId = first === 'backstage' ? 'backstage' : 'lab'
  const page =
    (first === 'lab' || first === 'backstage' ? rest.join('/') : '') || DEFAULT_PAGES[app]

  const [content, setContent] = useState(seedContent)
  const [users, setUsers] = useState(seedUsers)
  const [reports, setReports] = useState(seedReports)
  const [maintenance, setMaintenance] = useState(true)
  const [activity, setActivity] = useState<ActivityEntry[]>([
    {
      id: 'a0',
      text: 'Maintenance mode turned on',
      at: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
      tone: 'warning',
    },
    {
      id: 'a1',
      text: '“The lighthouse keeper” was published',
      at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      tone: 'success',
    },
    {
      id: 'a2',
      text: '“Neon Odyssey: Volume II” was sent for review',
      at: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
      tone: 'warning',
    },
  ])

  const log = useCallback((text: string, tone: StatusTone = 'info') => {
    setActivity((prev) => [
      { id: Math.random().toString(36).slice(2), text, at: new Date().toISOString(), tone },
      ...prev,
    ])
  }, [])

  const updateContent = useCallback((ids: string[], patch: Partial<ContentRecord>) => {
    const now = new Date().toISOString()
    setContent((prev) =>
      prev.map((c) => (ids.includes(c.id) ? { ...c, ...patch, updated: now } : c))
    )
  }, [])

  const addContent = useCallback(
    (record: ContentRecord) => setContent((prev) => [record, ...prev]),
    []
  )
  const removeContent = useCallback(
    (ids: string[]) => setContent((prev) => prev.filter((c) => !ids.includes(c.id))),
    []
  )

  const [saved, setSavedList] = useState<string[]>(['c8'])
  const setSaved = useCallback(
    (id: string, on: boolean) =>
      setSavedList((prev) =>
        on ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id)
      ),
    []
  )

  const [comments, setComments] = useState<Record<string, CommentData[]>>(SEED_COMMENTS)
  const addComment = useCallback((contentId: string, comment: CommentData, parentId?: string) => {
    setComments((prev) => {
      const list = prev[contentId] ?? []
      const next = parentId
        ? list.map((c) =>
            c.id === parentId ? { ...c, replies: [...(c.replies ?? []), comment] } : c
          )
        : [comment, ...list]
      return { ...prev, [contentId]: next }
    })
  }, [])
  const likeComment = useCallback((contentId: string, commentId: string) => {
    const toggle = (c: CommentData): CommentData =>
      c.id === commentId
        ? { ...c, liked: !c.liked, likes: (c.likes ?? 0) + (c.liked ? -1 : 1) }
        : { ...c, replies: c.replies?.map(toggle) }
    setComments((prev) => ({ ...prev, [contentId]: (prev[contentId] ?? []).map(toggle) }))
  }, [])

  const report = useCallback(
    (contentId: string, reason: string, reporter: string) => {
      setReports((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).slice(2),
          contentId,
          reason,
          reporter,
          at: new Date().toISOString(),
        },
      ])
      log(`New report: ${reason}`, 'danger')
    },
    [log]
  )

  const handleMaintenance = useCallback(
    (on: boolean) => {
      setMaintenance(on)
      log(
        on ? 'Maintenance mode turned on' : 'Maintenance mode turned off',
        on ? 'warning' : 'success'
      )
    },
    [log]
  )

  const value = useMemo<ShowcaseState>(
    () => ({
      path,
      app,
      page,
      navigate,
      content,
      updateContent,
      addContent,
      removeContent,
      users,
      setUsers,
      reports,
      setReports,
      maintenance,
      setMaintenance: handleMaintenance,
      activity,
      log,
      saved,
      setSaved,
      comments,
      addComment,
      likeComment,
      report,
    }),
    [
      path,
      app,
      page,
      navigate,
      content,
      updateContent,
      addContent,
      removeContent,
      users,
      reports,
      maintenance,
      handleMaintenance,
      activity,
      log,
      saved,
      setSaved,
      comments,
      addComment,
      likeComment,
      report,
    ]
  )

  return <ShowcaseContext.Provider value={value}>{children}</ShowcaseContext.Provider>
}

export function useShowcase() {
  const ctx = useContext(ShowcaseContext)
  if (!ctx) throw new Error('useShowcase must be used within ShowcaseProvider')
  return ctx
}

export const APPS = [
  { id: 'lab', name: 'Dynamic Lab', description: 'Public site and your dashboards' },
  { id: 'backstage', name: 'Backstage', description: 'Staff administration' },
]

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
