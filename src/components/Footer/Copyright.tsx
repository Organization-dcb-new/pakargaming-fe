'use client'

import { useTranslations } from 'next-intl'

export default function CopyrightComponent() {
  const t = useTranslations('Footer')

  return (
    <div className="mt-10 border-t border-border/60 pt-8 text-center lg:mt-12">
      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} PakarGaming. {t('rights')}
      </p>
    </div>
  )
}
