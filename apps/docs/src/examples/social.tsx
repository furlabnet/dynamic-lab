import React, { useState } from 'react'

import type { CropArea, DateRange, Reaction } from '@furlab/dynamic-lab'
import {
  BarChart,
  Button,
  Calendar,
  Carousel,
  CharacterSheet,
  Combobox,
  ContentCard,
  ConversationItem,
  cropImage,
  DatePicker,
  Grid,
  HoverCard,
  HStack,
  ImageCropper,
  LikeButton,
  Link,
  MessageBubble,
  MessageComposer,
  MessageDivider,
  MessageThread,
  ProfilePreview,
  ReactionBar,
  Sparkline,
  StatTile,
  Text,
  TierCard,
  toDateKey,
  VStack,
} from '@furlab/dynamic-lab'

import { BookOpen, Download, Star, User } from 'lucide-react'

/** A generated illustration, so the examples need no image files. */
function art(a: number, b: number, label = '') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${a} 80% 62%)"/><stop offset="1" stop-color="hsl(${b} 75% 45%)"/></linearGradient></defs><rect width="800" height="800" fill="url(#g)"/><circle cx="400" cy="360" r="170" fill="hsl(${a} 60% 88%)"/><path d="M270 260 L320 120 L380 240Z M530 260 L480 120 L420 240Z" fill="hsl(${a} 60% 88%)"/><circle cx="345" cy="350" r="18" fill="#1b1b2b"/><circle cx="455" cy="350" r="18" fill="#1b1b2b"/><ellipse cx="400" cy="410" rx="22" ry="14" fill="#1b1b2b"/><text x="400" y="720" font-family="sans-serif" font-size="44" fill="white" text-anchor="middle">${label}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const SPECIES = [
  { value: 'wolf', label: 'Wolf', group: 'Canines' },
  { value: 'fox', label: 'Fox', group: 'Canines' },
  { value: 'dog', label: 'Dog', group: 'Canines' },
  { value: 'cat', label: 'Cat', group: 'Felines' },
  { value: 'snow-leopard', label: 'Snow leopard', group: 'Felines' },
  { value: 'lion', label: 'Lion', group: 'Felines' },
  { value: 'dragon', label: 'Dragon', group: 'Scalies' },
  { value: 'protogen', label: 'Protogen', group: 'Synths', description: 'Visor-faced cyborg' },
]

export function ComboboxExample() {
  const [species, setSpecies] = useState<string | null>('fox')
  const [tags, setTags] = useState<string[]>(['comic', 'sci-fi'])
  const [options, setOptions] = useState(
    ['comic', 'story', 'sci-fi', 'fantasy', 'slice of life', 'adventure', 'mystery'].map((t) => ({
      value: t,
      label: t,
    }))
  )
  return (
    <div className="grid max-w-xl gap-6">
      <Combobox label="Species" options={SPECIES} value={species} onValueChange={setSpecies} />
      <Combobox
        label="Tags"
        multiple
        max={5}
        options={options}
        value={tags}
        onValueChange={setTags}
        placeholder="Add tags…"
        onCreate={(label) => {
          const value = label.toLowerCase()
          setOptions((o) => [...o, { value, label: value }])
          setTags((t) => [...t, value])
        }}
      />
    </div>
  )
}

export function HoverCardExample() {
  return (
    <Text>
      New chapter from{' '}
      <HoverCard
        content={
          <ProfilePreview
            name="Moth Calloway"
            handle="moth"
            initials="MC"
            banner={art(280, 220)}
            bio="Writes quiet sci-fi about lighthouses, moths and the people who keep them."
            stats={[
              { label: 'followers', value: '1.2k' },
              { label: 'works', value: 14 },
            ]}
            action={<Button size="sm">Follow</Button>}
          />
        }>
        <Link href="#">@moth</Link>
      </HoverCard>
      . Hover or tab to the name.
    </Text>
  )
}

export function CarouselExample() {
  const works = [
    'Ember',
    'Tidewater',
    'Small hours',
    'Moth light',
    'Lantern',
    'Saltmarsh',
    'Fennec',
  ]
  return (
    <Carousel title="Trending comics" action={<Link href="#">See all</Link>} dots>
      {works.map((w, i) => (
        <ContentCard
          key={w}
          href="#"
          title={w}
          type="Comic"
          byline="Rook Fernsby"
          cover={art(20 + i * 45, 200 + i * 20)}
          aspect="portrait"
        />
      ))}
    </Carousel>
  )
}

export function MessagesExample() {
  const [messages, setMessages] = useState([
    { own: false, text: 'Hi! Are commission slots still open?', time: '14:01' },
    { own: true, text: 'Yes, two left this month 🎉', time: '14:02' },
    { own: true, text: 'Want a full body or a headshot?', time: '14:02' },
  ])
  return (
    <div className="grid overflow-hidden rounded-[var(--radius-2xl)] border md:grid-cols-[16rem_1fr]">
      <div className="hidden flex-col gap-1 border-r p-2 md:flex">
        <ConversationItem
          href="#"
          name="Lark Okonjo"
          initials="LO"
          preview="Want a full body or…"
          time="14:02"
          active
          online
        />
        <ConversationItem
          href="#"
          name="Fen Aldous"
          initials="FA"
          preview="Sent you the refs!"
          time="Tue"
          unread={2}
          online={false}
        />
      </div>
      <div className="flex h-96 flex-col">
        <MessageThread className="flex-1">
          <MessageDivider>Today</MessageDivider>
          {messages.map((m, i) => {
            const prev = messages[i - 1]
            const next = messages[i + 1]
            const first = !prev || prev.own !== m.own
            const last = !next || next.own !== m.own
            return (
              <MessageBubble
                key={i}
                own={m.own}
                author="Lark Okonjo"
                initials="LO"
                time={m.time}
                status={m.own ? 'read' : undefined}
                grouping={first && last ? 'single' : first ? 'first' : last ? 'last' : 'middle'}>
                {m.text}
              </MessageBubble>
            )
          })}
        </MessageThread>
        <div className="border-t p-3">
          <MessageComposer
            onAttach={() => {}}
            onSend={(text) => setMessages((m) => [...m, { own: true, text, time: 'now' }])}
          />
        </div>
      </div>
    </div>
  )
}

export function TierCards() {
  return (
    <Grid cols={{ base: 1, md: 3 }} gap={4}>
      <TierCard
        name="Headshot"
        price="$40"
        period="per character"
        status="open"
        slotsLeft={4}
        slotsTotal={6}
        features={[
          'Flat colour',
          'Simple background',
          { label: 'Extra character', included: false },
        ]}
        action={<Button variant="secondary">Request</Button>}
        footnote="About 1 week"
      />
      <TierCard
        name="Full body"
        price="$120"
        period="per character"
        highlight="Most popular"
        status="limited"
        slotsLeft={1}
        slotsTotal={4}
        features={['Full shading', 'Simple background', 'Extra character +$80']}
        action={<Button>Request</Button>}
        footnote="2–3 weeks"
      />
      <TierCard
        name="Ref sheet"
        price="$260"
        status="sold-out"
        features={['Front and back', 'Palette and notes', 'Two expressions']}
        action={<Button disabled>Sold out</Button>}
        footnote="Opens again in December"
      />
    </Grid>
  )
}

export function Likes() {
  const [reactions, setReactions] = useState<Reaction[]>([
    { emoji: '❤️', count: 24, reacted: true, label: 'heart' },
    { emoji: '😂', count: 3, label: 'laughing' },
    { emoji: '🐾', count: 9, label: 'paw prints' },
  ])
  const toggle = (emoji: string) =>
    setReactions((rs) => {
      const found = rs.find((r) => r.emoji === emoji)
      if (!found) return [...rs, { emoji, count: 1, reacted: true }]
      return rs.map((r) =>
        r.emoji === emoji ? { ...r, reacted: !r.reacted, count: r.count + (r.reacted ? -1 : 1) } : r
      )
    })
  return (
    <VStack gap={4}>
      <HStack gap={1}>
        <LikeButton count={1283} label="Like The lighthouse keeper" />
        <LikeButton count={41} icon={<Star />} label="Favourite" />
      </HStack>
      <ReactionBar reactions={reactions} onToggle={toggle} />
    </VStack>
  )
}

export function CharacterSheetExample() {
  return (
    <CharacterSheet
      name="Ember"
      species="Red fox"
      pronouns="she/they"
      image={art(18, 345, 'Ember')}
      imageAlt="Ember, a red fox with cream cheeks"
      credit="Art by @moth"
      swatches={[
        { name: 'Main fur', color: '#D9572B' },
        { name: 'Cheeks', color: '#F6E3C8' },
        { name: 'Socks', color: '#2B2230' },
        { name: 'Eyes', color: '#3FB8A6' },
      ]}
      details={[
        { label: 'Age', value: 'Adult' },
        { label: 'Height', value: '5′6″' },
        { label: 'Personality', value: 'Curious, loud' },
      ]}
      bio="A cartographer who maps places that don't stay put."
      notes="Tail tip is cream, not white. No piercings, please."
      tags={['fox', 'oc', 'sfw']}
      actions={
        <Button size="sm" variant="secondary" leftIcon={<Download className="size-4" />}>
          Ref
        </Button>
      }
    />
  )
}

export function CalendarExample() {
  const [day, setDay] = useState<Date | null>(new Date())
  const [range, setRange] = useState<DateRange>({ from: null, to: null })
  const now = new Date()
  const events = {
    [toDateKey(new Date(now.getFullYear(), now.getMonth(), 3))]: 1,
    [toDateKey(new Date(now.getFullYear(), now.getMonth(), 17))]: 2,
  }
  return (
    <div className="flex flex-wrap items-start gap-8">
      <div className="surface-card p-3">
        <Calendar value={day} onValueChange={setDay} events={events} eventLabel="releases" />
      </div>
      <VStack gap={4} className="w-72">
        <DatePicker label="Release date" minDate={now} />
        <DatePicker label="Commission window" mode="range" value={range} onValueChange={setRange} />
      </VStack>
    </div>
  )
}

export function ImageCropperExample() {
  const [area, setArea] = useState<CropArea | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const src = art(260, 320, 'Drag me')
  return (
    <div className="grid items-start gap-6 sm:grid-cols-[1fr_auto]">
      <ImageCropper src={src} aspect={1} shape="circle" onCropChange={setArea} />
      <VStack gap={3} align="center">
        <div className="size-28 overflow-hidden rounded-full border bg-[var(--muted)]">
          {preview ? (
            <img src={preview} alt="Cropped avatar" className="size-full" />
          ) : (
            <User className="m-auto mt-9 size-10 text-[var(--muted-foreground)]" />
          )}
        </div>
        <Button
          size="sm"
          disabled={!area}
          onClick={async () => {
            if (!area) return
            const blob = await cropImage(src, area, { width: 256 })
            setPreview(URL.createObjectURL(blob))
          }}>
          Crop
        </Button>
      </VStack>
    </div>
  )
}

export function ChartsExample() {
  const views = [120, 180, 150, 260, 240, 380, 420, 390, 510, 470, 620, 700]
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const reads = [820, 1140, 960, 1480, 1320, 2210, 1870]
  return (
    <VStack gap={6}>
      <Grid cols={{ base: 1, sm: 2 }} gap={4}>
        <StatTile
          label="Views"
          value={12840}
          delta={0.18}
          deltaLabel="vs last month"
          trend={views}
        />
        <StatTile
          label="New followers"
          value={312}
          delta={-0.04}
          deltaLabel="vs last month"
          trend={views.slice().reverse()}
        />
      </Grid>
      <div className="surface-card flex flex-col gap-4 p-5">
        <HStack>
          <BookOpen className="size-4 text-[var(--muted-foreground)]" />
          <Text size="sm" weight="semibold">
            Chapter reads this week
          </Text>
        </HStack>
        <BarChart
          label="Chapter reads this week"
          data={days.map((d, i) => ({ label: d, value: reads[i]! }))}
          highlight={5}
        />
      </div>
      <div className="max-w-xs">
        <Sparkline
          label="Views"
          values={views}
          labels={views.map((_, i) => `Week ${i + 1}`)}
          height={48}
        />
      </div>
    </VStack>
  )
}
