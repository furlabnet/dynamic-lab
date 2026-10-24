import type { CommentData, ComicPage, DescriptionItem, DownloadFile, MediaItem, Platform, TagItem } from '../index'
import type { ContentRecord } from './data'

/**
 * Placeholder media. Images come from Lorem Picsum (free, Unsplash-sourced, stable per seed) and
 * avatars from pravatar.cc. Swap these helpers for your CDN in a real app.
 */
export const img = (seed: string, w = 1200, h = 800) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`
export const avatar = (id: string) => `https://i.pravatar.cc/300?u=${encodeURIComponent(id)}`

/* ------------------------------------------------------------- People */

export interface ProfileLink {
  id: string
  label: string
  href: string
  description?: string
  kind: 'shop' | 'commission' | 'patreon' | 'site' | 'lab' | 'newsletter' | 'video'
  featured?: boolean
}

export interface Profile {
  handle: string
  name: string
  avatar: string
  banner: string
  pronouns?: string
  bio: string
  location?: string
  website?: string
  joined: string
  followers: number
  following: number
  labs: string[]
  links: ProfileLink[]
  socials: Array<{ label: string; href: string; kind: 'mastodon' | 'bluesky' | 'youtube' | 'mail' | 'rss' }>
}

export const PROFILES: Profile[] = [
  {
    handle: 'alexrivera',
    name: 'Alex Rivera',
    avatar: avatar('alexrivera'),
    banner: img('alex-banner', 1600, 500),
    pronouns: 'they/them',
    bio: 'Writes quiet stories about lighthouses, letters and the sea. Runs Moonlit Studio with Sam.',
    location: 'Halifax, NS',
    website: 'alexrivera.example',
    joined: '2024-09-12',
    followers: 2140,
    following: 188,
    labs: ['moonlit-studio'],
    links: [
      { id: 'l1', label: 'Read “The lighthouse keeper”', href: '#/lab/view/c1', description: 'New chapter every Friday', kind: 'site', featured: true },
      { id: 'l2', label: 'Moonlit Studio', href: '#/lab/labs/moonlit-studio', description: 'Our Creator Lab', kind: 'lab' },
      { id: 'l3', label: 'Support me on Patreon', href: 'https://www.patreon.com/', description: 'Early chapters and sketches', kind: 'patreon' },
      { id: 'l4', label: 'Monthly letter', href: 'https://buttondown.com/', description: 'One email, first of the month', kind: 'newsletter' },
    ],
    socials: [
      { label: 'Mastodon', href: 'https://mastodon.social/', kind: 'mastodon' },
      { label: 'Bluesky', href: 'https://bsky.app/', kind: 'bluesky' },
      { label: 'Email', href: 'mailto:alex@dynamiclab.dev', kind: 'mail' },
    ],
  },
  {
    handle: 'jvance',
    name: 'Jordan Vance',
    avatar: avatar('jvance'),
    banner: img('jordan-banner', 1600, 500),
    pronouns: 'they/them',
    bio: 'Illustrator and cartoonist. Foxes, moths and folklore, mostly in ink and gouache. Commissions open twice a year.',
    location: 'Portland, OR',
    joined: '2025-01-20',
    followers: 8930,
    following: 402,
    labs: ['ink-and-ember'],
    links: [
      { id: 'j1', label: 'Commissions are OPEN', href: '#/lab/view/c3', description: '3 slots left · prices and terms', kind: 'commission', featured: true },
      { id: 'j2', label: 'Moth & Lantern', href: '#/lab/view/c8', description: 'My comic, chapter 2 is out', kind: 'site' },
      { id: 'j3', label: 'Print shop', href: 'https://www.inprnt.com/', description: 'Prints, stickers and zines', kind: 'shop' },
      { id: 'j4', label: 'Process videos', href: 'https://www.youtube.com/', kind: 'video' },
      { id: 'j5', label: 'Ink & Ember', href: '#/lab/labs/ink-and-ember', description: 'The collective I draw with', kind: 'lab' },
    ],
    socials: [
      { label: 'Bluesky', href: 'https://bsky.app/', kind: 'bluesky' },
      { label: 'YouTube', href: 'https://www.youtube.com/', kind: 'youtube' },
      { label: 'RSS', href: '#/lab/u/jvance', kind: 'rss' },
    ],
  },
  {
    handle: 'samokafor',
    name: 'Sam Okafor',
    avatar: avatar('samokafor'),
    banner: img('sam-banner', 1600, 500),
    bio: 'Makes small, strange visual novels in Ren’Py and writes letters to people who don’t exist.',
    location: 'Lagos / Leeds',
    joined: '2025-07-02',
    followers: 3310,
    following: 96,
    labs: ['moonlit-studio'],
    links: [
      { id: 's1', label: 'Download Last Train to Hollow Creek', href: '#/lab/view/c4', description: 'Free · Windows, macOS, Linux, Android', kind: 'site', featured: true },
      { id: 's2', label: 'Saltwater Letters', href: '#/lab/view/c10', description: 'A story in letters', kind: 'site' },
      { id: 's3', label: 'Devlog', href: 'https://itch.io/', kind: 'site' },
    ],
    socials: [{ label: 'Mastodon', href: 'https://mastodon.social/', kind: 'mastodon' }],
  },
  {
    handle: 'mayalin',
    name: 'Maya Lin',
    avatar: avatar('mayalin'),
    banner: img('maya-banner', 1600, 500),
    bio: 'Comics about the people who keep cities running after dark.',
    joined: '2025-03-28',
    followers: 5120,
    following: 230,
    labs: ['night-shift-comics'],
    links: [{ id: 'm1', label: 'Neon Odyssey', href: '#/lab/browse', kind: 'site', featured: true }],
    socials: [],
  },
  {
    handle: 'priya',
    name: 'Priya Natarajan',
    avatar: avatar('priya'),
    banner: img('priya-banner', 1600, 500),
    bio: 'Sci-fi horror, wolves and static. Mature work, tagged carefully.',
    joined: '2025-08-21',
    followers: 1990,
    following: 75,
    labs: ['ink-and-ember', 'night-shift-comics'],
    links: [{ id: 'p1', label: 'Ember Wolves', href: '#/lab/view/c13', kind: 'site', featured: true }],
    socials: [],
  },
]

export const profileByName = (name: string) => PROFILES.find((p) => p.name === name)
export const profileByHandle = (handle: string) => PROFILES.find((p) => p.handle === handle)

export interface LabInfo {
  slug: string
  name: string
  tagline: string
  about: string[]
  avatar: string
  banner: string
  founded: string
  members: Array<{ handle: string; role: string }>
  featured: string[]
  links: ProfileLink[]
}

export const LABS: LabInfo[] = [
  {
    slug: 'moonlit-studio',
    name: 'Moonlit Studio',
    tagline: 'Slow stories for late nights.',
    about: [
      'Moonlit Studio is a two-person Creator Lab making serialised fiction and small visual novels about coastlines, trains and the people who wait for them.',
      'We publish a new chapter most Fridays. Everything here is free to read; supporters get chapters a week early.',
    ],
    avatar: img('moonlit-logo', 400, 400),
    banner: img('moonlit-banner', 1600, 500),
    founded: '2025-02-01',
    members: [
      { handle: 'alexrivera', role: 'Writer · Lead' },
      { handle: 'samokafor', role: 'Developer · Writer' },
    ],
    featured: ['c4', 'c10', 'c1'],
    links: [
      { id: 'ml1', label: 'Start with “Saltwater Letters”', href: '#/lab/view/c10', kind: 'site', featured: true },
      { id: 'ml2', label: 'About the Lab', href: '#/lab/view/c5', kind: 'site' },
      { id: 'ml3', label: 'Support the studio', href: 'https://ko-fi.com/', description: 'Ko-fi', kind: 'patreon' },
    ],
  },
  {
    slug: 'ink-and-ember',
    name: 'Ink & Ember',
    tagline: 'Folklore, fur and firelight. An illustration collective.',
    about: [
      'Ink & Ember is a collective of illustrators and cartoonists who share a love of folklore, animals and traditional media.',
      'Members run their own commissions; the Lab is where we publish comics and collaborative zines.',
    ],
    avatar: img('ember-logo', 400, 400),
    banner: img('ember-banner', 1600, 500),
    founded: '2025-01-15',
    members: [
      { handle: 'jvance', role: 'Illustrator · Founder' },
      { handle: 'priya', role: 'Illustrator' },
    ],
    featured: ['c8', 'c3', 'c13'],
    links: [{ id: 'ie1', label: 'Read Moth & Lantern', href: '#/lab/view/c8', kind: 'site', featured: true }],
  },
  {
    slug: 'night-shift-comics',
    name: 'Night Shift Comics',
    tagline: 'Comics for people who work while you sleep.',
    about: ['An anthology Lab for slice-of-life and sci-fi comics set after midnight.'],
    avatar: img('nightshift-logo', 400, 400),
    banner: img('nightshift-banner', 1600, 500),
    founded: '2025-04-10',
    members: [
      { handle: 'mayalin', role: 'Cartoonist · Editor' },
      { handle: 'priya', role: 'Writer' },
    ],
    featured: ['c2', 'c6'],
    links: [],
  },
]

export const labBySlug = (slug: string) => LABS.find((l) => l.slug === slug)
export const labByName = (name: string) => LABS.find((l) => l.name === name)

/* ------------------------------------------------------- Rich details */

export interface Chapter {
  id: string
  title: string
  paragraphs: string[]
}

export interface PageSection {
  heading?: string
  paragraphs: string[]
}

export interface ContentDetails {
  description: string
  cover: string
  tags: TagItem[]
  saves: number
  views: number
  // page
  sections?: PageSection[]
  // artwork
  images?: MediaItem[]
  artInfo?: DescriptionItem[]
  // comic
  comicChapters?: Array<{ id: string; title: string; pages: ComicPage[] }>
  // story
  chapters?: Chapter[]
  // visual novel
  vn?: {
    engine: string
    version: string
    released: string
    updated: string
    playtime: string
    languages: string[]
    platforms: Platform[]
    files: DownloadFile[]
    screenshots: MediaItem[]
    features: string[]
    contentWarnings: string[]
    changelog: Array<{ version: string; date: string; notes: string }>
    price: string
  }
}

const t = (category: TagItem['category'], name: string, count?: number): TagItem => ({ category, name, count })

const comicPages = (seed: string, count: number): ComicPage[] =>
  Array.from({ length: count }, (_, i) => ({ src: img(`${seed}-${i + 1}`, 800, 1120), alt: `Page ${i + 1}` }))

const SALTWATER: Chapter[] = [
  {
    id: 'ch1',
    title: 'The first letter',
    paragraphs: [
      'Dear stranger at the end of the pier, I don’t know your name, which is the first thing I want to fix. I have watched you for eleven mornings now, standing where the boards go soft and grey, holding a thermos you never seem to drink from.',
      'I run the bait shop. You will have noticed the bait shop, because it smells like the bait shop, and because the sign has said OPEN for nine years regardless of whether it is. I am writing because it is easier than walking out there and asking, and because the gulls have started to look at me like I owe them an explanation.',
      'My grandmother wrote letters to the sea. She would fold them into small hard squares, the way you fold a note in school, and drop them off this pier every Sunday. She said the tide was a better postman than the one we had. He was, to be fair, not a good postman.',
      'I have tucked this under your thermos. If you are reading it, you have finally picked the thermos up, which I consider progress for both of us.',
      'The coffee in the shop is terrible but it is hot, and it is free for anyone who has been on the pier longer than an hour. You qualify. You have qualified for eleven days.',
      'Yours, from behind a counter full of hooks, — M.',
    ],
  },
  {
    id: 'ch2',
    title: 'A reply, in pencil',
    paragraphs: [
      'M., I did drink the coffee. You are right that it is terrible. I have never been more grateful for something terrible in my life, which I think says more about the weather than about you.',
      'My name is Ines. I am on the pier because my brother is on a boat called the Marguerite, and the Marguerite is three weeks late, and nobody at the harbour office will look me in the eye anymore. They have started saying “weather” the way people say “in a better place”.',
      'I bring the thermos because he always forgot his. It is a stupid ritual. I know it is a stupid ritual. I keep it anyway, the same way your sign says OPEN.',
      'I liked what you said about your grandmother. I have been thinking about the tide as a postman all night. I wonder what it does with the letters it can’t deliver. I wonder if there is a sorting office somewhere at the bottom of everything, very quiet, very cold, full of folded squares.',
      'I am leaving this in the tackle box by the door, the one with the broken latch. I hope that is all right. It felt like the right kind of mailbox.',
      'Ines.',
    ],
  },
  {
    id: 'ch3',
    title: 'Weather',
    paragraphs: [
      'Ines, the tackle box is yours now. I have fixed the latch, badly, with a paperclip, which is how I fix most things.',
      'I asked old Teodor at the harbour about the Marguerite. He did the thing you said, the not-looking. Then he did a different thing: he got out the chart, the real paper one with coffee rings on it, and showed me where the storm went. It went north. The Marguerite’s last call was south.',
      'I don’t want to give you hope that isn’t mine to give. But Teodor tapped the chart twice, right on the empty part, and said “there is a lot of sea there with nobody in it,” and I think he meant it kindly.',
      'Tomorrow I am going to put a second chair at the end of the pier. It is a folding chair. It has a rust stain shaped like Portugal. You do not have to sit in it.',
      'I will bring the terrible coffee in a proper mug. Thermoses are for people who are leaving, and I don’t think you are, not yet.',
      'Yours, now with a working mailbox, — Marta.',
    ],
  },
]

export const DETAILS: Record<string, ContentDetails> = {
  c5: {
    description: 'Who we are, what we make, and how to support the studio.',
    cover: img('about-lab', 1600, 700),
    tags: [],
    saves: 0,
    views: 912,
    sections: [
      {
        paragraphs: [
          'Moonlit Studio is a small Creator Lab run by Alex Rivera and Sam Okafor. We make serialised stories and short visual novels, mostly about the sea, trains, and people waiting for something.',
          'Everything we publish on Dynamic Lab is free to read. If you want to help us keep doing this, the best thing you can do is tell one person about a story you liked.',
        ],
      },
      {
        heading: 'What we’re working on',
        paragraphs: [
          '“Saltwater Letters” updates most Fridays. “Last Train to Hollow Creek” 1.2 adds a new ending and Android support.',
          'We’re also sketching a third project with Ink & Ember. It has a fox in it. That’s all we’re allowed to say.',
        ],
      },
      {
        heading: 'Working with us',
        paragraphs: [
          'We don’t take commissions, but we love collaborating with other Labs on anthologies and zines. Write to us through either of our profiles.',
        ],
      },
    ],
  },
  c3: {
    description:
      'Three paper foxes walk the edge of a winter forest, cut from old maps. Gouache on watercolour paper, finished digitally. Part of the “Folded Things” series.',
    cover: img('paper-foxes', 1200, 1500),
    tags: [
      t('artist', 'jordan_vance', 48),
      t('copyright', 'folded_things', 6),
      t('character', 'kitsune_trio', 3),
      t('species', 'red_fox', 1840),
      t('species', 'canine', 9200),
      t('general', 'winter', 2210),
      t('general', 'forest', 3400),
      t('general', 'papercraft', 120),
      t('general', 'group', 5100),
      t('general', 'snow', 1880),
      t('meta', 'traditional_media', 640),
      t('meta', 'gouache', 92),
      t('meta', 'hi_res', 22000),
    ],
    saves: 1204,
    views: 18300,
    images: [
      { src: img('paper-foxes', 1200, 1500), fullSrc: img('paper-foxes', 2000, 2500), alt: 'Paper Foxes, full piece' },
      { src: img('paper-foxes-detail', 1200, 1500), fullSrc: img('paper-foxes-detail', 2000, 2500), alt: 'Detail of the lead fox' },
      { src: img('paper-foxes-sketch', 1200, 1500), fullSrc: img('paper-foxes-sketch', 2000, 2500), alt: 'Pencil sketch' },
    ],
    artInfo: [
      { label: 'Medium', value: 'Gouache, digital finish' },
      { label: 'Size', value: '30 × 40 cm · 4000 × 5000 px' },
      { label: 'Series', value: 'Folded Things (3 of 6)' },
      { label: 'Prints', value: 'Available' },
    ],
  },
  c8: {
    description:
      'A moth who is afraid of the light takes a job as a lamplighter. A gentle fantasy comic about doing the thing that scares you, one street at a time.',
    cover: img('moth-1', 800, 1120),
    tags: [
      t('artist', 'jordan_vance', 48),
      t('copyright', 'moth_and_lantern', 24),
      t('character', 'wren_(moth)', 24),
      t('character', 'old_ash', 11),
      t('species', 'moth', 310),
      t('species', 'insect', 980),
      t('general', 'night', 6400),
      t('general', 'city', 2900),
      t('general', 'wholesome', 4100),
      t('lore', 'lamplighters_guild', 4),
      t('meta', 'comic', 12000),
      t('meta', 'full_color', 8800),
    ],
    saves: 3420,
    views: 41200,
    comicChapters: [
      { id: 'mc1', title: 'Chapter 1: The Job', pages: comicPages('moth', 10) },
      { id: 'mc2', title: 'Chapter 2: Wick Street', pages: comicPages('moth-ch2', 8) },
    ],
  },
  c10: {
    description:
      'Two strangers on opposite ends of a pier start leaving letters for each other: one waiting for a boat that’s late, one running a bait shop that’s never closed.',
    cover: img('saltwater', 1600, 900),
    tags: [
      t('artist', 'sam_okafor', 12),
      t('copyright', 'saltwater_letters', 3),
      t('character', 'marta', 3),
      t('character', 'ines', 3),
      t('general', 'epistolary', 140),
      t('general', 'coastal', 860),
      t('general', 'slow_burn', 2300),
      t('general', 'grief', 410),
      t('meta', 'ongoing', 15000),
    ],
    saves: 860,
    views: 9800,
    chapters: SALTWATER,
  },
  c4: {
    description:
      'The 23:14 to Hollow Creek has not run in forty years. Tonight it pulls into your station anyway. Ride it to the end of the line, talk to the passengers, and find out why each of them missed their stop.\n\nA short mystery visual novel with three endings, hand-drawn backgrounds and a soundtrack recorded on a cassette deck.',
    cover: img('hollow-creek', 1600, 900),
    tags: [
      t('artist', 'sam_okafor', 12),
      t('copyright', 'last_train_to_hollow_creek', 8),
      t('character', 'the_conductor', 8),
      t('general', 'mystery', 3300),
      t('general', 'train', 720),
      t('general', 'ghost', 1900),
      t('general', 'multiple_endings', 640),
      t('lore', 'hollow_creek_line', 2),
      t('meta', 'visual_novel', 2100),
      t('meta', "ren'py", 900),
    ],
    saves: 2210,
    views: 27600,
    vn: {
      engine: 'Ren’Py 8.3',
      version: '1.2.0',
      released: '2026-03-14',
      updated: '2026-10-02',
      playtime: '2–3 hours',
      languages: ['English', 'Español', 'Português (BR)'],
      platforms: ['windows', 'mac', 'linux', 'android'],
      price: 'Free · pay what you want',
      files: [
        { id: 'f1', name: 'HollowCreek-1.2.0-win.zip', platform: 'windows', size: '412 MB', version: '1.2.0' },
        { id: 'f2', name: 'HollowCreek-1.2.0-mac.zip', platform: 'mac', size: '398 MB', version: '1.2.0', note: 'Universal (Apple silicon + Intel)' },
        { id: 'f3', name: 'HollowCreek-1.2.0-linux.tar.bz2', platform: 'linux', size: '405 MB', version: '1.2.0' },
        { id: 'f4', name: 'HollowCreek-1.2.0.apk', platform: 'android', size: '356 MB', version: '1.2.0', note: 'Android 8+' },
      ],
      screenshots: ['station', 'carriage', 'conductor', 'window', 'tunnel', 'platform'].map((s) => ({
        src: img(`hollow-${s}`, 960, 540),
        fullSrc: img(`hollow-${s}`, 1920, 1080),
        alt: `Screenshot: ${s}`,
      })),
      features: ['Three endings', 'Fully voiced conductor', 'Hand-drawn backgrounds', 'Controller support', 'Dyslexia-friendly font option'],
      contentWarnings: ['Death (off-screen)', 'Grief', 'Mild horror imagery'],
      changelog: [
        { version: '1.2.0', date: '2026-10-02', notes: 'New “Night Shift” ending, Android build, Portuguese translation.' },
        { version: '1.1.0', date: '2026-05-20', notes: 'Spanish translation, controller support, 40 typo fixes.' },
        { version: '1.0.0', date: '2026-03-14', notes: 'First release.' },
      ],
    },
  },
  c13: {
    description: 'Wolves made of embers circle a burnt-out radio tower. Painted for the “Static” zine.',
    cover: img('ember-wolves', 1200, 1500),
    tags: [
      t('artist', 'priya_natarajan', 20),
      t('copyright', 'static_zine', 5),
      t('species', 'wolf', 6100),
      t('species', 'canine', 9200),
      t('general', 'fire', 2800),
      t('general', 'gore', 900),
      t('general', 'dark_theme', 1500),
      t('meta', 'digital_media', 30000),
    ],
    saves: 410,
    views: 5200,
    images: [{ src: img('ember-wolves', 1200, 1500), fullSrc: img('ember-wolves', 2000, 2500), alt: 'Ember Wolves' }],
    artInfo: [
      { label: 'Medium', value: 'Digital painting' },
      { label: 'Size', value: '3600 × 4500 px' },
    ],
  },
}

const GENERIC_PARAGRAPHS = [
  'The town kept its secrets the way old houses keep heat: badly, and mostly in the walls. Nobody talked about the lighthouse, and so of course everybody thought about it.',
  'She arrived on a Tuesday with one suitcase and a list of questions written on the back of a train ticket. The first question was crossed out. The second was underlined twice.',
  'By the time the fog came in, the harbour had gone quiet in the particular way that means people are listening from behind their curtains.',
  'There was a logbook on the desk, its spine cracked open at the same page it had been open at for years. Ships, dates, names. And then, in a different hand, ships that had never existed.',
  'He said the light still turned some nights, though the lamp had been taken out in 1974. He said it the way you mention the weather, and then he changed the subject very quickly.',
  'Later, she would remember that she had not been afraid. Curious, yes. Cold, certainly. But the fear came afterwards, when she understood what the numbers in the margin meant.',
]

/** Rich details for the showcase examples, and plausible defaults for everything else. */
export function getDetails(record: ContentRecord): ContentDetails {
  if (DETAILS[record.id]) return DETAILS[record.id]
  const tags: TagItem[] = [
    t('artist', record.creator.toLowerCase().replace(/\s+/g, '_')),
    ...record.tags.map((name) => t('general', name)),
    t('meta', record.type.replace('-', '_')),
  ]
  const base: ContentDetails = {
    description: record.summary ?? `${record.title} by ${record.creator}, from ${record.lab}.`,
    cover: img(record.id, 1200, 900),
    tags,
    saves: 120,
    views: 2400,
  }
  switch (record.type) {
    case 'artwork':
      return { ...base, images: [{ src: img(record.id, 1200, 1500), fullSrc: img(record.id, 2000, 2500), alt: record.title }] }
    case 'comic':
      return { ...base, comicChapters: [{ id: 'c1', title: 'Chapter 1', pages: comicPages(record.id, 6) }] }
    case 'story':
      return {
        ...base,
        chapters: [
          { id: 'ch1', title: 'Arrival', paragraphs: GENERIC_PARAGRAPHS.slice(0, 3).concat(GENERIC_PARAGRAPHS.slice(0, 3)) },
          { id: 'ch2', title: 'The logbook', paragraphs: GENERIC_PARAGRAPHS.slice(3).concat(GENERIC_PARAGRAPHS.slice(3)) },
        ],
      }
    case 'visual-novel':
      return { ...base, vn: { ...DETAILS.c4.vn!, files: DETAILS.c4.vn!.files.slice(0, 2), changelog: DETAILS.c4.vn!.changelog.slice(-1) } }
    default:
      return { ...base, sections: [{ paragraphs: [base.description] }] }
  }
}

export function wordCount(chapters: Chapter[]) {
  return chapters.reduce((n, c) => n + c.paragraphs.join(' ').split(/\s+/).length, 0)
}

/* ------------------------------------------------------------ Comments */

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600 * 1000).toISOString()
const who = (handle: string, badge?: string) => {
  const p = profileByHandle(handle)
  return { name: p?.name ?? handle, avatarSrc: p ? p.avatar : avatar(handle), href: `#/lab/u/${handle}`, badge }
}

export const SEED_COMMENTS: Record<string, CommentData[]> = {
  c3: [
    {
      id: 'k1',
      author: who('mayalin'),
      body: 'The way the map lines turn into the fur pattern on the lead fox. I keep zooming in.',
      createdAt: hoursAgo(5),
      likes: 24,
      replies: [{ id: 'k1r', author: who('jvance'), body: 'Thank you! Those are real 1930s survey maps, scanned and cut up.', createdAt: hoursAgo(4), likes: 9 }],
    },
    { id: 'k2', author: who('samokafor'), body: 'Is “Folded Things” going to be a print set?', createdAt: hoursAgo(30), likes: 6 },
  ],
  c8: [
    { id: 'k3', author: who('alexrivera'), body: 'Page 7, when Wren finally looks straight at the lamp. I actually teared up.', createdAt: hoursAgo(12), likes: 41 },
    { id: 'k4', author: { name: 'lantern_fan_88', avatarSrc: avatar('lanternfan') }, body: 'Reading this in book mode with two-page spreads is the way.', createdAt: hoursAgo(50), likes: 12 },
  ],
  c10: [
    {
      id: 'k5',
      author: who('alexrivera'),
      body: 'The chair with the rust stain shaped like Portugal. That detail is going to live in my head.',
      createdAt: hoursAgo(20),
      likes: 18,
      replies: [{ id: 'k5r', author: who('samokafor', 'Creator'), body: 'It’s a real chair. It’s in my kitchen. It is very much shaped like Portugal.', createdAt: hoursAgo(19), likes: 30 }],
    },
  ],
  c4: [
    { id: 'k6', author: who('jvance'), body: 'Got the Night Shift ending on my second run. The cassette soundtrack is perfect.', createdAt: hoursAgo(8), likes: 15 },
    { id: 'k7', author: { name: 'quietplayer', avatarSrc: avatar('quietplayer') }, body: 'Runs great on a Steam Deck through the Linux build, for anyone wondering.', createdAt: hoursAgo(72), likes: 27 },
  ],
}
