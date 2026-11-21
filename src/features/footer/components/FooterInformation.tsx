import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { footerHeadingClass, footerLinkClass } from '@/features/footer/styles'
import { EXTERNAL_LINKS } from '@/config/site'

export default function FooterInformation() {
  const t = useTranslations('FooterInformation')

  return (
    <div className="flex w-full flex-col gap-3">
      <h3 className={footerHeadingClass}>{t('title')}</h3>

      <ul className="flex flex-col gap-2">
        <li>
          <Link href="/about" className={footerLinkClass}>
            {t('about')}
          </Link>
        </li>

        <li>
          <Link href="/term-and-condition" className={footerLinkClass}>
            {t('terms')}
          </Link>
        </li>

        <li>
          <Link href="/policy-and-privacy" className={footerLinkClass}>
            {t('privacy')}
          </Link>
        </li>

        <li>
          <Link href="/check-transaction" className={footerLinkClass}>
            {t('checkTransaction')}
          </Link>
        </li>

        <li>
          <a
            href={EXTERNAL_LINKS.blog}
            target="_blank"
            rel="noopener noreferrer"
            className={footerLinkClass}
          >
            {t('blog')}
          </a>
        </li>
      </ul>
    </div>
  )
}
