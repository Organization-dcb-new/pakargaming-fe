'use client'

import { Check, RotateCcw, Search, ShoppingBag, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '../../../i18n/routing'
import { PaymentDataWithDetailProduct } from '../../../types/Transaction'
import { btnPrimary, btnSecondary, surface } from '../styles'
import InvoiceChip from './InvoiceChip'
import OrderSummary from './OrderSummary'
import StatusTimeline from './StatusTimeline'

/** Layout PAID / FAILED (referensi "status"): kolom tengah — ikon status, timeline, ringkasan, CTA. */
export default function StatusView({
  data,
  paid,
}: {
  data: PaymentDataWithDetailProduct
  paid: boolean
}) {
  const t = useTranslations('DetailTrx')
  const tStatus = useTranslations('TransactionStatus')
  const slug = data.detail_product?.game_slug
  const Icon = paid ? Check : X

  return (
    <section
      aria-labelledby="trx-status-title"
      className={`${surface} mx-auto flex w-full max-w-2xl flex-col gap-6 p-5 sm:p-8`}
    >
      <header className="flex flex-col items-center gap-3 text-center">
        <span
          className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${
            paid
              ? 'border-success bg-success/15 text-success'
              : 'border-destructive bg-destructive/15 text-destructive'
          }`}
        >
          <Icon className="h-8 w-8" strokeWidth={2.5} aria-hidden />
        </span>
        <h1
          id="trx-status-title"
          className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          {paid ? t('statusPaidTitle') : t('statusFailedTitle')}
        </h1>
        <p className="max-w-md text-base leading-relaxed text-muted-foreground">
          {paid ? tStatus('notePaid') : tStatus('noteFailed')}
        </p>
        <InvoiceChip value={data.payment_number} />
      </header>

      <StatusTimeline data={data} />

      <div className="rounded-xl bg-muted/60 p-4">
        <OrderSummary data={data} />
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <Link href="/check-transaction" className={`${btnSecondary} sm:flex-1`}>
          <Search className="h-4 w-4" aria-hidden />
          {t('checkOtherTransaction')}
        </Link>
        {slug ? (
          <Link href={`/games/${slug}`} className={`${btnPrimary} sm:flex-1`}>
            {paid ? (
              <ShoppingBag className="h-4 w-4" aria-hidden />
            ) : (
              <RotateCcw className="h-4 w-4" aria-hidden />
            )}
            {paid ? tStatus('buyAgain') : tStatus('retryTransaction')}
          </Link>
        ) : null}
      </div>
    </section>
  )
}
