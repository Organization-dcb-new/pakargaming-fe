'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { AR_One_Sans } from 'next/font/google'

const geist = AR_One_Sans({
  subsets: ['latin-ext'],
})

const LOGO_SRC = 'https://s3.nevaobjects.id/image-dev/uploads/20260121141804.png'

export default function BrandComponent() {
  const t = useTranslations('Footer')

  return (
    <div className="w-full max-w-sm lg:max-w-none">
      <div className="flex flex-col items-center gap-4 lg:items-start">
        <Image
          alt={t('brandName')}
          src={LOGO_SRC}
          width={192}
          height={64}
          className="h-auto w-40 object-contain sm:w-44"
          sizes="(max-width: 640px) 160px, 176px"
          priority={false}
        />

        <div>
          <h2 className="text-base font-semibold leading-snug text-foreground sm:text-lg">
            {t('brandName')}
          </h2>
          <p
            className={`${geist.className} mt-1 text-sm font-normal leading-relaxed text-muted-foreground sm:text-[0.9375rem]`}
          >
            {t('tagline')}
          </p>
        </div>

        <address className="not-italic">
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground lg:max-w-none">
            {t('address')}
          </p>
        </address>
      </div>
    </div>
  )
}
