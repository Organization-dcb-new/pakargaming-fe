'use client'

import { Check, ChevronDown } from 'lucide-react'
import { GetPaymentMethodResponse, PaymentMethod } from '@/types/paymentMethod'
import Image from 'next/image'
import { Price } from '@/types/game'
import { formatPrice } from '@/lib/formatPrice'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import StepCard from './StepCard'
import { canOptimize } from '@/lib/image'
import { paymentTotal } from '@/features/game-topup/lib/paymentTotal'

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

/** Total yang dibayar dengan metode ini, sudah diformat; biaya mengikuti aturan checkout dari backend. */
export const calculateTotalPrice = (payment: PaymentMethod, ActiveProduct: Price) => {
  if (!ActiveProduct || !payment) return null
  return formatPrice(paymentTotal(payment, ActiveProduct.selling_price || 0))
}

function getValidImageSrc(src?: string | null) {
  const normalized = src?.trim()
  return normalized ? normalized : null
}

export default function PaymentMethodList({
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
      <div className="space-y-4">
        {categories.map((category, index) => {
          const isOpen = activeIndexes.includes(index)
          const panelId = `payment-category-${index}`

          return (
            <div key={`${index}-${category.name}`}>
              {/* HEADER KATEGORI — strip chamfer, tanpa kotak bergaris supaya tidak ada garis dobel dengan kartu metode */}
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
                className="chamfer flex min-h-11 w-full cursor-pointer items-center gap-3 bg-input-background px-4 py-2.5 text-left transition-colors duration-200 [--chamfer:10px] hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
              >
                <span aria-hidden className="h-4 w-1 shrink-0 -skew-x-12 bg-gradient-brand" />
                <span className="flex-1 font-display text-sm font-bold uppercase tracking-wider text-foreground">
                  {category.name}
                </span>

                {/* Logo pihak ketiga di atas plat putih supaya terbaca di dark (rules §2.3) */}
                {!isOpen && (
                  <span className="hidden items-center gap-1.5 sm:flex">
                    {category.methods?.slice(0, 4).map((payment) => {
                      const iconSrc = getValidImageSrc(payment.icon_url)
                      return iconSrc ? (
                        <span
                          key={payment.id}
                          className="flex h-6 w-9 items-center justify-center rounded-sm bg-white px-1"
                        >
                          <Image
                            src={iconSrc}
                            alt=""
                            width={32}
                            height={20}
                            unoptimized={!canOptimize(iconSrc)}
                            className="max-h-4 w-auto object-contain"
                          />
                        </span>
                      ) : null
                    })}
                  </span>
                )}

                <ChevronDown
                  aria-hidden
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 motion-reduce:transition-none ${
                    isOpen ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>

              {/* DAFTAR METODE */}
              <div
                id={panelId}
                className={`overflow-hidden transition-all duration-300 ease-in-out motion-reduce:transition-none ${
                  isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="flex flex-col gap-2 pt-2">
                  {category.methods?.map((payment) => (
                    <PaymentMethodCard
                      key={payment.id}
                      payment={payment}
                      selected={activePayment?.id === payment.id}
                      focusable={isOpen}
                      totalPrice={ActiveProduct?.selling_price ? calculateTotalPrice(payment, ActiveProduct) : null}
                      onSelect={() => {
                        if (isLocked) {
                          onLockedAction?.()
                          return
                        }
                        if (payment.available) setSelectedPaymentMethod(payment)
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </StepCard>
  )
}

/** Singkatan untuk plat logo saat metode tidak punya ikon: satu kata → 4 huruf awal ("QRIS"), lebih → inisial ("BVA"). */
function paymentInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length <= 1) return (words[0] ?? '').slice(0, 4).toUpperCase()
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

interface PaymentMethodCardProps {
  payment: PaymentMethod
  selected: boolean
  /** false saat kategorinya tertutup — keluar dari urutan Tab */
  focusable: boolean
  totalPrice: string | null
  onSelect: () => void
}

/**
 * Kartu metode bayar — pola sama dengan kartu FAQ: dua lapis chamfer (luar = warna garis, dalam = isi solid).
 * Terpilih = garis cyan + gradient tipis + centang; tidak tersedia = redup + catatan dari backend.
 */
function PaymentMethodCard({ payment, selected, focusable, totalPrice, onSelect }: PaymentMethodCardProps) {
  const isDisabled = !payment.available
  const iconSrc = getValidImageSrc(payment.icon_url)
  const isActive = selected && !isDisabled

  return (
    <button
      type="button"
      tabIndex={focusable ? undefined : -1}
      onClick={onSelect}
      aria-pressed={isActive}
      aria-disabled={isDisabled}
      className={`chamfer block w-full p-px text-left transition-colors duration-200 [--chamfer:10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card motion-reduce:transition-none ${
        isDisabled
          ? 'cursor-not-allowed bg-border opacity-50'
          : isActive
            ? 'cursor-pointer bg-primary'
            : 'cursor-pointer bg-border hover:bg-primary/60'
      }`}
    >
      <span
        className={`chamfer flex min-h-14 items-center gap-3 bg-input-background px-3 py-2.5 [--chamfer:9.6px] ${
          isActive ? 'bg-linear-to-r from-primary/15 to-transparent to-70%' : ''
        }`}
      >
        {iconSrc ? (
          <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded-sm bg-white px-1.5">
            <Image
              src={iconSrc}
              alt=""
              width={48}
              height={28}
              unoptimized={!canOptimize(iconSrc)}
              className="max-h-6 w-auto object-contain"
            />
          </span>
        ) : (
          <span
            aria-hidden
            className="flex h-9 w-14 shrink-0 items-center justify-center rounded-sm bg-muted font-display text-xs font-bold tracking-wider text-muted-foreground"
          >
            {paymentInitials(payment.name)}
          </span>
        )}

        <span className="line-clamp-2 flex-1 text-sm font-semibold leading-snug text-foreground">{payment.name}</span>

        {isDisabled && payment.disabled_note ? (
          <span className="shrink-0 whitespace-nowrap text-xs font-semibold text-muted-foreground">
            {payment.disabled_note}
          </span>
        ) : totalPrice ? (
          <span
            className={`shrink-0 whitespace-nowrap font-display text-sm font-bold tabular-nums ${
              isActive ? 'text-primary' : 'text-foreground'
            }`}
          >
            Rp {totalPrice}
          </span>
        ) : null}

        {isActive && (
          <span
            aria-hidden
            className="chamfer flex h-5 w-5 shrink-0 items-center justify-center bg-primary text-primary-foreground [--chamfer:4px]"
          >
            <Check className="h-3 w-3" strokeWidth={3.5} />
          </span>
        )}
      </span>
    </button>
  )
}
