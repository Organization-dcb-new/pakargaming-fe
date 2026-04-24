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
      <div className="flex w-full max-w-5xl flex-col gap-4">
        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-6 dark:border-purple-500/30 dark:bg-white/5">
          <div className="flex flex-col gap-6">
            <TransactionTracking data={dataTrx} isEmbedded progressOnly />

            <div className="h-px w-full bg-gray-100 dark:bg-white/10" />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <TransactionTracking data={dataTrx} isEmbedded showProgress={false} />
              </div>

              <div className="flex flex-col gap-6 lg:col-span-7">
                <ProductDetailCard data={dataTrx} isEmbedded />
                <div className="h-px w-full bg-gray-100 dark:bg-white/10" />
                <PaymentDetailCard data={dataTrx} isEmbedded />
              </div>
            </div>
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
