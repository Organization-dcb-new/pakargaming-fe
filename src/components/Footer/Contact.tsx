import { FaWhatsapp } from 'react-icons/fa'
import { useTranslations } from 'next-intl'
import { FOOTER_CONTACT, footerContactLinkClass, footerHeadingClass } from './config'

export default function ContactComponent() {
  const t = useTranslations('Footer')

  return (
    <div className="flex w-full flex-col gap-3">
      <h3 className={footerHeadingClass}>{t('contact')}</h3>

      <ul className="space-y-3">
        <li>
          <a
            href={FOOTER_CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={footerContactLinkClass}
          >
            {/* Nomor ini link WhatsApp → logo WhatsApp asli, bukan ikon telepon generik */}
            <FaWhatsapp className="h-4 w-4 shrink-0 text-whatsapp" aria-hidden />
            <span className="break-all">{FOOTER_CONTACT.whatsappDisplay}</span>
          </a>
        </li>

        <li>
          <a href={FOOTER_CONTACT.emailUrl} className={footerContactLinkClass}>
            {/* Email tidak punya logo brand — glyph "@" font display, selebar ikon WhatsApp di atasnya */}
            <span
              aria-hidden
              className="w-4 shrink-0 text-center font-display text-base font-bold leading-none text-primary"
            >
              @
            </span>
            <span className="break-all">{FOOTER_CONTACT.email}</span>
          </a>
        </li>
      </ul>
    </div>
  )
}
