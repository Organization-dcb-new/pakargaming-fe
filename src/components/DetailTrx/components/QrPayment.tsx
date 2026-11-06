'use client'

import { useState } from 'react'
import { Download, Maximize2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../../ui/dialog'
import { isHttpUrl } from '../paymentView'
import { btnSecondary, focusRing } from '../styles'

interface QrPaymentProps {
  src: string
  title: string
  channel: string
}

/**
 * QR pembayaran + pratinjau besar (Dialog ui/: focus trap, Esc, aria-modal — rules §7).
 * QR sengaja di atas `bg-white` literal: scanner butuh quiet zone putih, di dark mode sekalipun.
 */
export default function QrPayment({ src, title, channel }: QrPaymentProps) {
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

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('enlargeQrHint')}
        className={`group relative cursor-zoom-in rounded-2xl border border-border bg-white p-3 transition-transform duration-200 hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100 ${focusRing}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- QR bisa berupa data: URL dari gateway */}
        <img src={src} alt={t('qrAlt')} className="h-52 w-52 object-contain sm:h-56 sm:w-56" />
        <span
          aria-hidden
          className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-80 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none"
        >
          <Maximize2 className="h-4 w-4" />
        </span>
      </button>

      <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{t('scanQrHint')}</p>

      {download ? <div className="w-full max-w-xs">{download}</div> : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-4 rounded-2xl border-border bg-card p-5 sm:max-w-sm">
          <DialogTitle className="pr-6 font-display text-lg font-bold text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription>{t('scanQrHint')}</DialogDescription>
          <div className="rounded-xl bg-white p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={t('qrAlt')} className="h-auto w-full" />
          </div>
          {download}
        </DialogContent>
      </Dialog>
    </div>
  )
}
