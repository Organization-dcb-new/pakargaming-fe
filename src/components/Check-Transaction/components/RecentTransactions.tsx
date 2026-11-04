'use client'

import { AlertTriangle, Receipt } from 'lucide-react'
import { useTranslations } from 'next-intl'
import useAuth from '../../../hooks/useAuth'
import { Link } from '../../../i18n/routing'
import { formatPrice } from '../../../utils/format_price'
import { useGetTransactionByEmailDashboard } from '../../Dashboard/hooks/useGetTransaction'
import { StatusBadge } from '../../ui/status-badge'
import TransactionThumb from './TransactionThumb'

const LIMIT = 5

/** Transaksi terakhir milik akun yang login (data dashboard yang sudah ada). Guest: tidak tampil. */
export default function RecentTransactions() {
  const t = useTranslations('CheckTransaction')
  const { token, loading: authLoading } = useAuth()
  const { data, isLoading, isError, refetch } = useGetTransactionByEmailDashboard(token)

  if (authLoading || !token) return null

  const transactions = (data?.data?.transaction_detail ?? []).slice(0, LIMIT)

  return (
    <section aria-labelledby="recent-trx-title" className="space-y-3">
      <h2 id="recent-trx-title" className="font-display text-lg font-semibold text-foreground">
        {t('recentTitle')}
      </h2>

      {isLoading ? (
        <ul role="status" aria-busy="true" className="flex animate-pulse flex-col gap-2.5 motion-reduce:animate-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3.5 rounded-xl border border-border bg-card px-3.5 py-3">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-1/2 rounded bg-muted" />
                <div className="h-3 w-1/3 rounded bg-muted" />
              </div>
              <div className="h-5 w-16 rounded-full bg-muted" />
            </li>
          ))}
        </ul>
      ) : isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" aria-hidden />
          <span className="flex-1 font-semibold text-foreground">{t('recentError')}</span>
          <button
            type="button"
            onClick={() => refetch()}
            className="cursor-pointer rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
          >
            {t('retry')}
          </button>
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-card/60 p-4 text-sm text-muted-foreground">
          <Receipt className="h-5 w-5 shrink-0" aria-hidden />
          {t('recentEmpty')}
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {transactions.map((trx) => (
            <li key={trx.id}>
              <Link
                href={`/detail-trx/${trx.id}`}
                className="flex items-center gap-3.5 rounded-xl border border-border bg-card px-3.5 py-3 transition-colors duration-200 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
              >
                <TransactionThumb src={trx.game_image} name={trx.game_name} />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm font-bold text-foreground">
                    {[trx.game_name, trx.game_item].filter(Boolean).join(' · ')}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">{trx.payment_number}</span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <span className="font-display text-sm font-semibold text-foreground">
                    Rp {formatPrice(trx.amount)}
                  </span>
                  <StatusBadge status={trx.status} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
