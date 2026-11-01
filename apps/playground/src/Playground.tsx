import React, { useState } from 'react'

import {
  Align,
  AspectRatio,
  AvatarGroup,
  Background,
  Badge,
  BottomNav,
  BottomNavItem,
  BrandLockup,
  Button,
  Center,
  Column,
  Columns,
  ContentCard,
  Glass,
  Grid,
  Heading,
  HStack,
  IconButton,
  Indicator,
  Link,
  List,
  ListItem,
  ProfileAvatar,
  Section,
  Show,
  SidebarLayout,
  SiteFooter,
  SiteHeader,
  SiteNav,
  SiteNavLink,
  SkipLink,
  Spacer,
  Stack,
  Stepper,
  Tabs,
  TabsList,
  TabsTrigger,
  Text,
  TextField,
  ThemeProvider,
  ThemeToggle,
  ToastProvider,
  VStack,
  ZStack,
  ZStackItem,
} from '@furlab/dynamic-lab'
import pkg from '@furlab/dynamic-lab/package.json'

import {
  Bell,
  BookOpen,
  Compass,
  Eye,
  Heart,
  Home,
  Inbox,
  MessageCircle,
  Play,
  Plus,
  Search,
  User,
} from 'lucide-react'

import { REPOSITORY_URL, SHOWCASE_URL } from './links'

/*
 * A Furlab-style home feed built only from Dynamic Lab components: no hand-written layout CSS.
 * It doubles as a smoke test for the layout primitives at every breakpoint.
 */

const WORKS = [
  { title: 'The lighthouse keeper', type: 'Comic', by: 'Rook Fernsby', meta: '24 pages' },
  { title: 'Tidewater', type: 'Story', by: 'Moth Calloway', meta: '3 chapters' },
  { title: 'Ember & Ash', type: 'Comic', by: 'Lark Okonjo', meta: '12 pages' },
  { title: 'Small hours', type: 'Story', by: 'Fen Aldous', meta: '1 chapter' },
]

const CREATORS = ['Rook', 'Moth', 'Lark', 'Fen', 'Tide', 'Ember', 'Wren'].map((n) => ({
  alt: n,
  initials: n.slice(0, 2).toUpperCase(),
}))

function Hero() {
  return (
    <ZStack className="overflow-hidden rounded-[var(--radius-3xl)]">
      <AspectRatio ratio={21 / 9} className="min-h-72">
        <div className="size-full bg-[linear-gradient(120deg,var(--glow-a),var(--glow-b))]" />
      </AspectRatio>
      <ZStackItem position="top-left" inset="1rem">
        <Badge variant="solid">Featured</Badge>
      </ZStackItem>
      <ZStackItem position="bottom-left" inset="clamp(1rem, 4vw, 2.5rem)">
        <VStack gap={3} className="max-w-xl text-white">
          <Text size="sm" weight="semibold" className="opacity-85">
            New chapter · Rook Fernsby
          </Text>
          <Heading level={1} size="display" tone="inherit">
            The lighthouse keeper
          </Heading>
          <HStack gap={2}>
            <Button leftIcon={<Play className="size-4" />}>Start reading</Button>
            <Button variant="glass" className="text-white">
              Save
            </Button>
          </HStack>
        </VStack>
      </ZStackItem>
    </ZStack>
  )
}

function Feed() {
  const [tab, setTab] = useState('following')
  return (
    <VStack gap={6}>
      <Align x="between">
        <Heading level={2}>Your feed</Heading>
        <Tabs value={tab} onValueChange={setTab} className="w-auto">
          <TabsList>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>
        </Tabs>
      </Align>
      <Grid cols={{ base: 1, sm: 2 }} gap={5}>
        {WORKS.map((w) => (
          <ContentCard
            key={w.title}
            href="#"
            title={w.title}
            type={w.type}
            byline={w.by}
            coverMeta={w.meta}
            icon={<BookOpen />}
            aspect="landscape"
            stats={[
              { icon: <Heart className="size-3.5" />, value: '1.2k', label: 'likes' },
              { icon: <Eye className="size-3.5" />, value: '8.4k', label: 'views' },
              { icon: <MessageCircle className="size-3.5" />, value: '86', label: 'comments' },
            ]}
          />
        ))}
      </Grid>
    </VStack>
  )
}

function Sidebar() {
  return (
    <VStack gap={6}>
      <Glass grain className="flex flex-col gap-4 p-5">
        <HStack>
          <ProfileAvatar size="lg" initials="YO" status="online" />
          <VStack gap={0} className="min-w-0">
            <Text weight="semibold" truncate>
              You
            </Text>
            <Text size="sm" tone="muted">
              Finish setting up
            </Text>
          </VStack>
        </HStack>
        <Stepper
          orientation="vertical"
          current={1}
          steps={[
            { label: 'Pick a name' },
            { label: 'Add an avatar' },
            { label: 'Follow 3 creators' },
          ]}
        />
      </Glass>

      <List variant="inset" label="Activity">
        <ListItem
          leading={<ProfileAvatar initials="MO" />}
          title="Moth replied to you"
          description="“Chapter 3 is where it all turns.”"
          trailing={
            <Text size="xs" tone="muted">
              2m
            </Text>
          }
          href="#"
          selected
        />
        <ListItem
          leading={<ProfileAvatar initials="LA" />}
          title="Lark followed you"
          trailing={
            <Text size="xs" tone="muted">
              1h
            </Text>
          }
          href="#"
        />
      </List>

      <VStack gap={3}>
        <Text size="sm" weight="semibold">
          Creators to follow
        </Text>
        <HStack>
          <AvatarGroup avatars={CREATORS} max={5} />
          <Spacer />
          <Link href={SHOWCASE_URL} variant="subtle">
            See all
          </Link>
        </HStack>
      </VStack>
    </VStack>
  )
}

function Playground() {
  const [nav, setNav] = useState('home')
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip pb-24 md:pb-0">
      <Background variant="aurora" pattern="dots" patternFade animate />
      <SkipLink />
      <SiteHeader
        brand={
          <a href="./" className="flex items-center gap-2" aria-label="Dynamic Lab home">
            <BrandLockup name="Dynamic Lab" />
          </a>
        }
        nav={
          <SiteNav>
            <SiteNavLink href="#" active>
              Home
            </SiteNavLink>
            <SiteNavLink href="#">Explore</SiteNavLink>
            <SiteNavLink href={SHOWCASE_URL}>Showcase</SiteNavLink>
          </SiteNav>
        }
        actions={
          <HStack gap={2}>
            <Show above="lg">
              <TextField
                aria-label="Search"
                placeholder="Search works and creators"
                startIcon={<Search className="size-4" />}
                className="w-64"
              />
            </Show>
            <Indicator count={3} label="3 unread notifications">
              <IconButton aria-label="Notifications" icon={<Bell className="size-4" />} />
            </Indicator>
            <ThemeToggle />
          </HStack>
        }
      />

      <Stack as="main" id="main" gap={0} className="flex-1">
        <Section spacing="sm">
          <Hero />
        </Section>

        <Section spacing="sm">
          <SidebarLayout
            side="right"
            sidebarWidth="20rem"
            sticky
            stickyTop="5.5rem"
            sidebar={<Sidebar />}
            sidebarLabel="Your activity">
            <Feed />
          </SidebarLayout>
        </Section>

        <Section
          eyebrow="For creators"
          title="Publish your first work"
          description="Upload pages or text, add details, and share it with your followers."
          centered>
          <Center>
            <Columns gap={4} collapseBelow="sm" align="center" className="w-full max-w-xl">
              <Column>
                <Badge variant="neutral">v{pkg.version}</Badge>
              </Column>
              <Column width="content">
                <Button size="lg" leftIcon={<Plus className="size-4" />}>
                  Create
                </Button>
              </Column>
            </Columns>
          </Center>
        </Section>
      </Stack>

      <SiteFooter
        start={<span>© 2026 Vedla Creative &amp; The Furlab Project · MIT licence</span>}
        end={
          <a href={REPOSITORY_URL} className="hover:underline">
            {pkg.name}@{pkg.version}
          </a>
        }
      />

      <BottomNav>
        {[
          { id: 'home', label: 'Home', icon: <Home /> },
          { id: 'explore', label: 'Explore', icon: <Compass /> },
          { id: 'create', label: 'Create', icon: <Plus /> },
          { id: 'inbox', label: 'Inbox', icon: <Inbox />, badge: 3 },
          { id: 'me', label: 'Profile', icon: <User /> },
        ].map((it) => (
          <BottomNavItem
            key={it.id}
            href="#"
            icon={it.icon}
            label={it.label}
            badge={it.badge}
            active={nav === it.id}
            onClick={(e) => {
              e.preventDefault()
              setNav(it.id)
            }}
          />
        ))}
      </BottomNav>
    </div>
  )
}

export function PlaygroundApp() {
  return (
    <ThemeProvider defaultBrand="dynamic" storageKey="dynamic-lab-playground">
      <ToastProvider>
        <Playground />
      </ToastProvider>
    </ThemeProvider>
  )
}
