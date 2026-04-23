import Image from 'next/image'
import { useGetPaymentMethod } from '../../hooks/usePaymentMethod'

function getValidImageSrc(src?: string | null) {
  const normalized = src?.trim()
  return normalized ? normalized : null
}

export default function SecurePayment() {
  const { data: dataPaymentMethods } = useGetPaymentMethod()

  const categories = dataPaymentMethods?.data ?? []
  const allPayments = categories.flatMap((category) => category.payment_method ?? [])

  return (
    <div className="w-full flex flex-1 flex-col gap-2">
      <h3 className="text-md font-semibold text-gray-900 dark:text-white tracking-wide">
        Pembayaran Aman
      </h3>

      {/* Image only */}
      <div className="flex flex-wrap gap-3 items-center">
        {allPayments.slice(0, 6).map((payment) => {
          const iconSrc = getValidImageSrc(payment.icon_url)
          if (!iconSrc) return null
          return (
            <Image
              key={payment.id}
              src={iconSrc}
              alt={payment.name}
              width={48}
              height={47}
              unoptimized={true}
              className="object-contain transition-transform duration-200 hover:scale-105"
            />
          )
        })}

        <p className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-medium">
          +10 lainnya
        </p>
      </div>
    </div>
  );
}
