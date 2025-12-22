'use client'

import { useParams } from 'next/navigation'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { formatPrice } from '../../../../utils/format_price'
import { useGetTransaction } from '../../../../hooks/useTransaction'
import { TransactionNotFound } from '../../../../components/Transaction/TransactionNotFound'

type Status = 'PENDING' | 'SUCCESS' | 'FAILED'

export default function TransactionStatusPage() {
  const { order_id } = useParams<{ order_id: string }>()
  const { data: transaction, isLoading } = useGetTransaction(order_id)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Clock className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!transaction?.data) {
    return <TransactionNotFound />
  }

  const data = transaction.data
  const status = data.status as Status

  const isPending = status === 'PENDING'
  const isQRIS = data.payment_channel === 'qris'

  const statusConfig: Record<Status, StatusConfig> = {
    PENDING: {
      icon: <Clock className="w-14 h-14 text-yellow-400 animate-pulse" />,
      title: 'Menunggu Pembayaran',
      desc: 'Selesaikan pembayaran sesuai metode yang dipilih',
      button: 'Cek Status Pembayaran',
      btnClass:
        'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700',
    },
    SUCCESS: {
      icon: <CheckCircle2 className="w-14 h-14 text-emerald-500" />,
      title: 'Pembayaran Berhasil',
      desc: 'Top up berhasil dan item sudah masuk ke akun kamu',
      button: 'Kembali ke Beranda',
      btnClass: `
    bg-emerald-500/10 text-emerald-600
    hover:bg-emerald-500 hover:text-white
    border border-emerald-500/30
  `,
    },
    FAILED: {
      icon: <XCircle className="w-14 h-14 text-rose-500" />,
      title: 'Pembayaran Gagal',
      desc: 'Transaksi gagal atau telah kedaluwarsa',
      button: 'Ulangi Transaksi',
      btnClass: `
    bg-rose-500/10 text-rose-600
    hover:bg-rose-500 hover:text-white
    border border-rose-500/30
  `,
    },
  }

  const config = statusConfig[status]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/40 dark:via-purple-900/40 to-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-fadeInUp">
        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-xl space-y-6">
          {/* STATUS */}
          <StatusHeader {...config} />

          {/* DETAIL */}
          <div className="space-y-3 text-sm">
            <Row label="Order ID" value={data.order_id} />
            <Row label="Payment No" value={data.payment_number} />
            <Row label="Metode" value={data.payment_channel?.toUpperCase()} />

            {isPending && !isQRIS && data.payment_url && (
              <LinkRow label="Pembayaran" value={data.payment_url} />
            )}

            {isPending && isQRIS && data.qr_code_url && <QRCodeSection qr={data.qr_code_url} />}

            <TotalRow amount={data.amount} />
          </div>

          {/* ACTION */}
          <button
            className={`w-full rounded-full cursor-pointer py-3 font-semibold transition active:scale-95 ${config.btnClass}`}
          >
            {config.button}
          </button>
        </div>
      </div>
    </div>
  )
}

function StatusHeader({ icon, title, desc }: StatusConfig) {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      {icon}
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
    </div>
  )
}

function LinkRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 items-center">
      <span className="text-gray-500">{label}</span>
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="
          px-4 py-1.5
          text-sm font-semibold
          rounded-full
          bg-gradient-to-r from-pink-500 to-purple-600
          text-white
          hover:from-pink-600 hover:to-purple-700
          transition-all
          shadow-sm hover:shadow-md
          active:scale-95
        "
      >
        Buka Pembayaran
      </a>
    </div>
  )
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null

  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900 dark:text-white text-right truncate">{value}</span>
    </div>
  )
}

function QRCodeSection({ qr }: { qr: string }) {
  return (
    <div className="flex flex-col items-center gap-3 pt-2">
      <img src={qr} alt="QRIS" className="w-56 h-56 rounded-xl border shadow" />
      <p className="text-xs text-gray-500 text-center">
        Scan QR menggunakan aplikasi e-wallet kamu
      </p>
    </div>
  )
}
function TotalRow({ amount }: { amount: number }) {
  return (
    <div className="pt-3 mt-2 border-t border-gray-200 dark:border-white/10 flex justify-between items-center">
      <span className="font-semibold">Total</span>
      <span className="font-bold text-purple-600 text-lg">Rp. {formatPrice(amount)}</span>
    </div>
  )
}

interface StatusConfig {
  icon: JSX.Element
  title: string
  desc: string
  button: string
  btnClass: string
}
