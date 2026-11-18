'use client'

import { ChevronRight } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { PaymentDataWithDetailProduct } from '@/types/transaction'
import { formatDateTime } from '@/lib/formatDate'
import { formatPrice } from '@/lib/formatPrice'
import { StatusBadge, statusAccentClass, statusBorderClass } from '@/components/ui/status-badge'
import TransactionThumb from '@/components/TransactionThumb'
import { displayStatus, orderProgress } from '@/features/transactions/lib/orderProgress'
import { HudPanel } from '@/components/ui/hud-panel'

/** Kartu hasil cek invoice — klik menuju halaman detail transaksi. */
export default function TransactionResultCard({
  transaction,
}: {
  transaction: PaymentDataWithDetailProduct
}) {
  const t = useTranslations('CheckTransaction')
  const tCommon = useTranslations('Common')
  const locale = useLocale()
  // Dibayar belum tentu terkirim (review SF1): warna dan label mengikuti pesanannya.
  const shownStatus = displayStatus(transaction)
  const progress = orderProgress(transaction)
  const progressLabel =
    progress === 'processing'
      ? tCommon('statusProcessing')
      : progress === 'delayed'
        ? tCommon('statusDelayed')
        : progress === 'refunded'
          ? tCommon('statusRefunded')
          : undefined
  const product = transaction.detail_product
  const title = [product?.item_name, product?.item_product].filter(Boolean).join(' · ') || '—'

  return (
    <HudPanel
      as={Link}
      href={`/detail-trx/${transaction.id}`}
      size="md"
      // Garis tepi mengikuti status (berhasil / menunggu / gagal); hover menyala penuh
      borderClassName={`${statusBorderClass(shownStatus)} hover:bg-primary`}
      className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      innerClassName="flex flex-wrap items-center gap-4 p-4 pl-5"
    >
      <span aria-hidden className={`absolute inset-y-0 left-0 w-1 ${statusAccentClass(shownStatus)}`} />
      <TransactionThumb src={product?.item_image} name={product?.item_name} size="lg" />

      <span className="flex min-w-0 flex-[1_1_12rem] flex-col gap-1">
        <span className="font-bold text-foreground">{title}</span>
        <span className="break-all font-mono text-sm text-muted-foreground">
          {transaction.payment_number}
          {transaction.created_at && ` · ${formatDateTime(transaction.created_at, locale)}`}
        </span>
        <span className="font-display text-sm font-semibold tabular-nums text-foreground">
          Rp {formatPrice(transaction.amount)}
        </span>
      </span>

      <span className="flex basis-full items-center justify-between gap-2 sm:basis-auto sm:flex-col sm:items-end">
        <StatusBadge status={shownStatus} label={progressLabel} />
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          {t('viewDetail')}
          <ChevronRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
            aria-hidden
          />
        </span>
      </span>
    </HudPanel>
  )
}

/** Skeleton kartu hasil — proporsi sama dengan TransactionResultCard. */
export function TransactionResultSkeleton() {
  const t = useTranslations('Common')

  return (
    <div
      role="status"
      aria-busy="true"
      className="chamfer flex animate-pulse items-center gap-4 bg-card p-4 [--chamfer:14px] motion-reduce:animate-none"
    >
      <span className="sr-only">{t('loading')}</span>
      <div className="chamfer h-12 w-12 shrink-0 bg-muted [--chamfer:9px]" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/2 rounded-sm bg-muted" />
        <div className="h-3 w-2/3 rounded-sm bg-muted" />
        <div className="h-3 w-20 rounded-sm bg-muted" />
      </div>
      <div className="h-6 w-20 -skew-x-12 rounded-sm bg-muted" />
    </div>
  )
}
