import React, { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from '@furlab/dynamic-lab'
import type { PropDoc } from './registry'

export function CodeBlock({
  code,
  language = 'tsx',
  className,
}: {
  code: string
  language?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  return (
    <div className={cn('docs-code', className)}>
      <div className="docs-code-bar">
        <span>{language}</span>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code)
            } catch {
              // Clipboard blocked: nothing to do, the code is still selectable.
            }
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}
          className="docs-code-copy"
          aria-label={copied ? 'Copied' : 'Copy code'}>
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
}

export function Code({ children }: { children: React.ReactNode }) {
  return <code className="docs-inline-code">{children}</code>
}

export function PropsTable({ rows }: { rows: PropDoc[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Prop</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Default</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.name}>
            <TableCell className="align-top font-mono text-[13px] font-semibold whitespace-nowrap">
              {r.name}
            </TableCell>
            <TableCell className="align-top font-mono text-xs text-[var(--primary)]">
              {r.type}
            </TableCell>
            <TableCell className="align-top font-mono text-xs text-[var(--muted-foreground)]">
              {r.default ?? '—'}
            </TableCell>
            <TableCell className="align-top text-sm">{r.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function Prose({ children }: { children: React.ReactNode }) {
  return <div className="docs-prose">{children}</div>
}
