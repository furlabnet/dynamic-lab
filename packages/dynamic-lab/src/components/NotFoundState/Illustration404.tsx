import React, { useId } from 'react'

import { cn } from '../../lib/utils'
import { MARK_LIQUID_PATH, MARK_VIEWBOX, MarkPaths } from '../Brand/DynamicLabBrand'

export interface Illustration404Props extends React.SVGProps<SVGSVGElement> {
  className?: string
  /** Accessible name. Pass an empty string to hide it from assistive technology. */
  title?: string
}

/** The two digits share one shape; the right one is the same path moved over. */
const FOUR = 'M0 190 V0 L-74 120 H32'

/** Where the Furlab mark sits: it is the 0, standing on the same baseline as the 4s. */
const MARK = { x: 150, y: 104, width: 180, height: 169 }

/**
 * The 4s are scaled to the mark's height. With its 26-unit stroke the path spans -87..45 across
 * and -13..203 down, so this makes it exactly MARK.height tall, top and bottom aligned with it.
 */
const FOUR_SCALE = MARK.height / 216
const FOUR_Y = MARK.y + 13 * FOUR_SCALE
/** Each 4's x, leaving the same 14-unit gap on both sides of the mark. */
const FOUR_X = [MARK.x - 14 - 45 * FOUR_SCALE, MARK.x + MARK.width + 14 + 87 * FOUR_SCALE]

/** A four-point sparkle centred on 0,0. */
const sparkle = (size: number) =>
  `M0 ${-size}Q0 0 ${size} 0Q0 0 0 ${size}Q0 0 ${-size} 0Q0 0 0 ${-size}Z`

/**
 * "404" in Dynamic Lab's own language: the 0 is the Furlab mark (FleskyFox and the flask), its
 * liquid in the brand colour and bubbling over. Drawn only with theme tokens, so it follows the
 * brand, palette and light or dark mode. The bubbles rise unless reduced motion is requested.
 */
export function Illustration404({
  className,
  title = '404 Page Not Found',
  ...props
}: Illustration404Props) {
  const glow = `dl-404-glow-${useId().replace(/:/g, '')}`

  return (
    <svg
      viewBox="0 0 480 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      className={cn('h-auto w-full max-w-full', className)}
      {...props}>
      <defs>
        <radialGradient id={glow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: 'var(--primary)', stopOpacity: 0.22 }} />
          <stop offset="100%" style={{ stopColor: 'var(--primary)', stopOpacity: 0 }} />
        </radialGradient>
        <style>{`
          .dl-404-bubble { transform-box: fill-box; transform-origin: center; animation: dl-404-rise 3.2s ease-in infinite; }
          .dl-404-bubble-2 { animation-delay: 1.05s; }
          .dl-404-bubble-3 { animation-delay: 2.1s; }
          @keyframes dl-404-rise {
            0% { transform: translateY(14px) scale(0.6); opacity: 0; }
            25% { opacity: 1; }
            100% { transform: translateY(-26px) scale(1); opacity: 0; }
          }
          @media (prefers-reduced-motion: reduce) { .dl-404-bubble { animation: none; } }
        `}</style>
      </defs>

      {/* Glow behind the mark and the floor everything stands on. */}
      <circle cx="240" cy="170" r="150" fill={`url(#${glow})`} />
      <ellipse
        cx="240"
        cy="282"
        rx="214"
        ry="12"
        style={{ fill: 'var(--foreground)', opacity: 0.07 }}
      />

      {/* The two 4s, each over a soft offset shadow in the brand colour. */}
      {FOUR_X.map((x) => (
        <g key={x} strokeLinecap="round" strokeLinejoin="round" strokeWidth="26">
          <path
            d={FOUR}
            transform={`translate(${x + 6} ${FOUR_Y + 6}) scale(${FOUR_SCALE})`}
            style={{ stroke: 'var(--primary)', opacity: 0.28 }}
          />
          <path
            d={FOUR}
            transform={`translate(${x} ${FOUR_Y}) scale(${FOUR_SCALE})`}
            style={{ stroke: 'var(--foreground)' }}
          />
        </g>
      ))}

      {/* The mark as the 0, then its flask's liquid again in the brand colour. */}
      <svg {...MARK} viewBox={MARK_VIEWBOX} aria-hidden style={{ fill: 'var(--foreground)' }}>
        <MarkPaths />
        <path d={MARK_LIQUID_PATH} style={{ fill: 'var(--primary)' }} />
      </svg>

      {/* Bubbles escaping from the flask's neck. */}
      <g strokeWidth="3.5" style={{ stroke: 'var(--primary)' }}>
        <circle className="dl-404-bubble" cx="296" cy="108" r="8" />
        <circle className="dl-404-bubble dl-404-bubble-2" cx="284" cy="86" r="6" />
        <circle className="dl-404-bubble dl-404-bubble-3" cx="300" cy="66" r="4.5" />
      </g>

      {/* Sparkles. */}
      <g style={{ fill: 'var(--primary)', opacity: 0.75 }}>
        <path d={sparkle(10)} transform="translate(340 52)" />
        <path d={sparkle(7)} transform="translate(176 66)" />
        <path d={sparkle(5)} transform="translate(462 236)" style={{ opacity: 0.7 }} />
      </g>
    </svg>
  )
}
