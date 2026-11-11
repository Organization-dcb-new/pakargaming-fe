import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { useTranslations } from 'next-intl'
import { footerHeadingClass } from '@/features/footer/styles'
import { SOCIAL_LINKS } from '@/config/site'

const socialLinkClass =
  'rounded-lg p-1 transition-transform duration-200 hover:scale-110 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'

export default function SocialMedia() {
  const t = useTranslations('Footer')

  return (
    <div className="flex w-full flex-col gap-3">
      <h3 className={footerHeadingClass}>{t('followUs')}</h3>

      <div className="flex items-center gap-4">
        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className={`${socialLinkClass} text-instagram`}
          aria-label={t('socialInstagramAria')}
        >
          <FaInstagram className="h-6 w-6" aria-hidden />
        </a>

        <a
          href={SOCIAL_LINKS.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={`${socialLinkClass} text-green-600`}
          aria-label={t('socialWhatsappAria')}
        >
          <FaWhatsapp className="h-6 w-6" aria-hidden />
        </a>
      </div>
    </div>
  )
}
