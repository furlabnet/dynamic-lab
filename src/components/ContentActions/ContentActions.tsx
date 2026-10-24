import React, { useState } from 'react'
import { Bookmark, Check, Flag, Link2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useControllableState } from '../../lib/hooks'
import { Button } from '../Button'
import { Dialog } from '../Dialog'
import { RadioGroup, RadioGroupItem } from '../RadioGroup'
import { Textarea } from '../Input'

export const DEFAULT_REPORT_REASONS = [
  { value: 'rating', label: 'Wrong age rating', description: 'The content is rated too low.' },
  { value: 'tags', label: 'Missing or wrong tags', description: 'Tags hide what the work contains.' },
  { value: 'theft', label: 'Stolen or uncredited work', description: "It's someone else's art or writing." },
  { value: 'spam', label: 'Spam or advertising' },
  { value: 'other', label: 'Something else' },
]

export interface ContentActionsProps {
  saved?: boolean
  defaultSaved?: boolean
  onSavedChange?: (saved: boolean) => void
  /** Saves by other people; the viewer's own save is added on top. */
  saveCount?: number
  /** Link copied by the Share button. Defaults to the current page. */
  shareUrl?: string
  /** Called when a report is submitted. Omit to hide the Report button. */
  onReport?: (report: { reason: string; details: string }) => void
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
  const [copied, setCopied] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const share = async () => {
    const url = shareUrl ?? window.location.href
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Clipboard can be blocked (insecure origin, permissions); the visual confirmation still helps.
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const closeReport = () => {
    setReportOpen(false)
    setTimeout(() => {
      setSubmitted(false)
      setReason('')
      setDetails('')
    }, 200)
  }

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
        leftIcon={copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
        onClick={share}
        aria-live="polite">
        {copied ? 'Link copied' : 'Share'}
      </Button>
      {children}
      {onReport && (
        <Button size={size} variant="ghost" leftIcon={<Flag className="size-4" />} onClick={() => setReportOpen(true)}>
          Report
        </Button>
      )}

      {onReport && (
        <Dialog
          open={reportOpen}
          onClose={closeReport}
          title={submitted ? 'Thanks for the report' : 'Report this content'}
          description={submitted ? 'A moderator will review it. You can keep browsing.' : "Reports are anonymous to the creator."}
          footer={
            submitted ? (
              <Button onClick={closeReport}>Done</Button>
            ) : (
              <>
                <Button variant="secondary" onClick={closeReport}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  disabled={!reason}
                  onClick={() => {
                    onReport({ reason: reportReasons.find((r) => r.value === reason)?.label ?? reason, details: details.trim() })
                    setSubmitted(true)
                  }}>
                  Send report
                </Button>
              </>
            )
          }>
          {!submitted && (
            <div className="flex flex-col gap-4">
              <RadioGroup label="What's wrong?" value={reason} onValueChange={setReason}>
                {reportReasons.map((r) => (
                  <RadioGroupItem key={r.value} value={r.value} label={r.label} description={r.description} />
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
