'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { canOptimize } from '@/lib/image'
import { cn } from '@/lib/cn'
import { LEVEL_STYLE } from '@/features/announcements/styles'
import type { PublicAnnouncement } from '@/features/announcements/types/announcement'
import AnnouncementLevelTag from './AnnouncementLevelTag'
import AnnouncementLink from './AnnouncementLink'

const secondaryButtonClass =
  'h-11 cursor-pointer rounded-sm border border-border px-4 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card motion-reduce:transition-none sm:flex-1'

const primaryButtonClass =
  'chamfer inline-flex h-11 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors duration-200 hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card motion-reduce:transition-none sm:flex-[2]'

/**
 * Popup pengumuman (gaya dialog HUD seperti AuthDialog/ConfirmModal). Ditutup dengan cara apa pun —
 * X, tombol, overlay, Esc, atau klik CTA — memanggil onClose (= ditandai sudah dibaca).
 */
export default function AnnouncementPopup({
  announcement,
  open,
  onClose,
}: {
  announcement: PublicAnnouncement
  open: boolean
  onClose: () => void
}) {
  const t = useTranslations('Announcements')
  const { title, body, level, image_url, link_url, link_label } = announcement
  // Gambar gagal dimuat → disembunyikan; popup tetap berarti tanpa gambar
  const [failedImage, setFailedImage] = useState<string | null>(null)
  const showImage = Boolean(image_url) && failedImage !== image_url

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <DialogContent
        // Tanpa isi = tanpa DialogDescription; atribut dilepas supaya Radix tidak memperingatkan
        {...(body ? {} : { 'aria-describedby': undefined })}
        className={cn(
          'chamfer max-h-[calc(100dvh-2rem)] gap-4 overflow-y-auto overscroll-contain rounded-none border-0 bg-card p-6 [--chamfer:20px] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-0.5 sm:max-w-md',
          LEVEL_STYLE[level].accent,
        )}
      >
        <DialogHeader className="items-start gap-3 pr-6 text-left">
          <AnnouncementLevelTag level={level} />
          <DialogTitle className="break-words font-display text-xl font-bold leading-snug text-foreground">
            {title}
          </DialogTitle>
        </DialogHeader>

        {showImage && (
          <div className="overflow-hidden rounded-sm bg-muted">
            <Image
              src={image_url}
              alt={title}
              width={896}
              height={504}
              sizes="(max-width: 640px) calc(100vw - 5rem), 400px"
              unoptimized={!canOptimize(image_url)}
              onError={() => setFailedImage(image_url)}
              className="h-auto max-h-[40dvh] w-full object-contain"
            />
          </div>
        )}

        {body && (
          <DialogDescription className="whitespace-pre-line break-words text-sm leading-relaxed text-foreground">
            {body}
          </DialogDescription>
        )}

        <DialogFooter className="mt-1 gap-2.5">
          {link_url ? (
            <>
              <DialogClose asChild>
                <button type="button" className={secondaryButtonClass}>
                  {t('close')}
                </button>
              </DialogClose>
              <AnnouncementLink href={link_url} onClick={onClose} className={primaryButtonClass} iconClassName="h-4 w-4">
                <span className="truncate">{link_label || t('defaultLinkLabel')}</span>
              </AnnouncementLink>
            </>
          ) : (
            <DialogClose asChild>
              <button type="button" className={cn(primaryButtonClass, 'w-full sm:flex-1')}>
                {t('gotIt')}
              </button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
