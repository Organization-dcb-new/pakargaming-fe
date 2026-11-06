'use client'

import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PaymentDataWithDetailProduct } from '../../../types/Transaction'
import { formatPrice } from '../../../utils/format_price'
import { StatusBadge } from '../../ui/status-badge'
import { getPaymentView } from '../paymentView'
import { btnPrimary, surface } from '../styles'
import InvoiceChip from './InvoiceChip'
import OrderSummary from './OrderSummary'
import PaymentInstructions from './PaymentInstructions'
import StatusTimeline from './StatusTimeline'

/** Layout PENDING (referensi "checkout"): panel bayar dominan di kiri, detail pesanan + progres di kanan. */
export default function CheckoutView({ data }: { data: PaymentDataWithDetailProduct }) {
  const t = useTranslations('DetailTrx')
  const tStatus = useTranslations('TransactionStatus')
  const view = getPaymentView(data)
  const product = data.detail_product
  const method = product?.payment_name?.trim() || data.payment_channel

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex min-w-0 flex-col items-start gap-2">
          <InvoiceChip value={data.payment_number} />
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('checkoutTitle')}
          </h1>
        </div>
        <StatusBadge status={data.status} className="px-3 py-1 text-sm" />
      </header>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <section
          aria-labelledby="pay-panel-title"
          className={`${surface} flex flex-col items-center gap-5 p-5 text-center sm:p-6 lg:col-span-7`}
        >
          <h2 id="pay-panel-title" className="sr-only">
            {t('paymentPanelTitle')}
          </h2>

          <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-1.5 text-sm font-bold text-foreground">
            {product?.payment_image ? (
              <span className="inline-flex rounded bg-white px-1.5 py-0.5">
                <Image
                  src={product.payment_image}
                  alt=""
                  width={48}
                  height={18}
                  unoptimized
                  className="h-[18px] w-auto object-contain"
                />
              </span>
            ) : null}
            {method}
          </span>

          <PaymentInstructions data={data} view={view} />

          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-muted-foreground">{t('totalDue')}</span>
            <span className="font-display text-4xl font-bold text-primary">
              Rp {formatPrice(data.amount)}
            </span>
          </div>

          {view.showPaymentLink ? (
            <a
              href={data.payment_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btnPrimary} max-w-md`}
            >
              {tStatus('continuePayment')}
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          ) : null}

          <div className="flex max-w-md flex-col gap-1.5">
            <p className="text-xs font-medium text-foreground">
              <span aria-hidden className="relative mr-2 inline-flex h-2 w-2 align-middle">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/60 motion-reduce:animate-none" />
                <span className="relative h-2 w-2 rounded-full bg-primary" />
              </span>
              {t('autoUpdateHint')}
            </p>
            <p className="text-xs text-muted-foreground">{tStatus('notePending')}</p>
          </div>
        </section>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:col-span-5">
          <section aria-labelledby="order-summary-title" className={`${surface} p-5`}>
            <h2
              id="order-summary-title"
              className="mb-4 font-display text-lg font-semibold text-foreground"
            >
              {t('orderDetailTitle')}
            </h2>
            <OrderSummary data={data} />
          </section>

          <section aria-labelledby="order-progress-title" className={`${surface} p-5`}>
            <h2
              id="order-progress-title"
              className="mb-4 font-display text-lg font-semibold text-foreground"
            >
              {t('progressTitle')}
            </h2>
            <StatusTimeline data={data} />
          </section>
        </aside>
      </div>
    </div>
  )
}
