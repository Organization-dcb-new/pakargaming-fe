"use client";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
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
import GameMaintenance from "./components/GameMaintenance";

const PAYMENT_CODES_NEEDING_USER_MDN = new Set(["ovo", "smartfren_airtime"]);
const MIN_PRODUCT_PRICE_FOR_VA = 10000;

function paymentRequiresUserMdn(payment: PaymentMethod | null): boolean {
  const code = payment?.code?.toLowerCase();
  return !!code && PAYMENT_CODES_NEEDING_USER_MDN.has(code);
}

function isVirtualAccountPayment(payment: PaymentMethod | null): boolean {
  if (!payment) return false;
  const haystack = [
    payment.type,
    payment.provider,
    payment.code,
    payment.name,
    payment.full_name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return /(^|[\s_-])va($|[\s_-])/.test(haystack) || haystack.includes("virtual");
}

function normalizeUserMdn(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.startsWith("62")) return d;
  if (d.startsWith("0")) return `62${d.slice(1)}`;
  if (d.startsWith("8")) return `62${d}`;
  return d;
}

function isValidUserMdn(raw: string): boolean {
  const n = normalizeUserMdn(raw);
  return n.length >= 11 && n.length <= 15 && n.startsWith("62");
}

export default function GameTransaction() {
  const t = useTranslations("GameCheckout");
  const { slug } = useParams<{ slug: string }>();
  const [selectedPackage, setSelectedPackage] = useState<Price | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
  const [email, setSelectedEmail] = useState<string>(null);
  const { user } = useAuth();
  const [account, setSelectedAccount] = useState<Record<string, any> | null>(
    null,
  );
  const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false);
  const [userMdn, setUserMdn] = useState("");

  const { data: dataPaymentMethods } = useGetPaymentMethod();
  const { data: dataGameDetail, isLoading: isLoadingGameDetail } =
    useGetGamesBySlug(slug);

  const gameId = dataGameDetail?.data?.id;

  const { data: categoryProduct } = useGetCategoryProduct(gameId);

  const { mutate, isPending } = useCreateTransaction();

  const activeProduct = selectedPackage ?? null;
  const activePayment = selectedPayment ?? null;
  const allowVaPayment = (activeProduct?.selling_price ?? 0) > MIN_PRODUCT_PRICE_FOR_VA;

  const inputs = dataGameDetail?.data?.input || [];

  const safeValues = account ?? {};

  const hasInputAccount = Object.values(safeValues).some(Boolean);
  const isAccountValid = !!account;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const hasEmail = !!email;
  const isEmailValid = hasEmail && emailRegex.test(email);
  const requiresAccountInput = inputs.length > 0;
  const isAccountStepCompleted = !requiresAccountInput || (hasInputAccount && isAccountValid);
  const isProductStepCompleted = !!activeProduct;
  const isPaymentStepCompleted = !!activePayment;

  useEffect(() => {
    if (user?.email) {
      setSelectedEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (!paymentRequiresUserMdn(selectedPayment)) {
      setUserMdn("");
    }
  }, [selectedPayment]);

  useEffect(() => {
    if (selectedPayment && !allowVaPayment && isVirtualAccountPayment(selectedPayment)) {
      setSelectedPayment(null);
      toast.error(t("toastVaMinAmount"));
    }
  }, [allowVaPayment, selectedPayment, t]);

  useEffect(() => {
    if (!isAccountStepCompleted && selectedPackage) {
      setSelectedPackage(null);
    }
  }, [isAccountStepCompleted, selectedPackage]);

  useEffect(() => {
    if ((!isAccountStepCompleted || !selectedPackage) && selectedPayment) {
      setSelectedPayment(null);
    }
  }, [isAccountStepCompleted, selectedPackage, selectedPayment]);

  if (isLoadingGameDetail) {
    return <SpinnerGameTransaction />;
  }

  if (dataGameDetail?.data && !dataGameDetail.data.is_active) {
    return (
      <LayoutGamesTransaction>
        <GameMaintenance gameName={dataGameDetail.data.name} />
      </LayoutGamesTransaction>
    );
  }

  const needsUserMdn = paymentRequiresUserMdn(selectedPayment);
  const hasUserMdn = userMdn.trim().length > 0;
  const isVaAllowedForSelection = !(
    selectedPayment &&
    isVirtualAccountPayment(selectedPayment) &&
    !allowVaPayment
  );

  const lockProductStep = !isAccountStepCompleted;
  const lockPaymentStep = !isAccountStepCompleted || !isProductStepCompleted;
  const lockContactStep =
    !isAccountStepCompleted || !isProductStepCompleted || !isPaymentStepCompleted;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleBlockedProductAction = () => {
    toast.error(t("toastFillAccount"));
    scrollToSection("account-section");
  };

  const handleBlockedPaymentAction = () => {
    if (!isAccountStepCompleted) {
      toast.error(t("toastFillAccount"));
      scrollToSection("account-section");
      return;
    }
    toast.error(t("toastSelectProduct"));
    scrollToSection("product-section");
  };

  const handleBlockedContactAction = () => {
    if (!isAccountStepCompleted) {
      toast.error(t("toastFillAccount"));
      scrollToSection("account-section");
      return;
    }
    if (!isProductStepCompleted) {
      toast.error(t("toastSelectProduct"));
      scrollToSection("product-section");
      return;
    }
    toast.error(t("toastSelectPayment"));
    scrollToSection("payment-method-section");
  };

  const paymentMethodsWithVaRules = dataPaymentMethods
    ? {
        ...dataPaymentMethods,
        data: (dataPaymentMethods.data ?? []).map((category) => ({
          ...category,
          payment_method: (category.payment_method ?? []).map((payment) => ({
            ...payment,
            is_active: payment.is_active && (allowVaPayment || !isVirtualAccountPayment(payment)),
          })),
        })),
      }
    : dataPaymentMethods;

  const handleOpenConfirm = () => {
    const validations = [
      ...(inputs.length > 0
        ? [
            { value: hasInputAccount, message: t("validationEnterAccount") },
            { value: isAccountValid, message: t("validationAccountNotFound") },
          ]
        : []),
      { value: selectedPackage, message: t("validationSelectProduct") },
      { value: selectedPayment, message: t("validationSelectPayment") },
      {
        value: isVaAllowedForSelection,
        message: t("validationVaMinAmount"),
      },
      { value: hasEmail, message: t("validationEmailRequired") },
      { value: isEmailValid, message: t("validationEmailInvalid") },
      ...(needsUserMdn
        ? [
            { value: hasUserMdn, message: t("validationPhoneRequired") },
            {
              value: isValidUserMdn(userMdn),
              message: t("validationPhoneInvalid"),
            },
          ]
        : []),
    ];
    for (const v of validations) {
      if (!v.value) {
        toast.error(v.message);
        return;
      }
    }
    setOpenModalConfirm(true);
  };

  const handleCreateOrder = () => {
    mutate({
      email: email,
      payment_method_id: selectedPayment.id,
      game_data: account,
      product_id: selectedPackage.id,
      ...(needsUserMdn ? { user_mdn: normalizeUserMdn(userMdn) } : {}),
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
      isLocked={lockProductStep}
      onLockedAction={handleBlockedProductAction}
    />,

    <PaymentMethodTransactionComponent
      ActiveProduct={activeProduct}
      setSelectedPaymentMethod={setSelectedPayment}
      PaymentMethod={paymentMethodsWithVaRules}
      activePayment={activePayment}
      selectedPackage={selectedPackage}
      isLocked={lockPaymentStep}
      onLockedAction={handleBlockedPaymentAction}
    />,

    <ContactForm
      setSelectedEmail={setSelectedEmail}
      email={email}
      requiresPhone={needsUserMdn}
      userMdn={userMdn}
      setUserMdn={setUserMdn}
      isLocked={lockContactStep}
      onLockedAction={handleBlockedContactAction}
    />,
  ];

  return (
    <LayoutGamesTransaction>
      <BannerGameTransaction game={dataGameDetail.data} />
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
      <div className="mt-5">
        <DescriptionGame game={dataGameDetail} />
        <FAQSection />
      </div>
    </LayoutGamesTransaction>
  );
}
