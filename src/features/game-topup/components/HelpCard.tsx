'use client'
import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FaWhatsapp } from 'react-icons/fa'
import { CONTACT } from '@/config/site'
import { HudPanel } from '@/components/ui/hud-panel'

/** Kartu bantuan CS (WhatsApp) — nomor dari config, bukan hardcoded (rules §8). */
export default function HelpCard() {
  const t = useTranslations('GameCheckout')

  return (
    <HudPanel
      as="a"
      href={CONTACT.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      accent={false}
      size="md"
      borderClassName="bg-border hover:bg-primary/60"
      className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      innerClassName="flex items-center gap-3 p-4"
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
    </HudPanel>
  )
}
