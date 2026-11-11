'use client'

import { useTranslations } from 'next-intl'
import { useLocaleSwitch, type LocaleCode } from '@/hooks/useLocaleSwitch'
import { useThemeSwitch, type ThemeChoice } from '@/hooks/useThemeSwitch'
import { cn } from '@/lib/cn'
import { focusRing } from '@/styles/focusRing'

/** Tombol pilihan di panel menu mobile — gaya sama dengan pilihan region (RegionSwitcher). */
export const optionButtonClass = (active: boolean) =>
  cn(
    'flex h-10 min-w-0 cursor-pointer touch-manipulation items-center justify-center rounded-sm border px-3 text-sm font-medium transition-colors duration-200 disabled:opacity-50',
    active
      ? 'border-primary/60 bg-primary/10 text-primary'
      : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground',
    focusRing,
  )

interface OptionsProps {
  /** Gaya judul bagian, supaya sama dengan judul bagian lain di menu */
  labelClassName?: string
}

export function LanguageOptions({ labelClassName }: OptionsProps) {
  const t = useTranslations('Navigation')
  const { locale, switchLocale, isPending } = useLocaleSwitch()
  const options: { code: LocaleCode; label: string }[] = [
    { code: 'id', label: t('languageId') },
    { code: 'en', label: t('languageEn') },
  ]

  return (
    <div className="space-y-2">
      <p id="mobile-language-label" className={labelClassName}>
        {t('language')}
      </p>
      <div role="group" aria-labelledby="mobile-language-label" className="grid grid-cols-2 gap-2">
        {options.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            onClick={() => switchLocale(code)}
            disabled={isPending}
            aria-pressed={locale === code}
            className={optionButtonClass(locale === code)}
          >
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function ThemeOptions({ labelClassName }: OptionsProps) {
  const t = useTranslations('Navigation')
  const { theme, switchTheme } = useThemeSwitch()
  const options: { value: ThemeChoice; label: string }[] = [
    { value: 'dark', label: t('themeDark') },
    { value: 'light', label: t('themeLight') },
    { value: 'system', label: t('themeSystem') },
  ]

  return (
    <div className="space-y-2">
      <p id="mobile-theme-label" className={labelClassName}>
        {t('theme')}
      </p>
      <div role="group" aria-labelledby="mobile-theme-label" className="grid grid-cols-3 gap-2">
        {options.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => switchTheme(value)}
            aria-pressed={theme === value}
            className={optionButtonClass(theme === value)}
          >
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
