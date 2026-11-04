'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '../i18n/routing'
import { useTransition } from 'react'

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'id', label: 'ID' },
] as const

export function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations('Navigation')
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
      className="mr-2 flex items-center rounded-lg border border-border bg-card p-0.5"
      role="group"
      aria-label={t('language')}
    >
      {locales.map(({ code, label }) => {
        const active = locale === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => handleLocaleChange(code)}
            disabled={isPending}
            aria-pressed={active}
            className={`min-w-[2.25rem] rounded-md px-2 py-1 font-display text-xs font-bold uppercase tracking-wider transition-colors duration-200 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background ${
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
