'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useGetPaymentMethod } from '../../hooks/usePaymentMethod'
import { footerHeadingClass } from './config'

const MAX_VISIBLE = 6

function getValidImageSrc(src?: string | null) {
  const normalized = src?.trim()
  return normalized ? normalized : null
}

export default function SecurePayment() {
  const t = useTranslations('Footer')
  const { data: dataPaymentMethods, isLoading, isError } = useGetPaymentMethod()

  const categories = dataPaymentMethods?.data ?? []
  const allPayments = categories
    .flatMap((category) => category.payment_method ?? [])
    .filter((payment) => getValidImageSrc(payment.icon_url))

  const visiblePayments = allPayments.slice(0, MAX_VISIBLE)
  const remaining = Math.max(0, allPayments.length - MAX_VISIBLE)

  return (
    <div className="flex w-full flex-col gap-3">
      <h3 className={`${footerHeadingClass} sm:text-base`}>{t('securePayment')}</h3>

      {isLoading ? (
        <div className="flex min-h-[3.25rem] flex-wrap items-center gap-3">
          {Array.from({ length: MAX_VISIBLE }).map((_, i) => (
            <div key={i} className="h-12 w-16 animate-pulse rounded-md bg-muted" aria-hidden />
          ))}
        </div>
      ) : isError || allPayments.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('paymentUnavailable')}</p>
      ) : (
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {visiblePayments.map((payment) => (
            <span
              key={payment.id}
              className="flex h-12 min-w-16 items-center justify-center rounded-md bg-white px-2 shadow-sm ring-1 ring-border transition-transform duration-200 hover:scale-105 motion-reduce:transition-none"
            >
              <Image
                src={payment.icon_url}
                alt={payment.name}
                width={48}
                height={48}
                unoptimized
                className="h-8 w-auto max-w-20 object-contain"
              />
            </span>
          ))}

          {remaining > 0 && (
            <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {t('paymentMore', { count: remaining })}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
