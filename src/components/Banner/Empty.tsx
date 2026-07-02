'use client'

import { ImageOff } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function EmptyBanner() {
  const t = useTranslations('Home')

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 px-6 py-10 text-center">
        <ImageOff className="h-8 w-8 text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground">{t('bannerEmpty')}</p>
      </div>
    </div>
  )
}
