'use client'

import { ChevronDown, Globe } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  DropdownMenu,
  DropdownMenuHudContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLocaleSwitch, type LocaleCode } from '@/hooks/useLocaleSwitch'
import { useRegion } from '@/hooks/useRegion'
import { useThemeSwitch, type ThemeChoice } from '@/hooks/useThemeSwitch'
import { cn } from '@/lib/cn'
import { regionName } from '@/lib/regionName'
import { focusRing } from '@/styles/focusRing'

// Label section: bilah miring gradient + teks display, sama seperti judul section di halaman
const sectionLabelClass =
  'flex items-center gap-2 px-2 pb-1 pt-2.5 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground before:h-3 before:w-1 before:shrink-0 before:-skew-x-12 before:bg-gradient-brand'
const itemClass =
  'cursor-pointer rounded-sm py-2 focus:bg-primary/10 focus:text-foreground data-[state=checked]:bg-primary/10 data-[state=checked]:font-semibold data-[state=checked]:text-primary'

/**
 * Satu tombol untuk region akun game, bahasa, dan tema (desktop). Tombol menampilkan kode region
 * bila ada lebih dari satu region, selain itu kode bahasa — jadi tidak ada dua "ID" berdampingan.
 */
export default function SettingsMenu() {
  const t = useTranslations('Navigation')
  const { locale, switchLocale, isPending } = useLocaleSwitch()
  const { theme, switchTheme } = useThemeSwitch()
  const { region, regions, setRegion } = useRegion()
  const showRegion = regions.length > 1
  const code = showRegion ? region : locale

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t('settingsLabel')}
          className={cn(
            'group inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-sm px-2.5 text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground',
            focusRing,
          )}
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
          <span className="font-display text-xs font-bold uppercase tracking-wider">{code}</span>
          <ChevronDown
            className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuHudContent align="end" sideOffset={8} className="w-72">
        {showRegion && (
          <>
            <DropdownMenuLabel className={sectionLabelClass}>{t('region')}</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={region} onValueChange={setRegion}>
              {regions.map((r) => (
                <DropdownMenuRadioItem key={r.code} value={r.code} className={itemClass}>
                  <span className="w-7 font-display text-xs font-bold uppercase tracking-wider opacity-70">
                    {r.code}
                  </span>
                  {regionName(r.code, locale, r.name)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <p className="px-2 pb-2 pt-1 text-xs leading-relaxed text-muted-foreground">{t('regionHint')}</p>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuLabel className={sectionLabelClass}>{t('language')}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={locale} onValueChange={(value) => switchLocale(value as LocaleCode)}>
          <DropdownMenuRadioItem value="id" disabled={isPending} className={itemClass}>
            {t('languageId')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en" disabled={isPending} className={itemClass}>
            {t('languageEn')}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className={sectionLabelClass}>{t('theme')}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme ?? ''} onValueChange={(value) => switchTheme(value as ThemeChoice)}>
          <DropdownMenuRadioItem value="dark" className={itemClass}>
            {t('themeDark')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light" className={itemClass}>
            {t('themeLight')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" className={itemClass}>
            {t('themeSystem')}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuHudContent>
    </DropdownMenu>
  )
}
