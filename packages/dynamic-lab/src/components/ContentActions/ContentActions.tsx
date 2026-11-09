'use client'

import React, { useState } from 'react'

import { Bookmark, Check, Flag, Link2, X } from 'lucide-react'

import { useAsyncAction, useControllableState, useCopyToClipboard } from '../../lib/hooks'
import { cn } from '../../lib/utils'
import { Button } from '../Button'
import { Dialog } from '../Dialog'
import { Textarea } from '../Input'
import { RadioGroup, RadioGroupItem } from '../RadioGroup'
import { DEFAULT_REPORT_REASONS } from './reportReasons'

export interface ContentActionsProps {
  saved?: boolean
  defaultSaved?: boolean
  onSavedChange?: (saved: boolean) => void
  /** Saves by other people; the viewer's own save is added on top. */
  saveCount?: number
  /** Link copied by the Share button. Defaults to the current page. */
  shareUrl?: string
  /**
   * Called when a report is submitted. Omit to hide the Report button. Return a promise and the
   * dialog shows progress, thanks the reader only once it resolves, and offers a retry if it
   * rejects, keeping what they wrote.
   */
  onReport?: (report: { reason: string; details: string }) => void | Promise<unknown>
  reportReasons?: Array<{ value: string; label: string; description?: string }>
  /** Extra buttons, e.g. a Download or Follow action. */
  children?: React.ReactNode
  size?: 'sm' | 'md'
  className?: string
}

/** Save, Share and Report for a piece of content. */
export function ContentActions({
  saved: savedProp,
  defaultSaved = false,
  onSavedChange,
  saveCount,
  shareUrl,
  onReport,
  reportReasons = DEFAULT_REPORT_REASONS,
  children,
  size = 'md',
  className,
}: ContentActionsProps) {
  const [saved, setSaved] = useControllableState(savedProp, defaultSaved, onSavedChange)
  const share = useCopyToClipboard(1800)
  const [reportOpen, setReportOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  // Editing (idle or error) → sending (pending) → thanks (success). It starts over each time the
  // dialog opens, so closing never has to wait for the exit animation to clear the form.
  const report = useAsyncAction((r: { reason: string; details: string }) => onReport?.(r))
  const submitted = report.status === 'success'

  const openReport = () => {
    report.reset()
    setReason('')
    setDetails('')
    setReportOpen(true)
  }
  const closeReport = () => {
    if (!report.isPending) setReportOpen(false)
  }
  const sendReport = () =>
    report.run({
      reason: reportReasons.find((r) => r.value === reason)?.label ?? reason,
      details: details.trim(),
    })

  const shareIcon = { idle: Link2, copied: Check, failed: X }[share.status]
  const shareLabel = { idle: 'Share', copied: 'Link copied', failed: 'Couldn’t copy' }[share.status]

  const count = saveCount !== undefined ? saveCount + (saved ? 1 : 0) : undefined

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <Button
        size={size}
        variant={saved ? 'primary' : 'secondary'}
        aria-pressed={saved}
        leftIcon={<Bookmark className={cn('size-4', saved && 'fill-current')} />}
        onClick={() => setSaved(!saved)}>
        {saved ? 'Saved' : 'Save'}
        {count !== undefined && <span className="ml-1 tabular-nums opacity-75">{count}</span>}
      </Button>
      <Button
        size={size}
        variant="secondary"
        leftIcon={React.createElement(shareIcon, { className: 'size-4' })}
        onClick={() => share.copy(shareUrl ?? window.location.href)}
        data-status={share.status}
        aria-live="polite">
        {shareLabel}
      </Button>
      {children}
      {onReport && (
        <Button
          size={size}
          variant="ghost"
          leftIcon={<Flag className="size-4" />}
          onClick={openReport}>
          Report
        </Button>
      )}

      {onReport && (
        <Dialog
          open={reportOpen}
          onClose={closeReport}
          title={submitted ? 'Thanks for the report' : 'Report this content'}
          description={
            submitted
              ? 'A moderator will review it. You can keep browsing.'
              : 'Reports are anonymous to the creator.'
          }
          footer={
            submitted ? (
              <Button onClick={closeReport}>Done</Button>
            ) : (
              <>
                <Button variant="secondary" onClick={closeReport} disabled={report.isPending}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  disabled={!reason}
                  loading={report.isPending}
                  onClick={sendReport}>
                  {report.status === 'error' ? 'Try again' : 'Send report'}
                </Button>
              </>
            )
          }>
          {!submitted && (
            <div className="flex flex-col gap-4" aria-busy={report.isPending || undefined}>
              {report.status === 'error' && (
                <p role="alert" className="text-sm text-[var(--status-danger-ink)]">
                  The report didn’t go through. Your answers are still here; try again.
                </p>
              )}
              <RadioGroup label="What's wrong?" value={reason} onValueChange={setReason}>
                {reportReasons.map((r) => (
                  <RadioGroupItem
                    key={r.value}
                    value={r.value}
                    label={r.label}
                    description={r.description}
                  />
                ))}
              </RadioGroup>
              <Textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Anything that helps the moderators (optional)"
                aria-label="Report details"
              />
            </div>
          )}
        </Dialog>
      )}
    </div>
  )
}
