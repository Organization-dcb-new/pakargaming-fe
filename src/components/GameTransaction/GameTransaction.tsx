'use client'
import { useParams } from 'next/navigation'
import { useGetGamesBySlug } from '../../hooks/useGame'
import SpinnerGameTransaction from './Spinner'
import LayoutGamesTransaction from './Layout'
import BannerGameTransaction from './Banner'
import AccountComponent from './Account'
import LayoutData from './LayoutData'
import { cloneElement, ReactElement, useState } from 'react'
import { ProductComponent } from './Product'
import { Price } from '../../types/Game'
import { PaymentMethod } from '../../types/PaymentMethod'
import { useGetPaymentMethod } from '../../hooks/usePaymentMethod'

export default function GameTransaction() {
  const { slug } = useParams<{ slug: string }>()
  const [selectedPackage, setSelectedPackage] = useState<Price | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null)
  const { data: dataPaymentMethods, isLoading: isLoadingPaymentMethods } = useGetPaymentMethod()

  const activeProduct = selectedPackage ?? null
  const activePayment = selectedPayment ?? null
  const { data: dataGameDetail, isLoading: isLoadingGameDetail } = useGetGamesBySlug(slug)
  const inputs = dataGameDetail?.data?.input || []

  if (isLoadingGameDetail) {
    return <SpinnerGameTransaction />
  }

  const sections: ReactElement[] = [
    ...(inputs.length > 0 ? [<AccountComponent key="account" gameData={inputs} />] : []),

    <ProductComponent key="product" game={dataGameDetail} activeProduct={activeProduct} />,
  ]

  return (
    <LayoutGamesTransaction>
      <BannerGameTransaction game={dataGameDetail.data} />
      <LayoutData>
        <div className="flex flex-col gap-5 items-center">
          {sections.map((Section, i) =>
            cloneElement(Section, {
              step: i + 1,
              key: `section-${i}`,
            })
          )}
        </div>
      </LayoutData>
    </LayoutGamesTransaction>
  )
}
