'use client'

import { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { PaymentDataWithDetailProduct } from '../../../types/Transaction'
import { formatPrice } from '../../../utils/format_price'
import { CopyButton } from '../../ui/copy-button'
import { PaymentView } from '../paymentView'
import QrPayment from './QrPayment'

/** Nilai besar yang perlu disalin (nomor VA, kode bayar, string QR). */
function CopyField({
  label,
  value,
  hint,
  compact = false,
}: {
  label: string
  value: string
  hint?: string
  /** true untuk nilai panjang (string QR) — font kecil monospace */
  compact?: boolean
}) {
  const t = useTranslations('TransactionStatus')

  return (
    <div className="w-full space-y-1.5 text-left">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <CopyButton
        value={value}
        successMessage={t('copySuccess')}
        label={t('copyLabel', { label })}
        className={`w-full justify-between rounded-xl border border-border bg-muted px-4 py-3 text-foreground hover:border-primary ${
          compact ? 'font-mono text-xs' : 'font-display text-lg font-bold tracking-wider'
        }`}
      >
        <span className="min-w-0 break-all text-left">{value}</span>
      </CopyButton>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

/** Langkah bernomor (badge ungu logo — sama seperti StepCard di halaman top-up). */
function StepList({ steps }: { steps: ReactNode[] }) {
  return (
    <ol className="flex w-full flex-col gap-2 text-left">
      {steps.map((step, i) => (
        <li key={i} className="flex items-start gap-3 rounded-xl bg-muted px-3.5 py-3">
          <span
            aria-hidden
            className="chamfer flex h-6 w-6 shrink-0 items-center justify-center bg-brand-solid font-display text-xs font-bold text-brand-solid-foreground [--chamfer:5px]"
          >
            {i + 1}
          </span>
          <span className="text-sm leading-relaxed text-foreground">{step}</span>
        </li>
      ))}
    </ol>
  )
}

interface PaymentInstructionsProps {
  data: PaymentDataWithDetailProduct
  view: PaymentView
}

/** Instruksi bayar per channel (QRIS, VA, e-wallet, pulsa, gerai). Tombol link bayar dirender oleh CheckoutView. */
export default function PaymentInstructions({ data, view }: PaymentInstructionsProps) {
  const t = useTranslations('TransactionStatus')
  const amount = `Rp ${formatPrice(data.amount ?? 0)}`
  const amountHint = t('transferExact', { amount: formatPrice(data.amount ?? 0) })
  const paymentName = data.detail_product?.payment_name?.trim() || data.payment_channel

  if (view.kind === 'none') return null

  if (view.kind === 'carrier') {
    return (
      <div className="w-full space-y-3 text-left">
        <p className="text-sm font-bold text-foreground">{t('carrierTitle')}</p>
        <StepList
          steps={[
            t('carrierStep1'),
            t('carrierStep2'),
            t('carrierStep3', { amount }),
            t('carrierStep4'),
          ]}
        />
        <p className="text-xs text-muted-foreground">{t('carrierNote')}</p>
      </div>
    )
  }

  if (view.kind === 'otc') {
    const { otcOutlet: outlet, otcCode: code } = view
    return (
      <div className="w-full space-y-4">
        <CopyField label={t('otcPaymentCodeLabel', { outlet })} value={code} />
        <StepList
          steps={[
            t('otcStep1', { outlet, code }),
            t('otcStep2', { outlet }),
            t('otcStep3', { outlet, code, amount }),
            t('otcStep4'),
          ]}
        />
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {view.qrImageSrc ? (
        <QrPayment
          src={view.qrImageSrc}
          channel={data.payment_channel}
          title={
            view.isQris ? t('payWithQris') : t('payWithChannel', { channel: data.payment_channel })
          }
        />
      ) : null}

      {view.rawQrString ? (
        <CopyField
          label={t('qrCodePaymentLabel')}
          value={view.rawQrString}
          hint={t('qrCodeHint')}
          compact
        />
      ) : null}

      {view.vaNumber ? (
        <CopyField
          label={view.isVaChannel ? t('vaNumberLabel') : t('paymentNumberLabel')}
          value={view.vaNumber}
          hint={amountHint}
        />
      ) : null}

      {view.isEwallet && view.hasPaymentLink ? (
        <p className="text-sm font-semibold text-foreground">
          {view.isOvo ? t('ovoHint') : t('payUsing', { name: paymentName })}
        </p>
      ) : null}
    </div>
  )
}
