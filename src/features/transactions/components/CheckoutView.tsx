'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ExternalLink, RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PaymentDataWithDetailProduct } from '@/types/transaction'
import { formatPrice } from '@/lib/formatPrice'
import { StatusBadge } from '@/components/ui/status-badge'
import { getPaymentView } from '@/features/transactions/lib/paymentView'
import { btnPrimary, btnSecondary } from '@/features/transactions/styles'
import { HudPanel } from '@/components/ui/hud-panel'
import InvoiceChip from './InvoiceChip'
import OrderSummary from './OrderSummary'
import PaymentInstructions from './PaymentInstructions'
import StatusTimeline from './StatusTimeline'
import { canOptimize } from '@/lib/image'

/**
 * Jeda antar cek status. Backend menanyakan status ke Paylabs paling sering sekali per 15 detik per
 * pembayaran; cek yang lebih rapat hanya membaca ulang data yang sama.
 */
const CHECK_STATUS_COOLDOWN_SECONDS = 15

type CheckoutViewProps = {
  data: PaymentDataWithDetailProduct
  onCheckStatus: () => Promise<unknown>
  checkingStatus: boolean
}

/** Layout PENDING (referensi "checkout"): panel bayar dominan di kiri, detail pesanan + progres di kanan. */
export default function CheckoutView({ data, onCheckStatus, checkingStatus }: CheckoutViewProps) {
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
        <HudPanel
          as="section"
          aria-labelledby="pay-panel-title"
          className="lg:col-span-7"
          innerClassName="flex flex-col items-center gap-5 p-5 text-center sm:p-6"
        >
          <h2 id="pay-panel-title" className="sr-only">
            {t('paymentPanelTitle')}
          </h2>

          <span className="inline-flex items-center gap-2 rounded-sm border border-border bg-muted px-3 py-1.5 text-sm font-bold text-foreground">
            {product?.payment_image ? (
              <span className="inline-flex rounded-sm bg-white px-1.5 py-0.5">
                <Image
                  src={product.payment_image}
                  alt=""
                  width={48}
                  height={18}
                  unoptimized={!canOptimize(product.payment_image)}
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

          <CheckStatusButton onCheck={onCheckStatus} checking={checkingStatus} />

          <p className="max-w-md text-xs text-muted-foreground">{tStatus('notePending')}</p>
        </HudPanel>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:col-span-5">
          <HudPanel as="section" aria-labelledby="order-summary-title" accent={false} size="md" innerClassName="p-5">
            <h2
              id="order-summary-title"
              className="flex items-center gap-2.5 before:h-5 before:w-1.5 before:shrink-0 before:-skew-x-12 before:bg-gradient-brand mb-4 font-display text-lg font-semibold text-foreground"
            >
              {t('orderDetailTitle')}
            </h2>
            <OrderSummary data={data} />
          </HudPanel>

          <HudPanel as="section" aria-labelledby="order-progress-title" accent={false} size="md" innerClassName="p-5">
            <h2
              id="order-progress-title"
              className="flex items-center gap-2.5 before:h-5 before:w-1.5 before:shrink-0 before:-skew-x-12 before:bg-gradient-brand mb-4 font-display text-lg font-semibold text-foreground"
            >
              {t('progressTitle')}
            </h2>
            <StatusTimeline data={data} />
          </HudPanel>
        </aside>
      </div>
    </div>
  )
}

/**
 * Tombol cek status pembayaran. Kalau pembayaran sudah masuk, halaman berganti ke kartu status;
 * kalau belum, tombol menunggu jeda dulu sebelum bisa ditekan lagi.
 */
function CheckStatusButton({ onCheck, checking }: { onCheck: () => Promise<unknown>; checking: boolean }) {
  const t = useTranslations('DetailTrx')
  const [cooldown, setCooldown] = useState(0)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleClick = async () => {
    setCooldown(CHECK_STATUS_COOLDOWN_SECONDS)
    await onCheck()
    setChecked(true)
  }

  const label = checking
    ? t('checkingStatus')
    : cooldown > 0
      ? t('checkStatusAgainIn', { seconds: cooldown })
      : t('checkStatus')

  return (
    <div className="flex w-full max-w-md flex-col gap-1.5">
      <button
        type="button"
        onClick={handleClick}
        disabled={checking || cooldown > 0}
        className={`${btnSecondary} disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <RefreshCw
          className={`h-4 w-4 ${checking ? 'animate-spin motion-reduce:animate-none' : ''}`}
          aria-hidden
        />
        {label}
      </button>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {checked && !checking ? t('stillPending') : t('checkStatusHint')}
      </p>
    </div>
  )
}
