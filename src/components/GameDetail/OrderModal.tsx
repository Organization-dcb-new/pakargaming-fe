'use client'
import { X, CheckCircle2, Clock } from 'lucide-react'
import { Price } from '../../types/Game'
import { PaymentMethod } from '../../types/PaymentMethod'
import { useEffect, useState } from 'react'

interface OrderDetailModalProps {
  open: boolean
  onClose: () => void
  packageData: Price
  payment: PaymentMethod
  email: string
  formatPrice: (price: number) => string
  onConfirm: () => void
  isPendingCreateTrx: boolean
}

export default function OrderDetailModal({
  open,
  onClose,
  packageData,
  payment,
  email,
  formatPrice,
  onConfirm,
  isPendingCreateTrx,
}: OrderDetailModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
    } else {
      setMounted(false)
    }
  }, [open])

  if (!open && !mounted) return null

  return (
    <div
      className={`
        fixed inset-0 z-[999] flex items-center justify-center
        transition-opacity duration-300 ease-out
        ${mounted ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {/* Overlay */}
      <div
        className={`
          absolute inset-0 bg-black/50
          transition-opacity duration-300 ease-out
          ${mounted ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`
          relative w-full max-w-md rounded-3xl
          bg-white dark:bg-zinc-900 shadow-2xl p-6
          transform transition-all duration-300 ease-out
          ${mounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Konfirmasi Pesanan</h2>
          <button onClick={onClose} className="cursor-pointer">
            <X className="w-5 h-5 text-gray-500 hover:text-gray-950 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Paket</span>
            <span className="font-medium text-gray-900 dark:text-white">{packageData.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Pembayaran</span>
            <span className="font-medium text-gray-900 dark:text-white">{payment.full_name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-900 dark:text-white truncate">
              {email || '-'}
            </span>
          </div>

          <hr className="border-gray-200 dark:border-white/10" />

          <div className="flex justify-between text-base">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-purple-600">
              Rp. {formatPrice(packageData.selling_price)}
            </span>
          </div>
        </div>

        {/* Action */}
        <button
          type="button"
          onClick={onConfirm}
          disabled={isPendingCreateTrx}
          className={`
    mt-6 w-full flex items-center justify-center gap-2
    rounded-full
    bg-gradient-to-r from-pink-500 to-purple-600
    hover:from-pink-600 hover:to-purple-700
    active:scale-95
    text-white font-semibold py-3
    transition-all duration-200
    ${isPendingCreateTrx ? 'opacity-70 cursor-not-allowed active:scale-100' : 'cursor-pointer'}
  `}
        >
          {isPendingCreateTrx ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Konfirmasi & Bayar
            </>
          )}
        </button>
      </div>
    </div>
  )
}
