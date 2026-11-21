'use client'

import { Globe } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { regionName } from '@/lib/regionName'
import { focusRing } from '@/styles/focusRing'

interface RegionNoticeProps {
  gameName: string
  /** Region pilihan pembeli di navbar, yang tidak punya versi game ini. */
  region: string
  /** Region akun yang dilayani halaman ini. */
  gameRegion: string
  onSwitchToGameRegion: () => void
}

/** Peringatan saat region navbar tidak cocok dengan game: produk di halaman ini untuk akun region lain. */
export default function RegionNotice({ gameName, region, gameRegion, onSwitchToGameRegion }: RegionNoticeProps) {
  const t = useTranslations('GameCheckout')
  const locale = useLocale()
  const chosen = regionName(region, locale)
  const served = regionName(gameRegion, locale)

  return (
    <div
      role="status"
      className="mb-6 flex flex-col gap-3 rounded-sm border border-warning/40 bg-warning/10 p-4 sm:flex-row sm:items-center"
    >
      <div className="flex min-w-0 flex-1 gap-3">
        <Globe className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {t('regionUnavailableTitle', { game: gameName, region: chosen })}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">{t('regionUnavailableDesc', { region: served })}</p>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
        <button
          type="button"
          onClick={onSwitchToGameRegion}
          className={`inline-flex h-9 cursor-pointer touch-manipulation items-center rounded-sm bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/85 ${focusRing}`}
        >
          {t('regionSwitchTo', { region: served })}
        </button>
        <Link
          href="/"
          className={`inline-flex h-9 items-center rounded-sm border border-border bg-card px-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-muted ${focusRing}`}
        >
          {t('regionBrowse', { region: chosen })}
        </Link>
      </div>
    </div>
  )
}
