import React from 'react'

import type { ColorSwatchProps, Swatch } from './ColorSwatch'
import { cn } from '../../lib/utils'
import { ColorSwatch } from './ColorSwatch'

/** A row of swatches, i.e. a character's palette. */
export function SwatchList({
  swatches,
  size,
  className,
}: {
  swatches: Swatch[]
  size?: ColorSwatchProps['size']
  className?: string
}) {
  return (
    <ul role="list" className={cn('flex flex-wrap gap-3', className)}>
      {swatches.map((s, i) => (
        <li key={`${s.color}-${i}`}>
          <ColorSwatch {...s} size={size} />
        </li>
      ))}
    </ul>
  )
}

/* ------------------------------------------------------ CharacterSheet */

export interface CharacterSheetProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  name: React.ReactNode
  /** Main reference image. */
  image?: string
  imageAlt?: string
  species?: React.ReactNode
  pronouns?: React.ReactNode
  /** Owner or artist credit, e.g. "Art by @moth". */
  credit?: React.ReactNode
  swatches?: Swatch[]
  /** Facts in a list: age, height, personality… */
  details?: Array<{ label: React.ReactNode; value: React.ReactNode }>
  /** Free text about the character. */
  bio?: React.ReactNode
  /** Notes for artists, e.g. markings and "please don't". */
  notes?: React.ReactNode
  /** Tags as chips. */
  tags?: string[]
  /** Buttons, e.g. "Download ref" or "Commission". */
  actions?: React.ReactNode
}

/**
 * A reference sheet for a character or fursona: art, species, pronouns, colour palette, facts and
 * notes for artists. Image beside the details on wide screens, above them on phones.
 */
export function CharacterSheet({
  className,
  name,
  image,
  imageAlt = '',
  species,
  pronouns,
  credit,
  swatches,
  details,
  bio,
  notes,
  tags,
  actions,
  ...props
}: CharacterSheetProps) {
  const nameId = React.useId()
  return (
    <article
      aria-labelledby={nameId}
      className={cn('dl-character surface-card', className)}
      {...props}>
      {image && (
        <figure className="dl-character-art">
          <img src={image} alt={imageAlt} loading="lazy" />
          {credit && <figcaption>{credit}</figcaption>}
        </figure>
      )}
      <div className="flex min-w-0 flex-col gap-5 p-5 sm:p-6">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 id={nameId} className="text-2xl font-[750] tracking-[-0.025em]">
              {name}
            </h2>
            {(species || pronouns) && (
              <p className="flex flex-wrap items-center gap-x-2 text-sm text-[var(--muted-foreground)]">
                {species && <span>{species}</span>}
                {species && pronouns && <span aria-hidden="true">·</span>}
                {pronouns && <span>{pronouns}</span>}
              </p>
            )}
            {!image && credit && <p className="text-xs text-[var(--muted-foreground)]">{credit}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </header>

        {swatches && swatches.length > 0 && (
          <section className="flex flex-col gap-2">
            <h3 className="dl-character-label">Palette</h3>
            <SwatchList swatches={swatches} />
          </section>
        )}

        {details && details.length > 0 && (
          <dl className="dl-character-details">
            {details.map((d, i) => (
              <div key={i}>
                <dt>{d.label}</dt>
                <dd>{d.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {bio && (
          <section className="flex flex-col gap-2">
            <h3 className="dl-character-label">About</h3>
            <div className="text-sm leading-relaxed">{bio}</div>
          </section>
        )}

        {notes && (
          <section className="notice-panel flex-col gap-1!" data-tone="info">
            <h3 className="text-xs font-bold tracking-[0.06em] uppercase">Notes for artists</h3>
            <div className="text-sm text-[var(--foreground)]">{notes}</div>
          </section>
        )}

        {tags && tags.length > 0 && (
          <ul role="list" className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <li key={t} className="ui-badge ui-badge-neutral">
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
