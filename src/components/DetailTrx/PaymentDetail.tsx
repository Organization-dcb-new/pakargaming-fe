import Image from 'next/image'
import { PaymentDataWithDetailProduct } from '../../types/Transaction'
import { Check, Clock, X } from 'lucide-react'

type PaymentStatus = 'PAID' | 'FAILED' | 'PENDING'

const paymentStatusStyle = {
  PAID: {
    label: 'PAID',
    icon: <Check size={12} />,
    className:
      'border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-400',
  },
  FAILED: {
    label: 'FAILED',
    icon: <X size={12} />,
    className:
      'border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 dark:border-red-400',
  },
  PENDING: {
    label: 'PENDING',
    icon: <Clock size={12} />,
    className:
      'border-orange-400 text-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-400',
  },
}

interface PaymentDetailCardProps {
  data: PaymentDataWithDetailProduct
}

export default function PaymentDetailCard({ data }: PaymentDetailCardProps) {
  const status = (data?.status || 'PENDING') as PaymentStatus
  const statusUI = paymentStatusStyle[status]

  return (
    <div className="w-full max-w-3xl">
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-purple-500/30 dark:bg-white/5 px-4 py-4 shadow-sm">
        {/* Title */}
        <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
          Detail Pembayaran
        </h2>

        {/* Status & Method */}
        <div className="mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Status pembayaran</span>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusUI.className}`}
            >
              {statusUI.icon}
              {statusUI.label}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Metode pembayaran</span>
            <div className="flex items-center gap-2">
              <Image
                src={
                  data?.detail_product?.payment_image ||
                  'https://api.dicebear.com/9.x/pixel-art/svg'
                }
                alt="Logo Payment"
                width={40}
                height={18}
                className="object-contain"
              />
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {data?.detail_product.payment_name}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-3 h-px bg-gray-100 dark:bg-gray-700" />

        {/* Amount */}
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Total transaksi</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Rp {data?.amount?.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Total pembayaran</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              Rp {data?.amount?.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
