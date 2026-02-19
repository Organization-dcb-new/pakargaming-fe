import Image from 'next/image'
import { PaymentDataWithDetailProduct } from '../../types/Transaction'
import { useState } from 'react'
import { Check, Copy, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

type ProductDetailCardProps = {
  data: PaymentDataWithDetailProduct
}

export default function ProductDetailCard({ data }: ProductDetailCardProps) {
  const [showVoucher, setShowVoucher] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!data?.payment_number) return
    await navigator.clipboard.writeText(data?.payment_number)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
    toast.success('Nomor transaksi berhasil disalin')
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-purple-500/30 dark:bg-white/5 px-4 py-4 shadow-sm">
        {/* Title */}
        <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Detail Produk</h2>

        {/* Header product */}
        <div className="mb-4 flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 items-center flex justify-center">
            <Image
              src={data?.detail_product?.item_image || 'https://api.dicebear.com/9.x/pixel-art/svg'}
              alt="Logo Product"
              width={128}
              height={128}
              className="object-contain rounded-md"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <span className="inline-block rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-semibold text-white">
              {data?.detail_product?.category}
            </span>

            <h3 className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
              {data?.detail_product?.item_product}
            </h3>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {data?.detail_product?.item_name}
            </p>
          </div>
        </div>

        {/* Detail list */}
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="grid grid-cols-3 gap-2 items-center">
            <span className="text-gray-500 dark:text-gray-400">Nomor Transaksi</span>
            <div
              onClick={handleCopy}
              className="col-span-2 flex items-center gap-2 font-medium text-gray-900 dark:text-white cursor-pointer group"
            >
              <span className="truncate">{data?.payment_number}</span>
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500 dark:text-gray-400">Produk</span>
            <span className="col-span-2 font-medium text-gray-900 dark:text-white">
              {data?.detail_product?.item_name}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500 dark:text-gray-400">Nominal</span>
            <span className="col-span-2 font-medium text-gray-900 dark:text-white">
              {data?.detail_product?.item_product}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500 dark:text-gray-400">Jumlah</span>
            <span className="col-span-2 font-medium text-gray-900 dark:text-white">
              {data?.detail_product?.item_quantity}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500 dark:text-gray-400">Email</span>
            <span className="col-span-2 font-medium text-gray-900 dark:text-white break-all">
              {data?.detail_product?.email}
            </span>
          </div>

          {data?.detail_product?.voucher_code?.trim() && (
            <div className="grid grid-cols-3 items-center gap-2 rounded-lg bg-green-50 dark:bg-green-900/20 px-3 py-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Voucher</span>
              <span className="col-span-2 flex items-center justify-between gap-2 font-semibold text-green-700 dark:text-green-400">
                <span className="break-all">
                  🎟️ {showVoucher ? data.detail_product.voucher_code : '••••••••••••••'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowVoucher(!showVoucher)}
                  className="text-green-600 dark:text-green-300 cursor-pointer hover:text-green-800 dark:hover:text-green-500"
                >
                  {showVoucher ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
