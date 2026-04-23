'use client'
import { ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { GetGameResponse, Price } from '../../types/Game'
import { PaymentMethod } from '../../types/PaymentMethod'
import { OrderFormValues } from '../../schemas/order_schema'
import { useCheckID } from '../../hooks/useTransaction'

interface OrderSummaryProps {
  activePackage: Price | null
  activePayment: PaymentMethod | null
  formatPrice: (price: number) => string
  onSubmit: () => void
  orderFormValue: OrderFormValues
  category_code: string
  setAccount: (account: string) => void
  InputGame: GetGameResponse
}

export default function OrderSummary({
  activePackage,
  activePayment,
  formatPrice,
  onSubmit,
  orderFormValue,
  category_code,
  setAccount,
  InputGame,
}: // gameInput,
OrderSummaryProps) {
  const t = useTranslations('GameCheckout')
  const hasGameInputs = InputGame?.data?.input?.length > 0

  const { mutateAsync: CheckID, isPending } = useCheckID()

  const handleBuyNow = async () => {
    try {
      if (!hasGameInputs) {
        onSubmit()
        return
      }
      const res = await CheckID({
        category_code,
        game_id: orderFormValue.game_id,
        provider_id: orderFormValue.provider_id,
        game_data: orderFormValue.game_data,
      })
      setAccount(res.username)
      onSubmit()
    } catch (err) {
      console.error(err)
    }
  }

  if (!activePackage && !activePayment) return null

  return (
    <div
      className="
           bg-black/5 dark:bg-white/10
        backdrop-blur-lg
        rounded-3xl
        p-5
        border border-gray-200 dark:border-white/20
        shadow-xl
        mt-6
      "
    >
      {/* Header */}
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('orderSummaryTitle')}</h2>

      {/* Info */}
      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-purple-200">{t('orderPackage')}</span>
          <span className="font-medium text-gray-900 dark:text-white text-right">
            {activePackage?.name || '-'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-purple-200">{t('orderPayment')}</span>
          <span className="font-medium text-gray-900 dark:text-white text-right">
            {activePayment?.full_name || '-'}
          </span>
        </div>

        <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-white/10">
          <span className="font-semibold">{t('orderTotal')}</span>
          <span className=" text-xl font-bold text-green-500 dark:text-green-400">
            {activePackage ? `Rp. ${formatPrice(activePackage.selling_price)}` : '-'}
          </span>
        </div>
      </div>

      <button
        onClick={handleBuyNow}
        disabled={isPending}
        className="
    w-full
    bg-gradient-to-r from-pink-500 to-purple-600
    text-white font-semibold
    py-3
    rounded-full
    transition-all
    cursor-pointer
    flex items-center justify-center gap-2
    text-sm
    disabled:opacity-60
    disabled:cursor-not-allowed
  "
      >
        <ShoppingCart className="w-4 h-4" />
        {isPending ? t('accountChecking') : t('mobileBuyNow')}
      </button>
    </div>
  )
}
