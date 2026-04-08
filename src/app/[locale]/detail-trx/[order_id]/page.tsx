'use client'
import { useParams } from 'next/navigation'
import PaymentDetailCard from '../../../../components/DetailTrx/PaymentDetail'
import ProductDetailCard from '../../../../components/DetailTrx/ProductDetail'
import TransactionTracking from '../../../../components/DetailTrx/StatusTrx'
import { useGetTransaction } from '../../../../hooks/useTransaction'
import { Loader2 } from 'lucide-react'
import PaymentFAQ from '../../../../components/DetailTrx/FAQPayment'
import { TransactionNotFound } from '../../../../components/Transaction/TransactionNotFound'

export default function DetailTransactionPage() {
  const { order_id } = useParams<{ order_id: string }>()
  const { data: transaction, isLoading } = useGetTransaction(order_id)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/40 dark:via-purple-900/40 to-background flex items-center justify-center px-4 py-10">
        <LoadingSpinner />
      </div>
    )
  }

  const dataTrx = transaction?.data
  if (!dataTrx) {
    return <TransactionNotFound />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/40 dark:via-purple-900/40 to-background flex items-center justify-center px-4 py-10">
      {/* Main Container */}
      <div className="flex flex-col">
        <div className="flex flex-col sm:flex-row gap-5">
          <TransactionTracking data={dataTrx} />
          <div className="sm:w-[640px] flex gap-4 flex-col flex-shrink">
            <ProductDetailCard data={dataTrx} />
            <PaymentDetailCard data={dataTrx} />
          </div>
        </div>

        <PaymentFAQ />
      </div>
    </div>
  )
}

export function LoadingSpinner() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  )
}
