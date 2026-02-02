'use client'
import { useParams } from 'next/navigation'
import { useGetGamesBySlug } from '../../hooks/useGame'
import SpinnerGameTransaction from './components/Spinner'
import LayoutGamesTransaction from './components/Layout'
import BannerGameTransaction from './components/Banner'
import AccountComponent from './components/Account'
import LayoutData from './components/LayoutData'
import { cloneElement, ReactElement, useEffect, useState } from 'react'
import { ProductComponent } from './components/Product'
import { Price } from '../../types/Game'
import { PaymentMethod } from '../../types/PaymentMethod'
import { useGetPaymentMethod } from '../../hooks/usePaymentMethod'
import PaymentMethodTransactionComponent from './components/PaymentMethod'
import ContactForm from './components/Contact'
import OrderTransactionComponent from './components/OrderTransaction'
import HelpCard from './components/Help'
import MobileOrderBar from './components/MobileOrderTransaction'
import { useCreateTransactionV2 } from './hooks/useCreateTransaction'
import { toast } from 'sonner'
import useAuth from '../../hooks/useAuth'
import ConfirmModal from './components/Confirmation'

export default function GameTransaction() {
  const { slug } = useParams<{ slug: string }>()
  const [selectedPackage, setSelectedPackage] = useState<Price | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null)
  const [email, setSelectedEmail] = useState<string>(null)
  const { user } = useAuth()
  const [account, setSelectedAccount] = useState<Record<string, any> | null>(null)
  const [openModal, setOpenModal] = useState<boolean>(false)

  const { data: dataPaymentMethods } = useGetPaymentMethod()
  const { data: dataGameDetail, isLoading: isLoadingGameDetail } = useGetGamesBySlug(slug)

  const { mutate } = useCreateTransactionV2()

  const activeProduct = selectedPackage ?? null
  const activePayment = selectedPayment ?? null

  const inputs = dataGameDetail?.data?.input || []

  useEffect(() => {
    if (user?.email) {
      setSelectedEmail(user.email)
    }
  }, [user])

  if (isLoadingGameDetail) {
    return <SpinnerGameTransaction />
  }

  const validations = [
    ...(inputs.length > 0 ? [{ value: account, message: 'Akun Tidak Ditemukan' }] : []),

    { value: selectedPackage, message: 'Pilih Produk' },
    { value: selectedPayment, message: 'Pilih metode pembayaran' },
    { value: email, message: 'Email belum diisi' },
  ]

  const handleCreateOrder = () => {
    for (const v of validations) {
      if (!v.value) {
        toast.error(v.message)
        return
      }
    }

    mutate({
      game_id: dataGameDetail.data.id,
      package: {
        product_id: selectedPackage.id,
        product_name: selectedPackage.name,
        product_sku: selectedPackage.sku,
      },
      payment: {
        payment_method_id: selectedPayment.id,
        payment_channel: selectedPayment.name,
      },
      email: email,
      game_data: account,
      amount: selectedPackage.selling_price,
      provider_id: dataGameDetail.data.provider_id,
    })
  }

  const sections: ReactElement[] = [
    ...(inputs.length > 0
      ? [
          <AccountComponent
            account={account}
            setAccount={setSelectedAccount}
            game={dataGameDetail.data}
            key="account"
            gameData={inputs}
          />,
        ]
      : []),

    <ProductComponent
      setSelectedPackage={setSelectedPackage}
      key="product"
      game={dataGameDetail}
      activeProduct={activeProduct}
    />,
    <PaymentMethodTransactionComponent
      ActiveProduct={activeProduct}
      setSelectedPaymentMethod={setSelectedPayment}
      PaymentMethod={dataPaymentMethods}
      activePayment={activePayment}
    />,
    <ContactForm setSelectedEmail={setSelectedEmail} email={email} />,
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

        <div className="flex items-center flex-col ">
          <HelpCard />
          <OrderTransactionComponent
            Payment={activePayment}
            Product={activeProduct}
            setOpenModal={setOpenModal}
          />
        </div>
      </LayoutData>
      <MobileOrderBar
        Payment={activePayment}
        Product={activeProduct}
        onSubmit={handleCreateOrder}
      />
      <ConfirmModal onConfirm={handleCreateOrder} />
    </LayoutGamesTransaction>
  )
}
