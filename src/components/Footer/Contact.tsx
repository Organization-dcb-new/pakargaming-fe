import { Mail, Phone } from 'lucide-react'
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
            <Phone className="h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" aria-hidden />
            <span className="break-all">{FOOTER_CONTACT.whatsappDisplay}</span>
          </a>
        </li>

        <li>
          <a href={FOOTER_CONTACT.emailUrl} className={footerContactLinkClass}>
            <Mail className="h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" aria-hidden />
            <span className="break-all">{FOOTER_CONTACT.email}</span>
          </a>
        </li>
      </ul>
    </div>
  )
}
