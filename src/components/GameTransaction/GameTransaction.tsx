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
import { useGetCategoryProduct } from './hooks/useGetCategoryProduct'

export default function GameTransaction() {
  const { slug } = useParams<{ slug: string }>()
  const [selectedPackage, setSelectedPackage] = useState<Price | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null)
  const [email, setSelectedEmail] = useState<string>(null)
  const { user } = useAuth()
  const [account, setSelectedAccount] = useState<Record<string, any> | null>(null)
  const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false)

  const { data: dataPaymentMethods } = useGetPaymentMethod()
  const { data: dataGameDetail, isLoading: isLoadingGameDetail } = useGetGamesBySlug(slug)

  const gameId = dataGameDetail?.data?.id

  const { data: categoryProduct } = useGetCategoryProduct(gameId)

  const { mutate, isPending } = useCreateTransactionV2()

  const activeProduct = selectedPackage ?? null
  const activePayment = selectedPayment ?? null

  const inputs = dataGameDetail?.data?.input || []

  const safeValues = account ?? {}

  const hasInputAccount = Object.values(safeValues).some(Boolean)
  const isAccountValid = !!account

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const hasEmail = !!email
  const isEmailValid = hasEmail && emailRegex.test(email)

  useEffect(() => {
    if (user?.email) {
      setSelectedEmail(user.email)
    }
  }, [user])

  if (isLoadingGameDetail) {
    return <SpinnerGameTransaction />
  }

  const validations = [
    ...(inputs.length > 0
      ? [
          { value: hasInputAccount, message: 'Masukkan akun' },
          { value: isAccountValid, message: 'Akun tidak ditemukan' },
        ]
      : []),
    { value: selectedPackage, message: 'Pilih Produk' },
    { value: selectedPayment, message: 'Pilih metode pembayaran' },
    { value: hasEmail, message: 'Email belum diisi' },
    { value: isEmailValid, message: 'Format email tidak valid' },
  ]

  const handleOpenConfirm = () => {
    for (const v of validations) {
      if (!v.value) {
        toast.error(v.message)
        return
      }
    }
    setOpenModalConfirm(true)
  }

  const handleCreateOrder = () => {
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
      product_id: selectedPackage.id,
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
      productGame={dataGameDetail}
      setSelectedPackage={setSelectedPackage}
      key="product"
      product={categoryProduct}
      activeProduct={activeProduct}
    />,

    <PaymentMethodTransactionComponent
      ActiveProduct={activeProduct}
      setSelectedPaymentMethod={setSelectedPayment}
      PaymentMethod={dataPaymentMethods}
      activePayment={activePayment}
      selectedPackage={selectedPackage}
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
            handleConfirm={handleOpenConfirm}
            Payment={activePayment}
            Product={activeProduct}
          />
        </div>
      </LayoutData>
      <MobileOrderBar
        Payment={activePayment}
        Product={activeProduct}
        handleConfirm={handleOpenConfirm}
      />
      <ConfirmModal
        open={openModalConfirm}
        setOpen={setOpenModalConfirm}
        Payment={activePayment}
        Product={activeProduct}
        onConfirm={handleCreateOrder}
        loading={isPending}
      />
    </LayoutGamesTransaction>
  )
}
