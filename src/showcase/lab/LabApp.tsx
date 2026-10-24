import React, { useMemo, useState } from 'react'
import {
  AppSwitcher,
  Badge,
  BrandLockup,
  Button,
  ContentCard,
  DropdownMenu,
  EmptyState,
  FilterChip,
  Input,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MetricCard,
  PageHeader,
  PageHeading,
  Panel,
  ProfileAvatar,
  RadioGroup,
  RadioGroupItem,
  Select,
  SidebarNav,
  SidebarNavGroup,
  SidebarNavItem,
  SiteBanner,
  SiteFooter,
  SiteHeader,
  SiteNav,
  SiteNavLink,
  StatusBadge,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TextField,
  ThemeToggle,
  UserMenu,
  DynamicLabMark,
  useToast,
} from '../../index'
import {
  Bell,
  BookImage,
  BookOpen,
  FilePlus2,
  FileText,
  Gamepad2,
  LayoutDashboard,
  Library,
  Link2,
  LogOut,
  Palette,
  Pencil,
  Search,
  SearchX,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  User,
} from 'lucide-react'
import {
  ALL_TAGS,
  CURRENT_USER,
  RATING_LABELS,
  STATUS_LABELS,
  STATUS_TONES,
  TYPE_LABELS,
  TYPE_PLURALS,
  type ContentRecord,
  type ContentType,
} from '../data'
import { APPS, formatDate, useShowcase } from '../state'
import { ComponentGallery } from '../gallery/ComponentGallery'
import { DETAILS, LABS, PROFILES, getDetails } from '../details'
import { ContentView } from './ContentView'
import { LabPage, LinksPage, ProfilePage } from './CreatorPages'

export const TYPE_ICONS: Record<ContentType, React.ReactNode> = {
  page: <FileText />,
  artwork: <Palette />,
  story: <BookOpen />,
  comic: <BookImage />,
  'visual-novel': <Gamepad2 />,
}

const TYPES = Object.keys(TYPE_LABELS) as ContentType[]

export function LabApp() {
  const { page, navigate, maintenance } = useShowcase()
  const { toast } = useToast()
  const section = page.split(/[/?]/)[0]
  const param = page.split('/')[1] ?? ''

  // Link-in-bio pages stand alone, without the site chrome.
  if (section === 'links') return <LinksPage handle={param} />

  const nav = (
    <SiteNav>
      <SiteNavLink active={section === 'home'} onClick={() => navigate('lab/home')}>
        Home
      </SiteNavLink>
      <SiteNavLink active={section === 'browse'} onClick={() => navigate('lab/browse')}>
        Browse
      </SiteNavLink>
      <SiteNavLink active={section === 'library'} onClick={() => navigate('lab/library')}>
        Library
      </SiteNavLink>
      <SiteNavLink active={section === 'components'} onClick={() => navigate('lab/components')}>
        Components
      </SiteNavLink>
    </SiteNav>
  )

  return (
    <div className="dynamic-lab-glow-bg flex min-h-screen flex-col">
      {maintenance && (
        <SiteBanner tone="warning">
          Maintenance mode is on. Visitors and Lab members have limited access to the site.
        </SiteBanner>
      )}
      <SiteHeader
        brand={
          <button type="button" onClick={() => navigate('lab/home')} className="rounded-[var(--radius-md)]" aria-label="Dynamic Lab home">
            <BrandLockup name="Dynamic Lab" />
          </button>
        }
        nav={nav}
        actions={
          <>
            <ThemeToggle variant="ghost" />
            <AppSwitcher apps={APPS} value="lab" onValueChange={(id) => navigate(`${id}/`)} />
            <UserMenu name={CURRENT_USER.name} email={CURRENT_USER.email}>
              <MenuItem icon={<LayoutDashboard />} onClick={() => navigate('lab/library/overview')}>
                Dashboard
              </MenuItem>
              <MenuItem icon={<FileText />} onClick={() => navigate('lab/library')}>
                My content
              </MenuItem>
              <MenuItem icon={<User />} onClick={() => navigate(`lab/u/${CURRENT_USER.handle}`)}>
                Your profile
              </MenuItem>
              <MenuItem icon={<Link2 />} onClick={() => navigate(`lab/links/${CURRENT_USER.handle}`)}>
                Your links page
              </MenuItem>
              <MenuItem icon={<ShieldCheck />} subtitle="Staff administration" onClick={() => navigate('backstage/')}>
                Backstage
              </MenuItem>
              <MenuSeparator />
              <MenuItem
                icon={<LogOut />}
                onClick={() => toast({ title: 'Signed out', description: 'This is a demo, so you are still here.', tone: 'info' })}>
                Sign out
              </MenuItem>
            </UserMenu>
          </>
        }
      />

      <main className="flex-1">
        {section === 'home' && <HomePage />}
        {section === 'browse' && <BrowsePage />}
        {section === 'library' && <LibraryPage sub={param || 'content'} />}
        {section === 'view' && <ContentView key={param} id={param} />}
        {section === 'u' && <ProfilePage key={param} handle={param} />}
        {section === 'labs' && <LabPage key={param} slug={param} />}
        {section === 'components' && (
          <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 sm:px-8">
            <ComponentGallery />
          </div>
        )}
        {!['home', 'browse', 'library', 'components', 'view', 'u', 'labs'].includes(section) && <HomePage />}
      </main>

      <SiteFooter
        start={
          <>
            <DynamicLabMark size={16} className="text-[var(--foreground)]" />
            <span>© 2026 Dynamic Lab</span>
          </>
        }
        end={<span>All rights reserved</span>}
      />
    </div>
  )
}

/* ---------------------------------------------------------------- Home */

const EXAMPLES = [
  { id: 'c5', hint: 'A static page' },
  { id: 'c3', hint: 'Zoom, tags, comments' },
  { id: 'c8', hint: 'Book or scroll reader' },
  { id: 'c10', hint: 'Chapters, progress, font controls' },
  { id: 'c4', hint: 'Downloads and platforms' },
]

function HomePage() {
  const { content, navigate } = useShowcase()
  const published = content.filter((c) => c.status === 'published' && !c.trashed && c.type !== 'page' && c.rating !== 'mature')

  return (
    <div className="mx-auto flex max-w-[var(--container-max)] flex-col gap-14 px-4 py-14 sm:px-8">
      <section className="flex flex-col items-start gap-6">
        <PageHeading
          eyebrow="Dynamic Lab"
          title="Stories worth staying up for"
          description="Comics, art and visual novels from independent creators, published from their own Creator Labs."
        />
        <div className="flex flex-wrap gap-3">
          <Button size="lg" onClick={() => navigate('lab/browse')} rightIcon={<Search className="size-4" />}>
            Browse creations
          </Button>
          <Button size="lg" variant="secondary" onClick={() => navigate('lab/components')}>
            See the component library
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="section-title">One of each</h2>
          <p className="page-description">Every content type has its own page. Open one to see it.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {EXAMPLES.map(({ id, hint }) => {
            const item = content.find((c) => c.id === id)
            if (!item) return null
            return (
              <ContentCard
                key={id}
                type={TYPE_LABELS[item.type]}
                title={item.title}
                byline={hint}
                cover={getDetails(item).cover}
                aspect="portrait"
                onClick={() => navigate(`lab/view/${id}`)}
              />
            )
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="section-title">Creators</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PROFILES.slice(0, 4).map((p) => (
              <div key={p.handle} className="ui-panel flex items-center gap-3 p-4!">
                <ProfileAvatar src={p.avatar} initials={p.name.slice(0, 2)} size="lg" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <a href={`#/lab/u/${p.handle}`} className="truncate font-semibold hover:underline">
                    {p.name}
                  </a>
                  <a href={`#/lab/links/${p.handle}`} className="truncate text-xs text-[var(--primary)] hover:underline">
                    Links page
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="section-title">Creator Labs</h2>
          <div className="flex flex-col gap-3">
            {LABS.map((lab) => (
              <a key={lab.slug} href={`#/lab/labs/${lab.slug}`} className="ui-panel flex items-center gap-4 p-4! transition-colors hover:border-[var(--primary)]">
                <ProfileAvatar src={lab.avatar} initials={lab.name.slice(0, 2)} size="lg" shape="square" />
                <div className="flex min-w-0 flex-col">
                  <span className="font-semibold">{lab.name}</span>
                  <span className="truncate text-sm text-[var(--muted-foreground)]">{lab.tagline}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <div className="flex items-end justify-between gap-4">
          <h2 className="section-title">Fresh from the community</h2>
          <Button variant="ghost" onClick={() => navigate('lab/browse')}>
            View all
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {published.slice(0, 4).map((item) => (
            <ContentCard
              key={item.id}
              type={TYPE_LABELS[item.type]}
              title={item.title}
              byline={`By ${item.creator}`}
              cover={getDetails(item).cover}
              onClick={() => navigate(`lab/view/${item.id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

/* -------------------------------------------------------------- Browse */

const tagNames = (c: ContentRecord) => Array.from(new Set([...c.tags, ...getDetails(c).tags.map((t) => t.name)]))

function BrowsePage() {
  const { content, navigate, path } = useShowcase()
  const tagFromUrl = decodeURIComponent(path.split('?tag=')[1] ?? '')
  const [draftQuery, setDraftQuery] = useState('')
  const [query, setQuery] = useState('')
  const [type, setType] = useState<ContentType | 'all'>('all')
  const [tag, setTag] = useState(tagFromUrl || 'all')
  const [rating, setRating] = useState(tagFromUrl ? 'any' : 'allowed')
  const allTags = useMemo(
    () => Array.from(new Set([...ALL_TAGS, ...Object.values(DETAILS).flatMap((d) => d.tags.map((t) => t.name))])).sort(),
    []
  )

  const results = useMemo(
    () =>
      content.filter((c) => {
        if (c.status !== 'published' || c.trashed) return false
        if (type !== 'all' && c.type !== type) return false
        if (tag !== 'all' && !tagNames(c).includes(tag)) return false
        if (rating === 'allowed' && c.rating === 'mature') return false
        if (rating !== 'allowed' && rating !== 'any' && c.rating !== rating) return false
        if (query && !`${c.title} ${c.creator} ${c.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())) return false
        return true
      }),
    [content, type, tag, rating, query]
  )

  const clear = () => {
    setDraftQuery('')
    setQuery('')
    setType('all')
    setTag('all')
    setRating('allowed')
  }

  return (
    <div className="mx-auto flex max-w-[var(--container-max)] flex-col gap-6 px-4 py-10 sm:px-8">
      <PageHeading eyebrow="Discover" title="Browse creations" />

      <form
        className="ui-panel flex flex-col gap-4"
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          setQuery(draftQuery.trim())
        }}>
        <div className="flex gap-3">
          <Input
            value={draftQuery}
            onChange={(e) => setDraftQuery(e.target.value)}
            placeholder="Search stories, artwork, comics, and games"
            aria-label="Search creations"
          />
          <Button type="submit">Search</Button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Select
            label="Category"
            value={type}
            onChange={(e) => setType(e.target.value as ContentType | 'all')}
            options={[{ value: 'all', label: 'All categories' }, ...TYPES.map((t) => ({ value: t, label: TYPE_PLURALS[t] }))]}
          />
          <Select
            label="Tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            options={[{ value: 'all', label: 'All tags' }, ...allTags.map((t) => ({ value: t, label: t.replace(/_/g, ' ') }))]}
          />
          <Select
            label="Rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            options={[
              { value: 'allowed', label: 'Allowed ratings' },
              { value: 'general', label: 'General only' },
              { value: 'teen', label: 'Teen only' },
              { value: 'any', label: 'Any rating' },
            ]}
          />
        </div>
      </form>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
        <FilterChip active={type === 'all'} onClick={() => setType('all')}>
          All
        </FilterChip>
        {TYPES.map((t) => (
          <FilterChip key={t} active={type === t} onClick={() => setType(t)}>
            {TYPE_PLURALS[t]}
          </FilterChip>
        ))}
      </div>

      <p className="body-sm text-[var(--muted-foreground)]" aria-live="polite">
        {results.length} {results.length === 1 ? 'creation' : 'creations'} from the Dynamic Lab community
        {query && (
          <>
            {' '}
            matching “{query}”
          </>
        )}
      </p>

      {results.length === 0 ? (
        <EmptyState
          icon={<SearchX className="size-7" />}
          title="Nothing matches those filters"
          description="Try a different word, or clear the filters to see everything that's published."
          action={
            <Button variant="secondary" onClick={clear}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((item) => (
            <ContentCard
              key={item.id}
              type={TYPE_LABELS[item.type]}
              title={item.title}
              byline={`By ${item.creator}`}
              cover={item.type === 'page' ? undefined : getDetails(item).cover}
              icon={TYPE_ICONS[item.type]}
              coverBadge={item.rating !== 'general' ? <Badge variant={item.rating === 'mature' ? 'danger' : 'warning'} size="sm">{RATING_LABELS[item.rating]}</Badge> : undefined}
              onClick={() => navigate(`lab/view/${item.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------- Library */

function LibraryPage({ sub }: { sub: string }) {
  const { navigate } = useShowcase()
  const go = (s: string) => navigate(`lab/library/${s}`)

  return (
    <div className="mx-auto grid max-w-[var(--container-max)] grid-cols-1 gap-8 px-4 py-10 sm:px-8 lg:grid-cols-[248px_minmax(0,1fr)]">
      <SidebarNav className="h-fit w-full" aria-label="Your Dynamic Lab">
        <div className="px-2.5 pb-1 pt-1 text-base font-bold">Your Dynamic Lab</div>
        <SidebarNavGroup label="Your space">
          <SidebarNavItem icon={<LayoutDashboard />} active={sub === 'overview'} onClick={() => go('overview')}>
            Overview
          </SidebarNavItem>
          <SidebarNavItem icon={<FileText />} active={sub === 'content'} onClick={() => go('content')}>
            My content
          </SidebarNavItem>
          <SidebarNavItem icon={<Library />} active={sub === 'saved'} onClick={() => go('saved')}>
            Library
          </SidebarNavItem>
          <SidebarNavItem icon={<Bell />} active={sub === 'notifications'} badge={2} onClick={() => go('notifications')}>
            Notifications
          </SidebarNavItem>
        </SidebarNavGroup>
        <SidebarNavGroup label="Account">
          <SidebarNavItem icon={<User />} active={sub === 'profile'} onClick={() => go('profile')}>
            Profile
          </SidebarNavItem>
          <SidebarNavItem icon={<Settings />} active={sub === 'account'} onClick={() => go('account')}>
            My account
          </SidebarNavItem>
          <SidebarNavItem icon={<SlidersHorizontal />} active={sub === 'preferences'} onClick={() => go('preferences')}>
            Content preferences
          </SidebarNavItem>
        </SidebarNavGroup>
      </SidebarNav>

      <div className="min-w-0">
        {sub === 'overview' && <LibraryOverview />}
        {sub === 'content' && <MyContent />}
        {sub === 'saved' && <SavedLibrary />}
        {sub === 'notifications' && <Notifications />}
        {sub === 'profile' && <ProfileForm />}
        {sub === 'account' && (
          <LibraryPlaceholder title="My account" description="Email, password and sign-in methods." />
        )}
        {sub === 'preferences' && <Preferences />}
      </div>
    </div>
  )
}

function LibraryOverview() {
  const { content, navigate } = useShowcase()
  const mine = content.filter((c) => c.creator === CURRENT_USER.name && !c.trashed)
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={`Welcome back, ${CURRENT_USER.name.split(' ')[0]}`} description="What's happening with your work." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Published" value={mine.filter((c) => c.status === 'published').length} href="#/lab/library/content" />
        <MetricCard label="Drafts" value={mine.filter((c) => c.status === 'draft').length} href="#/lab/library/content" />
        <MetricCard label="Waiting for review" value={mine.filter((c) => c.status === 'in-review').length} href="#/lab/library/content" />
      </div>
      <Button variant="secondary" className="self-start" onClick={() => navigate('lab/library/content')}>
        Go to my content
      </Button>
    </div>
  )
}

function MyContent() {
  const { content, addContent, updateContent, log } = useShowcase()
  const { toast } = useToast()
  const [type, setType] = useState<ContentType | 'all'>('all')
  const [draftStatus, setDraftStatus] = useState('all')
  const [status, setStatus] = useState('all')

  const mine = content.filter((c) => c.creator === CURRENT_USER.name && !c.trashed)
  const rows = mine.filter((c) => (type === 'all' || c.type === type) && (status === 'all' || c.status === status))

  const create = (t: ContentType) => {
    const record: ContentRecord = {
      id: Math.random().toString(36).slice(2),
      title: `Untitled ${TYPE_LABELS[t].toLowerCase()}`,
      type: t,
      creator: CURRENT_USER.name,
      lab: 'Moonlit Studio',
      rating: 'general',
      status: 'draft',
      updated: new Date().toISOString(),
      tags: [],
      comments: 'open',
    }
    addContent(record)
    log(`${CURRENT_USER.name} started a new ${TYPE_LABELS[t].toLowerCase()}`, 'neutral')
    toast({ title: 'Draft created', description: `“${record.title}” is in your drafts. It also shows in Backstage → Content.`, tone: 'success' })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My content"
        description="Drafts and published content tied to your personal identity, separate from any Creator Lab."
        actions={
          <DropdownMenu
            trigger={
              <Button leftIcon={<FilePlus2 className="size-4" />}>
                New
              </Button>
            }>
            <MenuLabel>Create</MenuLabel>
            {TYPES.map((t) => (
              <MenuItem key={t} icon={TYPE_ICONS[t]} onClick={() => create(t)}>
                {TYPE_LABELS[t]}
              </MenuItem>
            ))}
          </DropdownMenu>
        }
      />

      <div className="flex flex-wrap gap-2">
        <FilterChip active={type === 'all'} onClick={() => setType('all')}>
          All content
        </FilterChip>
        {TYPES.map((t) => (
          <FilterChip key={t} active={type === t} onClick={() => setType(t)}>
            {TYPE_PLURALS[t]}
          </FilterChip>
        ))}
      </div>

      <form
        className="ui-toolbar"
        onSubmit={(e) => {
          e.preventDefault()
          setStatus(draftStatus)
        }}>
        <div className="w-48">
          <Select
            label="Status"
            value={draftStatus}
            onChange={(e) => setDraftStatus(e.target.value)}
            options={[{ value: 'all', label: 'All statuses' }, ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))]}
          />
        </div>
        <Button type="submit" variant="secondary" size="sm" className="self-end">
          Filter
        </Button>
      </form>

      {rows.length === 0 ? (
        <EmptyState
          icon={<Pencil className="size-7" />}
          title="No content found"
          description={mine.length === 0 ? "You haven't created any personal content yet. Use New to start one." : 'Nothing matches these filters.'}
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setType('all')
                setStatus('all')
                setDraftStatus('all')
              }}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-semibold">{row.title}</TableCell>
                <TableCell className="text-[var(--muted-foreground)]">{TYPE_LABELS[row.type]}</TableCell>
                <TableCell>
                  <StatusBadge tone={STATUS_TONES[row.status]}>{STATUS_LABELS[row.status]}</StatusBadge>
                </TableCell>
                <TableCell className="text-[var(--muted-foreground)]">{formatDate(row.updated)}</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex gap-2">
                    {row.status === 'draft' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          updateContent([row.id], { status: 'in-review' })
                          log(`“${row.title}” was sent for review`, 'warning')
                          toast({ title: 'Sent for review', description: 'A moderator will look at it in Backstage.', tone: 'info' })
                        }}>
                        Send for review
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="danger-outline"
                      leftIcon={<Trash2 className="size-3.5" />}
                      onClick={() => {
                        updateContent([row.id], { trashed: true })
                        toast({
                          title: 'Moved to trash',
                          description: `“${row.title}” can be restored from Backstage → Trash.`,
                          action: { label: 'Undo', onClick: () => updateContent([row.id], { trashed: false }) },
                        })
                      }}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

function SavedLibrary() {
  const { content, saved, setSaved, navigate } = useShowcase()
  const items = content.filter((c) => saved.includes(c.id) && !c.trashed)
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Library" description="Creations you've saved. Use Save on any creation to add it here." />
      {items.length === 0 ? (
        <EmptyState
          icon={<Library className="size-7" />}
          title="Nothing saved yet"
          description="Open any creation and press Save."
          action={
            <Button variant="secondary" onClick={() => navigate('lab/browse')}>
              Browse creations
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="relative">
              <ContentCard
                type={TYPE_LABELS[item.type]}
                title={item.title}
                byline={`By ${item.creator}`}
                cover={getDetails(item).cover}
                onClick={() => navigate(`lab/view/${item.id}`)}
              />
              <Button size="sm" variant="secondary" className="absolute right-3 top-3" onClick={() => setSaved(item.id, false)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Notifications() {
  const [items, setItems] = useState([
    { id: 1, text: 'Maya Lin commented on “The lighthouse keeper”', read: false },
    { id: 2, text: '“About the Lab” was approved and published', read: false },
    { id: 3, text: 'Sam Okafor followed Moonlit Studio', read: true },
  ])
  const unread = items.filter((i) => !i.read).length
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notifications"
        description={unread ? `${unread} unread` : "You're all caught up."}
        actions={
          <Button variant="secondary" disabled={!unread} onClick={() => setItems((prev) => prev.map((i) => ({ ...i, read: true })))}>
            Mark all as read
          </Button>
        }
      />
      <div className="ui-panel flex flex-col divide-y divide-[var(--border)] p-0!">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, read: !i.read } : i)))}
            className="flex items-center gap-3 px-5 py-4 text-left text-sm hover:bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)]">
            <span className={item.read ? 'size-2 rounded-full bg-transparent' : 'size-2 rounded-full bg-[var(--primary)]'} aria-hidden />
            <span className={item.read ? 'text-[var(--muted-foreground)]' : 'font-semibold'}>{item.text}</span>
            <span className="ml-auto text-xs text-[var(--muted-foreground)]">{item.read ? 'Mark unread' : 'Mark read'}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ProfileForm() {
  const { toast } = useToast()
  const [name, setName] = useState(CURRENT_USER.name)
  const [saving, setSaving] = useState(false)
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Profile" description="How you appear on your public pages." />
      <form
        className="ui-panel flex max-w-xl flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          setSaving(true)
          setTimeout(() => {
            setSaving(false)
            toast({ title: 'Profile saved', description: `Your display name is now “${name}”.`, tone: 'success' })
          }, 900)
        }}>
        <TextField label="Display name" value={name} onChange={(e) => setName(e.target.value)} error={name.trim() ? undefined : 'A display name is required'} />
        <TextField label="Bio" isTextarea rows={3} placeholder="A sentence or two about you" helperText="Shown on your public profile." />
        <Button type="submit" className="self-start" loading={saving} disabled={!name.trim()}>
          Save profile
        </Button>
      </form>
    </div>
  )
}

function Preferences() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Content preferences" description="Choose what shows up when you browse." />
      <div className="ui-panel flex max-w-xl flex-col gap-6">
        <RadioGroup label="Ratings to show" defaultValue="teen" variant="card">
          <RadioGroupItem value="general" label="General only" description="Suitable for everyone." />
          <RadioGroupItem value="teen" label="General and Teen" description="The default for new accounts." />
          <RadioGroupItem value="mature" label="Everything" description="Includes Mature creations." />
        </RadioGroup>
        <Switch defaultChecked label="Blur mature covers" description="Click a cover to reveal it." />
        <Switch label="Autoplay visual novel music" />
      </div>
    </div>
  )
}

function LibraryPlaceholder({ title, description }: { title: string; description: string }) {
  const { navigate } = useShowcase()
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} description={description} />
      <EmptyState
        title="Nothing here yet"
        description="This page is a placeholder in the showcase."
        action={
          <Button variant="secondary" onClick={() => navigate('lab/browse')}>
            Browse creations
          </Button>
        }
      />
    </div>
  )
}
