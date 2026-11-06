'use client'

import { ChevronRight, Gamepad2, RotateCw, TriangleAlert } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '../../../i18n/routing'
import { formatPrice } from '../../../utils/format_price'
import TransactionThumb from '../../Check-Transaction/components/TransactionThumb'
import { focusRing } from '../../Navigation/config'
import { StatusBadge } from '../../ui/status-badge'
import { cn } from '../../ui/utils'
import type { PaymentResponseDetail } from '../types/transactions'

interface RecentTransactionsProps {
  transactions: PaymentResponseDetail[]
  isLoading: boolean
  isError: boolean
  isFetching: boolean
  onRetry: () => void
}

const cardClass = 'rounded-2xl border border-border bg-card shadow-sm'

/** Daftar transaksi terbaru dari data dasbor (kartu per transaksi, bukan tabel — nyaman di mobile). */
export default function RecentTransactions({
  transactions,
  isLoading,
  isError,
  isFetching,
  onRetry,
}: RecentTransactionsProps) {
  const t = useTranslations('Dashboard')
  const locale = useLocale()

  const formatDate = (iso: string) => {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return iso
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  let content
  if (isLoading) {
    content = (
      <ul role="status" aria-busy="true" className="divide-y divide-border">
        <span className="sr-only">{t('loading')}</span>
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="flex animate-pulse items-center gap-4 px-4 py-4 motion-reduce:animate-none sm:px-5">
            <div className="size-12 shrink-0 rounded-xl bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/5 rounded bg-muted" />
              <div className="h-3 w-1/4 rounded bg-muted" />
              <div className="h-3 w-1/3 rounded bg-muted" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-5 w-16 rounded-full bg-muted" />
            </div>
          </li>
        ))}
      </ul>
    )
  } else if (isError) {
    content = (
      <div role="alert" className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center">
        <TriangleAlert className="size-5 shrink-0 text-destructive" aria-hidden="true" />
        <p className="flex-1 text-sm text-foreground">{t('errorState')}</p>
        <button
          type="button"
          onClick={onRetry}
          disabled={isFetching}
          className={cn(
            'inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none',
            focusRing,
          )}
        >
          <RotateCw className={cn('size-4', isFetching && 'animate-spin motion-reduce:animate-none')} aria-hidden="true" />
          {t('retry')}
        </button>
      </div>
    )
  } else if (transactions.length === 0) {
    content = (
      <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
        <span
          aria-hidden="true"
          className="chamfer flex size-14 items-center justify-center bg-primary/10 text-primary [--chamfer:10px]"
        >
          <Gamepad2 className="size-7" />
        </span>
        <div className="space-y-1">
          <p className="font-display text-base font-bold text-foreground">{t('emptyState')}</p>
          <p className="text-sm text-muted-foreground">{t('emptyHint')}</p>
        </div>
        <Link
          href="/"
          className={cn(
            'chamfer mt-2 inline-flex h-10 items-center rounded-sm bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors duration-200 [--chamfer:8px] hover:bg-primary/85 motion-reduce:transition-none',
            focusRing,
          )}
        >
          {t('emptyCta')}
        </Link>
      </div>
    )
  } else {
    content = (
      <ul className="divide-y divide-border">
        {transactions.map((trx) => (
          <li key={trx.id}>
            <Link
              href={`/detail-trx/${trx.id}`}
              className="group flex items-center gap-4 px-4 py-4 transition-colors duration-200 hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset motion-reduce:transition-none sm:px-5"
            >
              <TransactionThumb src={trx.game_image} name={trx.game_name} size="lg" />

              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-sm font-bold text-foreground">{trx.game_name}</span>
                {trx.game_item && <span className="truncate text-sm text-muted-foreground">{trx.game_item}</span>}
                <span className="truncate text-xs text-muted-foreground">
                  <span className="font-mono">{trx.payment_number}</span>
                  {trx.created_at && <> · {formatDate(trx.created_at)}</>}
                </span>
              </span>

              <span className="flex shrink-0 flex-col items-end gap-1.5">
                <span className="font-display text-sm font-bold tabular-nums text-foreground sm:text-base">
                  Rp {formatPrice(trx.amount)}
                </span>
                <StatusBadge status={trx.status} />
              </span>

              <ChevronRight
                className="hidden size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:transition-none sm:block"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <section aria-labelledby="recent-trx-title" className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <h2 id="recent-trx-title" className="font-display text-lg font-bold text-foreground">
          {t('recentTitle')}
        </h2>
        <Link
          href="/check-transaction"
          className={cn('rounded-md text-sm font-semibold text-primary hover:underline', focusRing)}
        >
          {t('checkTransaction')}
        </Link>
      </div>
      <div className={cn(cardClass, 'overflow-hidden')}>{content}</div>
    </section>
  )
}
