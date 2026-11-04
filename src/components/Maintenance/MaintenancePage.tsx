'use client'

import { MessageCircle, Wrench } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { MaintenanceSchedule } from '../../lib/maintenance'
import { FOOTER_CONTACT } from '../Footer/config'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { BrandMark } from '../Navigation/Logo'
import { focusRing } from '../Navigation/config'
import { ThemeToggle } from '../ThemeToggle'
import ScheduleInfo from './ScheduleInfo'

/** Menggantikan seluruh isi situs (navbar, halaman, footer) selama jadwal maintenance aktif. */
export default function MaintenancePage({ schedule }: { schedule: MaintenanceSchedule }) {
  const t = useTranslations('Maintenance')

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6 md:h-16 lg:px-8">
          <BrandMark />
          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:py-16">
        <section aria-labelledby="maintenance-title" className="w-full max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <Wrench className="h-8 w-8" aria-hidden="true" />
          </div>

          <h1
            id="maintenance-title"
            className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            {t('title')}
          </h1>
          <p className="mx-auto mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t('description')}
          </p>

          <div className="mt-8">
            <ScheduleInfo name={schedule.name} endTime={schedule.end_time} />
          </div>

          <div className="mt-6 flex flex-col items-center gap-3">
            <a
              href={FOOTER_CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-brand-foreground shadow-sm transition-colors duration-200 hover:bg-brand/90 ${focusRing}`}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {t('contactCs')}
            </a>
            <p className="text-xs text-muted-foreground">{t('autoRefresh')}</p>
          </div>
        </section>
      </main>
    </div>
  )
}
