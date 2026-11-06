'use client'

import { useTranslations } from 'next-intl'
import LayoutGamesTransaction from './Layout'
import LayoutData from './LayoutData'

const bone = 'rounded-md bg-muted'

/** Skeleton halaman top-up — meniru header ringkas + kartu langkah + ringkasan (cegah CLS). */
export default function GameTransactionSkeleton() {
  const t = useTranslations('Common')

  return (
    <LayoutGamesTransaction>
      <div role="status" aria-busy="true" className="animate-pulse motion-reduce:animate-none">
        <span className="sr-only">{t('loading')}</span>

        <div className={`mb-4 h-4 w-40 ${bone}`} />
        <div className="h-36 rounded-2xl bg-muted sm:h-48 lg:h-56" />
        <div className="mb-6 flex items-start gap-4 px-3 sm:gap-5 sm:px-5">
          <div className="-mt-10 h-20 w-20 shrink-0 rounded-2xl bg-muted ring-4 ring-background sm:-mt-12 sm:h-24 sm:w-24" />
          <div className="flex-1 space-y-3 pt-3">
            <div className={`h-8 w-2/3 max-w-sm ${bone}`} />
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-6 w-24 rounded-full bg-muted" />
              ))}
            </div>
          </div>
        </div>

        <LayoutData>
          <div className="flex flex-col gap-4">
            {[0, 1].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-8 w-8 bg-muted" />
                  <div className={`h-6 w-48 ${bone}`} />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {Array.from({ length: i === 0 ? 2 : 6 }).map((_, j) => (
                    <div key={j} className="h-20 rounded-xl bg-muted" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="hidden h-72 rounded-2xl border border-border bg-card lg:block" />
        </LayoutData>
      </div>
    </LayoutGamesTransaction>
  )
}
