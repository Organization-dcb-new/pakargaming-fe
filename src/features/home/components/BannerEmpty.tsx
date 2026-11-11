'use client'

import { useTranslations } from 'next-intl'
import { STATE_GLYPH, StateGlyph } from '@/components/ui/state-glyph'

export default function BannerEmpty() {
  const t = useTranslations('Home')

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 px-6 py-10 text-center">
        <StateGlyph glyph={STATE_GLYPH.empty} tone="muted" size="md" />
        <p className="text-sm text-muted-foreground">{t('bannerEmpty')}</p>
      </div>
    </div>
  )
}
