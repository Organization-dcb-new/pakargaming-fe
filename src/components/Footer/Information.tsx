'use client'

import { Link } from '../../i18n/routing'
import { useTranslations } from 'next-intl'

export default function Information() {
  const t = useTranslations('FooterInformation')

  return (
    <div className="max-w-sm flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">{t('title')}</h3>

      <div className="flex flex-col gap-2">
        <Link
          href="/about"
          className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 hover:translate-x-1"
        >
          {t('about')}
        </Link>

        <Link
          href="/term-and-condition"
          className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 hover:translate-x-1"
        >
          {t('terms')}
        </Link>

        <Link
          href="/policy-and-privacy"
          className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 hover:translate-x-1"
        >
          {t('privacy')}
        </Link>

        <Link
          href="/check-transaction"
          className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 hover:translate-x-1"
        >
          {t('checkTransaction')}
        </Link>
        <Link
          href="https://blog.pakargaming.id"
          className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 hover:translate-x-1"
        >
          {t('blog')}
        </Link>
      </div>
    </div>
  )
}
