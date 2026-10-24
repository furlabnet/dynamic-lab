import React from 'react'
import { Download, Globe, Laptop, Monitor, Smartphone, Tablet, Terminal } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../Button'

export type Platform = 'windows' | 'mac' | 'linux' | 'android' | 'ios' | 'web'

export const PLATFORM_INFO: Record<Platform, { label: string; icon: React.ReactNode }> = {
  windows: { label: 'Windows', icon: <Monitor /> },
  mac: { label: 'macOS', icon: <Laptop /> },
  linux: { label: 'Linux', icon: <Terminal /> },
  android: { label: 'Android', icon: <Smartphone /> },
  ios: { label: 'iOS', icon: <Tablet /> },
  web: { label: 'Browser', icon: <Globe /> },
}

export interface PlatformBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  platform: Platform
}

export function PlatformBadge({ platform, className, ...props }: PlatformBadgeProps) {
  const info = PLATFORM_INFO[platform]
  return (
    <span className={cn('ui-platform-badge', className)} {...props}>
      {info.icon}
      {info.label}
    </span>
  )
}

export interface DownloadFile {
  id: string
  name: string
  platform: Platform
  size?: string
  version?: string
  /** Direct link. Without it, onDownload handles the click. */
  href?: string
  note?: string
}

export interface DownloadListProps {
  files: DownloadFile[]
  onDownload?: (file: DownloadFile) => void
  /** Platform to highlight as the recommended build (e.g. detected from the user agent). */
  recommended?: Platform
  className?: string
}

/** Detects the visitor's platform from the user agent, for `recommended`. */
export function detectPlatform(): Platform | undefined {
  if (typeof navigator === 'undefined') return undefined
  const ua = navigator.userAgent
  if (/Android/i.test(ua)) return 'android'
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios'
  if (/Mac/i.test(ua)) return 'mac'
  if (/Win/i.test(ua)) return 'windows'
  if (/Linux/i.test(ua)) return 'linux'
  return undefined
}

/** Build files for a downloadable work, one row per platform. */
export function DownloadList({ files, onDownload, recommended, className }: DownloadListProps) {
  return (
    <ul className={cn('flex flex-col gap-2', className)}>
      {files.map((file) => {
        const info = PLATFORM_INFO[file.platform]
        const isRecommended = file.platform === recommended
        return (
          <li key={file.id} className={cn('ui-download-row', isRecommended && 'ui-download-row-recommended')}>
            <span className="ui-command-item-icon size-10! [&>svg]:size-5!">{info.icon}</span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                <span className="truncate">{info.label}</span>
                {isRecommended && <span className="ui-badge ui-badge-primary ui-badge-sm">For your device</span>}
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">
                {[file.version && `v${file.version}`, file.size, file.note].filter(Boolean).join(' · ')}
              </span>
              <span className="truncate text-xs text-[var(--muted-foreground)] opacity-80" title={file.name}>
                {file.name}
              </span>
            </div>
            {file.href ? (
              <a href={file.href} download className="primary-button min-h-9! px-3! text-sm">
                <Download className="size-4" /> Download
              </a>
            ) : (
              <Button size="sm" variant={isRecommended ? 'primary' : 'secondary'} leftIcon={<Download className="size-4" />} onClick={() => onDownload?.(file)}>
                Download
              </Button>
            )}
          </li>
        )
      })}
    </ul>
  )
}
