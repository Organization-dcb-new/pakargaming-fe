'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Download, Maximize2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { HudPanel } from '@/components/ui/hud-panel'
import { cn } from '@/lib/cn'
import { isHttpUrl } from '@/features/transactions/lib/paymentView'
import { btnSecondary } from '@/features/transactions/styles'

interface QrPaymentProps {
  src: string
  title: string
  channel: string
  /** Teks chip di header kartu (mis. "QRIS" atau nama channel) */
  badge: string
}

/** Siku viewfinder: kiri ungu, kanan cyan — mengikuti belahan warna logo. */
const CORNERS = [
  'left-1.5 top-1.5 border-l-2 border-t-2 border-brand-solid',
  'right-1.5 top-1.5 border-r-2 border-t-2 border-primary',
  'bottom-1.5 left-1.5 border-b-2 border-l-2 border-brand-solid',
  'bottom-1.5 right-1.5 border-b-2 border-r-2 border-primary',
]

/**
 * Bidang putih QR + siku viewfinder. Siku ada di padding (p-5), tidak menimpa gambar QR, supaya
 * quiet zone tetap utuh. `bg-white` literal disengaja: scanner butuh latar putih, di dark mode sekalipun.
 */
function QrFrame({ src, alt, className, imgClassName }: { src: string; alt: string; className?: string; imgClassName: string }) {
  return (
    <span className={cn('relative block rounded-sm bg-white p-5', className)}>
      {CORNERS.map((pos) => (
        <span key={pos} aria-hidden className={`pointer-events-none absolute h-3.5 w-3.5 ${pos}`} />
      ))}
      {/* eslint-disable-next-line @next/next/no-img-element -- QR bisa berupa data: URL dari gateway */}
      <img src={src} alt={alt} className={imgClassName} />
    </span>
  )
}

/** Logo + wordmark kecil untuk header kartu QR. */
function QrBrand() {
  const tNav = useTranslations('Navigation')
  return (
    <span className="flex min-w-0 items-center gap-2">
      <Image src="/logo.png" alt="" width={20} height={20} className="h-5 w-5 shrink-0 object-contain" />
      <span className="truncate font-display text-sm font-bold uppercase tracking-wider text-foreground">
        {tNav.rich('wordmark', {
          accent: (chunks) => <span className="text-primary">{chunks}</span>,
        })}
      </span>
    </span>
  )
}

/**
 * Kartu "Scan Card": header logo PakarGaming + chip channel, QR di bidang putih dengan siku viewfinder,
 * dan petunjuk perbesar di footer (tidak lagi menimpa QR). Pratinjau besar memakai Dialog ui/ (rules §7).
 */
export default function QrPayment({ src, title, channel, badge }: QrPaymentProps) {
  const t = useTranslations('TransactionStatus')
  const [open, setOpen] = useState(false)

  const download = isHttpUrl(src) ? (
    <a href={src} download={`QR-${channel}.png`} className={btnSecondary}>
      <Download className="h-4 w-4" aria-hidden />
      {t('downloadQr')}
    </a>
  ) : null

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <p className="text-sm font-semibold text-foreground">{title}</p>

      <HudPanel size="md" accent={false} borderClassName="bg-gradient-brand" className="w-fit max-w-full">
        <div className="flex items-center justify-between gap-3 border-b border-border px-3.5 py-2.5">
          <QrBrand />
          <span className="inline-flex shrink-0 -skew-x-12 items-center rounded-sm bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">
            <span className="inline-block skew-x-12 uppercase tracking-wide">{badge}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t('enlargeQrHint')}
          className="group block w-full cursor-zoom-in px-3 pb-2.5 pt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          <QrFrame
            src={src}
            alt={t('qrAlt')}
            className="transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            imgClassName="h-52 w-52 object-contain sm:h-56 sm:w-56"
          />
          <span
            aria-hidden
            className="mt-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors duration-200 group-hover:text-primary motion-reduce:transition-none"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            {t('enlargeQrHint')}
          </span>
        </button>
      </HudPanel>

      <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{t('scanQrHint')}</p>

      {download ? <div className="w-full max-w-xs">{download}</div> : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="chamfer gap-4 rounded-none border-0 bg-card p-5 [--chamfer:20px] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-brand sm:max-w-sm">
          <DialogTitle className="pr-6 font-display text-lg font-bold text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription>{t('scanQrHint')}</DialogDescription>
          <QrFrame src={src} alt={t('qrAlt')} imgClassName="h-auto w-full" />
          {download}
        </DialogContent>
      </Dialog>
    </div>
  )
}
