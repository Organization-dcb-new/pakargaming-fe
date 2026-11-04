'use client'

import { ChevronRight } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '../../../i18n/routing'
import { PaymentDataWithDetailProduct } from '../../../types/Transaction'
import { formatDateTime } from '../../../utils/format_date'
import { formatPrice } from '../../../utils/format_price'
import { StatusBadge } from '../../ui/status-badge'
import TransactionThumb from './TransactionThumb'

/** Kartu hasil cek invoice — klik menuju halaman detail transaksi. */
export default function TransactionResultCard({
  transaction,
}: {
  transaction: PaymentDataWithDetailProduct
}) {
  const t = useTranslations('CheckTransaction')
  const locale = useLocale()
  const product = transaction.detail_product
  const title = [product?.item_name, product?.item_product].filter(Boolean).join(' · ') || '—'

  return (
    <Link
      href={`/detail-trx/${transaction.id}`}
      className="group flex flex-wrap items-center gap-4 rounded-2xl border-2 border-primary bg-card p-4 transition-shadow duration-200 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
    >
      <TransactionThumb src={product?.item_image} name={product?.item_name} size="lg" />

      <span className="flex min-w-0 flex-[1_1_12rem] flex-col gap-1">
        <span className="font-bold text-foreground">{title}</span>
        <span className="break-all text-sm text-muted-foreground">
          {transaction.payment_number}
          {transaction.created_at && ` · ${formatDateTime(transaction.created_at, locale)}`}
        </span>
        <span className="font-display text-sm font-semibold text-foreground">
          Rp {formatPrice(transaction.amount)}
        </span>
      </span>

      <span className="flex basis-full items-center justify-between gap-2 sm:basis-auto sm:flex-col sm:items-end">
        <StatusBadge status={transaction.status} />
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          {t('viewDetail')}
          <ChevronRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
            aria-hidden
          />
        </span>
      </span>
    </Link>
  )
}

/** Skeleton kartu hasil — proporsi sama dengan TransactionResultCard. */
export function TransactionResultSkeleton() {
  const t = useTranslations('Common')

  return (
    <div
      role="status"
      aria-busy="true"
      className="flex animate-pulse items-center gap-4 rounded-2xl border-2 border-border bg-card p-4 motion-reduce:animate-none"
    >
      <span className="sr-only">{t('loading')}</span>
      <div className="h-12 w-12 shrink-0 rounded-xl bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/2 rounded bg-muted" />
        <div className="h-3 w-2/3 rounded bg-muted" />
        <div className="h-3 w-20 rounded bg-muted" />
      </div>
      <div className="h-6 w-20 rounded-full bg-muted" />
    </div>
  )
}
