import React, { useState } from 'react'

import { Bookmark, Eye, MessageCircle } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Checkbox,
  type CommentData,
  CommentThread,
  ContentCard,
  DescriptionList,
  LocalDateTime,
  MediaGallery,
  MetricCard,
  ProfileAvatar,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TagList,
  WorkflowTimeline,
  WorkflowTimelineItem,
} from '@furlab/dynamic-lab'

export function TableExample() {
  const rows = [
    {
      id: 1,
      title: 'The lighthouse keeper',
      author: 'Alex Rivera',
      tone: 'success' as const,
      status: 'Published',
    },
    {
      id: 2,
      title: 'Neon Odyssey: Volume II',
      author: 'Maya Lin',
      tone: 'warning' as const,
      status: 'In review',
    },
    {
      id: 3,
      title: 'Tidepool Sketchbook',
      author: 'Maya Lin',
      tone: 'neutral' as const,
      status: 'Draft',
    },
  ]
  const [selected, setSelected] = useState<number[]>([])
  const toggle = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">
            <Checkbox
              aria-label="Select all"
              checked={selected.length === rows.length}
              indeterminate={selected.length > 0 && selected.length < rows.length}
              onCheckedChange={() =>
                setSelected(selected.length === rows.length ? [] : rows.map((r) => r.id))
              }
            />
          </TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id} selected={selected.includes(r.id)}>
            <TableCell>
              <Checkbox
                aria-label={`Select ${r.title}`}
                checked={selected.includes(r.id)}
                onCheckedChange={() => toggle(r.id)}
              />
            </TableCell>
            <TableCell className="font-semibold">{r.title}</TableCell>
            <TableCell>{r.author}</TableCell>
            <TableCell>
              <StatusBadge tone={r.tone}>{r.status}</StatusBadge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function Metrics() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <MetricCard label="Waiting for review" value={12} href="#" />
      <MetricCard
        label="Published this week"
        value={48}
        delta={{ value: '+12%', direction: 'up' }}
      />
      <MetricCard
        label="Reports"
        value={3}
        delta={{ value: '-2', direction: 'down' }}
        subtext="vs last week"
      />
    </div>
  )
}

export function Cards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <ContentCard
        type="Story"
        title="Saltwater Letters"
        byline="By Sam Okafor"
        bylineAvatar="https://i.pravatar.cc/100?u=samokafor"
        cover="https://picsum.photos/seed/saltwater/800/600"
        rating="general"
        coverMeta="3 ch · 4 min"
        tags={['epistolary', 'coastal']}
        stats={[
          { icon: <Bookmark />, value: '860', label: 'saves' },
          { icon: <Eye />, value: '9.8k', label: 'views' },
          { icon: <MessageCircle />, value: 2, label: 'comments' },
        ]}
        saved
        onClick={() => {}}
      />
      <ContentCard
        type="Artwork"
        title="Ember Wolves"
        byline="By Priya Natarajan"
        cover="https://picsum.photos/seed/ember-wolves/800/600"
        rating="explicit"
        blurCover
        stats={[{ icon: <Bookmark />, value: '410', label: 'saves' }]}
        onClick={() => {}}
      />
      <ContentCard type="Page" title="About the Lab" byline="Moonlit Studio" />
    </div>
  )
}

export function Avatars() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <ProfileAvatar initials="AR" size="sm" status="online" />
      <ProfileAvatar initials="ML" size="md" status="away" />
      <ProfileAvatar src="https://i.pravatar.cc/200?u=docs" size="lg" status="busy" />
      <ProfileAvatar initials="SO" size="xl" />
      <ProfileAvatar src="https://picsum.photos/seed/lab-logo/200/200" size="2xl" shape="square" />
    </div>
  )
}

export function Timeline() {
  return (
    <WorkflowTimeline>
      <WorkflowTimelineItem
        title="Published"
        time="Oct 21"
        completed
        status={<StatusBadge tone="success">Published</StatusBadge>}
      />
      <WorkflowTimelineItem title="Approved by Jordan" time="Oct 20" completed />
      <WorkflowTimelineItem title="Sent for review" time="Oct 19" active />
    </WorkflowTimeline>
  )
}

export function AccordionExample() {
  return (
    <Accordion type="single" defaultValue="a">
      <AccordionItem value="a">
        <AccordionTrigger>How do themes work?</AccordionTrigger>
        <AccordionContent>
          Pick one with setPalette from useTheme; it recolours the public site.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Can I turn off transparency?</AccordionTrigger>
        <AccordionContent>Yes: setTransparency('off') makes every surface solid.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export function Details() {
  return (
    <div className="max-w-sm">
      <DescriptionList
        items={[
          { label: 'Engine', value: 'Ren’Py 8.3' },
          { label: 'Version', value: '1.2.0' },
          { label: 'Play time', value: '2–3 hours' },
          { label: 'Languages', value: 'English, Español' },
        ]}
      />
    </div>
  )
}

export function Tags() {
  return (
    <TagList
      grouped
      tags={[
        { name: 'jordan_vance', category: 'artist', count: 48 },
        { name: 'folded_things', category: 'copyright', count: 6 },
        { name: 'red_fox', category: 'species', count: 1840 },
        { name: 'winter', category: 'general', count: 2210 },
        { name: 'forest', category: 'general', count: 3400 },
        { name: 'traditional_media', category: 'meta', count: 640 },
      ]}
      onTagClick={() => {}}
    />
  )
}

export function Gallery() {
  return (
    <MediaGallery
      columns={3}
      items={['station', 'carriage', 'tunnel'].map((s) => ({
        src: `https://picsum.photos/seed/hollow-${s}/640/360`,
        fullSrc: `https://picsum.photos/seed/hollow-${s}/1600/900`,
        alt: `Screenshot: ${s}`,
      }))}
    />
  )
}

export function Dates() {
  return (
    <div className="flex flex-col gap-1">
      <LocalDateTime date={new Date()} label="Now:" />
      <LocalDateTime date="2025-03-02T09:00:00Z" label="Joined" format="long" />
    </div>
  )
}

export function Comments() {
  const [comments, setComments] = useState<CommentData[]>([
    {
      id: '1',
      author: { name: 'Maya Lin', avatarSrc: 'https://i.pravatar.cc/100?u=mayalin' },
      body: 'The way the map lines turn into the fur pattern. I keep zooming in.',
      createdAt: new Date(Date.now() - 5 * 3600e3),
      likes: 24,
    },
  ])
  return (
    <CommentThread
      comments={comments}
      user={{ name: 'You' }}
      onAdd={(body, parentId) => {
        const comment: CommentData = {
          id: String(Date.now()),
          author: { name: 'You' },
          body,
          createdAt: new Date(),
        }
        setComments((list) =>
          parentId
            ? list.map((c) =>
                c.id === parentId ? { ...c, replies: [...(c.replies ?? []), comment] } : c
              )
            : [comment, ...list]
        )
      }}
      onLike={(id) =>
        setComments((list) =>
          list.map((c) =>
            c.id === id ? { ...c, liked: !c.liked, likes: (c.likes ?? 0) + (c.liked ? -1 : 1) } : c
          )
        )
      }
    />
  )
}
