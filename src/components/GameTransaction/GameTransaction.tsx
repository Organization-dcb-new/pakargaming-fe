"use client";
import { useParams } from "next/navigation";
import { useGetGamesBySlug } from "../../hooks/useGame";
import SpinnerGameTransaction from "./components/Spinner";
import LayoutGamesTransaction from "./components/Layout";
import BannerGameTransaction from "./components/Banner";
import AccountComponent from "./components/Account";
import LayoutData from "./components/LayoutData";
import { cloneElement, ReactElement, useEffect, useState } from "react";
import { ProductComponent } from "./components/Product";
import { Price } from "../../types/Game";
import { PaymentMethod } from "../../types/PaymentMethod";
import { useGetPaymentMethod } from "../../hooks/usePaymentMethod";
import PaymentMethodTransactionComponent from "./components/PaymentMethod";
import ContactForm from "./components/Contact";
import OrderTransactionComponent from "./components/OrderTransaction";
import HelpCard from "./components/Help";
import MobileOrderBar from "./components/MobileOrderTransaction";
import { useCreateTransaction } from "./hooks/useCreateTransaction";
import { toast } from "sonner";
import useAuth from "../../hooks/useAuth";
import ConfirmModal from "./components/Confirmation";
import { useGetCategoryProduct } from "./hooks/useGetCategoryProduct";
import DescriptionGame from "./components/Description";
import FAQSection from "./components/FAQ";

export default function GameTransaction() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedPackage, setSelectedPackage] = useState<Price | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
  const [email, setSelectedEmail] = useState<string>(null);
  const { user } = useAuth();
  const [account, setSelectedAccount] = useState<Record<string, any> | null>(
    null,
  );
  const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false);
  const [openInactiveModal, setOpenInactiveModal] = useState<boolean>(false);
  const [inactiveModalVisible, setInactiveModalVisible] = useState<boolean>(false);

  const { data: dataPaymentMethods } = useGetPaymentMethod();
  const { data: dataGameDetail, isLoading: isLoadingGameDetail } =
    useGetGamesBySlug(slug);


  const gameId = dataGameDetail?.data?.id;

  const { data: categoryProduct } = useGetCategoryProduct(gameId);

  const { mutate, isPending } = useCreateTransaction();
  const isGameInactive = dataGameDetail?.data?.is_active === false;
  const inactiveGameMessage =
    "Game sedang dalam gangguan silahakan hubungi cs atau admin";
  const inactiveTransactionMessage =
    "Transaksi sedang terjadi gangguan hubungii admin atau cs";

  const activeProduct = selectedPackage ?? null;
  const activePayment = selectedPayment ?? null;

  const inputs = dataGameDetail?.data?.input || [];

  const safeValues = account ?? {};

  const hasInputAccount = Object.values(safeValues).some(Boolean);
  const isAccountValid = !!account;

  const emailRegex = /^[^\s@]+@(gmail\.com|outlook\.com|yahoo\.com)$/i;

  const hasEmail = !!email;
  const isEmailValid = hasEmail && emailRegex.test(email);

  useEffect(() => {
    if (user?.email) {
      setSelectedEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (openInactiveModal) {
      setInactiveModalVisible(true);
      return;
    }

    const timeout = setTimeout(() => setInactiveModalVisible(false), 220);
    return () => clearTimeout(timeout);
  }, [openInactiveModal]);

  if (isLoadingGameDetail) {
    return <SpinnerGameTransaction />;
  }

  const validations = [
    ...(inputs.length > 0
      ? [
          { value: hasInputAccount, message: "Masukkan akun" },
          { value: isAccountValid, message: "Akun tidak ditemukan" },
        ]
      : []),
    { value: selectedPackage, message: "Pilih Produk" },
    { value: selectedPayment, message: "Pilih metode pembayaran" },
    { value: hasEmail, message: "Email belum diisi" },
    {
      value: isEmailValid,
      message: "Email harus menggunakan domain gmail.com, outlook.com, atau yahoo.com",
    },
  ];

  const handleOpenConfirm = () => {
    if (isGameInactive) {
      setOpenInactiveModal(true);
      return;
    }

    for (const v of validations) {
      if (!v.value) {
        toast.error(v.message);
        return;
      }
    }
    setOpenModalConfirm(true);
  };

  const handleCreateOrder = () => {
    if (isGameInactive) {
      setOpenModalConfirm(false);
      setOpenInactiveModal(true);
      return;
    }

    mutate({
      email: email,
      payment_method_id: selectedPayment.id,
      game_data: account,
      product_id: selectedPackage.id,
    });
  };

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
  ];

  return (
    <LayoutGamesTransaction>
      <BannerGameTransaction game={dataGameDetail.data} />
      {isGameInactive && (
        <div className="mx-auto mt-4 mb-2 w-full max-w-6xl px-4">
          <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900 shadow-sm">
            <p className="text-sm font-medium sm:text-base">{inactiveGameMessage}</p>
          </div>
        </div>
      )}
      <LayoutData>
        <div className="flex flex-col gap-5 items-center">
          {sections.map((Section, i) =>
            cloneElement(Section, {
              step: i + 1,
              key: `section-${i}`,
            }),
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
      {inactiveModalVisible && (
        <div
          className={`fixed inset-0 z-[60] flex items-end sm:items-center justify-center px-4 transition-all duration-200 ${
            openInactiveModal ? "bg-black/50" : "bg-black/0"
          }`}
        >
          <div
            className="absolute inset-0"
            onClick={() => setOpenInactiveModal(false)}
          />
          <div
            className={`relative w-full max-w-md bg-white p-6 shadow-2xl rounded-t-3xl sm:rounded-2xl transform transition-all duration-200 ease-out ${
              openInactiveModal
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-6 opacity-0 scale-[0.98]"
            }`}
          >
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                !
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Transaksi Tidak Tersedia
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {inactiveTransactionMessage}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => setOpenInactiveModal(false)}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-[0.98] cursor-pointer"
              >
                Kembali
              </button>
              <button
                onClick={() => setOpenInactiveModal(false)}
                className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-purple-500/30 active:scale-[0.98] cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-5">
        <DescriptionGame game={dataGameDetail} />
        <FAQSection />
      </div>
    </LayoutGamesTransaction>
  );
}
