'use client'
import { useLayoutEffect, useRef } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Price } from '../../../types/Game'
import { PaymentMethod } from '../../../types/PaymentMethod'
import { calculateTotalPrice } from './PaymentMethod'

interface OrderMobileProps {
  handleConfirm: () => void
  Product: Price
  Payment: PaymentMethod
}

const ORDER_BAR_CSS_VAR = '--mobile-order-bar-height'

export default function MobileOrderBar({ Product, handleConfirm, Payment }: OrderMobileProps) {
  const t = useTranslations('GameCheckout')
  const totalPrice = calculateTotalPrice(Payment, Product)
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = document.documentElement
    const el = rootRef.current
    if (!el) return

    const publish = () => {
      root.style.setProperty(ORDER_BAR_CSS_VAR, `${el.offsetHeight}px`)
    }
    publish()
    const ro = new ResizeObserver(publish)
    ro.observe(el)
    return () => {
      ro.disconnect()
      root.style.removeProperty(ORDER_BAR_CSS_VAR)
    }
  }, [Product, Payment])

  return (
    <div
      ref={rootRef}
      id="mobile-order-bar"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-2xl backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto flex max-w-3xl items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-xs text-muted-foreground">
            {Payment?.full_name || Product?.name || t('mobileTotal')}
          </span>
          <span className="font-display text-xl font-bold text-primary">
            {totalPrice !== null ? `Rp ${totalPrice}` : '—'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            handleConfirm()
          }}
          className="chamfer flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors duration-200 hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          <ShoppingCart className="h-4 w-4" aria-hidden />
          {t('mobileBuyNow')}
        </button>
      </div>
    </div>
  )
}
