import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { useTranslations } from 'next-intl'
import { FOOTER_SOCIAL, footerHeadingClass } from './config'

const socialLinkClass =
  'rounded-lg p-1 transition-transform duration-200 hover:scale-110 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500'

export default function SocialMediaComponent() {
  const t = useTranslations('Footer')

  return (
    <div className="flex w-full flex-col gap-3">
      <h3 className={footerHeadingClass}>{t('followUs')}</h3>

      <div className="flex items-center gap-4">
        <a
          href={FOOTER_SOCIAL.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className={`${socialLinkClass} text-pink-600`}
          aria-label={t('socialInstagramAria')}
        >
          <FaInstagram className="h-6 w-6" aria-hidden />
        </a>

        <a
          href={FOOTER_SOCIAL.whatsapp}
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
