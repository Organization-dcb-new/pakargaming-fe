'use client'

import { Link } from '../../i18n/routing'
import { useTranslations } from 'next-intl'

const linkClass =
  'rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 dark:hover:text-purple-400'

export default function Information() {
  const t = useTranslations('FooterInformation')

  return (
    <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-none">
      <h3 className="text-sm font-semibold tracking-wide text-foreground">{t('title')}</h3>

      <ul className="flex flex-col gap-2">
        <li>
          <Link href="/about" className={linkClass}>
            {t('about')}
          </Link>
        </li>

        <li>
          <Link href="/term-and-condition" className={linkClass}>
            {t('terms')}
          </Link>
        </li>

        <li>
          <Link href="/policy-and-privacy" className={linkClass}>
            {t('privacy')}
          </Link>
        </li>

        <li>
          <Link href="/check-transaction" className={linkClass}>
            {t('checkTransaction')}
          </Link>
        </li>

        <li>
          <a
            href="https://blog.pakargaming.id"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {t('blog')}
          </a>
        </li>
      </ul>
    </div>
  )
}
