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
      className="mr-2 flex items-center rounded-lg border border-brand/30 bg-card p-0.5"
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
            aria-pressed={active}
            className={`min-w-[2.25rem] rounded-md px-2 py-1 text-xs font-semibold uppercase transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background ${
              active
                ? 'bg-brand text-brand-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-brand/10'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
