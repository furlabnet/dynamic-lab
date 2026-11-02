import type { TagCategory, TagItem } from '../Tag'
import { TAG_CATEGORY_LABELS } from '../Tag'

const CATEGORIES = Object.keys(TAG_CATEGORY_LABELS) as TagCategory[]

/** "Species:Red Fox" → { category: 'species', name: 'red_fox' }. Unknown prefixes stay in the name. */
export function parseTag(raw: string, defaultCategory: TagCategory = 'general'): TagItem | null {
  let text = raw.trim().toLowerCase()
  if (!text) return null
  let category = defaultCategory
  const match = text.match(/^([a-z]+):(.+)$/)
  if (match && (CATEGORIES as string[]).includes(match[1])) {
    category = match[1] as TagCategory
    text = match[2]
  }
  const name = text
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\p{L}\p{N}_()'\-.]/gu, '')
  return name ? { name, category } : null
}
