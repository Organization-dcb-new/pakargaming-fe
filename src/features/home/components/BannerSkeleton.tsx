'use client'

import { useTranslations } from 'next-intl'
import { BANNER_IMAGE_HEIGHT, BANNER_IMAGE_WIDTH } from '@/features/home/lib/bannerDimensions'

export function BannerSkeleton() {
  const t = useTranslations('Home')

  return (
    <section
      role="status"
      aria-busy="true"
      className="w-full animate-pulse motion-reduce:animate-none">
      <span className="sr-only">{t('loading')}</span>
      {/* Bentuk sama dengan BannerFrame (chamfer bergaris) supaya tidak ada pergeseran saat data datang */}
      <div className="chamfer bg-border p-0.5 [--chamfer:14px] sm:[--chamfer:22px]">
        <div
          className="chamfer w-full bg-muted [--chamfer:13px] sm:[--chamfer:21px]"
          style={{
            aspectRatio: `${BANNER_IMAGE_WIDTH} / ${BANNER_IMAGE_HEIGHT}`,
          }}
        />
      </div>
    </section>
  )
}
