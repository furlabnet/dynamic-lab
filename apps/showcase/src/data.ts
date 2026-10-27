import type { StatusTone } from '@furlab/dynamic-lab'

export type ContentType = 'page' | 'artwork' | 'story' | 'comic' | 'visual-novel'
export type ContentStatus = 'draft' | 'in-review' | 'published' | 'archived'
export type ContentRating = 'general' | 'suggestive' | 'mature'

export interface ContentRecord {
  id: string
  title: string
  type: ContentType
  creator: string
  lab: string
  rating: ContentRating
  status: ContentStatus
  updated: string
  tags: string[]
  comments: 'open' | 'closed'
  trashed?: boolean
  summary?: string
}

export const TYPE_LABELS: Record<ContentType, string> = {
  page: 'Page',
  artwork: 'Artwork',
  story: 'Story',
  comic: 'Comic',
  'visual-novel': 'Visual novel',
}

export const TYPE_PLURALS: Record<ContentType, string> = {
  page: 'Pages',
  artwork: 'Artwork',
  story: 'Stories',
  comic: 'Comics',
  'visual-novel': 'Visual novels',
}

export const STATUS_LABELS: Record<ContentStatus, string> = {
  draft: 'Draft',
  'in-review': 'In review',
  published: 'Published',
  archived: 'Archived',
}

export const STATUS_TONES: Record<ContentStatus, StatusTone> = {
  draft: 'neutral',
  'in-review': 'warning',
  published: 'success',
  archived: 'danger',
}

export const RATING_LABELS: Record<ContentRating, string> = {
  general: 'General',
  suggestive: 'Suggestive',
  mature: 'Mature',
}

export const CURRENT_USER = {
  name: 'Alex Rivera',
  email: 'alex@dynamiclab.dev',
  role: 'Administrator',
  handle: 'alexrivera',
  avatar: 'https://i.pravatar.cc/300?u=alexrivera',
}

const day = 24 * 60 * 60 * 1000
const ago = (days: number) => new Date(Date.UTC(2026, 9, 21, 15, 30) - days * day).toISOString()

export const seedContent: ContentRecord[] = [
  {
    id: 'c1',
    title: 'The lighthouse keeper',
    type: 'story',
    creator: 'Alex Rivera',
    lab: 'Moonlit Studio',
    rating: 'general',
    status: 'published',
    updated: ago(0),
    tags: ['mystery', 'coastal'],
    comments: 'open',
    summary: 'A keeper logs ships that never arrive.',
  },
  {
    id: 'c2',
    title: 'Neon Odyssey: Volume II',
    type: 'comic',
    creator: 'Maya Lin',
    lab: 'Night Shift Comics',
    rating: 'suggestive',
    status: 'in-review',
    updated: ago(1),
    tags: ['sci-fi', 'cyberpunk'],
    comments: 'open',
  },
  {
    id: 'c3',
    title: 'Paper Foxes',
    type: 'artwork',
    creator: 'Jordan Vance',
    lab: 'Ink & Ember',
    rating: 'general',
    status: 'published',
    updated: ago(2),
    tags: ['folklore'],
    comments: 'open',
  },
  {
    id: 'c4',
    title: 'Last Train to Hollow Creek',
    type: 'visual-novel',
    creator: 'Sam Okafor',
    lab: 'Moonlit Studio',
    rating: 'suggestive',
    status: 'published',
    updated: ago(3),
    tags: ['mystery', 'horror'],
    comments: 'closed',
  },
  {
    id: 'c5',
    title: 'About the Lab',
    type: 'page',
    creator: 'Alex Rivera',
    lab: 'Moonlit Studio',
    rating: 'general',
    status: 'published',
    updated: ago(4),
    tags: [],
    comments: 'closed',
  },
  {
    id: 'c6',
    title: 'Tidepool Sketchbook',
    type: 'artwork',
    creator: 'Maya Lin',
    lab: 'Night Shift Comics',
    rating: 'general',
    status: 'draft',
    updated: ago(5),
    tags: ['coastal', 'nature'],
    comments: 'open',
  },
  {
    id: 'c7',
    title: 'Garden of Static',
    type: 'story',
    creator: 'Priya Natarajan',
    lab: 'Ink & Ember',
    rating: 'mature',
    status: 'in-review',
    updated: ago(6),
    tags: ['sci-fi'],
    comments: 'open',
  },
  {
    id: 'c8',
    title: 'Moth & Lantern',
    type: 'comic',
    creator: 'Jordan Vance',
    lab: 'Ink & Ember',
    rating: 'general',
    status: 'published',
    updated: ago(8),
    tags: ['folklore', 'nature'],
    comments: 'open',
  },
  {
    id: 'c9',
    title: 'Signal Lost',
    type: 'visual-novel',
    creator: 'Priya Natarajan',
    lab: 'Night Shift Comics',
    rating: 'mature',
    status: 'archived',
    updated: ago(12),
    tags: ['sci-fi', 'horror'],
    comments: 'closed',
  },
  {
    id: 'c10',
    title: 'Saltwater Letters',
    type: 'story',
    creator: 'Sam Okafor',
    lab: 'Moonlit Studio',
    rating: 'general',
    status: 'published',
    updated: ago(14),
    tags: ['coastal', 'romance'],
    comments: 'open',
  },
  {
    id: 'c11',
    title: 'Clockwork Orchard',
    type: 'artwork',
    creator: 'Alex Rivera',
    lab: 'Moonlit Studio',
    rating: 'general',
    status: 'draft',
    updated: ago(15),
    tags: ['nature'],
    comments: 'open',
  },
  {
    id: 'c13',
    title: 'Ember Wolves',
    type: 'artwork',
    creator: 'Priya Natarajan',
    lab: 'Ink & Ember',
    rating: 'mature',
    status: 'published',
    updated: ago(1),
    tags: ['horror', 'nature'],
    comments: 'open',
  },
  {
    id: 'c12',
    title: 'Community Guidelines',
    type: 'page',
    creator: 'Staff',
    lab: 'Dynamic Lab',
    rating: 'general',
    status: 'published',
    updated: ago(20),
    tags: [],
    comments: 'closed',
  },
]

export type UserRole = 'Administrator' | 'Moderator' | 'Creator' | 'Member'

export interface UserRecord {
  id: string
  name: string
  email: string
  role: UserRole
  status: 'active' | 'invited' | 'suspended'
  joined: string
  lab?: string
}

export const seedUsers: UserRecord[] = [
  {
    id: 'u1',
    name: 'Alex Rivera',
    email: 'alex@dynamiclab.dev',
    role: 'Administrator',
    status: 'active',
    joined: ago(400),
    lab: 'Moonlit Studio',
  },
  {
    id: 'u2',
    name: 'Maya Lin',
    email: 'maya@example.com',
    role: 'Creator',
    status: 'active',
    joined: ago(210),
    lab: 'Night Shift Comics',
  },
  {
    id: 'u3',
    name: 'Jordan Vance',
    email: 'jordan@example.com',
    role: 'Moderator',
    status: 'active',
    joined: ago(180),
    lab: 'Ink & Ember',
  },
  {
    id: 'u4',
    name: 'Sam Okafor',
    email: 'sam@example.com',
    role: 'Creator',
    status: 'active',
    joined: ago(95),
    lab: 'Moonlit Studio',
  },
  {
    id: 'u5',
    name: 'Priya Natarajan',
    email: 'priya@example.com',
    role: 'Creator',
    status: 'suspended',
    joined: ago(60),
    lab: 'Ink & Ember',
  },
  {
    id: 'u6',
    name: 'Lee Moreau',
    email: 'lee@example.com',
    role: 'Member',
    status: 'invited',
    joined: ago(2),
  },
]

export interface ReportRecord {
  id: string
  contentId: string
  reason: string
  reporter: string
  at: string
}

export const seedReports: ReportRecord[] = [
  {
    id: 'r1',
    contentId: 'c7',
    reason: 'Rating looks too low for the content',
    reporter: 'Lee Moreau',
    at: ago(0),
  },
  {
    id: 'r2',
    contentId: 'c2',
    reason: 'Uses artwork without credit',
    reporter: 'Sam Okafor',
    at: ago(1),
  },
  {
    id: 'r3',
    contentId: 'c4',
    reason: 'Spam in the description',
    reporter: 'Maya Lin',
    at: ago(3),
  },
]

export const ALL_TAGS = Array.from(new Set(seedContent.flatMap((c) => c.tags))).sort()
