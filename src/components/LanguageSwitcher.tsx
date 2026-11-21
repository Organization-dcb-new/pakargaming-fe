'use client'

import { useTranslations } from 'next-intl'
import { useLocaleSwitch } from '@/hooks/useLocaleSwitch'

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'id', label: 'ID' },
] as const

/** Toggle EN/ID ringkas — dipakai halaman maintenance. Navbar memakai popover pengaturan. */
export function LanguageSwitcher() {
  const t = useTranslations('Navigation')
  const { locale, switchLocale: handleLocaleChange, isPending } = useLocaleSwitch()

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
