'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useGetPaymentMethod } from '../../hooks/usePaymentMethod'

function getValidImageSrc(src?: string | null) {
  const normalized = src?.trim()
  return normalized ? normalized : null
}

export default function SecurePayment() {
  const t = useTranslations('Footer')
  const { data: dataPaymentMethods, isLoading } = useGetPaymentMethod()

  const categories = dataPaymentMethods?.data ?? []
  const allPayments = categories.flatMap((category) => category.payment_method ?? [])

  return (
    <div className="flex w-full flex-col gap-3">
      <h3 className="text-sm font-semibold tracking-wide text-foreground sm:text-base">{t('securePayment')}</h3>

      {isLoading ? (
        <div className="flex min-h-[3.25rem] flex-wrap items-center gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-11 w-12 animate-pulse rounded-md bg-muted"
              aria-hidden
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {allPayments.slice(0, 6).map((payment) => {
            const iconSrc = getValidImageSrc(payment.icon_url)
            if (!iconSrc) return null
            return (
              <Image
                key={payment.id}
                src={iconSrc}
                alt={payment.name}
                width={48}
                height={48}
                unoptimized
                className="h-10 w-auto max-h-12 object-contain transition-transform duration-200 hover:scale-105 sm:h-12"
              />
            )
          })}

          <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            {t('paymentMore')}
          </span>
        </div>
      )}
    </div>
  )
}
