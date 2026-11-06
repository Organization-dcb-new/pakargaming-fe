'use client'

import { useState } from 'react'
import { Loader2, RotateCw, Search, SearchX } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '../../i18n/routing'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

/**
 * Transaksi tidak ditemukan (dipakai detail-trx & transaction/[order_id]).
 * Hook tidak membedakan 404 vs gagal jaringan, jadi `onRetry` (refetch yang sudah ada) sekaligus jadi state error (rules §6).
 */
export function TransactionNotFound({ onRetry }: { onRetry?: () => unknown }) {
  const t = useTranslations('Orders')
  const [retrying, setRetrying] = useState(false)

  const handleRetry = async () => {
    if (!onRetry) return
    setRetrying(true)
    try {
      await onRetry()
    } finally {
      setRetrying(false)
    }
  }

  return (
    <section
      aria-labelledby="trx-not-found-title"
      className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-16 text-center sm:px-6 md:py-24 lg:px-8"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-destructive bg-destructive/15 text-destructive">
        <SearchX className="h-8 w-8" aria-hidden />
      </span>

      <h1
        id="trx-not-found-title"
        className="mt-5 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
      >
        {t('notFoundTitle')}
      </h1>
      <p className="mt-3 max-w-prose text-base leading-relaxed text-muted-foreground">
        {t('notFoundDesc')}
      </p>

      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Link
          href="/check-transaction"
          className={`chamfer flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-7 text-base font-bold text-primary-foreground transition-colors duration-200 hover:bg-primary/85 motion-reduce:transition-none ${focusRing}`}
        >
          <Search className="size-4" aria-hidden />
          {t('notFoundCheck')}
        </Link>
        {onRetry ? (
          <button
            type="button"
            onClick={handleRetry}
            disabled={retrying}
            className={`flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-card px-7 text-base font-semibold text-foreground transition-colors duration-200 hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none ${focusRing}`}
          >
            {retrying ? (
              <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
            ) : (
              <RotateCw className="size-4" aria-hidden />
            )}
            {t('notFoundRetry')}
          </button>
        ) : (
          <Link
            href="/"
            className={`flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-card px-7 text-base font-semibold text-foreground transition-colors duration-200 hover:border-primary/50 hover:text-primary motion-reduce:transition-none ${focusRing}`}
          >
            {t('notFoundHome')}
          </Link>
        )}
      </div>
    </section>
  )
}
