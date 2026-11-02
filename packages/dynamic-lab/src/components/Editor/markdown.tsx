import React from 'react'

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  // **bold**, *italic*, [label](url). Only http(s), mailto and in-page (#) links are kept.
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g)
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={key}>{part.slice(2, -2)}</strong>
    if (/^\*[^*]+\*$/.test(part)) return <em key={key}>{part.slice(1, -1)}</em>
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
    if (link) {
      const safe = /^(https?:|mailto:|#)/.test(link[2])
      return safe ? (
        <a
          key={key}
          href={link[2]}
          className="text-[var(--primary)] underline"
          target={link[2].startsWith('#') ? undefined : '_blank'}
          rel="noreferrer">
          {link[1]}
        </a>
      ) : (
        link[1]
      )
    }
    return part
  })
}

/** Renders a small Markdown subset (headings, quotes, lists, rules, bold, italic, links) as React nodes. No HTML is injected. */
export function renderMarkdown(source: string): React.ReactNode {
  const blocks = source
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
  return blocks.map((block, i) => {
    const key = `b${i}`
    if (/^-{3,}$/.test(block)) return <hr key={key} />
    if (block.startsWith('### ')) return <h3 key={key}>{renderInline(block.slice(4), key)}</h3>
    if (block.startsWith('## ') || block.startsWith('# '))
      return <h2 key={key}>{renderInline(block.replace(/^#+\s/, ''), key)}</h2>
    if (block.split('\n').every((l) => l.startsWith('> ')))
      return (
        <blockquote key={key}>
          {renderInline(
            block
              .split('\n')
              .map((l) => l.slice(2))
              .join(' '),
            key
          )}
        </blockquote>
      )
    if (block.split('\n').every((l) => /^[-*] /.test(l)))
      return (
        <ul key={key} className="list-disc pl-6">
          {block.split('\n').map((l, j) => (
            <li key={j}>{renderInline(l.slice(2), `${key}-${j}`)}</li>
          ))}
        </ul>
      )
    return <p key={key}>{renderInline(block.replace(/\n/g, ' '), key)}</p>
  })
}

export function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}
