'use client'
import { useState } from 'react'

interface ConfirmModalProps {
  loading?: boolean
  onConfirm: () => void
}

export default function ConfirmModal({ loading = false, onConfirm }: ConfirmModalProps) {
  const [open, setOpen] = useState(true)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      {/* backdrop */}
      <div className="absolute inset-0" onClick={loading ? undefined : () => setOpen(false)} />

      {/* modal */}
      <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-2xl bg-white p-6 shadow-2xl animate-[fadeIn_.2s_ease-out]">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Konfirmasi Pembayaran</h2>
          <p className="mt-2 text-sm text-gray-500">
            Periksa kembali pesanan sebelum melanjutkan transaksi.
          </p>
        </div>

        <button
          onClick={onConfirm}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-purple-700 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Lanjutkan Pembayaran'}
        </button>
      </div>
    </div>
  )
}
