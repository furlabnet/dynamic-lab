import React from 'react'
import { Bookmark, Eye, MessageCircle } from 'lucide-react'
import { ContentCard, PLATFORM_INFO, type ContentCardProps } from '@furlab/dynamic-lab'
import { TYPE_LABELS, type ContentRecord } from '../data'
import { getDetails, profileByName, wordCount } from '../details'
import { useShowcase } from '../state'

const compact = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n)

type RecordCardProps = { record: ContentRecord } & Partial<Omit<ContentCardProps, 'title'>>

/**
 * A ContentCard filled from a showcase record: rating, saves, views, comments, a type-specific
 * fact (pages, chapters and reading time, version, image count), a few tags, and platforms for
 * visual novels. Mature covers are blurred, matching the default content preferences.
 */
export function RecordCard({ record, ...overrides }: RecordCardProps) {
  const { saved, comments, navigate } = useShowcase()
  const details = getDetails(record)
  const isSaved = saved.includes(record.id)
  const commentCount = (comments[record.id] ?? []).reduce(
    (n, c) => n + 1 + (c.replies?.length ?? 0),
    0
  )

  let coverMeta: React.ReactNode
  if (record.type === 'comic' && details.comicChapters) {
    const pages = details.comicChapters.reduce((n, c) => n + c.pages.length, 0)
    coverMeta =
      details.comicChapters.length > 1
        ? `${details.comicChapters.length} ch · ${pages} pages`
        : `${pages} pages`
  } else if (record.type === 'story' && details.chapters) {
    const minutes = Math.max(1, Math.round(wordCount(details.chapters) / 230))
    coverMeta = `${details.chapters.length} ch · ${minutes} min`
  } else if (record.type === 'visual-novel' && details.vn) {
    coverMeta = `v${details.vn.version} · ${details.vn.playtime || 'Game'}`
  } else if (record.type === 'artwork' && details.images && details.images.length > 1) {
    coverMeta = `${details.images.length} images`
  }

  const tags = details.tags
    .filter((t) => t.category === 'general' || t.category === 'species')
    .slice(0, 3)
    .map((t) => t.name)

  const platforms =
    record.type === 'visual-novel' && details.vn ? (
      <span
        className="inline-flex items-center gap-1 [&_svg]:size-3.5"
        aria-label={`Platforms: ${details.vn.platforms.map((p) => PLATFORM_INFO[p].label).join(', ')}`}>
        {details.vn.platforms.map((p) => (
          <span key={p} title={PLATFORM_INFO[p].label}>
            {PLATFORM_INFO[p].icon}
          </span>
        ))}
      </span>
    ) : undefined

  const showStats = record.type !== 'page'

  return (
    <ContentCard
      type={TYPE_LABELS[record.type]}
      title={record.title}
      byline={`By ${record.creator}`}
      bylineAvatar={profileByName(record.creator)?.avatar}
      cover={details.cover}
      rating={record.type === 'page' ? undefined : record.rating}
      blurCover={record.rating === 'mature'}
      coverMeta={coverMeta}
      saved={isSaved}
      tags={tags}
      stats={
        showStats
          ? [
              {
                icon: <Bookmark />,
                value: compact(details.saves + (isSaved ? 1 : 0)),
                label: 'saves',
              },
              { icon: <Eye />, value: compact(details.views), label: 'views' },
              ...(record.comments === 'open' || commentCount > 0
                ? [{ icon: <MessageCircle />, value: commentCount, label: 'comments' }]
                : []),
            ]
          : undefined
      }
      footer={platforms}
      onClick={() => navigate(`lab/view/${record.id}`)}
      {...overrides}
    />
  )
}
