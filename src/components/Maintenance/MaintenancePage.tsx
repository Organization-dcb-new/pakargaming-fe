'use client'

import { MessageCircle, RefreshCw } from 'lucide-react'
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
      <header className="relative pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6 md:h-16 lg:px-8">
          <BrandMark />
          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
        {/* Garis gradient logo, sama dengan navbar utama (Navigation/LayoutTop) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-brand opacity-60"
        />
      </header>

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:py-16">
        {/* Glow dekoratif di belakang countdown */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 size-112 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
        />

        <section aria-labelledby="maintenance-title" className="relative w-full max-w-lg text-center">
          <span className="chamfer inline-flex max-w-full items-center gap-2 bg-warning/15 px-3 py-1 font-display text-xs font-bold uppercase tracking-widest text-foreground [--chamfer:6px]">
            <span aria-hidden="true" className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex size-full rounded-full bg-warning opacity-75 animate-ping motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-warning" />
            </span>
            {t('badge')}
            {schedule.name && (
              <>
                <span aria-hidden="true" className="text-muted-foreground">
                  ·
                </span>
                <span className="truncate">{schedule.name}</span>
              </>
            )}
          </span>

          <h1
            id="maintenance-title"
            className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {t('title')}
          </h1>
          <p className="mx-auto mt-3 max-w-prose text-base leading-relaxed text-muted-foreground">
            {t('description')}
          </p>

          <div className="mt-10">
            <ScheduleInfo startTime={schedule.start_time} endTime={schedule.end_time} />
          </div>

          <div className="mt-10 flex flex-col items-center gap-4">
            <a
              href={FOOTER_CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`chamfer inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-7 text-base font-bold text-primary-foreground transition-colors duration-200 hover:bg-primary/85 motion-reduce:transition-none ${focusRing}`}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {t('contactCs')}
            </a>
            <p className="text-xs text-balance text-muted-foreground">
              <RefreshCw className="mr-1.5 inline size-3.5 align-[-2px]" aria-hidden="true" />
              {t('autoRefresh')}
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
