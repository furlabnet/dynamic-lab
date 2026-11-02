import type { LucideIcon } from 'lucide-react'

import {
  Flame,
  Frown,
  HandHeart,
  Heart,
  Laugh,
  PartyPopper,
  PawPrint,
  Sparkles,
  Star,
  ThumbsUp,
} from 'lucide-react'

export interface Reaction {
  /** Which reaction this is: one of the choices' ids, e.g. "heart". */
  id: string
  count: number
  /** The viewer has reacted with this one. */
  reacted?: boolean
  /** Name for screen readers. Defaults to the matching choice's label. */
  label?: string
}

export interface ReactionChoice {
  id: string
  /** Name for screen readers and the picker's tooltip, e.g. "Heart". */
  label: string
  icon: LucideIcon
}

/** The reactions ReactionBar and ReactionPicker offer by default, drawn as icons. */
export const DEFAULT_REACTIONS: ReactionChoice[] = [
  { id: 'heart', label: 'Heart', icon: Heart },
  { id: 'laugh', label: 'Laughing', icon: Laugh },
  { id: 'paw', label: 'Paw prints', icon: PawPrint },
  { id: 'fire', label: 'Fire', icon: Flame },
  { id: 'sparkles', label: 'Sparkles', icon: Sparkles },
  { id: 'star', label: 'Star', icon: Star },
  { id: 'thumbs-up', label: 'Thumbs up', icon: ThumbsUp },
  { id: 'party', label: 'Party', icon: PartyPopper },
  { id: 'hug', label: 'Hug', icon: HandHeart },
  { id: 'sad', label: 'Sad', icon: Frown },
]
