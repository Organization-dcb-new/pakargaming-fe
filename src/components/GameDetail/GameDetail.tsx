'use client'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useGetGamesBySlug } from '../../hooks/useGame'
import { useState } from 'react'
import { CheckCircle2, Info, Mail, ShoppingCart } from 'lucide-react'
import { GameDetailSkeleton } from '../../components/GameDetailSkeleton'
import { toast } from 'sonner'
import { useGetPaymentMethod } from '../../hooks/usePaymentMethod'
import { Price } from '../../types/Game'
import { PaymentMethod } from '../../types/PaymentMethod'
import HeaderGameDetail from './Header'
import InputGame from './InputGame'
import { formatPrice } from '../../utils/format_price'
import PackageGame from './PackageGame'
import PaymentMethodComponent from './PaymentMethod'
import EmailInput from './EmailInput'
import OrderSummary from './OrderSummary'

export function GameDetailComponent() {
  const { slug } = useParams<{ slug: string }>()
  const { data: dataGameDetail, isLoading: isLoadingGameDetail } = useGetGamesBySlug(slug)
  const { data: dataPaymentMethods, isLoading: isLoadingPaymentMethods } = useGetPaymentMethod()
  const [email, setEmail] = useState<string>('')
  const [selectedPackage, setSelectedPackage] = useState<Price | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null)

  const activePackage = selectedPackage ?? dataGameDetail?.data?.product?.[0] ?? null
  const activePayment = selectedPayment ?? dataPaymentMethods?.data?.[0] ?? null

  const handleSubmit = () => {
    if (!activePackage || !activePayment) {
      toast.error('Lengkapi Field yang Kosong')
      return
    }
    toast.success('Top-up diproses 🎉')
  }

  if (isLoadingGameDetail && isLoadingPaymentMethods) {
    return <GameDetailSkeleton />
  }

  return (
    <div className="min-h-screen  bg-gradient-to-br from-background via-purple-50/50 dark:via-purple-900/50 to-background">
      <div className="max-w-6xl mx-auto flex flex-row gap-4 p-4">
        {/* Header */}
        <HeaderGameDetail GameDetail={dataGameDetail} />
        {/* Input Game */}
        <div>
          {/* Field Input Game */}
          <InputGame InputGame={dataGameDetail} />

          {/* Package Selection */}
          <PackageGame
            PackageGame={dataGameDetail}
            activePackage={activePackage}
            setSelectedPackage={setSelectedPackage}
          />

          {/* Payment Method */}
          <PaymentMethodComponent
            PaymentMethod={dataPaymentMethods}
            activePayment={activePayment}
            setSelectedPayment={setSelectedPayment}
          />
          {/* Email Input */}
          <EmailInput email={email} setEmail={setEmail} />

          {/* Order Summary Navbar - Sticky Bottom */}
          <OrderSummary activePackage={activePackage} activePayment={activePayment} formatPrice={formatPrice} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}
