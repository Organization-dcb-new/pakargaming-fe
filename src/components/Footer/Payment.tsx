import Image from 'next/image'
import { useGetPaymentMethod } from '../../hooks/usePaymentMethod'

export default function SecurePayment() {
  const { data: dataPaymentMethods } = useGetPaymentMethod()

  const categories = dataPaymentMethods?.data ?? []
  const allPayments = categories.flatMap((category) => category.payment_method ?? [])

  return (
    <div className='w-full flex flex-1 flex-col'>
      <h3>Pembayaran Aman</h3>

      {/* Image only */}
      <div className="flex flex-wrap gap-2">
        {allPayments.map((payment) => (
          <Image
            key={payment.id}
            src={payment.icon_url}
            alt={payment.name}
            width={40}
            height={40}
          />
        ))}
      </div>

      <p>10+ lainnya</p>
    </div>
  )
}
