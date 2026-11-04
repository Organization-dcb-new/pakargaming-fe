import { useTranslations } from 'next-intl'
import { FOOTER_SITE_NAME } from './config'

export default function CopyrightComponent() {
  const t = useTranslations('Footer')

  return (
    <div className="mt-10 border-t border-border pt-8 text-center lg:mt-12">
      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} {FOOTER_SITE_NAME}. {t('rights')}
      </p>
    </div>
  )
}
