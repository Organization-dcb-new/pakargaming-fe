import { useTranslations } from 'next-intl'
import { SITE_NAME } from '@/config/site'

export default function FooterCopyright() {
  const t = useTranslations('Footer')

  return (
    <div className="mt-10 border-t border-border pt-8 text-center lg:mt-12">
      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} {SITE_NAME}. {t('rights')}
      </p>
    </div>
  )
}
