'use client'
import { useParams, useRouter } from 'next/navigation'
import { useGetGamesBySlug } from '../../hooks/useGame'
import { useState, useRef, useEffect } from 'react'
import { GameDetailSpinner } from './GameDetailSkeleton'
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
      provider_id: '',
      game_id: '',
      product_id: '',
    },
  })

  const {
    setValue,
    formState: { errors },
  } = orderForm

  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedPackage, setSelectedPackage] = useState<Price | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null)
  const [account, setAccount] = useState<string>('')

  const [isRedirecting, setIsRedirecting] = useState(false)

  // Refs for scrolling
  const packageRef = useRef<HTMLDivElement>(null)
  const paymentRef = useRef<HTMLDivElement>(null)
  const emailRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)

  // Refs to track scroll state to prevent repeated scrolling
  const hasScrolledToPackage = useRef(false)
  const hasScrolledToTop = useRef(false)

  // Watch form values for auto-scroll
  const gameData = orderForm.watch('game_data')
  const email = orderForm.watch('email')

  const orderFormValue = orderForm.watch()

  // Auto-scroll logic for Step 1 -> Step 2
  useEffect(() => {
    if (dataGameDetail?.data?.input) {
      const requiredInputs = dataGameDetail.data.input.filter((i) => i.required)
      const allFilled = requiredInputs.every(
        (input) => gameData?.[input.key] && gameData[input.key].toString().length > 0
      )

      if (allFilled && !hasScrolledToPackage.current && requiredInputs.length > 0) {
        // Debounce slightly to ensure user is done typing
        const timer = setTimeout(() => {
          packageRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
          hasScrolledToPackage.current = true
        }, 1000)
        return () => clearTimeout(timer)
      } else if (!allFilled) {
        hasScrolledToPackage.current = false
      }
    }
  }, [gameData, dataGameDetail])

  // Auto-scroll Step 4 (Email) -> Top/Summary if everything is done
  useEffect(() => {
    const isStep1Done = dataGameDetail?.data?.input
      ?.filter((i) => i.required)
      .every((input) => gameData?.[input.key] && gameData[input.key].toString().length > 0)

    const isStep2Done = !!selectedPackage
    const isStep3Done = !!selectedPayment

    // Check email validity simple regex or length
    const isEmailFilled = email && email.length > 5 && email.includes('@')
    const allDone = isStep1Done && isStep2Done && isStep3Done && isEmailFilled

    if (allDone && !hasScrolledToTop.current) {
      const timer = setTimeout(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        hasScrolledToTop.current = true
      }, 1000)
      return () => clearTimeout(timer)
    } else if (!allDone) {
      hasScrolledToTop.current = false
    }
  }, [email, gameData, selectedPackage, selectedPayment, dataGameDetail])

  const activePackage = selectedPackage ?? null
  const activePayment = selectedPayment ?? null

  const onSubmit = () => {
    setShowModal(true)
  }

  const handleConfirmOrder = async () => {
    try {
      const payload = orderForm.getValues()

      const res = await createTransaction(payload)
      setIsRedirecting(true)

      router.push(`/${locale}/detail-trx/${res.data.id}`)
    } catch (err) {
      setIsRedirecting(false)
    }
  }

  if (isLoadingGameDetail || !dataGameDetail || isLoadingPaymentMethods || !dataPaymentMethods) {
    return <GameDetailSpinner />
  }

  const packageError = errors.package?.product_id?.message
  const paymentError = errors.payment?.payment_method_id?.message

  return (
    <>
      {isRedirecting && (
        <div
          className="
          fixed inset-0 z-[9999]
          bg-white/80 dark:bg-black/70
          backdrop-blur-sm
          flex items-center justify-center
          transition-opacity duration-300
        "
        >
          <div className="flex flex-col items-center gap-3">
            <svg className="w-8 h-8 animate-spin text-purple-600" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              Mengalihkan ke halaman pembayaran…
            </p>
          </div>
        </div>
      )}

      <div className="min-h-screen  bg-gradient-to-br from-background via-purple-50/50 dark:via-purple-900/50 to-background">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 p-4">
          <div>
            {/* Header */}
            <div ref={topRef}>
              <HeaderGameDetail GameDetail={dataGameDetail} />
            </div>
            {/* Order Summary Navbar - Sticky Bottom */}

            <div className="hidden lg:block">
              <OrderSummary
                InputGame={dataGameDetail}
                setAccount={setAccount}
                category_code={dataGameDetail.data.code}
                orderFormValue={orderFormValue}
                activePackage={activePackage}
                activePayment={activePayment}
                formatPrice={formatPrice}
                onSubmit={onSubmit}
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
            <div ref={packageRef}>
              <PackageGame
                packageError={packageError}
                PackageGame={dataGameDetail}
                activePackage={activePackage}
                setSelectedPackage={(pkg) => {
                  setSelectedPackage(pkg)
                  setValue('package.product_id', pkg.id, {
                    shouldValidate: true,
                  })
                  setValue('package.product_name', pkg.name)
                  setValue('package.product_sku', pkg.sku)
                  setValue('provider_id', dataGameDetail?.data?.provider_id || '', {
                    shouldValidate: true,
                  })
                  setValue('game_id', dataGameDetail?.data?.id || '', {
                    shouldValidate: true,
                  })
                  setValue('product_id', pkg.id, {
                    shouldValidate: true,
                  })

                  // Scroll to next step
                  setTimeout(() => {
                    paymentRef.current?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    })
                  }, 300)
                }}
              />
            </div>

            {/* Payment Method */}
            <div ref={paymentRef}>
              <PaymentMethodComponent
                paymentError={paymentError}
                PaymentMethod={dataPaymentMethods}
                activePayment={activePayment}
                setSelectedPayment={(pm) => {
                  setSelectedPayment(pm)
                  setValue('payment.payment_method_id', pm.id, {
                    shouldValidate: true,
                  })
                  setValue('payment.payment_channel', pm.name)

                  // Scroll to next step
                  setTimeout(() => {
                    emailRef.current?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    })
                  }, 300)
                }}
              />
            </div>

            {/* Email Input */}
            <div ref={emailRef}>
              <EmailInput
                register={orderForm.register}
                error={orderForm.formState.errors.email?.message}
              />
            </div>

            <div className="lg:hidden mt-6">
              <OrderSummary
                InputGame={dataGameDetail}
                setAccount={setAccount}
                category_code={dataGameDetail.data.code}
                orderFormValue={orderFormValue}
                activePackage={activePackage}
                activePayment={activePayment}
                formatPrice={formatPrice}
                onSubmit={onSubmit}
              />
            </div>

            <OrderDetailModal
              Account={account}
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
    </>
  )
}
