'use client'
import { useEffect, useState } from 'react'
import { Price } from '../../../types/Game'
import { PaymentMethod } from '../../../types/PaymentMethod'
import { formatPrice } from '../../../utils/format_price'
import { calculateTotalPrice } from './PaymentMethod'

interface ConfirmModalProps {
  loading?: boolean
  onConfirm: () => void
  Product: Price
  Payment: PaymentMethod
  setOpen: (value: boolean) => void
  open: boolean
}

export default function ConfirmModal({
  loading = false,
  onConfirm,
  setOpen,
  open,
  Product,
  Payment,
}: ConfirmModalProps) {
  const [visible, setVisible] = useState(false)
  const finalPrice = calculateTotalPrice(Payment, Product)

  useEffect(() => {
    if (open) {
      setVisible(true)
    } else {
      const t = setTimeout(() => setVisible(false), 200)
      return () => clearTimeout(t)
    }
  }, [open])

  if (!visible) return null

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4
        transition-all duration-200
        ${open ? 'bg-black/50' : 'bg-black/0'}
      `}
    >
      {/* backdrop */}
      <div className="absolute inset-0" onClick={loading ? undefined : () => setOpen(false)} />

      {/* modal */}
      <div
        className={`
          relative w-full max-w-md bg-white p-6 shadow-2xl
          rounded-t-3xl sm:rounded-2xl
          transform transition-all duration-200 ease-out
          ${open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}
        `}
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">Konfirmasi Pembayaran</h2>
          <p className="mt-1 text-sm text-gray-500">Periksa kembali pesanan sebelum melanjutkan.</p>
        </div>

        {/* Detail */}
        <div className="mt-5 rounded-2xl border border-purple-100 bg-purple-50/50 p-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Produk</span>
            <span className="font-medium text-gray-900 text-right">{Product?.name || '-'}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Pembayaran</span>
            <span className="font-medium text-gray-900 text-right">
              {Payment?.full_name || '-'}
            </span>
          </div>

          <div className="flex justify-between border-t border-purple-200 pt-2">
            <span className="font-medium text-gray-700">Total</span>
            <span className="font-bold text-green-600">Rp {finalPrice}</span>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={onConfirm}
          disabled={loading}
          className="
            mt-6 w-full rounded-xl
            bg-gradient-to-r from-pink-500 to-purple-600
            py-3 text-sm font-semibold text-white
            shadow-md transition
            hover:shadow-purple-500/30
            active:scale-[0.98]
            disabled:opacity-50
            cursor-pointer
          "
        >
          {loading ? 'Memproses...' : 'Lanjutkan Pembayaran'}
        </button>
      </div>
    </div>
  )
}
