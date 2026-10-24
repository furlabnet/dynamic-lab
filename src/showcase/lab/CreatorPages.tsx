import React, { useState } from 'react'
import {
  Badge,
  Button,
  ContentCard,
  DescriptionList,
  EmptyState,
  FilterChip,
  LinkHub,
  NotFoundState,
  Panel,
  ProfileAvatar,
  ProfileHeader,
  SegmentedControl,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ThemeToggle,
  useToast,
  type LinkHubLink,
} from '../../index'
import {
  AtSign,
  BookOpen,
  Calendar,
  Cloud,
  FlaskConical,
  Grid3x3,
  Heart,
  Link2,
  List,
  Mail,
  MapPin,
  MessageSquare,
  Palette,
  Pencil,
  Play,
  Rss,
  ShoppingBag,
  UserPlus,
  UserCheck,
  Globe,
} from 'lucide-react'
import { CURRENT_USER, STATUS_LABELS, STATUS_TONES, TYPE_LABELS, TYPE_PLURALS, type ContentRecord, type ContentType } from '../data'
import { getDetails, labBySlug, profileByHandle, type ProfileLink } from '../details'
import { formatDate, useShowcase } from '../state'

const LINK_ICONS: Record<ProfileLink['kind'], React.ReactNode> = {
  shop: <ShoppingBag />,
  commission: <Palette />,
  patreon: <Heart />,
  site: <BookOpen />,
  lab: <FlaskConical />,
  newsletter: <Mail />,
  video: <Play />,
}

const SOCIAL_ICONS = {
  mastodon: <AtSign />,
  bluesky: <Cloud />,
  youtube: <Play />,
  mail: <Mail />,
  rss: <Rss />,
}

const TYPES = Object.keys(TYPE_LABELS) as ContentType[]

function compact(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

function WorksGrid({ works, emptyText }: { works: ContentRecord[]; emptyText: string }) {
  const { navigate } = useShowcase()
  const [type, setType] = useState<ContentType | 'all'>('all')
  const [view, setView] = useState('grid')
  const types = TYPES.filter((t) => works.some((w) => w.type === t))
  const shown = works.filter((w) => type === 'all' || w.type === type)

  if (works.length === 0) return <EmptyState title="Nothing published yet" description={emptyText} />

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={type === 'all'} count={works.length} onClick={() => setType('all')}>
            All
          </FilterChip>
          {types.map((t) => (
            <FilterChip key={t} active={type === t} count={works.filter((w) => w.type === t).length} onClick={() => setType(t)}>
              {TYPE_PLURALS[t]}
            </FilterChip>
          ))}
        </div>
        <SegmentedControl
          size="sm"
          aria-label="Layout"
          value={view}
          onValueChange={setView}
          options={[
            { value: 'grid', label: 'Grid', icon: <Grid3x3 /> },
            { value: 'list', label: 'List', icon: <List /> },
          ]}
        />
      </div>
      {view === 'grid' ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((w) => (
            <ContentCard
              key={w.id}
              type={TYPE_LABELS[w.type]}
              title={w.title}
              byline={`By ${w.creator}`}
              cover={getDetails(w).cover}
              coverBadge={w.rating !== 'general' ? <Badge variant={w.rating === 'mature' ? 'danger' : 'warning'} size="sm">{w.rating}</Badge> : undefined}
              onClick={() => navigate(`lab/view/${w.id}`)}
            />
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map((w) => (
              <TableRow key={w.id} className="cursor-pointer" onClick={() => navigate(`lab/view/${w.id}`)}>
                <TableCell className="font-semibold">
                  <div className="flex items-center gap-3">
                    <img src={getDetails(w).cover} alt="" className="size-10 rounded-[var(--radius-md)] object-cover" loading="lazy" />
                    {w.title}
                  </div>
                </TableCell>
                <TableCell className="text-[var(--muted-foreground)]">{TYPE_LABELS[w.type]}</TableCell>
                <TableCell>{w.creator}</TableCell>
                <TableCell className="text-[var(--muted-foreground)]">{formatDate(w.updated)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

function FollowButton({ name, initialFollowers }: { name: string; initialFollowers?: number }) {
  const { toast } = useToast()
  const [following, setFollowing] = useState(false)
  return (
    <Button
      variant={following ? 'secondary' : 'primary'}
      aria-pressed={following}
      leftIcon={following ? <UserCheck className="size-4" /> : <UserPlus className="size-4" />}
      onClick={() => {
        setFollowing(!following)
        if (!following) toast({ title: `Following ${name}`, description: 'New work shows up in your notifications.', tone: 'success' })
      }}>
      {following ? 'Following' : 'Follow'}
      {initialFollowers !== undefined && <span className="ml-1 opacity-75">{compact(initialFollowers + (following ? 1 : 0))}</span>}
    </Button>
  )
}

/* ------------------------------------------------------------ Profile */

export function ProfilePage({ handle }: { handle: string }) {
  const { content, navigate, saved } = useShowcase()
  const { toast } = useToast()
  const profile = profileByHandle(handle)

  if (!profile) {
    return (
      <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 sm:px-8">
        <NotFoundState title="No one by that name" description={`We couldn't find @${handle}.`} onHomeClick={() => navigate('lab/browse')} />
      </div>
    )
  }

  const isMe = profile.handle === CURRENT_USER.handle
  const works = content.filter((c) => c.creator === profile.name && c.status === 'published' && !c.trashed)
  const drafts = content.filter((c) => c.creator === profile.name && c.status !== 'published' && !c.trashed)
  const savedWorks = content.filter((c) => saved.includes(c.id) && !c.trashed)
  const labs = profile.labs.map(labBySlug).filter(Boolean)

  return (
    <div className="mx-auto flex max-w-[var(--container-max)] flex-col gap-8 px-4 py-8 sm:px-8">
      <ProfileHeader
        name={profile.name}
        handle={`@${profile.handle}`}
        avatarSrc={profile.avatar}
        bannerSrc={profile.banner}
        badges={
          <>
            {profile.pronouns && <Badge variant="neutral">{profile.pronouns}</Badge>}
            {labs.length > 0 && <Badge>Creator</Badge>}
          </>
        }
        bio={profile.bio}
        meta={
          <>
            {profile.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin /> {profile.location}
              </span>
            )}
            {profile.website && (
              <span className="inline-flex items-center gap-1.5">
                <Globe /> {profile.website}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Calendar /> Joined {formatDate(profile.joined)}
            </span>
          </>
        }
        stats={[
          { label: 'Creations', value: works.length },
          { label: 'Followers', value: compact(profile.followers) },
          { label: 'Following', value: profile.following },
        ]}
        actions={
          <>
            <Button variant="secondary" leftIcon={<Link2 className="size-4" />} onClick={() => navigate(`lab/links/${profile.handle}`)}>
              Links
            </Button>
            {isMe ? (
              <Button leftIcon={<Pencil className="size-4" />} onClick={() => navigate('lab/library/profile')}>
                Edit profile
              </Button>
            ) : (
              <>
                <Button variant="secondary" leftIcon={<MessageSquare className="size-4" />} onClick={() => toast({ title: 'Messages', description: 'Direct messages are not part of the demo.' })}>
                  Message
                </Button>
                <FollowButton name={profile.name} />
              </>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Tabs defaultValue="works" variant="line">
          <TabsList>
            <TabsTrigger value="works">Creations</TabsTrigger>
            {isMe && <TabsTrigger value="drafts">Drafts ({drafts.length})</TabsTrigger>}
            {isMe && <TabsTrigger value="saved">Saved ({savedWorks.length})</TabsTrigger>}
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <TabsContent value="works" className="pt-5">
            <WorksGrid works={works} emptyText={`${profile.name} hasn't published anything yet.`} />
          </TabsContent>
          {isMe && (
            <TabsContent value="drafts" className="pt-5">
              <div className="flex flex-col gap-2">
                {drafts.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => navigate(`lab/view/${d.id}`)}
                    className="ui-panel flex items-center justify-between gap-3 py-3! text-left hover:border-[var(--primary)]">
                    <span className="font-semibold">{d.title}</span>
                    <StatusBadge tone={STATUS_TONES[d.status]}>{STATUS_LABELS[d.status]}</StatusBadge>
                  </button>
                ))}
                {drafts.length === 0 && <p className="body-sm text-[var(--muted-foreground)]">No drafts.</p>}
              </div>
            </TabsContent>
          )}
          {isMe && (
            <TabsContent value="saved" className="pt-5">
              <WorksGrid works={savedWorks} emptyText="Use Save on any creation to keep it here." />
            </TabsContent>
          )}
          <TabsContent value="about" className="pt-5">
            <Panel>
              <DescriptionList
                items={[
                  { label: 'Handle', value: `@${profile.handle}` },
                  { label: 'Pronouns', value: profile.pronouns ?? '—' },
                  { label: 'Location', value: profile.location ?? '—' },
                  { label: 'Joined', value: formatDate(profile.joined) },
                  { label: 'Labs', value: labs.map((l) => l!.name).join(', ') || '—' },
                ]}
              />
            </Panel>
          </TabsContent>
        </Tabs>

        <aside className="flex flex-col gap-6">
          {labs.length > 0 && (
            <Panel title="Creator Labs">
              <ul className="flex flex-col gap-3">
                {labs.map((lab) => (
                  <li key={lab!.slug}>
                    <a href={`#/lab/labs/${lab!.slug}`} className="flex items-center gap-3 rounded-[var(--radius-lg)] p-1 hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)]">
                      <ProfileAvatar src={lab!.avatar} initials={lab!.name.slice(0, 2)} size="lg" shape="square" />
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate font-semibold">{lab!.name}</span>
                        <span className="truncate text-xs text-[var(--muted-foreground)]">{lab!.members.find((m) => m.handle === profile.handle)?.role}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
          <Panel
            title="Links"
            actions={
              <Button size="sm" variant="ghost" onClick={() => navigate(`lab/links/${profile.handle}`)}>
                Open page
              </Button>
            }>
            <ul className="flex flex-col gap-2 text-sm">
              {profile.links.map((l) => (
                <li key={l.id}>
                  <a href={l.href} className="flex items-center gap-2 font-medium hover:text-[var(--primary)] [&_svg]:size-4 [&_svg]:text-[var(--muted-foreground)]">
                    {LINK_ICONS[l.kind]} {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- Lab */

export function LabPage({ slug }: { slug: string }) {
  const { content, navigate } = useShowcase()
  const lab = labBySlug(slug)

  if (!lab) {
    return (
      <div className="mx-auto max-w-[var(--container-max)] px-4 py-10 sm:px-8">
        <NotFoundState title="No Lab here" description={`We couldn't find a Creator Lab called “${slug}”.`} onHomeClick={() => navigate('lab/browse')} />
      </div>
    )
  }

  const works = content.filter((c) => c.lab === lab.name && c.status === 'published' && !c.trashed && c.type !== 'page')
  const featured = lab.featured.map((id) => content.find((c) => c.id === id)).filter((c): c is ContentRecord => Boolean(c && !c.trashed))
  const pages = content.filter((c) => c.lab === lab.name && c.type === 'page' && c.status === 'published')
  const [hero, ...rest] = featured

  return (
    <div className="mx-auto flex max-w-[var(--container-max)] flex-col gap-10 px-4 py-8 sm:px-8">
      <ProfileHeader
        variant="lab"
        name={lab.name}
        handle={`Creator Lab · since ${new Date(lab.founded).getFullYear()}`}
        avatarSrc={lab.avatar}
        bannerSrc={lab.banner}
        badges={<Badge>Lab</Badge>}
        bio={lab.tagline}
        stats={[
          { label: 'Members', value: lab.members.length },
          { label: 'Works', value: works.length },
          { label: 'Followers', value: '4.2k' },
        ]}
        actions={
          <>
            <Button variant="secondary" leftIcon={<Link2 className="size-4" />} onClick={() => navigate(`lab/links/${lab.slug}`)}>
              Links
            </Button>
            <FollowButton name={lab.name} />
          </>
        }
      />

      {hero && (
        <section className="flex flex-col gap-4">
          <h2 className="section-title">Featured</h2>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <button
              type="button"
              onClick={() => navigate(`lab/view/${hero.id}`)}
              className="group relative overflow-hidden rounded-[var(--radius-3xl)] text-left focus-visible:outline-2 focus-visible:outline-[var(--ring)]">
              <img src={getDetails(hero).cover} alt="" className="aspect-[16/10] size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-white/80">{TYPE_LABELS[hero.type]}</span>
                <span className="text-2xl font-extrabold tracking-tight sm:text-3xl">{hero.title}</span>
                <span className="max-w-lg text-sm text-white/85">{getDetails(hero).description.split('\n')[0]}</span>
              </div>
            </button>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {rest.map((w) => (
                <ContentCard key={w.id} type={TYPE_LABELS[w.type]} title={w.title} byline={`By ${w.creator}`} cover={getDetails(w).cover} aspect="landscape" onClick={() => navigate(`lab/view/${w.id}`)} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="flex flex-col gap-4">
          <h2 className="section-title">All work</h2>
          <WorksGrid works={works} emptyText="This Lab hasn't published anything yet." />
        </section>
        <aside className="flex flex-col gap-6">
          <Panel title="About">
            <div className="flex flex-col gap-3 text-sm leading-relaxed">
              {lab.about.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {pages.map((p) => (
                <a key={p.id} href={`#/lab/view/${p.id}`} className="font-semibold text-[var(--primary)] hover:underline">
                  {p.title} →
                </a>
              ))}
            </div>
          </Panel>
          <Panel title="Members">
            <ul className="flex flex-col gap-3">
              {lab.members.map((m) => {
                const p = profileByHandle(m.handle)
                return (
                  <li key={m.handle}>
                    <a href={`#/lab/u/${m.handle}`} className="flex items-center gap-3 rounded-[var(--radius-lg)] p-1 hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)]">
                      <ProfileAvatar src={p?.avatar} initials={m.handle.slice(0, 2)} size="lg" />
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate font-semibold">{p?.name ?? m.handle}</span>
                        <span className="truncate text-xs text-[var(--muted-foreground)]">{m.role}</span>
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </Panel>
          {lab.links.length > 0 && (
            <Panel title="Links">
              <ul className="flex flex-col gap-2 text-sm">
                {lab.links.map((l) => (
                  <li key={l.id}>
                    <a href={l.href} className="flex items-center gap-2 font-medium hover:text-[var(--primary)] [&_svg]:size-4 [&_svg]:text-[var(--muted-foreground)]">
                      {LINK_ICONS[l.kind]} {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </aside>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- Links */

/** Link-in-bio page for a creator or a Lab. Rendered without the site chrome. */
export function LinksPage({ handle }: { handle: string }) {
  const { navigate } = useShowcase()
  const { toast } = useToast()
  const profile = profileByHandle(handle)
  const lab = profile ? undefined : labBySlug(handle)
  const owner = profile ?? lab

  if (!owner) {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <NotFoundState title="No links here" description={`Nothing is published at /links/${handle}.`} onHomeClick={() => navigate('lab/home')} />
      </div>
    )
  }

  const links: LinkHubLink[] = owner.links.map((l) => ({
    id: l.id,
    label: l.label,
    href: l.href,
    description: l.description,
    icon: LINK_ICONS[l.kind],
    featured: l.featured,
    onClick: /^https?:/.test(l.href)
      ? (e) => {
          e.preventDefault()
          toast({ title: 'External link', description: `Would open ${new URL(l.href).hostname}.` })
        }
      : undefined,
  }))

  const fullProfileHref = profile ? `#/lab/u/${profile.handle}` : `#/lab/labs/${lab!.slug}`

  return (
    <div className="relative min-h-screen overflow-hidden">
      <img src={profile ? profile.banner : lab!.banner} alt="" className="absolute inset-0 -z-10 size-full scale-110 object-cover opacity-40 blur-2xl" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[color-mix(in_srgb,var(--background)_70%,transparent)] to-[var(--background)]" />
      <div className="absolute right-4 top-4">
        <ThemeToggle variant="ghost" />
      </div>
      <div className="px-4 py-16">
        <LinkHub
          name={owner.name}
          handle={profile ? `@${profile.handle}` : 'Creator Lab'}
          avatarSrc={profile ? profile.avatar : lab!.avatar}
          bio={profile ? profile.bio : lab!.tagline}
          links={[
            ...links,
            { id: 'profile', label: profile ? 'Full portfolio on Dynamic Lab' : 'Visit the Lab', href: fullProfileHref, icon: <Globe /> },
          ]}
          socials={profile?.socials.map((s) => ({ label: s.label, href: s.href, icon: SOCIAL_ICONS[s.kind] }))}
          footer={
            <a href="#/lab/home" className="hover:underline">
              Made with Dynamic Lab
            </a>
          }
        />
      </div>
    </div>
  )
}

