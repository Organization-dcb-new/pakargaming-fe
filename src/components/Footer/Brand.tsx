import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { AR_One_Sans } from 'next/font/google'
import { FOOTER_LOGO_SRC } from './config'

const taglineFont = AR_One_Sans({
  subsets: ['latin-ext'],
  display: 'swap',
})

export default function BrandComponent() {
  const t = useTranslations('Footer')

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4 text-center lg:max-w-none lg:items-start lg:text-left">
      <Image
        alt={t('brandName')}
        src={FOOTER_LOGO_SRC}
        width={192}
        height={64}
        className="h-auto w-40 object-contain sm:w-44"
        sizes="(max-width: 640px) 160px, 176px"
      />

      <div>
        <h2 className="text-base font-semibold leading-snug text-foreground sm:text-lg">
          {t('brandName')}
        </h2>
        <p
          className={`${taglineFont.className} mt-1 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]`}
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
  )
}
