'use client'
import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FaWhatsapp } from 'react-icons/fa'
import { CONTACT } from '@/config/site'

/** Kartu bantuan CS (WhatsApp) — nomor dari config, bukan hardcoded (rules §8). */
export default function HelpCard() {
  const t = useTranslations('GameCheckout')

  return (
    <a
      href={CONTACT.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors duration-200 hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
    >
      <FaWhatsapp className="h-8 w-8 shrink-0 text-whatsapp" aria-hidden />
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
