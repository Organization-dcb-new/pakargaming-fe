'use client'

import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { useTranslations } from 'next-intl'

export default function SocialMediaComponent() {
  const t = useTranslations('Footer')

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-3 sm:max-w-none lg:items-start">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('followUs')}</p>

      <div className="flex items-center gap-4">
        <a
          href="https://www.instagram.com/pakargaming.id/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-1 text-pink-600 transition-transform duration-200 hover:scale-110 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
          aria-label={t('socialInstagramAria')}
        >
          <FaInstagram className="h-6 w-6" aria-hidden />
        </a>

        <a
          href="https://wa.me/628131793708"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-1 text-green-600 transition-transform duration-200 hover:scale-110 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
          aria-label={t('socialWhatsappAria')}
        >
          <FaWhatsapp className="h-6 w-6" aria-hidden />
        </a>
      </div>
    </div>
  )
}
