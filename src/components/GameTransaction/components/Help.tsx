'use client'
import { ChevronRight, Headset } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FOOTER_CONTACT } from '../../Footer/config'

/** Kartu bantuan CS (WhatsApp) — nomor dari config, bukan hardcoded (rules §8). */
export default function HelpCard() {
  const t = useTranslations('GameCheckout')

  return (
    <a
      href={FOOTER_CONTACT.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors duration-200 hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand/40 bg-brand/10 text-brand">
        <Headset className="h-5 w-5" aria-hidden />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-bold text-foreground">{t('helpTitle')}</span>
        <span className="text-xs leading-relaxed text-muted-foreground">{t('helpSubtitle')}</span>
      </span>
      <ChevronRight
        className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:transition-none"
        aria-hidden
      />
    </a>
  )
}
