import { useTranslations } from 'next-intl'
import FooterLogo from './FooterLogo'

export default function BrandComponent() {
  const t = useTranslations('Footer')

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4 text-center lg:max-w-none lg:items-start lg:text-left">
      <FooterLogo alt={t('brandName')} />

      <div>
        <h2 className="font-display text-base font-bold leading-snug text-foreground sm:text-lg">
          {t('brandName')}
        </h2>
        <p
          className="mt-1 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]"
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
