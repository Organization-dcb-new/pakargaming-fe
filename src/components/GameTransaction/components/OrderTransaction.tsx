'use client'
import { ShoppingCart } from 'lucide-react'
import { Price } from '../../../types/Game'
import { PaymentMethod } from '../../../types/PaymentMethod'
import { formatPrice } from '../../../utils/format_price'

interface OrderProps {
  Product: Price
  Payment: PaymentMethod
  setOpenModal: (v: boolean) => void
}

export default function OrderSummary({ Payment, Product, setOpenModal }: OrderProps) {
  return (
    <div className=" hidden xl:block sticky top-24 mt-5">
      <div className="bg-black/5  xl:w-100  dark:bg-white/10 rounded-3xl p-4 sm:p-6 border border-purple-500/30 shadow-xl">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          Ringkasan Pesanan :
        </h2>

        {/* Info */}
        <div className="space-y-3 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm dark:text-purple-200">Paket : </span>
            <span className="font-medium text-gray-900 dark:text-white text-right">
              {Product?.name}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-purple-200">Pembayaran : </span>
            <span className="font-medium text-gray-900 dark:text-white text-right">
              {Payment?.full_name}
            </span>
          </div>

          <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-white/10">
            <span className="font-semibold">Total : </span>
            <span className=" text-xl font-bold text-green-500 dark:text-green-400">
              {Product?.selling_price && (
                <p className="sm:text-sm font-semibold text-purple-600 dark:text-purple-400">
                  Rp {formatPrice(Product?.selling_price)}
                </p>
              )}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            setOpenModal(true)
          }}
          className="
    w-full
    bg-gradient-to-r from-pink-500 to-purple-600
    text-white font-semibold
    py-3
    rounded-full
    transition-all duration-300
    cursor-pointer
    flex items-center justify-center gap-2
    text-sm
    hover:shadow-lg
    hover:shadow-purple-500/30
    hover:scale-[1.03]
    active:scale-[0.97]
    disabled:opacity-60
    disabled:cursor-not-allowed
  "
        >
          <ShoppingCart className="w-4 h-4" />
          Beli
        </button>
      </div>
    </div>
  )
}
