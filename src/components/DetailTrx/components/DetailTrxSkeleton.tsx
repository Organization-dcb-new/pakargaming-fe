'use client'

import { useTranslations } from 'next-intl'
import { surface } from '../styles'

/** Skeleton layout checkout (status belum diketahui saat loading; mayoritas user datang dari pesanan baru → PENDING). */
export default function DetailTrxSkeleton() {
  const t = useTranslations('Common')

  return (
    <div
      role="status"
      aria-busy="true"
      className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8"
    >
      <span className="sr-only">{t('loading')}</span>
      <div className="mx-auto flex w-full max-w-5xl animate-pulse flex-col gap-5 motion-reduce:animate-none">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-2">
            <div className="h-8 w-52 rounded-full bg-muted" />
            <div className="h-10 w-72 max-w-full rounded-lg bg-muted" />
          </div>
          <div className="h-7 w-24 rounded-full bg-muted" />
        </div>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
          <div className={`${surface} flex flex-col items-center gap-5 p-5 sm:p-6 lg:col-span-7`}>
            <div className="h-9 w-32 rounded-lg bg-muted" />
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-[15.5rem] w-[15.5rem] max-w-full rounded-2xl bg-muted" />
            <div className="h-4 w-64 max-w-full rounded bg-muted" />
            <div className="flex flex-col items-center gap-2">
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-10 w-48 rounded-lg bg-muted" />
            </div>
            <div className="h-12 w-full max-w-md rounded-lg bg-muted" />
          </div>

          <div className="flex flex-col gap-5 lg:col-span-5">
            <div className={`${surface} space-y-4 p-5`}>
              <div className="h-6 w-36 rounded bg-muted" />
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/2 rounded bg-muted" />
                  <div className="h-3 w-1/3 rounded bg-muted" />
                </div>
              </div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between gap-4">
                  <div className="h-4 w-20 rounded bg-muted" />
                  <div className="h-4 w-28 rounded bg-muted" />
                </div>
              ))}
            </div>
            <div className={`${surface} space-y-4 p-5`}>
              <div className="h-6 w-32 rounded bg-muted" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3.5">
                  <div className="h-6 w-6 shrink-0 rounded-full bg-muted" />
                  <div className="h-4 w-40 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
