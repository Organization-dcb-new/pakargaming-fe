import { Check, X, Clock, Copy } from 'lucide-react'
import { PaymentDataWithDetailProduct } from '../../types/Transaction'
import Link from 'next/link'
import { useState } from 'react'

interface TransactionStatusCardProps {
  data: PaymentDataWithDetailProduct
}

export default function TransactionStatusCard({ data }: TransactionStatusCardProps) {
  const statusConfig = {
    PAID: {
      label: 'Berhasil',
      icon: <Check size={24} />,
      bg: 'bg-green-100 dark:bg-green-900',
      text: 'text-green-700 dark:text-green-400',
    },
    FAILED: {
      label: 'Gagal',
      icon: <X size={24} />,
      bg: 'bg-red-100 dark:bg-red-900',
      text: 'text-red-700 dark:text-red-400',
    },
    PENDING: {
      label: 'Pending',
      icon: <Clock size={24} />,
      bg: 'bg-yellow-100 dark:bg-yellow-900',
      text: 'text-yellow-700 dark:text-yellow-400',
    },
  }

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!data.va_number) return

    await navigator.clipboard.writeText(data.va_number)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const cfg = statusConfig[data.status] || statusConfig.PENDING

  const paymentChannel = data.payment_channel?.toLowerCase()
  const isWallet =
    paymentChannel === 'shopeepay' ||
    paymentChannel === 'gopay' ||
    paymentChannel === 'dana' ||
    paymentChannel === 'ovo' ||
    paymentChannel === 'smartfren_airtime' ||
    paymentChannel === 'va_mandiri' ||
    paymentChannel === 'va_bca'
  const isQRIS = !!(data.qr_code_url || data.qr_string)
  const isVA = paymentChannel?.includes('va')

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-gray-200 dark:border-purple-500/30 dark:bg-white/5 bg-white   px-6 py-8 shadow-sm flex flex-col items-center space-y-4">
        {/* Status Icon */}
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full ${cfg.bg} ${cfg.text}`}
        >
          {cfg.icon}
        </div>

        {/* Status Label */}
        <h2 className={`text-lg font-semibold ${cfg.text}`}>{cfg.label}</h2>

        {/* Status Message */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          {data.status === 'PAID'
            ? 'Transaksi berhasil.'
            : data.status === 'FAILED'
              ? 'Transaksi gagal.'
              : 'Transaksi sedang menunggu pembayaran.'}
        </p>

        {isVA && data.va_number && (
          <div className="w-full mt-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 text-center">
              Nomor Virtual Account
            </p>

            <div className="flex items-center justify-between rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800 px-4 py-3">
              <span className="text-sm font-mono tracking-wide text-gray-800 dark:text-white">
                {data.va_number}
              </span>

              <button
                onClick={handleCopy}
                className="flex  cursor-pointer items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700 transition"
              >
                {copied ? (
                  <>
                    <Check size={14} /> Tersalin
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Salin nomor VA ini dan lakukan pembayaran melalui ATM / m-banking
            </p>
          </div>
        )}

        {/* Payment Action */}
        {data.status === 'PENDING' && (
          <>
            {isWallet && data.payment_url ? (
              <>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 text-center">
                  {paymentChannel === 'ovo'
                    ? 'Bayar lewat aplikasi OVO'
                    : `Bayar menggunakan ${data.payment_channel}`}
                </p>

                <a
                  href={data.payment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    mt-4 w-full rounded-2xl
                    bg-gradient-to-r from-pink-500 to-purple-600
                    py-3 text-sm font-semibold text-white
                    shadow-md hover:shadow-lg
                    hover:from-pink-600 hover:to-purple-700
                    active:scale-95
                    transition-all duration-200
                    flex justify-center items-center
                  "
                >
                  Lanjutkan Pembayaran
                </a>
              </>
            ) : isQRIS ? (
              <>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 text-center">
                  Bayar menggunakan {data.payment_channel}
                </p>

                <img
                  src={data.qr_code_url || data.qr_string}
                  alt="QR Code"
                  className="h-40 w-40 object-contain rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm"
                />

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Scan QR code ini menggunakan aplikasi {data.payment_channel} untuk menyelesaikan
                  pembayaran
                </p>

                <a
                  href={data.qr_code_url || data.qr_string}
                  download={`QR-${data.payment_channel}.png`}
                  className="
                    mt-2 w-full inline-flex justify-center items-center
                    rounded-2xl
                    bg-gradient-to-r from-purple-500 to-pink-500
                    py-2 text-sm font-semibold text-white
                    shadow-md hover:shadow-lg
                    hover:from-purple-600 hover:to-pink-600
                    active:scale-95
                    transition-all duration-200
                  "
                >
                  Download QR
                </a>
              </>
            ) : null}
          </>
        )}

        {data.status === 'FAILED' && (
          <Link
            href={`/en/games/${data.detail_product?.game_slug}`}
            className="
              mt-4 w-full inline-flex justify-center items-center
              rounded-2xl
              bg-gradient-to-r from-red-500 to-red-700
              py-3 text-sm font-semibold text-white
              shadow-md hover:shadow-lg
              hover:from-red-600 hover:to-red-800
              active:scale-95
              transition-all duration-200
            "
          >
            Ulangi Transaksi
          </Link>
        )}

        {data.status === 'PAID' && (
          <Link
            href={`/en/games/${data.detail_product?.game_slug}`}
            className="
              mt-4 w-full inline-flex justify-center items-center
              rounded-2xl
              bg-gradient-to-r from-blue-500 to-blue-700
              py-3 text-sm font-semibold text-white
              shadow-md hover:shadow-lg
              hover:from-blue-600 hover:to-blue-800
              active:scale-95
              transition-all duration-200
            "
          >
            Beli lagi
          </Link>
        )}
      </div>
    </div>
  )
}
