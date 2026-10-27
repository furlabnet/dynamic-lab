import React, { useRef, useState } from 'react'
import { BookOpen, Heart, Palette } from 'lucide-react'
import {
  Badge,
  Button,
  ChapterNav,
  ComicReader,
  ContentActions,
  DownloadList,
  LinkHub,
  PlatformBadge,
  ProfileHeader,
  ReaderSettings,
  ReadingProgress,
  readerStyle,
  useReaderPrefs,
  useReadingProgress,
  useToast,
} from '@furlab/dynamic-lab'

export function Actions() {
  const { toast } = useToast()
  return (
    <ContentActions
      saveCount={1204}
      onReport={({ reason }) => toast({ title: 'Report sent', description: reason, tone: 'info' })}
    />
  )
}

export function Comic() {
  const pages = Array.from({ length: 6 }, (_, i) => ({
    src: `https://picsum.photos/seed/docs-comic-${i}/800/1120`,
    alt: `Page ${i + 1}`,
  }))
  return <ComicReader pages={pages} defaultSpread />
}

export function Reader() {
  const [prefs, setPrefs] = useReaderPrefs('docs-reader')
  const [chapter, setChapter] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const progress = useReadingProgress(ref)
  const chapters = [
    { id: '1', title: 'The first letter' },
    { id: '2', title: 'A reply, in pencil' },
  ]
  return (
    <div className="flex flex-col gap-4">
      <ReadingProgress
        value={progress}
        minutes={3}
        label={chapters[chapter].title}
        className="static!"
      />
      <div className="flex items-center gap-2">
        <ChapterNav
          chapters={chapters}
          current={chapter}
          onChange={setChapter}
          variant="compact"
          className="flex-1"
        />
        <ReaderSettings value={prefs} onChange={setPrefs} />
      </div>
      <div ref={ref} className="ui-prose" style={readerStyle(prefs)}>
        <p>
          Dear stranger at the end of the pier, I don’t know your name, which is the first thing I
          want to fix.
        </p>
        <p>
          I run the bait shop. You will have noticed the bait shop, because it smells like the bait
          shop.
        </p>
      </div>
    </div>
  )
}

export function Downloads() {
  const { toast } = useToast()
  return (
    <div className="flex max-w-md flex-col gap-4">
      <DownloadList
        recommended="windows"
        onDownload={(file) => toast({ title: 'Downloading', description: file.name })}
        files={[
          {
            id: 'w',
            name: 'HollowCreek-1.2.0-win.zip',
            platform: 'windows',
            size: '412 MB',
            version: '1.2.0',
          },
          {
            id: 'm',
            name: 'HollowCreek-1.2.0-mac.zip',
            platform: 'mac',
            size: '398 MB',
            version: '1.2.0',
          },
          {
            id: 'a',
            name: 'HollowCreek-1.2.0.apk',
            platform: 'android',
            size: '356 MB',
            version: '1.2.0',
            note: 'Android 8+',
          },
        ]}
      />
      <div className="flex flex-wrap gap-2">
        <PlatformBadge platform="linux" />
        <PlatformBadge platform="web" />
      </div>
    </div>
  )
}

export function Profile() {
  return (
    <ProfileHeader
      name="Jordan Vance"
      handle="@jvance"
      avatarSrc="https://i.pravatar.cc/300?u=jvance"
      bannerSrc="https://picsum.photos/seed/jordan-banner/1600/500"
      badges={<Badge>Creator</Badge>}
      bio="Illustrator and cartoonist. Foxes, moths and folklore."
      stats={[
        { label: 'Creations', value: 24 },
        { label: 'Followers', value: '8.9k' },
      ]}
      actions={<Button>Follow</Button>}
    />
  )
}

export function Links() {
  return (
    <LinkHub
      name="Jordan Vance"
      handle="@jvance"
      avatarSrc="https://i.pravatar.cc/300?u=jvance"
      bio="Commissions open twice a year."
      links={[
        {
          id: '1',
          label: 'Commissions are OPEN',
          description: '3 slots left',
          href: '#',
          icon: <Palette />,
          featured: true,
        },
        {
          id: '2',
          label: 'Moth & Lantern',
          description: 'My comic',
          href: '#',
          icon: <BookOpen />,
        },
        { id: '3', label: 'Support me', href: '#', icon: <Heart /> },
      ]}
    />
  )
}
