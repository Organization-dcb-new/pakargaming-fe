'use client'

import { useTranslations } from 'next-intl'

/** Skeleton daftar game home — meniru layout final (chip nav + header section + grid tile) untuk mencegah CLS. */
export function GamesByShowSkeleton() {
  const t = useTranslations('Home')

  return (
    <div
      role="status"
      aria-busy="true"
      className="animate-pulse motion-reduce:animate-none"
    >
      <span className="sr-only">{t('loading')}</span>

      {/* Baris chip navigasi show — overflow-hidden: jumlah chip melebihi lebar mobile */}
      <div className="flex gap-2 md:gap-4 justify-start md:justify-center overflow-hidden px-4 py-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-24 shrink-0 rounded-full bg-muted" />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-5">
            {/* Header section */}
            <div className="flex items-center gap-3">
              <span className="h-6 w-1.5 -skew-x-12 bg-muted" />
              <div className="h-7 w-40 rounded-md bg-muted" />
              <div className="ml-auto h-6 w-20 rounded-full bg-muted" />
            </div>

            {/* Grid tile */}
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="rounded-2xl border border-border bg-card p-2 sm:p-2.5">
                  <div className="aspect-square w-full rounded-xl bg-muted" />
                  <div className="mx-0.5 mt-2.5 h-4 w-3/4 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
