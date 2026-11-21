'use client'

import { useTranslations } from 'next-intl'
import TopUpLayout from './TopUpLayout'
import TopUpGrid from './TopUpGrid'

const bone = 'rounded-sm bg-muted'

/** Skeleton halaman top-up — meniru header ringkas + kartu langkah + ringkasan (cegah CLS). */
export default function GameTopUpSkeleton() {
  const t = useTranslations('Common')

  return (
    <TopUpLayout>
      <div role="status" aria-busy="true" className="animate-pulse motion-reduce:animate-none">
        <span className="sr-only">{t('loading')}</span>

        <div className={`mb-4 h-4 w-40 ${bone}`} />
        <div className="chamfer h-36 bg-muted [--chamfer:20px] sm:h-48 lg:h-56" />
        <div className="mb-6 flex items-start gap-4 px-3 sm:gap-5 sm:px-5">
          <div className="chamfer -mt-10 h-20 w-20 shrink-0 bg-muted [--chamfer:14px] sm:-mt-12 sm:h-24 sm:w-24" />
          <div className="flex-1 space-y-3 pt-3">
            <div className={`h-8 w-2/3 max-w-sm ${bone}`} />
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-6 w-24 -skew-x-12 rounded-sm bg-muted" />
              ))}
            </div>
          </div>
        </div>

        <TopUpGrid>
          <div className="flex flex-col gap-4">
            {[0, 1].map((i) => (
              <div key={i} className="chamfer bg-card p-4 [--chamfer:14px] sm:p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="chamfer h-8 w-8 bg-muted [--chamfer:7px]" />
                  <div className={`h-6 w-48 ${bone}`} />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {Array.from({ length: i === 0 ? 2 : 6 }).map((_, j) => (
                    <div key={j} className="h-20 rounded-sm bg-muted" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="chamfer hidden h-72 bg-card [--chamfer:20px] lg:block" />
        </TopUpGrid>
      </div>
    </TopUpLayout>
  )
}
