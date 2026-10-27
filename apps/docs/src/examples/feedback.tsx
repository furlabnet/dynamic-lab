import React, { useEffect, useState } from 'react'
import { Search, Sparkles } from 'lucide-react'
import {
  AgeGate,
  AgeRating,
  Badge,
  Button,
  EmptyState,
  Kbd,
  NoticePanel,
  Progress,
  SiteBanner,
  Skeleton,
  SkeletonAvatar,
  SkeletonText,
  Spinner,
  StatusBadge,
} from '@furlab/dynamic-lab'

export function StatusBadges() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <StatusBadge tone="neutral">Draft</StatusBadge>
      <StatusBadge tone="warning">In review</StatusBadge>
      <StatusBadge tone="success" pulse>
        Published
      </StatusBadge>
      <StatusBadge tone="danger">Archived</StatusBadge>
      <StatusBadge tone="info">Syncing</StatusBadge>
    </div>
  )
}

export function Badges() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Backstage</Badge>
      <Badge variant="solid">New</Badge>
      <Badge variant="neutral">12</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Verified</Badge>
      <Badge variant="warning" size="sm">
        Small
      </Badge>
    </div>
  )
}

export function Notices() {
  const [open, setOpen] = useState(true)
  return (
    <div className="flex flex-col gap-3">
      <NoticePanel tone="success" title="Changes published">
        Your story is live.
      </NoticePanel>
      <NoticePanel tone="warning" title="Waiting for review">
        Edits will reset its place in the queue.
      </NoticePanel>
      {open ? (
        <NoticePanel tone="info" title="Tip" onDismiss={() => setOpen(false)}>
          Press <Kbd>⌘K</Kbd> to jump anywhere.
        </NoticePanel>
      ) : (
        <Button variant="ghost" size="sm" className="self-start" onClick={() => setOpen(true)}>
          Show the tip again
        </Button>
      )}
    </div>
  )
}

export function Banner() {
  return (
    <div className="flex flex-col gap-3">
      <SiteBanner tone="warning">
        Maintenance mode is on. Visitors and Lab members have limited access.
      </SiteBanner>
      <SiteBanner tone="primary" icon={<Sparkles />}>
        New: colour themes are here.
      </SiteBanner>
    </div>
  )
}

export function ProgressExample() {
  const [value, setValue] = useState(30)
  useEffect(() => {
    const t = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 10)), 700)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="flex max-w-md flex-col gap-4">
      <Progress label="Uploading chapter-3.pdf" value={value} showValue />
      <Progress label="Processing" size="sm" />
      <Spinner showLabel label="Loading comments" />
    </div>
  )
}

export function Skeletons() {
  return (
    <div className="flex max-w-md flex-col gap-4">
      <div className="flex items-center gap-3">
        <SkeletonAvatar size="lg" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  )
}

export function Empty() {
  return (
    <EmptyState
      icon={<Search className="size-7" />}
      title="No stories match “lighthouse”"
      description="Try a different word, or clear the search to see everything."
      action={<Button variant="secondary">Clear search</Button>}
    />
  )
}

export function Ratings() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <AgeRating rating="general" />
        <AgeRating rating="suggestive" />
        <AgeRating rating="mature" />
      </div>
      <AgeRating rating="suggestive" variant="full" />
    </div>
  )
}

export function Gate() {
  return (
    <AgeGate rating="mature" className="max-w-sm overflow-hidden rounded-[var(--radius-2xl)]">
      <img
        src="https://picsum.photos/seed/docs-gate/800/600"
        alt="Example artwork"
        className="aspect-[4/3] w-full object-cover"
      />
    </AgeGate>
  )
}

export function Keys() {
  return (
    <p className="body-sm flex flex-wrap items-center gap-2">
      Search with <Kbd keys={['⌘', 'K']} /> or <Kbd>Ctrl K</Kbd>, close with <Kbd>Esc</Kbd>.
    </p>
  )
}
