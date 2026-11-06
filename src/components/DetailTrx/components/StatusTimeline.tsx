'use client'

import { Check, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { PaymentDataWithDetailProduct } from '../../../types/Transaction'
import { formatDateTime } from '../../../utils/format_date'
import { normalizeTransactionStatus } from '../../ui/status-badge'

type StepState = 'done' | 'current' | 'failed' | 'idle'

const DOT: Record<StepState, string> = {
  done: 'border-primary bg-primary text-primary-foreground',
  current: 'border-pending bg-pending/15',
  failed: 'border-destructive bg-destructive text-destructive-foreground',
  idle: 'border-border bg-card',
}

const TITLE: Record<StepState, string> = {
  done: 'text-foreground',
  current: 'text-foreground',
  failed: 'text-destructive',
  idle: 'text-muted-foreground',
}

/** Timeline vertikal 3 langkah (dibuat → pembayaran → selesai). Status disampaikan lewat teks, bukan warna saja. */
export default function StatusTimeline({ data }: { data: PaymentDataWithDetailProduct }) {
  const t = useTranslations('TransactionStatus')
  const tDetail = useTranslations('DetailTrx')
  const locale = useLocale()
  const status = normalizeTransactionStatus(data.status)
  const paid = status === 'paid'
  const failed = status === 'failed'
  const method = data.detail_product?.payment_name?.trim() || data.payment_channel

  const steps: { title: string; desc: string; state: StepState }[] = [
    {
      title: t('trackCreated'),
      desc: formatDateTime(data.created_at, locale) || t('trackCreatedDesc'),
      state: 'done',
    },
    {
      title: t('trackPayment'),
      desc: paid
        ? t('trackPaymentDescPaid', { method })
        : failed
          ? t('trackPaymentDescFailed')
          : t('trackPaymentDescPending', { method }),
      state: paid ? 'done' : failed ? 'failed' : 'current',
    },
    {
      title: t('trackCompleted'),
      desc: paid
        ? t('trackCompletedDescPaid')
        : failed
          ? t('trackCompletedDescFailed')
          : t('trackCompletedDescPending'),
      state: paid ? 'done' : 'idle',
    },
  ]

  return (
    <ol aria-label={tDetail('progressTitle')} className="flex flex-col">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        const nextDone = steps[i + 1]?.state === 'done'
        return (
          <li
            key={step.title}
            aria-current={step.state === 'current' ? 'step' : undefined}
            className="flex gap-3.5"
          >
            <div className="flex w-6 flex-none flex-col items-center">
              <span
                className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${DOT[step.state]}`}
              >
                {step.state === 'current' && (
                  <>
                    <span
                      aria-hidden
                      className="absolute inset-0 animate-ping rounded-full bg-pending/40 motion-reduce:animate-none"
                    />
                    <span aria-hidden className="h-2 w-2 rounded-full bg-pending" />
                  </>
                )}
                {step.state === 'done' && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />}
                {step.state === 'failed' && <X className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />}
              </span>
              {!isLast && (
                <span
                  aria-hidden
                  className={`min-h-6 w-0.5 flex-1 ${nextDone ? 'bg-primary' : 'bg-border'}`}
                />
              )}
            </div>
            <div className={`flex min-w-0 flex-col gap-0.5 ${isLast ? '' : 'pb-5'}`}>
              <span className={`text-sm font-bold ${TITLE[step.state]}`}>{step.title}</span>
              <span className="text-xs text-muted-foreground">{step.desc}</span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
