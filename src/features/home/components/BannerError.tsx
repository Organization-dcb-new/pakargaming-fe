'use client'

import { useTranslations } from 'next-intl'
import { STATE_GLYPH, StateGlyph } from '@/components/ui/state-glyph'

export default function BannerError({ onRetry }: { onRetry?: () => void }) {
  const t = useTranslations('Home')

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/30 bg-card p-8 text-center">
        <StateGlyph glyph={STATE_GLYPH.error} tone="destructive" />

        <p className="font-semibold text-foreground">{t('bannerErrorTitle')}</p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="chamfer cursor-pointer rounded-sm bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition-colors duration-200 [--chamfer:8px] hover:bg-primary/85 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            {t('retry')}
          </button>
        )}
      </div>
    </div>
  )
}
