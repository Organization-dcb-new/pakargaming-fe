'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function EtcComponent() {
  const t = useTranslations('Footer')

  return (
    <div className="flex flex-col gap-8 border-t border-border/60 pt-8 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-x-10 sm:gap-y-6">
      <div className="flex max-w-md flex-col gap-2 text-sm">
        <span className="text-xs font-medium text-foreground">{t('consumerComplaints')}</span>

        <div className="flex flex-col gap-2 text-xs">
          <a
            href="https://wa.me/628131793708"
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit font-medium text-muted-foreground transition-colors hover:text-purple-600 dark:hover:text-purple-400"
          >
            +62 813-1793-708
          </a>

          <a
            href="mailto:pakargaming1@gmail.com"
            className="w-fit break-all font-medium text-muted-foreground transition-colors hover:text-purple-600 dark:hover:text-purple-400"
          >
            pakargaming1@gmail.com
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:items-end">
        <p className="text-xs font-medium text-foreground sm:text-right">{t('securityPrivacy')}</p>
        <div className="flex flex-row items-center gap-6 sm:justify-end">
          <Image src="/ssl.webp" alt="SSL secure" width={120} height={40} className="h-8 w-auto object-contain" />
          <Image src="/kan.webp" alt="Privacy certification" width={120} height={40} className="h-8 w-auto object-contain" />
        </div>
      </div>
    </div>
  )
}
