'use client'

import { useTranslations } from 'next-intl'
import { BANNER_IMAGE_HEIGHT, BANNER_IMAGE_WIDTH } from './bannerDimensions'

export function ShowSkeleton() {
  const t = useTranslations('Home')

  return (
    <section
      role="status"
      aria-busy="true"
      className="w-full animate-pulse motion-reduce:animate-none">
      <span className="sr-only">{t('loading')}</span>
      <div className="relative w-full overflow-hidden rounded-2xl border border-border">
        <div
          className="w-full bg-muted"
          style={{
            aspectRatio: `${BANNER_IMAGE_WIDTH} / ${BANNER_IMAGE_HEIGHT}`,
          }}
        />
      </div>
    </section>
  )
}
