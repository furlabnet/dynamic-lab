import React, { useMemo, useRef, useState } from 'react'
import {
  AgeGate,
  AgeRating,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  ChapterNav,
  ComicReader,
  CommentThread,
  ContentActions,
  ContentCard,
  DescriptionList,
  DownloadList,
  Lightbox,
  MediaGallery,
  NotFoundState,
  NoticePanel,
  Panel,
  PlatformBadge,
  ProfileAvatar,
  ReaderSettings,
  ReadingProgress,
  SegmentedControl,
  Separator,
  TagList,
  detectPlatform,
  readerStyle,
  renderMarkdown,
  useReaderPrefs,
  useReadingProgress,
  useToast,
  type TagItem,
} from '@furlab/dynamic-lab'
import {
  AlertTriangle,
  Calendar,
  Clock,
  Cpu,
  Eye,
  Gamepad2,
  Globe,
  History,
  Languages,
  Package,
  Pencil,
  Sparkles,
} from 'lucide-react'
import { CURRENT_USER, TYPE_LABELS, TYPE_PLURALS, type ContentRecord } from '../data'
import { getDetails, labByName, profileByName, wordCount, type ContentDetails } from '../details'
import { formatDate, useShowcase } from '../state'
import { RecordCard } from './RecordCard'

/* ------------------------------------------------------------- Shared */

function useContentHandlers(record: ContentRecord) {
  const { saved, setSaved, comments, addComment, likeComment, report } = useShowcase()
  const { toast } = useToast()
  return {
    saved: saved.includes(record.id),
    onSavedChange: (on: boolean) => {
      setSaved(record.id, on)
      toast({
        title: on ? 'Saved to your Library' : 'Removed from your Library',
        description: on ? 'Find it under Library → Library.' : record.title,
        tone: on ? 'success' : 'default',
      })
    },
    onReport: ({ reason, details }: { reason: string; details: string }) => {
      report(record.id, details ? `${reason}: ${details}` : reason, CURRENT_USER.name)
      toast({
        title: 'Report sent',
        description: 'It is now in Backstage → Moderation.',
        tone: 'info',
      })
    },
    comments: comments[record.id] ?? [],
    onAddComment: (body: string, parentId?: string) =>
      addComment(
        record.id,
        {
          id: Math.random().toString(36).slice(2),
          author: {
            name: CURRENT_USER.name,
            avatarSrc: CURRENT_USER.avatar,
            href: `#/lab/u/${CURRENT_USER.handle}`,
          },
          body,
          createdAt: new Date().toISOString(),
        },
        parentId
      ),
    onLike: (id: string) => likeComment(record.id, id),
  }
}

function Crumbs({ record }: { record: ContentRecord }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#/lab/browse">Browse</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#/lab/browse">{TYPE_PLURALS[record.type]}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="max-w-[16rem] truncate">{record.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function Byline({ record }: { record: ContentRecord }) {
  const profile = profileByName(record.creator)
  const lab = labByName(record.lab)
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
      <a
        href={profile ? `#/lab/u/${profile.handle}` : undefined}
        className="flex items-center gap-2 font-semibold hover:underline">
        <ProfileAvatar src={profile?.avatar} initials={record.creator.slice(0, 2)} size="sm" />
        {record.creator}
      </a>
      {lab && (
        <span className="text-[var(--muted-foreground)]">
          in{' '}
          <a
            href={`#/lab/labs/${lab.slug}`}
            className="font-semibold text-[var(--foreground)] hover:underline">
            {lab.name}
          </a>
        </span>
      )}
      <span className="text-[var(--muted-foreground)]">· {formatDate(record.updated)}</span>
    </div>
  )
}

function ContentHeading({
  record,
  details,
  extra,
}: {
  record: ContentRecord
  details: ContentDetails
  extra?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="page-eyebrow">{TYPE_LABELS[record.type]}</span>
        <AgeRating rating={record.rating} />
        {extra}
      </div>
      <h1 className="page-title">{record.title}</h1>
      <Byline record={record} />
      <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
        <span className="inline-flex items-center gap-1">
          <Eye className="size-3.5" /> {details.views.toLocaleString()} views
        </span>
      </div>
    </div>
  )
}

function TagPanel({ tags }: { tags: TagItem[] }) {
  const { navigate } = useShowcase()
  if (tags.length === 0) return null
  return (
    <Panel title="Tags">
      <TagList
        grouped
        tags={tags}
        onTagClick={(tag) => navigate(`lab/browse?tag=${encodeURIComponent(tag.name)}`)}
      />
    </Panel>
  )
}

function MoreFrom({ record }: { record: ContentRecord }) {
  const { content, navigate } = useShowcase()
  const more = content
    .filter(
      (c) =>
        c.creator === record.creator &&
        c.id !== record.id &&
        c.status === 'published' &&
        !c.trashed &&
        c.type !== 'page'
    )
    .slice(0, 3)
  if (more.length === 0) return null
  return (
    <section className="flex flex-col gap-4">
      <h2 className="section-title">More from {record.creator}</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {more.map((m) => (
          <RecordCard key={m.id} record={m} byline={m.lab} />
        ))}
      </div>
    </section>
  )
}

function Comments({ record }: { record: ContentRecord }) {
  const h = useContentHandlers(record)
  return (
    <CommentThread
      comments={h.comments}
      onAdd={h.onAddComment}
      onLike={h.onLike}
      closed={record.comments === 'closed'}
      user={{ name: CURRENT_USER.name, avatarSrc: CURRENT_USER.avatar }}
    />
  )
}

function EditButton({ id }: { id: string }) {
  const { navigate } = useShowcase()
  return (
    <Button
      variant="secondary"
      leftIcon={<Pencil className="size-4" />}
      onClick={() => navigate(`lab/edit/${id}`)}>
      Edit
    </Button>
  )
}

function Actions({
  record,
  details,
  children,
}: {
  record: ContentRecord
  details: ContentDetails
  children?: React.ReactNode
}) {
  const h = useContentHandlers(record)
  return (
    <ContentActions
      saved={h.saved}
      onSavedChange={h.onSavedChange}
      saveCount={details.saves}
      onReport={h.onReport}
      shareUrl={`${window.location.origin}/#/lab/view/${record.id}`}>
      <EditButton id={record.id} />
      {children}
    </ContentActions>
  )
}

const shell = 'mx-auto flex max-w-[var(--container-max)] flex-col gap-8 px-4 py-8 sm:px-8'

/* -------------------------------------------------------------- Entry */

export function ContentView({ id }: { id: string }) {
  const { content, navigate } = useShowcase()
  const record = content.find((c) => c.id === id && !c.trashed)

  if (!record) {
    return (
      <div className={shell}>
        <NotFoundState
          title="That creation isn't here"
          description="It may have been deleted or moved to the trash."
          onHomeClick={() => navigate('lab/browse')}
        />
      </div>
    )
  }

  const details = getDetails(record)
  const notPublished = record.status !== 'published' && (
    <NoticePanel tone="warning" title="Not published">
      Only you and staff can see this. It's {record.status.replace('-', ' ')} right now.
    </NoticePanel>
  )

  return (
    <>
      {record.type === 'page' && (
        <PageView record={record} details={details} notice={notPublished} />
      )}
      {record.type === 'artwork' && (
        <ArtworkView record={record} details={details} notice={notPublished} />
      )}
      {record.type === 'comic' && (
        <ComicView record={record} details={details} notice={notPublished} />
      )}
      {record.type === 'story' && (
        <StoryView record={record} details={details} notice={notPublished} />
      )}
      {record.type === 'visual-novel' && (
        <VisualNovelView record={record} details={details} notice={notPublished} />
      )}
    </>
  )
}

interface ViewProps {
  record: ContentRecord
  details: ContentDetails
  notice?: React.ReactNode
}

/* --------------------------------------------------------------- Page */

function PageView({ record, details, notice }: ViewProps) {
  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 sm:px-8">
      {notice}
      <div className="flex flex-col gap-4">
        <span className="page-eyebrow">Page</span>
        <h1 className="page-title">{record.title}</h1>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Byline record={record} />
          <EditButton id={record.id} />
        </div>
      </div>
      <img
        src={details.cover}
        alt=""
        className="aspect-[16/7] w-full rounded-[var(--radius-3xl)] object-cover"
      />
      <div className="ui-prose flex flex-col text-[17px] leading-relaxed">
        {details.body
          ? renderMarkdown(details.body)
          : details.sections?.map((s, i) => (
              <React.Fragment key={i}>
                {s.heading && <h2>{s.heading}</h2>}
                {s.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </React.Fragment>
            ))}
      </div>
    </article>
  )
}

/* ------------------------------------------------------------ Artwork */

function ArtworkView({ record, details, notice }: ViewProps) {
  const images = details.images ?? [{ src: details.cover, alt: record.title }]
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <div className={shell}>
      <Crumbs record={record} />
      {notice}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-w-0 flex-col gap-4">
          <AgeGate rating={record.rating} className="overflow-hidden rounded-[var(--radius-3xl)]">
            <button
              type="button"
              onClick={() => setLightbox(active)}
              className="block w-full cursor-zoom-in bg-[var(--muted)]"
              aria-label="Open full size">
              <img
                src={images[active].src}
                alt={images[active].alt ?? record.title}
                className="mx-auto max-h-[80vh] w-auto object-contain"
              />
            </button>
          </AgeGate>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((im, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={im.alt}
                  aria-pressed={active === i}
                  className="ui-media-thumb aspect-[4/5] w-20 aria-pressed:outline-2 aria-pressed:outline-[var(--primary)]">
                  <img src={im.src} alt="" />
                </button>
              ))}
            </div>
          )}
          <Lightbox items={images} index={lightbox} onIndexChange={setLightbox} />
          <div className="mt-4">
            <Comments record={record} />
          </div>
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <ContentHeading record={record} details={details} />
          <Actions record={record} details={details} />
          <p className="body-sm leading-relaxed">{details.description}</p>
          {details.artInfo && <DescriptionList items={details.artInfo} />}
          <TagPanel tags={details.tags} />
        </aside>
      </div>
      <MoreFrom record={record} />
    </div>
  )
}

/* -------------------------------------------------------------- Comic */

function ComicView({ record, details, notice }: ViewProps) {
  const chapters = details.comicChapters ?? []
  const [chapter, setChapter] = useState(0)
  const current = chapters[chapter]

  return (
    <div className={shell}>
      <Crumbs record={record} />
      {notice}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <ContentHeading
          record={record}
          details={details}
          extra={
            <Badge variant="neutral">
              {chapters.reduce((n, c) => n + c.pages.length, 0)} pages
            </Badge>
          }
        />
        <Actions record={record} details={details} />
      </div>

      {chapters.length > 1 && (
        <ChapterNav
          chapters={chapters}
          current={chapter}
          onChange={setChapter}
          className="max-w-xl"
        />
      )}

      {current && (
        <AgeGate rating={record.rating}>
          {/* key resets the reader to page 1 when the chapter changes */}
          <ComicReader
            key={current.id}
            pages={current.pages}
            defaultMode={details.comicSettings?.defaultMode ?? 'book'}
            defaultSpread={details.comicSettings?.spread ?? true}
            direction={details.comicSettings?.direction ?? 'ltr'}
          />
        </AgeGate>
      )}

      {chapter < chapters.length - 1 && (
        <Button
          className="self-center"
          onClick={() => (
            setChapter(chapter + 1),
            window.scrollTo({ top: 0, behavior: 'smooth' })
          )}>
          Next: {chapters[chapter + 1].title}
        </Button>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-8">
          <Panel title="About this comic">
            <p className="body-sm leading-relaxed">{details.description}</p>
          </Panel>
          <Comments record={record} />
        </div>
        <TagPanel tags={details.tags} />
      </div>
      <MoreFrom record={record} />
    </div>
  )
}

/* -------------------------------------------------------------- Story */

function StoryView({ record, details, notice }: ViewProps) {
  const chapters = details.chapters ?? []
  const [chapter, setChapter] = useState(0)
  const [prefs, setPrefs] = useReaderPrefs()
  const articleRef = useRef<HTMLElement>(null)
  const progress = useReadingProgress(articleRef)
  const current = chapters[chapter]
  const words = useMemo(() => current?.paragraphs.join(' ').split(/\s+/).length ?? 0, [current])
  const minutes = Math.max(1, Math.round(words / 230))
  const totalMinutes = Math.max(1, Math.round(wordCount(chapters) / 230))

  const go = (i: number) => {
    setChapter(i)
    articleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <ReadingProgress
        value={progress}
        minutes={minutes}
        label={`${record.title} · Chapter ${chapter + 1}: ${current?.title}`}
      />
      <div className={shell}>
        <Crumbs record={record} />
        {notice}
        <div className="relative overflow-hidden rounded-[var(--radius-3xl)]">
          <img src={details.cover} alt="" className="aspect-[21/8] w-full object-cover" />
        </div>
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          <ContentHeading
            record={record}
            details={details}
            extra={
              <Badge variant="neutral">
                {chapters.length} chapters · {totalMinutes} min read
              </Badge>
            }
          />
          <p className="page-description">{details.description}</p>
          <Actions record={record} details={details} />
          <Separator />
          <div className="flex items-center gap-2">
            <ChapterNav
              chapters={chapters}
              current={chapter}
              onChange={go}
              variant="compact"
              className="flex-1"
            />
            <ReaderSettings value={prefs} onChange={setPrefs} />
          </div>
        </div>

        <AgeGate rating={record.rating}>
          <article ref={articleRef} className="mx-auto scroll-mt-32" style={readerStyle(prefs)}>
            <header
              className="mb-8 flex flex-col gap-1 text-center"
              style={{ fontFamily: 'var(--font-sans)' }}>
              <span className="page-eyebrow">Chapter {chapter + 1}</span>
              <h2 className="section-title">{current?.title}</h2>
              <span className="inline-flex items-center justify-center gap-1 text-xs text-[var(--muted-foreground)]">
                <Clock className="size-3.5" /> {minutes} min · {words.toLocaleString()} words
              </span>
            </header>
            <div className="ui-prose">
              {renderMarkdown(current?.paragraphs.join('\n\n') ?? '')}
              <hr />
            </div>
          </article>
        </AgeGate>

        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
          <ChapterNav chapters={chapters} current={chapter} onChange={go} />
          <TagPanel tags={details.tags} />
          <Comments record={record} />
        </div>
        <MoreFrom record={record} />
      </div>
    </>
  )
}

/* -------------------------------------------------------- Visual novel */

function VisualNovelView({ record, details, notice }: ViewProps) {
  const vn = details.vn!
  const { toast } = useToast()
  const recommended = useMemo(detectPlatform, [])
  const [section, setSection] = useState('about')

  return (
    <div className={shell}>
      <Crumbs record={record} />
      {notice}
      <div className="relative overflow-hidden rounded-[var(--radius-3xl)]">
        <img src={details.cover} alt="" className="aspect-[21/8] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 text-white sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="ui-badge bg-white/15 text-white">Visual novel</span>
            <AgeRating rating={record.rating} className="bg-white/90" />
            <span className="ui-badge bg-white/15 text-white">v{vn.version}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">{record.title}</h1>
          <p className="max-w-2xl text-sm text-white/85 sm:text-base">
            {details.description.split('\n')[0]}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-w-0 flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Byline record={record} />
            <Actions record={record} details={details} />
          </div>

          <AgeGate rating={record.rating}>
            <MediaGallery items={vn.screenshots} columns={3} />
          </AgeGate>

          <SegmentedControl
            aria-label="Section"
            value={section}
            onValueChange={setSection}
            options={[
              { value: 'about', label: 'About' },
              { value: 'changelog', label: `Changelog (${vn.changelog.length})` },
            ]}
          />

          {section === 'about' ? (
            <div className="flex flex-col gap-6">
              <div className="ui-prose ui-md-preview p-0! text-[15px]">
                {renderMarkdown(details.description)}
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Panel title="Features">
                  <ul className="flex flex-col gap-2 text-sm">
                    {vn.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Sparkles className="size-4 shrink-0 text-[var(--primary)]" /> {f}
                      </li>
                    ))}
                  </ul>
                </Panel>
                <Panel title="Content warnings">
                  <ul className="flex flex-col gap-2 text-sm">
                    {vn.contentWarnings.map((w) => (
                      <li key={w} className="flex items-center gap-2">
                        <AlertTriangle className="size-4 shrink-0 text-[var(--status-warning-ink)]" />{' '}
                        {w}
                      </li>
                    ))}
                  </ul>
                </Panel>
              </div>
            </div>
          ) : (
            <ol className="flex flex-col gap-4">
              {vn.changelog.map((c) => (
                <li key={c.version} className="ui-panel py-4!">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold">v{c.version}</span>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {formatDate(c.date)}
                    </span>
                  </div>
                  <p className="body-sm mt-1 text-[var(--muted-foreground)]">{c.notes}</p>
                </li>
              ))}
            </ol>
          )}

          <Comments record={record} />
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <Panel title="Download" description={vn.price}>
            <DownloadList
              files={vn.files}
              recommended={recommended}
              onDownload={(file) =>
                toast({
                  title: 'Download started',
                  description: `${file.name} (${file.size}). It's a demo, so nothing is downloaded.`,
                  tone: 'success',
                })
              }
            />
          </Panel>
          <Panel title="Details">
            <DescriptionList
              items={[
                { label: 'Engine', value: vn.engine, icon: <Cpu /> },
                { label: 'Version', value: vn.version, icon: <Package /> },
                { label: 'Released', value: formatDate(vn.released), icon: <Calendar /> },
                { label: 'Updated', value: formatDate(vn.updated), icon: <History /> },
                { label: 'Play time', value: vn.playtime, icon: <Gamepad2 /> },
                { label: 'Languages', value: vn.languages.join(', '), icon: <Languages /> },
                { label: 'Rating', value: <AgeRating rating={record.rating} />, icon: <Globe /> },
              ]}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {vn.platforms.map((p) => (
                <PlatformBadge key={p} platform={p} />
              ))}
            </div>
          </Panel>
          <TagPanel tags={details.tags} />
        </aside>
      </div>
      <MoreFrom record={record} />
    </div>
  )
}
