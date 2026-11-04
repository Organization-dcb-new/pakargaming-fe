'use client'

import { Check, ChevronDown } from 'lucide-react'
import { GetPaymentMethodResponse, PaymentMethod } from '../../../types/PaymentMethod'
import Image from 'next/image'
import { Price } from '../../../types/Game'
import { formatPrice } from '../../../utils/format_price'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import StepCard from './StepCard'

interface PaymentMethodProps {
  PaymentMethod: GetPaymentMethodResponse
  activePayment: PaymentMethod | null
  step?: number
  setSelectedPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod | null>>
  ActiveProduct: Price
  selectedPackage: Price | null
  isLocked?: boolean
  onLockedAction?: () => void
}

export const calculateTotalPrice = (payment: PaymentMethod, ActiveProduct: Price) => {
  if (!ActiveProduct) return null

  const base = ActiveProduct?.selling_price || 0
  const code = payment?.code || ''
  const useFixedFee =
    code.startsWith('va') ||
    ['alfamart_otc', 'indomaret_otc'].includes(code)
  const fee = useFixedFee
    ? payment?.fee_fixed || 0
    : base * (payment?.fee_percentage / 100) || 0
  const total = base + fee
  return formatPrice(Math.round(total))
}

function getValidImageSrc(src?: string | null) {
  const normalized = src?.trim()
  return normalized ? normalized : null
}

export default function PaymentMethodTransactionComponent({
  PaymentMethod,
  activePayment,
  step,
  ActiveProduct,
  setSelectedPaymentMethod,
  selectedPackage,
  isLocked = false,
  onLockedAction,
}: PaymentMethodProps) {
  const t = useTranslations('GameCheckout')
  const [activeIndexes, setActiveIndexes] = useState<number[]>([0])

  const scrollToPayment = () => {
    const el = document.getElementById('payment-method-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    if (selectedPackage) {
      scrollToPayment()
    }
  }, [selectedPackage])

  const categories = PaymentMethod?.data ?? []

  const toggle = (index: number) => {
    setActiveIndexes(
      (prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index) 
          : [...prev, index] 
    )
  }

  return (
    <StepCard
      id="payment-method-section"
      step={step ?? 3}
      title={t('selectPayment')}
      locked={isLocked}
      lockedLabel={t('stepLocked')}
    >
      <div className="space-y-3">
        {categories.map((category, index) => {
          const isOpen = activeIndexes.includes(index)
          const panelId = `payment-category-${category.id}`

          return (
            <div key={category.id} className="overflow-hidden rounded-xl border border-border">
              {/* HEADER */}
              <button
                type="button"
                onClick={() => {
                  if (isLocked) {
                    onLockedAction?.()
                    return
                  }
                  toggle(index)
                }}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring motion-reduce:transition-none"
              >
                <span className="flex-1 font-semibold text-foreground">{category.name}</span>

                {/* ICON LIST — logo pihak ketiga di atas plat putih supaya terbaca di dark */}
                <span className="hidden items-center gap-1.5 sm:flex">
                  {category.payment_method?.slice(0, 4).map((payment) => {
                    const iconSrc = getValidImageSrc(payment.icon_url)
                    return iconSrc ? (
                      <span
                        key={payment.id}
                        className="flex h-6 w-9 items-center justify-center rounded bg-white px-1"
                      >
                        <Image
                          src={iconSrc}
                          alt=""
                          width={32}
                          height={20}
                          unoptimized={true}
                          className="max-h-4 w-auto object-contain"
                        />
                      </span>
                    ) : null
                  })}
                </span>

                <ChevronDown
                  aria-hidden
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 motion-reduce:transition-none ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* COLLAPSE CONTENT */}
              <div
                id={panelId}
                className={`overflow-hidden transition-all duration-300 ease-in-out motion-reduce:transition-none ${
                  isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="flex flex-col gap-2 px-3 pb-3">
                  {category.payment_method?.map((payment) => {
                    const isSelected = activePayment?.id === payment.id
                    const isDisabled = !payment.is_active
                    const totalPrice = calculateTotalPrice(payment, ActiveProduct)
                    const iconSrc = getValidImageSrc(payment.icon_url)

                    return (
                      <button
                        key={payment.id}
                        type="button"
                        tabIndex={isOpen ? undefined : -1}
                        onClick={() => {
                          if (isLocked) {
                            onLockedAction?.()
                            return
                          }
                          if (!isDisabled) setSelectedPaymentMethod(payment)
                        }}
                        aria-pressed={isSelected}
                        aria-disabled={isDisabled}
                        className={`flex min-h-14 w-full items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-[border-color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none ${
                          isDisabled
                            ? 'cursor-not-allowed border-border bg-muted opacity-50'
                            : isSelected
                              ? 'cursor-pointer border-primary bg-primary/10'
                              : 'cursor-pointer border-border bg-input-background hover:border-primary/60'
                        }`}
                      >
                        <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded-md bg-white px-1.5 shadow-sm">
                          {iconSrc ? (
                            <Image
                              src={iconSrc}
                              alt=""
                              width={48}
                              height={28}
                              unoptimized={true}
                              className="max-h-6 w-auto object-contain"
                            />
                          ) : null}
                        </span>

                        <span className="line-clamp-2 flex-1 text-sm font-semibold leading-snug text-foreground">
                          {payment.full_name}
                        </span>

                        {ActiveProduct?.selling_price && (
                          <span
                            className={`shrink-0 whitespace-nowrap font-display text-sm font-semibold ${
                              isSelected ? 'text-primary' : 'text-foreground'
                            }`}
                          >
                            Rp {totalPrice}
                          </span>
                        )}

                        {isSelected && !isDisabled && (
                          <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={3} aria-hidden />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </StepCard>
  )
}
