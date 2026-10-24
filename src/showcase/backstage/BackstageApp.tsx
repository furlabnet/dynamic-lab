import React, { useMemo, useState } from 'react'
import {
  AdminShell,
  AdminSidebar,
  AppSwitcher,
  Badge,
  BrandLockup,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Checkbox,
  CommandPalette,
  CommandTrigger,
  Dialog,
  Drawer,
  DropdownMenu,
  EmptyState,
  FileInput,
  FilterChip,
  IconButton,
  Input,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MetricCard,
  NoticePanel,
  PageHeader,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Panel,
  ProfileAvatar,
  RadioGroup,
  RadioGroupItem,
  SegmentedControl,
  Select,
  SidebarNavGroup,
  SidebarNavItem,
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
  Tooltip,
  WorkflowTimeline,
  WorkflowTimelineItem,
  useToast,
  type CommandItem,
} from '../../index'
import {
  ArchiveRestore,
  CalendarClock,
  Database,
  FileText,
  FlaskConical,
  Image,
  KeyRound,
  LayoutGrid,
  LogOut,
  MoreHorizontal,
  Search,
  Settings,
  Shield,
  ScrollText,
  Tag,
  Trash2,
  UserPlus,
  Users,
  Palette,
  Globe,
  Moon,
} from 'lucide-react'
import {
  CURRENT_USER,
  RATING_LABELS,
  STATUS_LABELS,
  STATUS_TONES,
  TYPE_LABELS,
  TYPE_PLURALS,
  type ContentRecord,
  type ContentStatus,
  type ContentType,
  type UserRole,
} from '../data'
import { APPS, formatDate, useShowcase } from '../state'
import { ComponentGallery } from '../gallery/ComponentGallery'
import { useTheme } from '../../index'

interface NavEntry {
  id: string
  label: string
  icon: React.ReactNode
  group: string
}

const NAV: NavEntry[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutGrid />, group: '' },
  { id: 'content', label: 'Content', icon: <FileText />, group: 'Library' },
  { id: 'media', label: 'Media', icon: <Image />, group: 'Library' },
  { id: 'tags', label: 'Tags', icon: <Tag />, group: 'Library' },
  { id: 'trash', label: 'Trash', icon: <Trash2 />, group: 'Library' },
  { id: 'users', label: 'Users', icon: <Users />, group: 'People & Labs' },
  { id: 'labs', label: 'Labs', icon: <FlaskConical />, group: 'People & Labs' },
  { id: 'moderation', label: 'Moderation', icon: <Shield />, group: 'Trust & Safety' },
  { id: 'schedules', label: 'Schedules', icon: <CalendarClock />, group: 'System' },
  { id: 'audit', label: 'Audit', icon: <ScrollText />, group: 'System' },
  { id: 'schema', label: 'Schema', icon: <Database />, group: 'System' },
  { id: 'roles', label: 'Roles', icon: <KeyRound />, group: 'System' },
  { id: 'settings', label: 'Site settings', icon: <Settings />, group: 'System' },
  { id: 'design-system', label: 'Design system', icon: <Palette />, group: 'System' },
]

const GROUPS = ['', 'Library', 'People & Labs', 'Trust & Safety', 'System']

function timeAgo(iso: string) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  return `${Math.round(hours / 24)} d ago`
}

export function BackstageApp() {
  const { page, navigate, content, reports, maintenance, setMaintenance } = useShowcase()
  const { toggleMode } = useTheme()
  const { toast } = useToast()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const pageId = page.split('?')[0]
  const current = NAV.find((n) => n.id === pageId) ?? NAV[0]

  const badges: Record<string, number | undefined> = {
    moderation: reports.length || undefined,
    trash: content.filter((c) => c.trashed).length || undefined,
  }

  const commands: CommandItem[] = useMemo(
    () => [
      ...NAV.map((n) => ({
        id: `go-${n.id}`,
        label: n.label,
        group: 'Go to',
        icon: n.icon,
        description: n.group || undefined,
        onSelect: () => navigate(`backstage/${n.id}`),
      })),
      {
        id: 'toggle-maintenance',
        label: maintenance ? 'Turn maintenance mode off' : 'Turn maintenance mode on',
        group: 'Actions',
        icon: <Settings />,
        keywords: ['maintenance', 'banner', 'site'],
        onSelect: () => setMaintenance(!maintenance),
      },
      { id: 'toggle-theme', label: 'Toggle dark mode', group: 'Actions', icon: <Moon />, keywords: ['theme', 'light'], onSelect: toggleMode },
      { id: 'public-site', label: 'Open the public site', group: 'Actions', icon: <Globe />, keywords: ['lab', 'switch app'], onSelect: () => navigate('lab/') },
      ...content
        .filter((c) => !c.trashed)
        .map((c) => ({
          id: `content-${c.id}`,
          label: c.title,
          group: 'Content',
          icon: <FileText />,
          description: `${TYPE_LABELS[c.type]} · ${c.creator}`,
          onSelect: () => navigate(`backstage/content?q=${encodeURIComponent(c.title)}`),
        })),
    ],
    [content, maintenance, navigate, setMaintenance, toggleMode]
  )

  return (
    <>
      <AdminShell
        className="dynamic-lab-glow-bg"
        sidebar={
          <AdminSidebar
            header={<BrandLockup name="Dynamic Lab" product="Backstage" size="sm" />}
            search={<CommandTrigger onClick={() => setPaletteOpen(true)} />}
            footer={
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <ProfileAvatar initials="AR" size="sm" className="ui-user-avatar" />
                  <div className="ui-nav-text flex min-w-0 flex-col">
                    <span className="flex items-center gap-1.5 text-sm font-semibold">
                      {CURRENT_USER.name.split(' ')[0]}
                      <Badge size="sm">{CURRENT_USER.role}</Badge>
                    </span>
                    <span className="truncate text-xs text-[var(--muted-foreground)]">{CURRENT_USER.email}</span>
                  </div>
                </div>
                <div className="ui-nav-text flex items-center gap-1">
                  <ThemeToggle variant="ghost" />
                  <Tooltip content="Sign out" side="top">
                    <IconButton
                      aria-label="Sign out"
                      variant="ghost"
                      icon={<LogOut className="size-[18px]" />}
                      onClick={() => toast({ title: 'Signed out', description: 'This is a demo, so you are still here.', tone: 'info' })}
                    />
                  </Tooltip>
                </div>
              </div>
            }>
            {GROUPS.map((group) => (
              <SidebarNavGroup key={group || 'root'} label={group || undefined}>
                {NAV.filter((n) => n.group === group).map((n) => (
                  <SidebarNavItem
                    key={n.id}
                    icon={n.icon}
                    active={current.id === n.id}
                    badge={badges[n.id]}
                    onClick={() => navigate(`backstage/${n.id}`)}>
                    {n.label}
                  </SidebarNavItem>
                ))}
              </SidebarNavGroup>
            ))}
          </AdminSidebar>
        }
        topbar={
          <>
            <Breadcrumb>
              <BreadcrumbList>
                {current.id === 'overview' ? (
                  <BreadcrumbItem>
                    <BreadcrumbPage>Overview</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#/backstage/overview">Overview</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{current.label}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto">
              <AppSwitcher apps={APPS} value="backstage" onValueChange={(id) => navigate(`${id}/`)} />
            </div>
          </>
        }>
        {maintenance && pageId !== 'settings' && (
          <NoticePanel
            tone="warning"
            title="Maintenance mode is on"
            className="mb-6"
            onDismiss={() => setMaintenance(false)}>
            Visitors and Lab members have limited access. Dismiss to turn it off, or change it in{' '}
            <a href="#/backstage/settings" className="font-semibold underline">
              Site settings
            </a>
            .
          </NoticePanel>
        )}
        {pageId === 'overview' && <OverviewPage />}
        {pageId === 'content' && <ContentPage />}
        {pageId === 'trash' && <TrashPage />}
        {pageId === 'users' && <UsersPage />}
        {pageId === 'moderation' && <ModerationPage />}
        {pageId === 'tags' && <TagsPage />}
        {pageId === 'audit' && <AuditPage />}
        {pageId === 'settings' && <SettingsPage />}
        {pageId === 'design-system' && <ComponentGallery />}
        {['media', 'labs', 'schedules', 'schema', 'roles'].includes(pageId) && <PlaceholderPage entry={current} />}
        {!NAV.some((n) => n.id === pageId) && <OverviewPage />}
      </AdminShell>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} items={commands} />
    </>
  )
}

/* ------------------------------------------------------------ Overview */

function OverviewPage() {
  const { content, users, reports, activity } = useShowcase()
  const live = content.filter((c) => !c.trashed)
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Overview" description="Site-wide health across every Creator Lab." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Waiting for review" value={live.filter((c) => c.status === 'in-review').length} href="#/backstage/content" />
        <MetricCard label="Published" value={live.filter((c) => c.status === 'published').length} delta={{ value: '+3', direction: 'up' }} href="#/backstage/content" />
        <MetricCard label="Active users" value={users.filter((u) => u.status === 'active').length} href="#/backstage/users" />
        <MetricCard label="Open reports" value={reports.length} href="#/backstage/moderation" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Panel title="Recent activity" description="Everything you do in this demo is logged here.">
          <WorkflowTimeline>
            {activity.slice(0, 6).map((a) => (
              <WorkflowTimelineItem
                key={a.id}
                title={a.text}
                time={timeAgo(a.at)}
                completed={a.tone === 'success'}
                active={a.tone !== 'neutral'}
                className="py-3!"
              />
            ))}
          </WorkflowTimeline>
        </Panel>
        <Panel title="Labs">
          <ul className="flex flex-col gap-3 text-sm">
            {Array.from(new Set(content.map((c) => c.lab))).map((lab) => (
              <li key={lab} className="flex items-center justify-between gap-3">
                <span className="font-medium">{lab}</span>
                <Badge variant="neutral">{content.filter((c) => c.lab === lab && !c.trashed).length}</Badge>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- Content */

const PAGE_SIZE = 6
const TYPES = Object.keys(TYPE_LABELS) as ContentType[]
const STATUSES = Object.keys(STATUS_LABELS) as ContentStatus[]

function ContentPage() {
  const { content, updateContent, log, path } = useShowcase()
  const { toast } = useToast()
  const initialQuery = decodeURIComponent(path.split('?q=')[1] ?? '')

  const [draftQuery, setDraftQuery] = useState(initialQuery)
  const [query, setQuery] = useState(initialQuery)
  const [type, setType] = useState<ContentType | 'all'>('all')
  const [draftFilters, setDraftFilters] = useState({ status: 'all', rating: 'all' })
  const [filters, setFilters] = useState(draftFilters)
  const [selected, setSelected] = useState<string[]>([])
  const [bulkComments, setBulkComments] = useState<'open' | 'closed'>('open')
  const [bulkStatus, setBulkStatus] = useState<ContentStatus>('published')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [viewing, setViewing] = useState<ContentRecord | null>(null)
  const [editing, setEditing] = useState<ContentRecord | null>(null)
  const [deleting, setDeleting] = useState<ContentRecord | null>(null)
  const [pageIndex, setPageIndex] = useState(0)

  React.useEffect(() => {
    setDraftQuery(initialQuery)
    setQuery(initialQuery)
  }, [initialQuery])

  const rows = content.filter(
    (c) =>
      !c.trashed &&
      (type === 'all' || c.type === type) &&
      (filters.status === 'all' || c.status === filters.status) &&
      (filters.rating === 'all' || c.rating === filters.rating) &&
      (!query || `${c.title} ${c.creator}`.toLowerCase().includes(query.toLowerCase()))
  )
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(pageIndex, pageCount - 1)
  const visible = rows.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)
  const visibleIds = visible.map((r) => r.id)
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id))
  const someVisibleSelected = visibleIds.some((id) => selected.includes(id))
  const selectedRecords = content.filter((c) => selected.includes(c.id))

  const toggle = (id: string) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="All content"
        description="Site-wide overview of all publications across Creator Labs."
        actions={
          <form
            role="search"
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              setQuery(draftQuery.trim())
              setPageIndex(0)
            }}>
            <Input
              value={draftQuery}
              onChange={(e) => setDraftQuery(e.target.value)}
              placeholder="Search records"
              aria-label="Search records"
              startIcon={<Search className="size-4" />}
              className="w-64"
            />
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </form>
        }
      />

      <div className="flex flex-wrap gap-2">
        <FilterChip active={type === 'all'} onClick={() => (setType('all'), setPageIndex(0))}>
          All content
        </FilterChip>
        {TYPES.map((t) => (
          <FilterChip key={t} active={type === t} onClick={() => (setType(t), setPageIndex(0))}>
            {TYPE_PLURALS[t]}
          </FilterChip>
        ))}
      </div>

      <form
        className="ui-toolbar items-end"
        onSubmit={(e) => {
          e.preventDefault()
          setFilters(draftFilters)
          setPageIndex(0)
        }}>
        <div className="w-44">
          <Select
            label="Status"
            value={draftFilters.status}
            onChange={(e) => setDraftFilters((f) => ({ ...f, status: e.target.value }))}
            options={[{ value: 'all', label: 'All statuses' }, ...STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }))]}
          />
        </div>
        <div className="w-44">
          <Select
            label="Rating"
            value={draftFilters.rating}
            onChange={(e) => setDraftFilters((f) => ({ ...f, rating: e.target.value }))}
            options={[{ value: 'all', label: 'All ratings' }, ...Object.entries(RATING_LABELS).map(([value, label]) => ({ value, label }))]}
          />
        </div>
        <Button type="submit" variant="secondary">
          Filter
        </Button>
        {(query || type !== 'all' || filters.status !== 'all' || filters.rating !== 'all') && (
          <Button
            variant="ghost"
            onClick={() => {
              setDraftQuery('')
              setQuery('')
              setType('all')
              setDraftFilters({ status: 'all', rating: 'all' })
              setFilters({ status: 'all', rating: 'all' })
            }}>
            Reset
          </Button>
        )}
      </form>

      <p className="body-sm text-[var(--muted-foreground)]">
        {rows.length} {rows.length === 1 ? 'item' : 'items'}
        {query && ` matching “${query}”`}
      </p>

      <div className="ui-toolbar justify-between">
        <span className="text-sm font-medium">{selected.length} selected</span>
        <div className="flex items-center gap-2">
          <span className="ui-toolbar-label text-sm text-[var(--muted-foreground)]">Bulk comments:</span>
          <Select
            aria-label="Bulk comments setting"
            containerClassName="w-auto"
            className="h-[var(--control-compact)] w-40 py-0"
            value={bulkComments}
            onChange={(e) => setBulkComments(e.target.value as 'open' | 'closed')}
            options={[
              { value: 'open', label: 'Open comments' },
              { value: 'closed', label: 'Close comments' },
            ]}
          />
          <Button
            size="sm"
            variant="secondary"
            disabled={!selected.length}
            onClick={() => {
              updateContent(selected, { comments: bulkComments })
              log(`Comments ${bulkComments === 'open' ? 'opened' : 'closed'} on ${selected.length} items`, 'info')
              toast({ title: 'Comments updated', description: `${selected.length} items now have ${bulkComments} comments.`, tone: 'success' })
            }}>
            Apply to selected
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="ui-toolbar-label text-sm text-[var(--muted-foreground)]">Bulk workflow:</span>
          <Select
            aria-label="Bulk workflow action"
            containerClassName="w-auto"
            className="h-[var(--control-compact)] w-44 py-0"
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value as ContentStatus)}
            options={STATUSES.map((s) => ({ value: s, label: `Move to ${STATUS_LABELS[s]}` }))}
          />
          <Button size="sm" disabled={!selected.length} onClick={() => setPreviewOpen(true)}>
            Preview
          </Button>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<Search className="size-7" />}
          title="No records match"
          description="Try another search or reset the filters."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  aria-label="Select all on this page"
                  checked={allVisibleSelected}
                  indeterminate={someVisibleSelected && !allVisibleSelected}
                  onCheckedChange={() =>
                    setSelected((prev) =>
                      allVisibleSelected ? prev.filter((id) => !visibleIds.includes(id)) : Array.from(new Set([...prev, ...visibleIds]))
                    )
                  }
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((row) => (
              <TableRow key={row.id} selected={selected.includes(row.id)}>
                <TableCell>
                  <Checkbox aria-label={`Select ${row.title}`} checked={selected.includes(row.id)} onCheckedChange={() => toggle(row.id)} />
                </TableCell>
                <TableCell className="font-semibold">{row.title}</TableCell>
                <TableCell className="text-[var(--muted-foreground)]">{TYPE_LABELS[row.type]}</TableCell>
                <TableCell>{row.creator}</TableCell>
                <TableCell className="text-[var(--muted-foreground)]">{RATING_LABELS[row.rating]}</TableCell>
                <TableCell>
                  <StatusBadge tone={STATUS_TONES[row.status]}>{STATUS_LABELS[row.status]}</StatusBadge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-[var(--muted-foreground)]">{formatDate(row.updated)}</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <Button size="sm" variant="secondary" onClick={() => setViewing(row)}>
                      View
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setEditing(row)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="text-[var(--destructive)] hover:text-[var(--destructive)]" onClick={() => setDeleting(row)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="body-sm text-[var(--muted-foreground)]">
          {rows.length} records · Page {safePage + 1} of {pageCount}
        </span>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious disabled={safePage === 0} onClick={() => setPageIndex(safePage - 1)} />
            </PaginationItem>
            {Array.from({ length: pageCount }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink isActive={i === safePage} onClick={() => setPageIndex(i)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext disabled={safePage >= pageCount - 1} onClick={() => setPageIndex(safePage + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Bulk workflow preview */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={`Move ${selected.length} ${selected.length === 1 ? 'item' : 'items'} to ${STATUS_LABELS[bulkStatus]}?`}
        description="Review the change before it's applied."
        maxWidth="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPreviewOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                updateContent(selected, { status: bulkStatus })
                log(`${selected.length} items moved to ${STATUS_LABELS[bulkStatus]}`, STATUS_TONES[bulkStatus])
                toast({ title: 'Workflow updated', description: `${selected.length} items are now ${STATUS_LABELS[bulkStatus].toLowerCase()}.`, tone: 'success' })
                setSelected([])
                setPreviewOpen(false)
              }}>
              Apply change
            </Button>
          </>
        }>
        <ul className="flex flex-col divide-y divide-[var(--border)] rounded-[var(--radius-lg)] border border-[var(--border)]">
          {selectedRecords.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 px-3 py-2">
              <span className="font-medium">{r.title}</span>
              <span className="flex items-center gap-2 text-xs">
                <StatusBadge tone={STATUS_TONES[r.status]}>{STATUS_LABELS[r.status]}</StatusBadge>→
                <StatusBadge tone={STATUS_TONES[bulkStatus]}>{STATUS_LABELS[bulkStatus]}</StatusBadge>
              </span>
            </li>
          ))}
        </ul>
      </Dialog>

      {/* View drawer */}
      <Drawer
        open={viewing !== null}
        onClose={() => setViewing(null)}
        title={viewing?.title}
        description={viewing ? `${TYPE_LABELS[viewing.type]} by ${viewing.creator} · ${viewing.lab}` : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setViewing(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (viewing) setEditing(viewing)
                setViewing(null)
              }}>
              Edit
            </Button>
          </>
        }>
        {viewing && (
          <dl className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-3">
            <dt className="text-[var(--muted-foreground)]">Status</dt>
            <dd>
              <StatusBadge tone={STATUS_TONES[viewing.status]}>{STATUS_LABELS[viewing.status]}</StatusBadge>
            </dd>
            <dt className="text-[var(--muted-foreground)]">Rating</dt>
            <dd>{RATING_LABELS[viewing.rating]}</dd>
            <dt className="text-[var(--muted-foreground)]">Comments</dt>
            <dd className="capitalize">{viewing.comments}</dd>
            <dt className="text-[var(--muted-foreground)]">Tags</dt>
            <dd className="flex flex-wrap gap-1.5">
              {viewing.tags.length ? viewing.tags.map((t) => <Badge key={t} variant="neutral">{t}</Badge>) : '—'}
            </dd>
            <dt className="text-[var(--muted-foreground)]">Updated</dt>
            <dd>{formatDate(viewing.updated)}</dd>
            {viewing.summary && (
              <>
                <dt className="text-[var(--muted-foreground)]">Summary</dt>
                <dd>{viewing.summary}</dd>
              </>
            )}
          </dl>
        )}
      </Drawer>

      {/* Edit dialog */}
      {editing && (
        <EditDialog
          record={editing}
          onClose={() => setEditing(null)}
          onSave={(patch) => {
            updateContent([editing.id], patch)
            log(`“${patch.title ?? editing.title}” was edited`, 'info')
            toast({ title: 'Saved', description: `“${patch.title ?? editing.title}” was updated.`, tone: 'success' })
            setEditing(null)
          }}
        />
      )}

      {/* Delete confirm */}
      <Dialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title={`Delete “${deleting?.title}”?`}
        description="It moves to the trash for 45 days, then is deleted for good."
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!deleting) return
                const target = deleting
                updateContent([target.id], { trashed: true })
                setSelected((prev) => prev.filter((id) => id !== target.id))
                log(`“${target.title}” moved to trash`, 'danger')
                toast({
                  title: 'Moved to trash',
                  description: `“${target.title}” can be restored from Trash.`,
                  action: { label: 'Undo', onClick: () => updateContent([target.id], { trashed: false }) },
                })
                setDeleting(null)
              }}>
              Move to trash
            </Button>
          </>
        }
      />
    </div>
  )
}

function EditDialog({
  record,
  onClose,
  onSave,
}: {
  record: ContentRecord
  onClose: () => void
  onSave: (patch: Partial<ContentRecord>) => void
}) {
  const [title, setTitle] = useState(record.title)
  const [status, setStatus] = useState(record.status)
  const [rating, setRating] = useState(record.rating)
  const [comments, setComments] = useState(record.comments === 'open')

  return (
    <Dialog
      open
      onClose={onClose}
      title="Edit content"
      description={`${TYPE_LABELS[record.type]} by ${record.creator}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!title.trim()}
            onClick={() => onSave({ title: title.trim(), status, rating, comments: comments ? 'open' : 'closed' })}>
            Save changes
          </Button>
        </>
      }>
      <div className="flex flex-col gap-4">
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} error={title.trim() ? undefined : 'Title is required'} />
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as ContentStatus)}
          options={STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
        />
        <div className="flex flex-col gap-1.5">
          <span className="button-sm">Rating</span>
          <SegmentedControl
            aria-label="Rating"
            fullWidth
            value={rating}
            onValueChange={(v) => setRating(v as ContentRecord['rating'])}
            options={Object.entries(RATING_LABELS).map(([value, label]) => ({ value, label }))}
          />
        </div>
        <Switch checked={comments} onCheckedChange={setComments} label="Allow comments" />
      </div>
    </Dialog>
  )
}

/* --------------------------------------------------------------- Trash */

function TrashPage() {
  const { content, updateContent, removeContent, log } = useShowcase()
  const { toast } = useToast()
  const [confirmEmpty, setConfirmEmpty] = useState(false)
  const trashed = content.filter((c) => c.trashed)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Trash"
        description="Deleted items stay here for 45 days."
        actions={
          <Button variant="danger-outline" disabled={!trashed.length} onClick={() => setConfirmEmpty(true)}>
            Empty trash
          </Button>
        }
      />
      {trashed.length === 0 ? (
        <EmptyState icon={<Trash2 className="size-7" />} title="Trash is empty" description="Delete something from Content and it shows up here." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Deleted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trashed.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-semibold">{row.title}</TableCell>
                <TableCell className="text-[var(--muted-foreground)]">{TYPE_LABELS[row.type]}</TableCell>
                <TableCell className="text-[var(--muted-foreground)]">{formatDate(row.updated)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="secondary"
                    leftIcon={<ArchiveRestore className="size-3.5" />}
                    onClick={() => {
                      updateContent([row.id], { trashed: false })
                      log(`“${row.title}” restored from trash`, 'success')
                      toast({ title: 'Restored', description: `“${row.title}” is back in Content.`, tone: 'success' })
                    }}>
                    Restore
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Dialog
        open={confirmEmpty}
        onClose={() => setConfirmEmpty(false)}
        title={`Delete ${trashed.length} items for good?`}
        description="This can't be undone."
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmEmpty(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                removeContent(trashed.map((t) => t.id))
                log(`Trash emptied (${trashed.length} items)`, 'danger')
                setConfirmEmpty(false)
              }}>
              Delete for good
            </Button>
          </>
        }
      />
    </div>
  )
}

/* --------------------------------------------------------------- Users */

const ROLES: UserRole[] = ['Administrator', 'Moderator', 'Creator', 'Member']
const USER_TONES = { active: 'success', invited: 'info', suspended: 'danger' } as const

function UsersPage() {
  const { users, setUsers, log } = useShowcase()
  const { toast } = useToast()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>('Member')
  const emailValid = /^\S+@\S+\.\S+$/.test(email)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Users"
        description="Everyone with an account, and what they're allowed to do."
        actions={
          <Button leftIcon={<UserPlus className="size-4" />} onClick={() => setInviteOpen(true)}>
            Invite user
          </Button>
        }
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <ProfileAvatar initials={u.name.split(' ').map((p) => p[0]).join('')} size="sm" />
                  <div className="flex flex-col">
                    <span className="font-semibold">{u.name}</span>
                    <span className="text-xs text-[var(--muted-foreground)]">{u.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={u.role === 'Administrator' ? 'primary' : 'neutral'}>{u.role}</Badge>
              </TableCell>
              <TableCell>
                <StatusBadge tone={USER_TONES[u.status]}>{u.status}</StatusBadge>
              </TableCell>
              <TableCell className="text-[var(--muted-foreground)]">{formatDate(u.joined)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu
                  trigger={<IconButton aria-label={`Actions for ${u.name}`} variant="ghost" size="icon" icon={<MoreHorizontal className="size-4" />} />}>
                  <MenuLabel>Role</MenuLabel>
                  {ROLES.map((r) => (
                    <MenuItem
                      key={r}
                      selected={u.role === r}
                      onClick={() => {
                        setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role: r } : x)))
                        log(`${u.name} is now ${r}`, 'info')
                      }}>
                      {r}
                    </MenuItem>
                  ))}
                  <MenuSeparator />
                  <MenuItem
                    danger={u.status !== 'suspended'}
                    onClick={() => {
                      const next = u.status === 'suspended' ? 'active' : 'suspended'
                      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, status: next } : x)))
                      log(`${u.name} was ${next === 'suspended' ? 'suspended' : 'reinstated'}`, next === 'suspended' ? 'danger' : 'success')
                      toast({ title: next === 'suspended' ? 'User suspended' : 'User reinstated', description: u.name, tone: next === 'suspended' ? 'warning' : 'success' })
                    }}>
                    {u.status === 'suspended' ? 'Reinstate' : 'Suspend'}
                  </MenuItem>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite a user"
        description="They'll get an email with a link to set up their account."
        footer={
          <>
            <Button variant="secondary" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!emailValid}
              onClick={() => {
                const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
                setUsers((prev) => [
                  ...prev,
                  { id: Math.random().toString(36).slice(2), name, email, role, status: 'invited', joined: new Date().toISOString() },
                ])
                log(`${email} was invited as ${role}`, 'info')
                toast({ title: 'Invite sent', description: `${email} was invited as ${role}.`, tone: 'success' })
                setEmail('')
                setInviteOpen(false)
              }}>
              Send invite
            </Button>
          </>
        }>
        <div className="flex flex-col gap-4">
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            error={email && !emailValid ? 'Enter a valid email address' : undefined}
          />
          <RadioGroup label="Role" value={role} onValueChange={(v) => setRole(v as UserRole)}>
            {ROLES.map((r) => (
              <RadioGroupItem key={r} value={r} label={r} />
            ))}
          </RadioGroup>
        </div>
      </Dialog>
    </div>
  )
}

/* ---------------------------------------------------------- Moderation */

function ModerationPage() {
  const { reports, setReports, content, updateContent, log } = useShowcase()
  const { toast } = useToast()

  const resolve = (id: string, action: 'dismiss' | 'archive') => {
    const report = reports.find((r) => r.id === id)
    if (!report) return
    const item = content.find((c) => c.id === report.contentId)
    if (action === 'archive' && item) {
      updateContent([item.id], { status: 'archived' })
      log(`“${item.title}” archived after a report`, 'danger')
    } else {
      log(`Report on “${item?.title}” dismissed`, 'neutral')
    }
    setReports((prev) => prev.filter((r) => r.id !== id))
    toast({ title: action === 'archive' ? 'Content archived' : 'Report dismissed', description: item?.title ?? '', tone: action === 'archive' ? 'warning' : 'info' })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Moderation" description="Reports from the community, oldest first." />
      {reports.length === 0 ? (
        <EmptyState icon={<Shield className="size-7" />} title="No open reports" description="Nice. The queue is empty." />
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((r) => {
            const item = content.find((c) => c.id === r.contentId)
            return (
              <Panel
                key={r.id}
                title={item?.title}
                description={`Reported by ${r.reporter} · ${formatDate(r.at)}`}
                actions={
                  <>
                    <Button size="sm" variant="secondary" onClick={() => resolve(r.id, 'dismiss')}>
                      Dismiss
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => resolve(r.id, 'archive')}>
                      Archive content
                    </Button>
                  </>
                }>
                <p className="body-sm">“{r.reason}”</p>
              </Panel>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- Tags */

function TagsPage() {
  const { content, navigate } = useShowcase()
  const counts = new Map<string, number>()
  content.filter((c) => !c.trashed).forEach((c) => c.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)))
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Tags" description="Tags in use across all Labs." />
      <div className="flex flex-wrap gap-2">
        {Array.from(counts.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([tag, count]) => (
            <FilterChip key={tag} count={count} onClick={() => navigate(`backstage/content?q=${tag}`)}>
              {tag}
            </FilterChip>
          ))}
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- Audit */

function AuditPage() {
  const { activity } = useShowcase()
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Audit" description="A log of every change made in this session." />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>When</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activity.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="font-medium">{a.text}</TableCell>
              <TableCell>
                <StatusBadge tone={a.tone}>{a.tone}</StatusBadge>
              </TableCell>
              <TableCell className="text-[var(--muted-foreground)]">{new Date(a.at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

/* ------------------------------------------------------- Site settings */

function SettingsPage() {
  const { maintenance, setMaintenance, log } = useShowcase()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [siteName, setSiteName] = useState('Dynamic Lab')

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Site settings" description="Changes here apply to the public site right away." />

      <Panel title="Maintenance mode" description="Shows a banner on the public site and limits access for visitors and Lab members.">
        <Switch
          checked={maintenance}
          onCheckedChange={setMaintenance}
          label={maintenance ? 'Maintenance mode is on' : 'Maintenance mode is off'}
          description="Switch to Dynamic Lab with the app switcher to see the banner."
        />
      </Panel>

      <form
        className="ui-panel flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          setSaving(true)
          setTimeout(() => {
            setSaving(false)
            log('Site settings saved', 'success')
            toast({ title: 'Settings saved', description: 'The public site picks them up on next load.', tone: 'success' })
          }, 900)
        }}>
        <h3 className="ui-section-title">General</h3>
        <TextField label="Site name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
        <RadioGroup label="Registration" defaultValue="invite" orientation="horizontal" variant="card">
          <RadioGroupItem value="open" label="Open" description="Anyone can sign up" />
          <RadioGroupItem value="invite" label="Invite only" description="Staff send invites" />
          <RadioGroupItem value="closed" label="Closed" description="No new accounts" />
        </RadioGroup>
        <div className="flex flex-col gap-1.5">
          <span className="button-sm">Default rating for new uploads</span>
          <SegmentedControl
            aria-label="Default rating"
            defaultValue="general"
            options={Object.entries(RATING_LABELS).map(([value, label]) => ({ value, label }))}
          />
        </div>
        <FileInput label="Site logo" variant="dropzone" accept=".svg,.png" helperText="SVG or PNG, at least 512 px wide." />
        <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
          <Button variant="secondary" onClick={() => setSiteName('Dynamic Lab')}>
            Reset
          </Button>
          <Button type="submit" loading={saving}>
            Save settings
          </Button>
        </div>
      </form>
    </div>
  )
}

/* --------------------------------------------------------- Placeholder */

function PlaceholderPage({ entry }: { entry: NavEntry }) {
  const { navigate } = useShowcase()
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={entry.label} />
      <EmptyState
        icon={entry.icon}
        title={`${entry.label} isn't part of the demo`}
        description="The navigation, breadcrumbs and command palette all work; this page just has no content yet."
        action={
          <Button variant="secondary" onClick={() => navigate('backstage/overview')}>
            Back to overview
          </Button>
        }
      />
    </div>
  )
}
