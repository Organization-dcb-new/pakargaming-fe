'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/cn'
import { focusRing } from '@/styles/focusRing'
import { LEVEL_STYLE } from '@/features/announcements/styles'
import type { PublicAnnouncement } from '@/features/announcements/types/announcement'
import AnnouncementLevelTag from './AnnouncementLevelTag'
import AnnouncementLink from './AnnouncementLink'

/**
 * Strip tipis selebar layar di atas navbar: chip level · judul + isi satu baris · link · tutup.
 * Teks yang terpotong bisa dibuka (ketuk teks/chevron): judul membungkus, isi tampil penuh di bawahnya.
 */
export default function AnnouncementBar({
  announcement,
  onDismiss,
}: {
  announcement: PublicAnnouncement
  onDismiss: () => void
}) {
  const t = useTranslations('Announcements')
  const { title, body, level, link_url, link_label } = announcement
  const style = LEVEL_STYLE[level]
  const panelId = useId()
  const textRef = useRef<HTMLParagraphElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [overflowing, setOverflowing] = useState(false)

  // Hanya diukur saat tertutup (satu baris): saat terbuka teks tidak terpotong, tapi tombolnya tetap perlu
  useEffect(() => {
    const el = textRef.current
    if (!el || expanded) return
    const measure = () => setOverflowing(el.scrollWidth > el.clientWidth + 1)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [expanded, title, body])

  const canExpand = expanded || overflowing

  return (
    <div
      className={cn(
        'border-b bg-background/90 backdrop-blur-md animate-in fade-in-0 slide-in-from-top-1 duration-200 motion-reduce:animate-none',
        style.edge,
      )}
    >
      <div className={style.tint}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-10 items-center gap-2 py-1.5 sm:gap-3">
            <AnnouncementLevelTag level={level} compact />

            {/* Tombol toggle merentang (after:inset-0) menutupi area teks, jadi seluruh teks bisa diketuk */}
            <div className="relative flex min-w-0 flex-1 items-center gap-1">
              <p
                ref={textRef}
                className={cn(
                  'min-w-0 text-xs text-foreground sm:text-sm',
                  expanded ? 'break-words' : 'truncate',
                )}
              >
                <strong className="font-bold">{title}</strong>
                {body && !expanded && <span className="text-muted-foreground"> — {body}</span>}
              </p>
              {canExpand && (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                  aria-controls={body ? panelId : undefined}
                  className={cn(
                    'inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground transition-colors duration-200 after:absolute after:inset-0 hover:text-foreground motion-reduce:transition-none',
                    focusRing,
                  )}
                >
                  <ChevronDown
                    className={cn('h-4 w-4 transition-transform duration-200 motion-reduce:transition-none', expanded && 'rotate-180')}
                    aria-hidden
                  />
                  <span className="sr-only">{expanded ? t('showLess') : t('showMore')}</span>
                </button>
              )}
            </div>

            {/* Layar kecil: ikon saja (label untuk pembaca layar) supaya teks pengumuman tetap kebagian tempat */}
            {link_url && (
              <AnnouncementLink
                href={link_url}
                iconClassName="max-sm:h-4 max-sm:w-4"
                className={cn(
                  'inline-flex shrink-0 items-center gap-1 rounded-sm text-sm font-semibold text-foreground underline decoration-primary/60 underline-offset-4 transition-colors duration-200 hover:decoration-primary motion-reduce:transition-none max-sm:h-7 max-sm:w-7 max-sm:justify-center max-sm:hover:bg-foreground/10',
                  focusRing,
                )}
              >
                <span className="max-sm:sr-only sm:max-w-56 sm:truncate">{link_label || t('defaultLinkLabel')}</span>
              </AnnouncementLink>
            )}

            <button
              type="button"
              onClick={onDismiss}
              aria-label={t('dismiss', { title })}
              className={cn(
                '-mr-1.5 inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground transition-colors duration-200 hover:bg-foreground/10 hover:text-foreground motion-reduce:transition-none',
                focusRing,
              )}
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          {body && (
            <p
              id={panelId}
              hidden={!expanded}
              className="whitespace-pre-line break-words pb-2.5 text-xs text-muted-foreground animate-in fade-in-0 slide-in-from-top-1 duration-200 motion-reduce:animate-none sm:text-sm"
            >
              {body}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
