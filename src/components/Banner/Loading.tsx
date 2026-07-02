'use client'

import { useTranslations } from 'next-intl'
import { BANNER_IMAGE_HEIGHT, BANNER_IMAGE_WIDTH } from './bannerDimensions'

export function ShowSkeleton() {
  const t = useTranslations('Home')

  return (
    <section
      role="status"
      aria-busy="true"
      className="w-full max-w-5xl mx-auto px-4 py-10 animate-pulse motion-reduce:animate-none">
      <span className="sr-only">{t('loading')}</span>
      <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl">
        <div
          className="w-full rounded-2xl bg-muted"
          style={{
            aspectRatio: `${BANNER_IMAGE_WIDTH} / ${BANNER_IMAGE_HEIGHT}`,
          }}
        />
      </div>
    </section>
  )
}
