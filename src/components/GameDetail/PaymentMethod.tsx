import { GetPaymentMethodResponse, PaymentMethod } from '../../types/PaymentMethod'
import Image from 'next/image'

interface PaymentMethodProps {
  PaymentMethod: GetPaymentMethodResponse
  activePayment: PaymentMethod | null
  setSelectedPayment: (pay: PaymentMethod) => void
}

export default function PaymentMethodComponent({
  PaymentMethod,
  activePayment,
  setSelectedPayment,
}: PaymentMethodProps) {
  return (
    <div
      className="
     dark:bg-white/10
    bg-black/5
    backdrop-blur-lg
    rounded-3xl
    p-5 mb-6
    border border-white/20 dark:border-white/20

    shadow-xl
  "
    >
      {/* Header */}
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Pilih Pembayaran</h2>

      {/* Payment Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {PaymentMethod.data.map((payment) => {
          const isSelected = activePayment?.id === payment.id

          return (
            <div
              key={payment.id}
              onClick={() => setSelectedPayment(payment)}
              className={`
            cursor-pointer rounded-2xl p-3 transition-all duration-300
            flex flex-col items-center justify-between gap-2
            min-h-[110px]
            ${
              isSelected
                ? 'bg-gradient-to-br from-blue-500 to-cyan-500 border border-white shadow-md scale-[1.02] '
                : 'bg-white/80 dark:bg-white/20 border border-gray-300 dark:border-white/30 hover:bg-white dark:hover:bg-white/30 hover:scale-[1.01]'
            }
          `}
            >
              {/* Icon */}
              {/* Icon */}
              <div
                className={`
    flex items-center justify-center h-12 w-12 rounded-xl transition-all
    ${isSelected ? 'bg-white shadow-md' : 'bg-transparent'}
  `}
              >
                <Image
                  src={payment.icon_url}
                  alt={payment.name}
                  width={40}
                  height={50}
                  className="object-contain"
                />
              </div>

              {/* Name */}
              <p className="text-gray-900 dark:text-white text-center text-xs font-medium leading-snug line-clamp-2">
                {payment.full_name}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
