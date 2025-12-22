'use client'
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
           bg-black/5 dark:bg-white/10
        backdrop-blur-lg
        rounded-3xl
        p-5
        border border-gray-200 dark:border-white/20
        shadow-xl
        mt-6
      "
    >
      {/* Header */}
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Ringkasan Pesanan : </h2>

      {/* Info */}
      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-purple-200">Paket</span>
          <span className="font-medium text-gray-900 dark:text-white text-right">
            {activePackage?.name || '-'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-purple-200">Pembayaran</span>
          <span className="font-medium text-gray-900 dark:text-white text-right">
            {activePayment?.full_name || '-'}
          </span>
        </div>

        <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-white/10">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-purple-600">
            {activePackage ? `Rp. ${formatPrice(activePackage.selling_price)}` : '-'}
          </span>
        </div>
      </div>

      {/* Action */}
      <button
        onClick={onSubmit}
        className="
          w-full
          cursor-pointer
          bg-gradient-to-r from-pink-500 to-purple-600
          hover:from-pink-600 hover:to-purple-700
          text-white font-semibold
          py-3
          rounded-full
          transition-all duration-300
          shadow-md hover:shadow-lg hover:scale-[1.02]
          flex items-center justify-center gap-2
          text-sm
        "
      >
        <ShoppingCart className="w-4 h-4" />
        Beli Sekarang
      </button>
    </div>
  )
}
