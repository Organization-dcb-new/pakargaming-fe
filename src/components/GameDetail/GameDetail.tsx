'use client'
import { useParams, useRouter } from 'next/navigation'
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
import OrderDetailModal from './OrderModal'

const generateOrderId = () => {
  return `TRX-${Date.now()}`
}

export function GameDetailComponent() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()

  const { data: dataGameDetail, isLoading: isLoadingGameDetail } = useGetGamesBySlug(slug)
  const { data: dataPaymentMethods, isLoading: isLoadingPaymentMethods } = useGetPaymentMethod()

  const [email, setEmail] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedPackage, setSelectedPackage] = useState<Price | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null)

  const activePackage = selectedPackage ?? dataGameDetail?.data?.product?.[0] ?? null
  const activePayment = selectedPayment ?? dataPaymentMethods?.data?.[0] ?? null

  const handleSubmit = () => {
    if (!activePackage || !activePayment) {
      toast.error('Lengkapi Field yang Kosong')
      return
    }

    setShowModal(true)
  }
  const params = useParams<{ locale: 'id' | 'en' }>()

  const locale = params.locale ?? 'id'

  const handleConfirmOrder = () => {
    const orderId = generateOrderId()

    setShowModal(false)
    router.push(`/${locale}/transaction/${orderId}`)
  }

  if (isLoadingGameDetail && isLoadingPaymentMethods) {
    return <GameDetailSkeleton />
  }

  return (
    <div className="min-h-screen  bg-gradient-to-br from-background via-purple-50/50 dark:via-purple-900/50 to-background">
      <div className="max-w-6xl mx-auto flex flex-row gap-4 p-4">
        <div>
          {/* Header */}
          <HeaderGameDetail GameDetail={dataGameDetail} />
          {/* Order Summary Navbar - Sticky Bottom */}
          <OrderSummary
            activePackage={activePackage}
            activePayment={activePayment}
            formatPrice={formatPrice}
            onSubmit={handleSubmit}
          />
        </div>

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

          <OrderDetailModal
            open={showModal}
            onClose={() => setShowModal(false)}
            packageData={activePackage}
            payment={activePayment}
            email={email}
            formatPrice={formatPrice}
            onConfirm={handleConfirmOrder}
          />
        </div>
      </div>
    </div>
  )
}
