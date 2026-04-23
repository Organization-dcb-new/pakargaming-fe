'use client'

import { useTranslations } from 'next-intl'

export default function NewsletterComponent() {
  const t = useTranslations('Newsletter')

  return (
    <div>
      <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-6">{t('title')}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{t('description')}</p>
      <form className="space-y-3">
        <input
          type="email"
          placeholder={t('placeholder')}
          className="w-full bg-gray-100 dark:bg-black/40 border border-purple-200 dark:border-purple-500/20 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />
        <button
          type="button"
          className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          {t('subscribe')}
        </button>
      </form>
    </div>
  )
}
