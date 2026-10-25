import React, { useMemo, useState } from 'react'

import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Eye,
  FileUp,
  Plus,
  Trash2,
} from 'lucide-react'

import {
  AGE_RATING_INFO,
  AgeRating,
  type AgeRatingValue,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Checkbox,
  countWords,
  Dialog,
  type DownloadFile,
  DragHandle,
  EditorActionBar,
  EmptyState,
  FormSection,
  IconButton,
  ImageUploader,
  MarkdownEditor,
  NotFoundState,
  PageHeader,
  Panel,
  type Platform,
  PLATFORM_INFO,
  PlatformBadge,
  RadioGroup,
  RadioGroupItem,
  SegmentedControl,
  Select,
  SortableList,
  StatusBadge,
  Switch,
  TagInput,
  type TagItem,
  TextField,
  type UploadedImage,
  useToast,
} from '../../index'
import {
  type ContentRecord,
  type ContentStatus,
  type ContentType,
  CURRENT_USER,
  STATUS_LABELS,
  STATUS_TONES,
  TYPE_LABELS,
} from '../data'
import { type ContentDetails, DETAILS, getDetails, img, LABS } from '../details'
import { useShowcase } from '../state'
import { TYPE_ICONS } from './LabApp'

/* ------------------------------------------------------------- Model */

interface ComicChapterDraft {
  id: string
  title: string
  pages: UploadedImage[]
}

interface StoryChapterDraft {
  id: string
  title: string
  body: string
}

interface BuildDraft {
  id: string
  platform: Platform
  fileName: string
  size: string
  note: string
}

interface Draft {
  title: string
  summary: string
  rating: AgeRatingValue | ''
  tags: TagItem[]
  comments: boolean
  lab: string
  status: ContentStatus
  cover: UploadedImage[]
  // page
  body: string
  // artwork
  images: UploadedImage[]
  medium: string
  dimensions: string
  series: string
  // comic
  comicChapters: ComicChapterDraft[]
  direction: 'ltr' | 'rtl'
  defaultMode: 'book' | 'scroll'
  spread: boolean
  // story
  chapters: StoryChapterDraft[]
  // visual novel
  engine: string
  version: string
  playtime: string
  languages: string
  price: string
  builds: BuildDraft[]
  screenshots: UploadedImage[]
  features: string
  warnings: string
  whatsNew: string
}

const uid = () => Math.random().toString(36).slice(2, 9)
const asUpload = (src: string, name?: string): UploadedImage => ({ id: uid(), src, name })
const PERSONAL = 'Personal'

function emptyDraft(type: ContentType): Draft {
  return {
    title: '',
    summary: '',
    rating: type === 'page' ? 'general' : '',
    tags: [],
    comments: type !== 'page',
    lab: LABS[0].name,
    status: 'draft',
    cover: [],
    body: '',
    images: [],
    medium: '',
    dimensions: '',
    series: '',
    comicChapters: [{ id: uid(), title: 'Chapter 1', pages: [] }],
    direction: 'ltr',
    defaultMode: 'book',
    spread: true,
    chapters: [{ id: uid(), title: 'Chapter 1', body: '' }],
    engine: 'Ren’Py',
    version: '1.0.0',
    playtime: '',
    languages: 'English',
    price: 'Free',
    builds: [],
    screenshots: [],
    features: '',
    warnings: '',
    whatsNew: 'First release.',
  }
}

function sectionsToMarkdown(details: ContentDetails) {
  if (details.body) return details.body
  return (details.sections ?? [])
    .map((s) => [s.heading && `## ${s.heading}`, ...s.paragraphs].filter(Boolean).join('\n\n'))
    .join('\n\n')
}

function draftFromRecord(record: ContentRecord, details: ContentDetails): Draft {
  const base = emptyDraft(record.type)
  const info = Object.fromEntries(
    (details.artInfo ?? []).map((i) => [String(i.label), String(i.value)])
  )
  const vn = details.vn
  return {
    ...base,
    title: record.title,
    summary: details.description,
    rating: record.rating,
    tags: details.tags,
    comments: record.comments === 'open',
    lab: record.lab,
    status: record.status === 'archived' ? 'draft' : record.status,
    cover: details.cover ? [asUpload(details.cover, 'Current cover')] : [],
    body: sectionsToMarkdown(details),
    images: (details.images ?? []).map((i) => asUpload(i.src, i.alt)),
    medium: info.Medium ?? '',
    dimensions: info.Size ?? '',
    series: info.Series ?? '',
    comicChapters:
      details.comicChapters?.map((c) => ({
        id: c.id,
        title: c.title,
        pages: c.pages.map((p) => asUpload(p.src, p.alt)),
      })) ?? base.comicChapters,
    direction: details.comicSettings?.direction ?? 'ltr',
    defaultMode: details.comicSettings?.defaultMode ?? 'book',
    spread: details.comicSettings?.spread ?? true,
    chapters:
      details.chapters?.map((c) => ({
        id: c.id,
        title: c.title,
        body: c.paragraphs.join('\n\n'),
      })) ?? base.chapters,
    engine: vn?.engine.replace(/\s[\d.]+$/, '') ?? base.engine,
    version: vn?.version ?? base.version,
    playtime: vn?.playtime ?? '',
    languages: vn?.languages.join(', ') ?? base.languages,
    price: vn?.price ?? base.price,
    builds:
      vn?.files.map((f) => ({
        id: f.id,
        platform: f.platform,
        fileName: f.name,
        size: f.size ?? '',
        note: f.note ?? '',
      })) ?? [],
    screenshots: vn?.screenshots.map((s) => asUpload(s.src, s.alt)) ?? [],
    features: vn?.features.join('\n') ?? '',
    warnings: vn?.contentWarnings.join('\n') ?? '',
    whatsNew: '',
  }
}

function detailsFromDraft(
  type: ContentType,
  id: string,
  d: Draft,
  previous?: ContentDetails
): ContentDetails {
  const lines = (s: string) =>
    s
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
  const cover =
    d.cover[0]?.src ??
    (type === 'artwork'
      ? d.images[0]?.src
      : type === 'comic'
        ? d.comicChapters[0]?.pages[0]?.src
        : undefined) ??
    img(id, 1200, 900)
  const base: ContentDetails = {
    description: d.summary,
    cover,
    tags: d.tags,
    saves: previous?.saves ?? 0,
    views: previous?.views ?? 0,
  }
  switch (type) {
    case 'page':
      return { ...base, body: d.body }
    case 'artwork':
      return {
        ...base,
        images: d.images.map((i, n) => ({
          src: i.src,
          fullSrc: i.src.startsWith('blob:')
            ? i.src
            : i.src.replace(/\/(\d+)\/(\d+)$/, '/2000/2500'),
          alt: n === 0 ? d.title : `${d.title}, view ${n + 1}`,
        })),
        artInfo: [
          d.medium && { label: 'Medium', value: d.medium },
          d.dimensions && { label: 'Size', value: d.dimensions },
          d.series && { label: 'Series', value: d.series },
        ].filter(Boolean) as ContentDetails['artInfo'],
      }
    case 'comic':
      return {
        ...base,
        comicChapters: d.comicChapters.map((c) => ({
          id: c.id,
          title: c.title,
          pages: c.pages.map((p, n) => ({ src: p.src, alt: `Page ${n + 1}` })),
        })),
        comicSettings: { direction: d.direction, defaultMode: d.defaultMode, spread: d.spread },
      }
    case 'story':
      return {
        ...base,
        chapters: d.chapters.map((c) => ({
          id: c.id,
          title: c.title,
          paragraphs: c.body
            .split(/\n{2,}/)
            .map((p) => p.trim())
            .filter(Boolean),
        })),
      }
    case 'visual-novel': {
      const now = new Date().toISOString()
      const prev = previous?.vn
      const changelog = prev?.changelog ?? []
      const files: DownloadFile[] = d.builds.map((b) => ({
        id: b.id,
        name: b.fileName,
        platform: b.platform,
        size: b.size,
        version: d.version,
        note: b.note || undefined,
      }))
      return {
        ...base,
        vn: {
          engine: d.engine,
          version: d.version,
          released: prev?.released ?? now,
          updated: now,
          playtime: d.playtime,
          languages: d.languages
            .split(',')
            .map((l) => l.trim())
            .filter(Boolean),
          platforms: Array.from(new Set(d.builds.map((b) => b.platform))),
          files,
          screenshots: d.screenshots.map((s, n) => ({
            src: s.src,
            fullSrc: s.src,
            alt: `Screenshot ${n + 1}`,
          })),
          features: lines(d.features),
          contentWarnings: lines(d.warnings),
          changelog:
            d.whatsNew.trim() && changelog[0]?.version !== d.version
              ? [{ version: d.version, date: now, notes: d.whatsNew.trim() }, ...changelog]
              : changelog,
          price: d.price,
        },
      }
    }
  }
}

function useTagSuggestions() {
  return useMemo(() => {
    const map = new Map<string, TagItem>()
    Object.values(DETAILS).forEach((d) =>
      d.tags.forEach((t) => {
        const existing = map.get(t.name)
        if (!existing || (t.count ?? 0) > (existing.count ?? 0)) map.set(t.name, t)
      })
    )
    return Array.from(map.values())
  }, [])
}

function formatBytes(bytes: number) {
  return bytes > 1e9
    ? `${(bytes / 1e9).toFixed(1)} GB`
    : bytes > 1e6
      ? `${Math.round(bytes / 1e6)} MB`
      : `${Math.max(1, Math.round(bytes / 1e3))} KB`
}

/* ------------------------------------------------------- Validation */

interface Check {
  label: string
  ok: boolean
  /** Required to publish (otherwise only a recommendation). */
  required: boolean
}

function checksFor(type: ContentType, d: Draft): Check[] {
  const checks: Check[] = [{ label: 'Title', ok: d.title.trim().length > 0, required: true }]
  if (type !== 'page') {
    checks.push({ label: 'Summary', ok: d.summary.trim().length >= 20, required: true })
    checks.push({ label: 'Age rating', ok: d.rating !== '', required: true })
    checks.push({ label: 'At least 5 tags', ok: d.tags.length >= 5, required: false })
    checks.push({
      label: 'An artist tag',
      ok: d.tags.some((t) => t.category === 'artist'),
      required: false,
    })
  }
  if (type === 'page')
    checks.push({ label: 'Some body text', ok: countWords(d.body) >= 10, required: true })
  if (type === 'artwork')
    checks.push({ label: 'At least one image', ok: d.images.length > 0, required: true })
  if (type === 'comic') {
    checks.push({
      label: 'Every chapter has pages',
      ok: d.comicChapters.length > 0 && d.comicChapters.every((c) => c.pages.length > 0),
      required: true,
    })
  }
  if (type === 'story') {
    checks.push({
      label: 'Every chapter has text',
      ok: d.chapters.length > 0 && d.chapters.every((c) => countWords(c.body) > 0),
      required: true,
    })
  }
  if (type === 'visual-novel') {
    checks.push({
      label: 'At least one build',
      ok: d.builds.length > 0 && d.builds.every((b) => b.fileName),
      required: true,
    })
    checks.push({
      label: 'Three or more screenshots',
      ok: d.screenshots.length >= 3,
      required: false,
    })
  }
  return checks
}

/* ------------------------------------------------------- Type picker */

const TYPE_BLURBS: Record<ContentType, string> = {
  page: 'An information page for your profile or Lab: about, FAQ, commission terms.',
  artwork: 'One piece, or a set of views and sketches. Tagged and rated.',
  comic: 'Multi-page chapters read as a book or a vertical scroll.',
  story: 'Prose in chapters, with a reader that remembers font settings.',
  'visual-novel': 'A downloadable game: builds per platform, screenshots and a changelog.',
}

export function NewContentPicker() {
  const { navigate } = useShowcase()
  return (
    <div className="mx-auto flex max-w-[var(--container-max)] flex-col gap-8 px-4 py-10 sm:px-8">
      <PageHeader
        title="Create something"
        description="Pick what you're making. You can save a draft at any point."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {(Object.keys(TYPE_LABELS) as ContentType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => navigate(`lab/new/${type}`)}
            className="ui-panel flex flex-col items-start gap-3 text-left transition-colors hover:border-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--ring)]">
            <span className="ui-hero-icon size-12! [&>svg]:size-5">{TYPE_ICONS[type]}</span>
            <span className="text-base font-bold">{TYPE_LABELS[type]}</span>
            <span className="body-sm text-[var(--muted-foreground)]">{TYPE_BLURBS[type]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ Editor */

export function ContentEditor({ type: typeProp, id }: { type?: ContentType; id?: string }) {
  const { content, navigate, addContent, updateContent, log } = useShowcase()
  const { toast } = useToast()
  const record = id ? content.find((c) => c.id === id) : undefined
  const type = record?.type ?? typeProp

  const [initial] = useState<Draft | null>(() => {
    if (record) return draftFromRecord(record, getDetails(record))
    return type ? emptyDraft(type) : null
  })
  const [draft, setDraft] = useState<Draft | null>(initial)
  const [saved, setSaved] = useState(initial)
  const [submitted, setSubmitted] = useState(false)
  const [confirmLeave, setConfirmLeave] = useState(false)
  const suggestions = useTagSuggestions()

  if (!type || !draft || (id && !record)) {
    return (
      <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 sm:px-8">
        <NotFoundState
          title="Nothing to edit"
          description="That creation doesn't exist, or the type isn't one we know."
          onHomeClick={() => navigate('lab/new')}
        />
      </div>
    )
  }

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d))
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved)
  const checks = checksFor(type, draft)
  const canPublish = checks.every((c) => !c.required || c.ok)
  const isNew = !record
  const label = TYPE_LABELS[type].toLowerCase()
  const err = (ok: boolean, message: string) => (submitted && !ok ? message : undefined)

  const save = (status: ContentStatus) => {
    setSubmitted(true)
    if (!draft.title.trim()) {
      toast({
        title: 'Add a title first',
        description: 'Everything else can wait.',
        tone: 'warning',
      })
      return
    }
    if (status !== 'draft' && !canPublish) {
      toast({
        title: 'A few things are missing',
        description: 'Check the list on the right.',
        tone: 'warning',
      })
      return
    }
    const contentId = record?.id ?? `n${uid()}`
    // Showcase only: details live in a module-level map, so editing it is enough for every view to pick it up.
    DETAILS[contentId] = detailsFromDraft(
      type,
      contentId,
      draft,
      record ? getDetails(record) : undefined
    )
    const fields: Partial<ContentRecord> = {
      title: draft.title.trim(),
      rating: (draft.rating || 'general') as AgeRatingValue,
      tags: draft.tags.filter((t) => t.category === 'general').map((t) => t.name),
      comments: draft.comments ? 'open' : 'closed',
      lab: draft.lab,
      status,
      summary: draft.summary,
    }
    if (record) {
      updateContent([record.id], fields)
    } else {
      addContent({
        ...fields,
        id: contentId,
        type,
        creator: CURRENT_USER.name,
        updated: new Date().toISOString(),
      } as ContentRecord)
    }
    const next = { ...draft, status }
    setDraft(next)
    setSaved(next)
    log(
      `“${fields.title}” ${status === 'draft' ? 'saved as a draft' : status === 'in-review' ? 'sent for review' : 'published'}`,
      STATUS_TONES[status]
    )
    toast({
      title:
        status === 'draft'
          ? 'Draft saved'
          : status === 'in-review'
            ? 'Sent for review'
            : 'Published',
      description:
        status === 'published'
          ? 'It’s live on your profile and in Browse.'
          : `“${fields.title}” is in My content.`,
      tone: 'success',
      action: { label: 'View', onClick: () => navigate(`lab/view/${contentId}`) },
    })
    if (status === 'published') navigate(`lab/view/${contentId}`)
    else if (isNew) navigate(`lab/edit/${contentId}`)
  }

  const leave = () =>
    dirty
      ? setConfirmLeave(true)
      : navigate(record ? `lab/view/${record.id}` : 'lab/library/content')

  return (
    <div className="flex flex-col">
      <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-col gap-8 px-4 py-8 sm:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#/lab/library/content">My content</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {isNew ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#/lab/new">New</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{TYPE_LABELS[type]}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage className="max-w-[16rem] truncate">
                  Edit “{record.title}”
                </BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <PageHeader
          title={isNew ? `New ${label}` : `Edit ${label}`}
          description={TYPE_BLURBS[type]}
          actions={
            <>
              <StatusBadge tone={STATUS_TONES[saved?.status ?? 'draft']}>
                {STATUS_LABELS[saved?.status ?? 'draft']}
              </StatusBadge>
              {record && (
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Eye className="size-4" />}
                  onClick={() => navigate(`lab/view/${record.id}`)}>
                  View
                </Button>
              )}
            </>
          }
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <form className="flex min-w-0 flex-col gap-10" onSubmit={(e) => e.preventDefault()}>
            <FormSection
              title="Basics"
              description={
                type === 'page'
                  ? 'Pages have no rating, tags or comments.'
                  : 'What people see in Browse and on your profile.'
              }>
              <TextField
                label="Title"
                value={draft.title}
                maxLength={120}
                onChange={(e) => set('title', e.target.value)}
                placeholder={`Name your ${label}`}
                error={err(draft.title.trim().length > 0, 'A title is required')}
                helperText={`${draft.title.length}/120`}
              />
              {type !== 'page' && type !== 'visual-novel' && (
                <TextField
                  label="Summary"
                  isTextarea
                  rows={3}
                  value={draft.summary}
                  onChange={(e) => set('summary', e.target.value)}
                  placeholder="A sentence or two for the card and the top of the page"
                  error={err(
                    draft.summary.trim().length >= 20,
                    'Write at least a sentence (20 characters)'
                  )}
                  helperText={`${draft.summary.length}/400`}
                  maxLength={400}
                />
              )}
              {type !== 'artwork' && (
                <ImageUploader
                  label={type === 'page' ? 'Header image' : 'Cover'}
                  multiple={false}
                  value={draft.cover}
                  onChange={(v) => set('cover', v)}
                  aspect={type === 'comic' ? 'page' : 'video'}
                  noun="cover"
                  helperText={
                    type === 'comic'
                      ? 'Optional. The first page is used if you skip this.'
                      : 'JPG, PNG or WebP. 1600 × 900 or larger looks best.'
                  }
                />
              )}
            </FormSection>

            {type === 'page' && (
              <FormSection
                title="Content"
                description="Write in Markdown. Use ## for section headings.">
                <MarkdownEditor
                  label="Body"
                  rows={16}
                  value={draft.body}
                  onChange={(v) => set('body', v)}
                  error={err(countWords(draft.body) >= 10, 'Write a few sentences')}
                />
              </FormSection>
            )}

            {type === 'artwork' && <ArtworkFields draft={draft} set={set} submitted={submitted} />}
            {type === 'comic' && <ComicFields draft={draft} set={set} submitted={submitted} />}
            {type === 'story' && <StoryFields draft={draft} set={set} submitted={submitted} />}
            {type === 'visual-novel' && (
              <VisualNovelFields draft={draft} set={set} submitted={submitted} />
            )}

            {type !== 'page' && (
              <>
                <FormSection
                  title="Age rating"
                  description="Pick the highest rating that applies. Explicit work is hidden from people who haven't opted in.">
                  <RadioGroup
                    label="Rating"
                    value={draft.rating}
                    onValueChange={(v) => set('rating', v as AgeRatingValue)}
                    orientation="horizontal"
                    variant="card">
                    {(Object.keys(AGE_RATING_INFO) as AgeRatingValue[]).map((r) => (
                      <RadioGroupItem
                        key={r}
                        value={r}
                        label={
                          <span className="flex items-center gap-2">
                            <AgeRating rating={r} /> {AGE_RATING_INFO[r].label}
                          </span>
                        }
                        description={AGE_RATING_INFO[r].description}
                      />
                    ))}
                  </RadioGroup>
                  {submitted && !draft.rating && (
                    <p className="text-xs font-medium text-[var(--destructive)]">Choose a rating</p>
                  )}
                </FormSection>

                <FormSection
                  title="Tags"
                  description="Tags are how people find work and filter what they don't want to see. Be thorough and honest.">
                  <TagInput
                    label="Tags"
                    value={draft.tags}
                    onChange={(v) => set('tags', v)}
                    suggestions={suggestions}
                    minTags={5}
                    maxTags={60}
                  />
                </FormSection>
              </>
            )}
          </form>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <Panel title="Publishing">
              <div className="flex flex-col gap-5">
                <Select
                  label="Publish to"
                  value={draft.lab}
                  onChange={(e) => set('lab', e.target.value)}
                  options={[
                    ...LABS.filter((l) =>
                      l.members.some((m) => m.handle === CURRENT_USER.handle)
                    ).map((l) => ({ value: l.name, label: l.name })),
                    { value: PERSONAL, label: 'My profile only' },
                  ]}
                />
                {type !== 'page' && (
                  <Switch
                    checked={draft.comments}
                    onCheckedChange={(v) => set('comments', v)}
                    label="Allow comments"
                  />
                )}
              </div>
            </Panel>
            <Panel
              title="Checklist"
              description={
                canPublish ? 'Ready to publish.' : 'Required items must be done before publishing.'
              }>
              <ul className="flex flex-col gap-2 text-sm">
                {checks.map((c) => (
                  <li key={c.label} className="flex items-center gap-2">
                    {c.ok ? (
                      <CheckCircle2 className="size-4 shrink-0 text-[var(--status-success-ink)]" />
                    ) : (
                      <Circle
                        className={
                          c.required
                            ? 'size-4 shrink-0 text-[var(--status-warning-ink)]'
                            : 'size-4 shrink-0 text-[var(--muted-foreground)]'
                        }
                      />
                    )}
                    <span className={c.ok ? 'text-[var(--muted-foreground)] line-through' : ''}>
                      {c.label}
                    </span>
                    {!c.required && !c.ok && (
                      <Badge variant="neutral" size="sm">
                        Tip
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            </Panel>
          </aside>
        </div>
      </div>

      <EditorActionBar dirty={dirty} status={!dirty && isNew ? 'Not saved yet' : undefined}>
        <Button variant="ghost" onClick={leave}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={() => save('draft')}>
          Save draft
        </Button>
        <Button variant="secondary" onClick={() => save('in-review')}>
          Send for review
        </Button>
        <Button onClick={() => save('published')} disabled={submitted && !canPublish}>
          {record?.status === 'published' ? 'Update' : 'Publish'}
        </Button>
      </EditorActionBar>

      <Dialog
        open={confirmLeave}
        onClose={() => setConfirmLeave(false)}
        title="Discard your changes?"
        description="You have edits that haven't been saved."
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmLeave(false)}>
              Keep editing
            </Button>
            <Button
              variant="danger"
              onClick={() => navigate(record ? `lab/view/${record.id}` : 'lab/library/content')}>
              Discard
            </Button>
          </>
        }
      />
    </div>
  )
}

type FieldProps = {
  draft: Draft
  set: <K extends keyof Draft>(key: K, value: Draft[K]) => void
  submitted: boolean
}

/* ------------------------------------------------------------ Artwork */

function ArtworkFields({ draft, set, submitted }: FieldProps) {
  return (
    <FormSection
      title="Images"
      description="The first image is the main piece and the cover. Add alternates, details or sketches after it.">
      <ImageUploader
        label="Images"
        value={draft.images}
        onChange={(v) => set('images', v)}
        firstLabel="Main"
        max={12}
        helperText="Up to 12 images. Drag to reorder."
        error={submitted && draft.images.length === 0 ? 'Add at least one image' : undefined}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TextField
          label="Medium"
          value={draft.medium}
          onChange={(e) => set('medium', e.target.value)}
          placeholder="Gouache, digital…"
        />
        <TextField
          label="Size"
          value={draft.dimensions}
          onChange={(e) => set('dimensions', e.target.value)}
          placeholder="4000 × 5000 px"
        />
        <TextField
          label="Series"
          value={draft.series}
          onChange={(e) => set('series', e.target.value)}
          placeholder="Optional"
        />
      </div>
    </FormSection>
  )
}

/* -------------------------------------------------------------- Comic */

function ComicFields({ draft, set, submitted }: FieldProps) {
  const [open, setOpen] = useState(draft.comicChapters[0]?.id ?? '')
  const update = (id: string, patch: Partial<ComicChapterDraft>) =>
    set(
      'comicChapters',
      draft.comicChapters.map((c) => (c.id === id ? { ...c, ...patch } : c))
    )
  const totalPages = draft.comicChapters.reduce((n, c) => n + c.pages.length, 0)

  return (
    <>
      <FormSection
        title="Chapters & pages"
        description={`${draft.comicChapters.length} chapters · ${totalPages} pages. Upload pages in reading order, then drag to fix any that are out of place.`}
        actions={
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<Plus className="size-4" />}
            onClick={() => {
              const chapter = {
                id: uid(),
                title: `Chapter ${draft.comicChapters.length + 1}`,
                pages: [],
              }
              set('comicChapters', [...draft.comicChapters, chapter])
              setOpen(chapter.id)
            }}>
            Add chapter
          </Button>
        }>
        <SortableList
          items={draft.comicChapters}
          getKey={(c) => c.id}
          getLabel={(c) => c.title}
          onReorder={(v) => set('comicChapters', v)}
          renderItem={(chapter, api) => (
            <div className="ui-panel flex flex-col gap-4 p-4!">
              <div className="flex items-center gap-2">
                <DragHandle {...api.handleProps} />
                <TextField
                  aria-label="Chapter title"
                  value={chapter.title}
                  onChange={(e) => update(chapter.id, { title: e.target.value })}
                  className="font-semibold"
                />
                <Badge variant={chapter.pages.length ? 'neutral' : 'warning'} className="shrink-0">
                  {chapter.pages.length} pages
                </Badge>
                <IconButton
                  aria-label={open === chapter.id ? 'Collapse chapter' : 'Expand chapter'}
                  aria-expanded={open === chapter.id}
                  variant="ghost"
                  icon={
                    open === chapter.id ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )
                  }
                  onClick={() => setOpen(open === chapter.id ? '' : chapter.id)}
                />
                <IconButton
                  aria-label={`Delete ${chapter.title}`}
                  variant="ghost"
                  disabled={draft.comicChapters.length === 1}
                  icon={<Trash2 className="size-4" />}
                  onClick={() =>
                    set(
                      'comicChapters',
                      draft.comicChapters.filter((c) => c.id !== chapter.id)
                    )
                  }
                />
              </div>
              {open === chapter.id && (
                <ImageUploader
                  value={chapter.pages}
                  onChange={(pages) => update(chapter.id, { pages })}
                  aspect="page"
                  numbered
                  noun="page"
                  helperText="Select many files at once. They're sorted by file name, so 01.png, 02.png… works best."
                  error={
                    submitted && chapter.pages.length === 0
                      ? 'This chapter has no pages'
                      : undefined
                  }
                />
              )}
            </div>
          )}
        />
      </FormSection>

      <FormSection
        title="Reader"
        description="How the comic opens for readers. They can still switch modes.">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <span className="button-sm">Default mode</span>
            <SegmentedControl
              fullWidth
              aria-label="Default mode"
              value={draft.defaultMode}
              onValueChange={(v) => set('defaultMode', v as Draft['defaultMode'])}
              options={[
                { value: 'book', label: 'Book (page by page)' },
                { value: 'scroll', label: 'Vertical scroll' },
              ]}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="button-sm">Reading direction</span>
            <SegmentedControl
              fullWidth
              aria-label="Reading direction"
              value={draft.direction}
              onValueChange={(v) => set('direction', v as Draft['direction'])}
              options={[
                { value: 'ltr', label: 'Left to right' },
                { value: 'rtl', label: 'Right to left (manga)' },
              ]}
            />
          </div>
        </div>
        <Switch
          checked={draft.spread}
          onCheckedChange={(v) => set('spread', v)}
          label="Two-page spreads on wide screens"
          description="The first page is shown alone, as a cover."
        />
      </FormSection>
    </>
  )
}

/* -------------------------------------------------------------- Story */

function StoryFields({ draft, set, submitted }: FieldProps) {
  const [open, setOpen] = useState(draft.chapters[0]?.id ?? '')
  const update = (id: string, patch: Partial<StoryChapterDraft>) =>
    set(
      'chapters',
      draft.chapters.map((c) => (c.id === id ? { ...c, ...patch } : c))
    )
  const words = draft.chapters.reduce((n, c) => n + countWords(c.body), 0)

  return (
    <FormSection
      title="Chapters"
      description={`${draft.chapters.length} chapters · ${words.toLocaleString()} words · about ${Math.max(1, Math.round(words / 230))} min. Use --- for a scene break.`}
      actions={
        <Button
          size="sm"
          variant="secondary"
          leftIcon={<Plus className="size-4" />}
          onClick={() => {
            const chapter = { id: uid(), title: `Chapter ${draft.chapters.length + 1}`, body: '' }
            set('chapters', [...draft.chapters, chapter])
            setOpen(chapter.id)
          }}>
          Add chapter
        </Button>
      }>
      <SortableList
        items={draft.chapters}
        getKey={(c) => c.id}
        getLabel={(c) => c.title}
        onReorder={(v) => set('chapters', v)}
        renderItem={(chapter, api) => (
          <div className="ui-panel flex flex-col gap-4 p-4!">
            <div className="flex items-center gap-2">
              <DragHandle {...api.handleProps} />
              <span className="w-7 shrink-0 text-center text-sm font-bold text-[var(--muted-foreground)]">
                {api.index + 1}
              </span>
              <TextField
                aria-label="Chapter title"
                value={chapter.title}
                onChange={(e) => update(chapter.id, { title: e.target.value })}
                className="font-semibold"
              />
              <span className="hidden shrink-0 text-xs tabular-nums text-[var(--muted-foreground)] sm:inline">
                {countWords(chapter.body).toLocaleString()} words
              </span>
              <IconButton
                aria-label={open === chapter.id ? 'Collapse chapter' : 'Expand chapter'}
                aria-expanded={open === chapter.id}
                variant="ghost"
                icon={
                  open === chapter.id ? (
                    <ChevronUp className="size-4" />
                  ) : (
                    <ChevronDown className="size-4" />
                  )
                }
                onClick={() => setOpen(open === chapter.id ? '' : chapter.id)}
              />
              <IconButton
                aria-label={`Delete ${chapter.title}`}
                variant="ghost"
                disabled={draft.chapters.length === 1}
                icon={<Trash2 className="size-4" />}
                onClick={() =>
                  set(
                    'chapters',
                    draft.chapters.filter((c) => c.id !== chapter.id)
                  )
                }
              />
            </div>
            {open === chapter.id && (
              <MarkdownEditor
                rows={14}
                value={chapter.body}
                onChange={(body) => update(chapter.id, { body })}
                previewStyle={{
                  fontFamily: "'Iowan Old Style', Palatino, Georgia, serif",
                  fontSize: 18,
                }}
                placeholder="Start writing… Blank lines separate paragraphs."
                error={
                  submitted && countWords(chapter.body) === 0 ? 'This chapter is empty' : undefined
                }
              />
            )}
          </div>
        )}
      />
    </FormSection>
  )
}

/* -------------------------------------------------------- Visual novel */

const ENGINES = ['Ren’Py', 'Unity', 'Godot', 'TyranoBuilder', 'Twine', 'Naninovel', 'Other']

function VisualNovelFields({ draft, set, submitted }: FieldProps) {
  const updateBuild = (id: string, patch: Partial<BuildDraft>) =>
    set(
      'builds',
      draft.builds.map((b) => (b.id === id ? { ...b, ...patch } : b))
    )
  const usedPlatforms = new Set(draft.builds.map((b) => b.platform))
  const nextPlatform =
    (Object.keys(PLATFORM_INFO) as Platform[]).find((p) => !usedPlatforms.has(p)) ?? 'windows'

  return (
    <>
      <FormSection
        title="Store page"
        description="The long description, features and content warnings shown on the download page.">
        <MarkdownEditor
          label="Description"
          rows={8}
          value={draft.summary}
          onChange={(v) => set('summary', v)}
          showWordCount={false}
          helperText="The first paragraph also appears on the cover and in Browse."
          error={
            submitted && draft.summary.trim().length < 20
              ? 'Describe the game in at least a sentence'
              : undefined
          }
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField
            label="Features"
            isTextarea
            rows={4}
            value={draft.features}
            onChange={(e) => set('features', e.target.value)}
            placeholder={'One per line\nThree endings\nController support'}
          />
          <TextField
            label="Content warnings"
            isTextarea
            rows={4}
            value={draft.warnings}
            onChange={(e) => set('warnings', e.target.value)}
            placeholder={'One per line\nGrief\nMild horror imagery'}
          />
        </div>
        <ImageUploader
          label="Screenshots"
          value={draft.screenshots}
          onChange={(v) => set('screenshots', v)}
          aspect="video"
          noun="screenshot"
          max={12}
          helperText="16:9 works best. Show a variety of scenes."
        />
      </FormSection>

      <FormSection title="Game details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Engine"
            value={draft.engine}
            onChange={(e) => set('engine', e.target.value)}
            options={ENGINES.map((e) => ({ value: e, label: e }))}
          />
          <TextField
            label="Version"
            value={draft.version}
            onChange={(e) => set('version', e.target.value)}
            placeholder="1.0.0"
          />
          <TextField
            label="Play time"
            value={draft.playtime}
            onChange={(e) => set('playtime', e.target.value)}
            placeholder="2–3 hours"
          />
          <TextField
            label="Price"
            value={draft.price}
            onChange={(e) => set('price', e.target.value)}
            placeholder="Free · pay what you want"
          />
        </div>
        <TextField
          label="Languages"
          value={draft.languages}
          onChange={(e) => set('languages', e.target.value)}
          helperText="Separate with commas."
        />
      </FormSection>

      <FormSection
        title="Builds"
        description="One file per platform. Platforms on the page come from the builds you add."
        actions={
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<Plus className="size-4" />}
            onClick={() =>
              set('builds', [
                ...draft.builds,
                { id: uid(), platform: nextPlatform, fileName: '', size: '', note: '' },
              ])
            }>
            Add build
          </Button>
        }>
        {draft.builds.length === 0 ? (
          <EmptyState
            icon={<FileUp className="size-7" />}
            title="No builds yet"
            description="Add a build for each platform you support."
            className={submitted ? 'border-[var(--destructive)]' : undefined}
            action={
              <Button
                variant="secondary"
                onClick={() =>
                  set('builds', [
                    { id: uid(), platform: 'windows', fileName: '', size: '', note: '' },
                  ])
                }>
                Add a Windows build
              </Button>
            }
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {draft.builds.map((b) => (
              <li key={b.id} className="ui-download-row flex-wrap">
                <Select
                  aria-label="Platform"
                  containerClassName="w-40"
                  value={b.platform}
                  onChange={(e) => updateBuild(b.id, { platform: e.target.value as Platform })}
                  options={(Object.keys(PLATFORM_INFO) as Platform[]).map((p) => ({
                    value: p,
                    label: PLATFORM_INFO[p].label,
                  }))}
                />
                <label
                  className={
                    b.fileName
                      ? 'secondary-button min-h-10! min-w-0 flex-1 justify-start'
                      : 'secondary-button min-h-10! flex-1 justify-start border-dashed'
                  }>
                  <FileUp className="size-4 shrink-0" />
                  <span className="truncate">
                    {b.fileName ? `${b.fileName} · ${b.size}` : 'Choose file…'}
                  </span>
                  <input
                    type="file"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file)
                        updateBuild(b.id, { fileName: file.name, size: formatBytes(file.size) })
                    }}
                  />
                </label>
                <TextField
                  aria-label="Note"
                  value={b.note}
                  onChange={(e) => updateBuild(b.id, { note: e.target.value })}
                  placeholder="Note, e.g. Android 8+"
                  className="w-48"
                />
                <IconButton
                  aria-label="Remove build"
                  variant="ghost"
                  icon={<Trash2 className="size-4" />}
                  onClick={() =>
                    set(
                      'builds',
                      draft.builds.filter((x) => x.id !== b.id)
                    )
                  }
                />
              </li>
            ))}
          </ul>
        )}
        {draft.builds.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Array.from(usedPlatforms).map((p) => (
              <PlatformBadge key={p} platform={p} />
            ))}
          </div>
        )}
        {submitted && draft.builds.some((b) => !b.fileName) && (
          <p className="text-xs font-medium text-[var(--destructive)]">
            Choose a file for every build
          </p>
        )}
        <TextField
          label={`What's new in ${draft.version || 'this version'}`}
          isTextarea
          rows={3}
          value={draft.whatsNew}
          onChange={(e) => set('whatsNew', e.target.value)}
          helperText="Added to the changelog when the version number changes."
        />
        <Checkbox defaultChecked label="Notify followers about this update" />
      </FormSection>
    </>
  )
}
