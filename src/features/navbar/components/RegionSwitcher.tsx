'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRegion } from '@/hooks/useRegion'
import { regionName } from '@/lib/regionName'
import { optionButtonClass } from './SettingsOptions'

interface RegionSwitcherProps {
  /** Gaya judul bagian di panel menu mobile, supaya sama dengan judul bagian lain. */
  labelClassName?: string
}

/**
 * Pemilih region akun game di panel menu mobile (desktop: bagian dari SettingsMenu).
 * Etalase, pencarian, dan halaman game mengikuti pilihan ini. Tidak dirender selama hanya satu region.
 */
export default function RegionSwitcher({ labelClassName }: RegionSwitcherProps) {
  const t = useTranslations('Navigation')
  const locale = useLocale()
  const { region, regions, setRegion } = useRegion()

  if (regions.length <= 1) return null

  return (
    <div className="space-y-2">
      <p id="mobile-region-label" className={labelClassName}>
        {t('region')}
      </p>
      <div role="group" aria-labelledby="mobile-region-label" className="grid grid-cols-2 gap-2">
        {regions.map((r) => {
          const active = r.code === region
          return (
            <button
              key={r.code}
              type="button"
              onClick={() => setRegion(r.code)}
              aria-pressed={active}
              className={`${optionButtonClass(active)} justify-start gap-2`}
            >
              <span className="font-display text-xs font-bold uppercase tracking-wider">{r.code}</span>
              <span className="truncate">{regionName(r.code, locale, r.name)}</span>
            </button>
          )
        })}
      </div>
      <p className="px-3 text-xs text-muted-foreground">{t('regionHint')}</p>
    </div>
  )
}
