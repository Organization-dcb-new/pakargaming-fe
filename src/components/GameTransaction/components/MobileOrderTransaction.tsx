'use client'
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

export default function MobileOrderBar({ Product, handleConfirm, Payment }: OrderMobileProps) {
  const t = useTranslations('GameCheckout')
  const totalPrice = calculateTotalPrice(Payment, Product)
  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 ">
      {/* blur background */}
      <div className="backdrop-blur-md  bg-white/80 dark:bg-black/70 border-t border-purple-500/30 shadow-2xl px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 ">
          {/* Harga */}
          <div className="flex flex-row justify-between  w-full sm:max-w-100 ">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-purple-200">{t('mobileTotal')}</span>
              <span className="text-lg font-bold text-green-500 dark:text-green-400">
                Rp {totalPrice}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-purple-200">{t('mobilePayment')}</span>
              <span className="text-lg font-bold text-purple-500 dark:text-green-400">
                {Payment?.full_name}
              </span>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={() => {
              handleConfirm()
            }}
            className="
            cursor-pointer
            w-full
              flex-1
               sm:max-w-40
              bg-gradient-to-r from-pink-500 to-purple-600
              text-white font-semibold
              py-3
              rounded-full
              transition-all duration-300
              flex items-center justify-center gap-2
              text-sm
              hover:shadow-lg
              hover:shadow-purple-500/30
              active:scale-[0.97]
            "
          >
            <ShoppingCart className="w-4 h-4" />
            {t('mobileBuyNow')}
          </button>
        </div>
      </div>
    </div>
  )
}
