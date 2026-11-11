'use client'
import { ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Price } from '@/types/game'
import { PaymentMethod } from '@/types/paymentMethod'
import { calculateTotalPrice } from './PaymentMethodList'

interface OrderProps {
  Product: Price
  Payment: PaymentMethod
  handleConfirm: () => void
  /** Nama game — baris pertama ringkasan */
  gameName?: string
  /** Nickname hasil cek ID (null bila belum terverifikasi) */
  accountName?: string | null
  /** Status tiap langkah, untuk progres & daftar yang belum lengkap */
  steps: { label: string; done: boolean }[]
}

const EMPTY = '—'

export default function OrderSummary({
  Payment,
  Product,
  handleConfirm,
  gameName,
  accountName,
  steps,
}: OrderProps) {
  const t = useTranslations('GameCheckout')
  const totalPrice = calculateTotalPrice(Payment, Product)
  const doneCount = steps.filter((step) => step.done).length
  const allDone = doneCount === steps.length
  const missing = steps.filter((step) => !step.done)

  const rows = [
    { label: t('orderGame'), value: gameName },
    { label: t('orderAccount'), value: accountName },
    { label: t('orderPackage'), value: Product?.name },
    { label: t('orderPayment'), value: Payment?.full_name },
  ]

  return (
    <section
      aria-labelledby="order-summary-title"
      className="hidden flex-col gap-4 rounded-2xl border border-border bg-card p-5 lg:flex"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="order-summary-title" className="font-display text-lg font-semibold text-foreground">
          {t('orderSummaryTitle')}
        </h2>
        <span className={`text-xs font-semibold ${allDone ? 'text-success' : 'text-muted-foreground'}`}>
          {t('stepsProgress', { done: doneCount, total: steps.length })}
        </span>
      </div>

      <dl className="flex flex-col gap-2.5 text-sm">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-3">
            <dt className="shrink-0 text-muted-foreground">{label}</dt>
            <dd className="text-right font-semibold text-foreground">{value || EMPTY}</dd>
          </div>
        ))}
      </dl>

      <div className="h-px bg-border" />

      <div className="flex items-baseline justify-between gap-3">
        <span className="font-semibold text-foreground">{t('orderTotal')}</span>
        <span className="font-display text-2xl font-bold text-primary">
          {totalPrice !== null ? `Rp ${totalPrice}` : EMPTY}
        </span>
      </div>

      <button
        type="button"
        onClick={() => {
          handleConfirm()
        }}
        className="chamfer flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary text-base font-bold text-primary-foreground transition-colors duration-200 hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card motion-reduce:transition-none"
      >
        <ShoppingCart className="h-4 w-4" aria-hidden />
        {t('orderBuy')}
      </button>

      {!allDone && (
        <div className="text-xs text-muted-foreground">
          <p className="font-semibold">{t('checklistIncomplete')}</p>
          <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
            {missing.map((step) => (
              <li key={step.label} className="flex items-center gap-1.5">
                <span aria-hidden className="size-1.5 rounded-full bg-muted-foreground/60" />
                {step.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
