'use client'
import { useParams, useRouter } from 'next/navigation'
import { useGetGamesBySlug } from '../../hooks/useGame'
import { useState } from 'react'
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
import { useForm } from 'react-hook-form'
import { OrderFormValues, orderSchema } from '../../schemas/order_schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateTransaction } from '../../hooks/useTransaction'
import { AlertCircle } from 'lucide-react'

export function GameDetailComponent() {
  // Routing
  const { slug } = useParams<{ slug: string }>()
  const params = useParams<{ locale: 'id' | 'en' }>()
  const router = useRouter()
  const locale = params.locale ?? 'id'

  // Data Game Input and Payment Methods
  const { data: dataGameDetail, isLoading: isLoadingGameDetail } = useGetGamesBySlug(slug)
  const { data: dataPaymentMethods, isLoading: isLoadingPaymentMethods } = useGetPaymentMethod()
  const { mutateAsync: createTransaction, isPending: isPendingCreateTrx } = useCreateTransaction()

  // Handle Form
  const orderForm = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),

    defaultValues: {
      email: '',
      game_data: {},
      package: {
        product_id: '',
        product_name: '',
        product_sku: '',
      },
      payment: {
        payment_method_id: '',
        payment_channel: '',
      },
      amount: 0,
    },
  })

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = orderForm

  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedPackage, setSelectedPackage] = useState<Price | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null)

  const activePackage = selectedPackage ?? null
  const activePayment = selectedPayment ?? null

  const onSubmit = () => {
    setShowModal(true)
  }

  const handleConfirmOrder = async () => {
    try {
      const payload = orderForm.getValues()

      const res = await createTransaction(payload)

      setShowModal(false)

      router.push(`/${locale}/transaction/${res.data.id}`)
    } catch (err) {}
  }

  if (isLoadingGameDetail && isLoadingPaymentMethods) {
    return <GameDetailSkeleton />
  }

  const packageError = errors.package?.product_id?.message
  const paymentError = errors.payment?.payment_method_id?.message

  return (
    <div className="min-h-screen  bg-gradient-to-br from-background via-purple-50/50 dark:via-purple-900/50 to-background">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 p-4">
        <div>
          {/* Header */}
          <HeaderGameDetail GameDetail={dataGameDetail} />
          {/* Order Summary Navbar - Sticky Bottom */}

          <div className="hidden lg:block">
            <OrderSummary
              activePackage={activePackage}
              activePayment={activePayment}
              formatPrice={formatPrice}
              onSubmit={handleSubmit(onSubmit)}
            />
          </div>
        </div>

        {/* Input Game */}
        <div>
          {/* Field Input Game */}
          <InputGame
            InputGame={dataGameDetail}
            control={orderForm.control}
            errors={orderForm.formState.errors}
          />

          {/* Package Selection */}

          <PackageGame
            packageError={packageError}
            PackageGame={dataGameDetail}
            activePackage={activePackage}
            setSelectedPackage={(pkg) => {
              setSelectedPackage(pkg)
              setValue('package.product_id', pkg.id, { shouldValidate: true })
              setValue('package.product_name', pkg.name)
              setValue('package.product_sku', pkg.sku)
              setValue('amount', pkg.selling_price, { shouldValidate: true })
            }}
          />

          {/* Payment Method */}
          <PaymentMethodComponent
            paymentError={paymentError}
            PaymentMethod={dataPaymentMethods}
            activePayment={activePayment}
            setSelectedPayment={(pm) => {
              setSelectedPayment(pm)
              setValue('payment.payment_method_id', pm.id, { shouldValidate: true })
              setValue('payment.payment_channel', pm.name)
            }}
          />

          {/* Email Input */}
          <EmailInput
            register={orderForm.register}
            error={orderForm.formState.errors.email?.message}
          />

          <div className="lg:hidden mt-6">
            <OrderSummary
              activePackage={activePackage}
              activePayment={activePayment}
              formatPrice={formatPrice}
              onSubmit={handleSubmit(onSubmit)}
            />
          </div>

          <OrderDetailModal
            isPendingCreateTrx={isPendingCreateTrx}
            open={showModal}
            onClose={() => setShowModal(false)}
            packageData={activePackage}
            payment={activePayment}
            email={orderForm.watch('email')}
            formatPrice={formatPrice}
            onConfirm={handleConfirmOrder}
          />
        </div>
      </div>
    </div>
  )
}
