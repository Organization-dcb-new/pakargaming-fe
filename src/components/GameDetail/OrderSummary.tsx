import { ShoppingCart } from 'lucide-react'
import { Price } from '../../types/Game'
import { PaymentMethod } from '../../types/PaymentMethod'

interface OrderSummaryProps {
  activePackage: Price | null
  activePayment: PaymentMethod | null
  formatPrice: (price: number) => string
  onSubmit: () => void
}

export default function OrderSummary({
  activePackage,
  activePayment,
  formatPrice,
  onSubmit,
}: OrderSummaryProps) {
  if (!activePackage && !activePayment) return null

  return (
    <div
      className="
    fixed bottom-0 left-0 right-0 z-50
    bg-white/80 dark:bg-white/10
    backdrop-blur-lg
    border-t border-gray-200 dark:border-white/20
    shadow-2xl
  "
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Order Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-gray-500 dark:text-purple-200 text-xs whitespace-nowrap">
                Paket:
              </span>
              <span className="text-gray-900 dark:text-white font-medium text-xs truncate">
                {activePackage?.name || '-'}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <span className="text-gray-500 dark:text-purple-200 text-xs whitespace-nowrap">
                Pembayaran:
              </span>
              <span className="text-gray-900 dark:text-white font-medium text-xs truncate">
                {activePayment?.full_name || '-'}
              </span>
            </div>
          </div>

          {/* Total & Button */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-gray-500 dark:text-purple-200 text-[10px]">Total</p>
              <p className="text-gray-900 dark:text-white font-bold text-sm">
                {activePackage ? `Rp. ${formatPrice(activePackage.selling_price)}` : '-'}
              </p>
            </div>

            <button
              onClick={onSubmit}
              className="
            cursor-pointer
            bg-gradient-to-r from-pink-500 to-purple-600
            hover:from-pink-600 hover:to-purple-700
            text-white font-semibold
            py-2 px-4 sm:px-6
            rounded-full
            transition-all duration-300
            shadow-md hover:shadow-lg hover:scale-[1.02]
            flex items-center justify-center gap-2
            text-xs sm:text-sm whitespace-nowrap
          "
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Beli Sekarang</span>
              <span className="sm:hidden">Beli</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
