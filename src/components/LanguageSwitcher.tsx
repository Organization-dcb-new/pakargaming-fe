'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '../i18n/routing'
import { useTransition } from 'react'

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'id', label: 'ID' },
] as const

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleLocaleChange = (newLocale: (typeof locales)[number]['code']) => {
    if (newLocale === locale) return
    startTransition(() => {
      router.replace(pathname, { locale: newLocale })
    })
  }

  return (
    <div
      className="mr-2 flex items-center rounded-lg border border-purple-500/30 dark:border-purple-500/20 bg-white/80 dark:bg-slate-800/80 p-0.5"
      role="group"
      aria-label="Language"
    >
      {locales.map(({ code, label }) => {
        const active = locale === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => handleLocaleChange(code)}
            disabled={isPending}
            className={`min-w-[2.25rem] rounded-md px-2 py-1 text-xs font-semibold uppercase transition-colors disabled:opacity-50 ${
              active
                ? 'bg-purple-600 text-white shadow-sm dark:bg-purple-500'
                : 'text-gray-700 hover:bg-purple-100 dark:text-gray-300 dark:hover:bg-purple-500/20'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
