'use client'

import { RotateCcw, Search, ShoppingBag } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { PaymentDataWithDetailProduct } from '@/types/transaction'
import { btnPrimary, btnSecondary } from '@/features/transactions/styles'
import { HudPanel } from '@/components/ui/hud-panel'
import { STATE_GLYPH, StateGlyph } from '@/components/ui/state-glyph'
import { statusAccentClass, statusBorderClass } from '@/components/ui/status-badge'
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

  return (
    <HudPanel
      as="section"
      aria-labelledby="trx-status-title"
      accent={false}
      // Garis tepi & bilah atas mengikuti status: hijau = berhasil, merah = gagal
      borderClassName={statusBorderClass(data.status)}
      className="mx-auto w-full max-w-2xl"
      innerClassName="flex flex-col gap-6 overflow-hidden p-5 sm:p-8"
    >
      <span aria-hidden className={`absolute inset-x-0 top-0 h-1 ${statusAccentClass(data.status)}`} />
      <span aria-hidden className="bg-stripes pointer-events-none absolute inset-x-0 top-0 h-32" />

      <header className="relative flex flex-col items-center gap-3 text-center">
        <span
          aria-hidden
          className={`chamfer flex h-20 min-w-20 items-center justify-center px-4 [--chamfer:14px] ${
            paid ? 'bg-success/15' : 'bg-destructive/15'
          }`}
        >
          <StateGlyph
            glyph={paid ? STATE_GLYPH.success : STATE_GLYPH.error}
            tone={paid ? 'success' : 'destructive'}
            size="md"
          />
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

      <div className="rounded-sm bg-muted/60 p-4">
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
    </HudPanel>
  )
}
