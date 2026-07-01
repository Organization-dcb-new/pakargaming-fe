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
            <div key={i} className="h-11 w-12 animate-pulse rounded-md bg-muted" aria-hidden />
          ))}
        </div>
      ) : isError || allPayments.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('paymentUnavailable')}</p>
      ) : (
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {visiblePayments.map((payment) => (
            <Image
              key={payment.id}
              src={payment.icon_url}
              alt={payment.name}
              width={48}
              height={48}
              unoptimized
              className="h-10 w-auto max-h-12 object-contain transition-transform duration-200 hover:scale-105 sm:h-12"
            />
          ))}

          {remaining > 0 && (
            <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground dark:border-white/10 dark:bg-white/[0.06]">
              {t('paymentMore', { count: remaining })}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
