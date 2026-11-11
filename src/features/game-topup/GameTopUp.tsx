"use client";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useGetGamesBySlug } from "@/api/games";
import GameTopUpSkeleton from "@/features/game-topup/components/GameTopUpSkeleton";
import TopUpLayout from "@/features/game-topup/components/TopUpLayout";
import GameHeader from "@/features/game-topup/components/GameHeader";
import AccountComponent from "@/features/game-topup/components/AccountCard";
import TopUpGrid from "@/features/game-topup/components/TopUpGrid";
import { cloneElement, ReactElement, useEffect, useState } from "react";
import { ProductList } from "@/features/game-topup/components/ProductList";
import { Price } from "@/types/game";
import { PaymentMethod } from "@/types/paymentMethod";
import { useGetPaymentMethod } from "@/api/useGetPaymentMethod";
import PaymentMethodList from "@/features/game-topup/components/PaymentMethodList";
import ContactForm from "@/features/game-topup/components/ContactForm";
import OrderTransactionComponent from "@/features/game-topup/components/OrderSummary";
import HelpCard from "@/features/game-topup/components/HelpCard";
import MobileOrderBar from "@/features/game-topup/components/MobileOrderBar";
import { useCreateTransaction } from "@/features/game-topup/api/useCreateTransaction";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import ConfirmModal from "@/features/game-topup/components/ConfirmModal";
import { useGetCategoryProduct } from "@/features/game-topup/api/useGetCategoryProduct";
import GameDescription from "@/features/game-topup/components/GameDescription";
import FAQSection from "@/features/game-topup/components/FAQSection";
import GameUnavailable from "@/features/game-topup/components/GameUnavailable";
import RegionNotice from "@/features/game-topup/components/RegionNotice";
import { useGameRegion } from "@/features/game-topup/hooks/useGameRegion";
import { StepStatusContext, type StepStatus } from "@/features/game-topup/components/StepCard";
import { formatPrice } from "@/lib/formatPrice";
import { paymentTotalLimit } from "@/features/game-topup/lib/paymentTotal";

/** Aturan metode (biaya, batas total, butuh nomor HP) dikirim backend — sama dengan yang dicek checkout. */
function paymentRequiresUserMdn(payment: PaymentMethod | null): boolean {
  return !!payment?.needs_phone;
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

export default function GameTopUp() {
  const t = useTranslations("GameCheckout");
  const { slug } = useParams<{ slug: string }>();
  const [selectedPackage, setSelectedPackage] = useState<Price | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
  const [email, setSelectedEmail] = useState<string>(null);
  const { user } = useAuth();
  const [account, setSelectedAccount] = useState<Record<string, any> | null>(
    null,
  );
  /** Nickname hasil cek ID untuk isian akun saat ini (ringkasan & konfirmasi). */
  const [accountName, setAccountName] = useState<string | null>(null);
  const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false);
  const [userMdn, setUserMdn] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const { data: dataPaymentMethods } = useGetPaymentMethod();
  const { data: dataGameDetail, isLoading: isLoadingGameDetail } =
    useGetGamesBySlug(slug);

  const gameId = dataGameDetail?.data?.id;
  const { gameRegion, regionMismatch, switchToGameRegion } = useGameRegion(dataGameDetail?.data);

  const { data: categoryProduct } = useGetCategoryProduct(gameId);

  const { mutate, isPending } = useCreateTransaction();
  /** Langkah yang sedang ditunjuk karena belum lengkap (setelah klik "Beli" / langkah terkunci). */
  const [flaggedStep, setFlaggedStep] = useState<string | null>(null);

  const activeProduct = selectedPackage ?? null;
  const activePayment = selectedPayment ?? null;
  const productPrice = activeProduct?.selling_price ?? 0;
  /** Metode terpilih menolak total untuk produk ini (di bawah min. / di atas maks. metode). */
  const selectedPaymentLimit =
    selectedPayment && activeProduct ? paymentTotalLimit(selectedPayment, productPrice) : null;

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
    if (selectedPayment && selectedPaymentLimit) {
      setSelectedPayment(null);
      toast.error(t("toastMethodAmount", { method: selectedPayment.name }));
    }
  }, [selectedPaymentLimit, selectedPayment, t]);

  // Mengedit ID akun TIDAK lagi mengosongkan produk & pembayaran yang sudah dipilih: langkahnya
  // hanya terkunci sampai ID lolos cek ulang (validasi sebelum pesan tetap mewajibkan akun valid).

  if (isLoadingGameDetail) {
    return <GameTopUpSkeleton />;
  }

  if (!dataGameDetail?.data) {
    return (
      <TopUpLayout>
        <GameUnavailable reason="not-found" />
      </TopUpLayout>
    );
  }

  if (dataGameDetail?.data && !dataGameDetail.data.is_active) {
    return (
      <TopUpLayout>
        <GameUnavailable reason="maintenance" gameName={dataGameDetail.data.name} />
      </TopUpLayout>
    );
  }

  const needsUserMdn = paymentRequiresUserMdn(selectedPayment);
  const hasUserMdn = userMdn.trim().length > 0;
  const isPaymentAllowedForSelection = !selectedPaymentLimit;

  const lockProductStep = !isAccountStepCompleted;
  const lockPaymentStep = !isAccountStepCompleted || !isProductStepCompleted;
  const lockContactStep =
    !isAccountStepCompleted || !isProductStepCompleted || !isPaymentStepCompleted;

  const contactMessage = !hasEmail
    ? t("validationEmailRequired")
    : !isEmailValid
      ? t("validationEmailInvalid")
      : needsUserMdn && !hasUserMdn
        ? t("validationPhoneRequired")
        : needsUserMdn && !isValidUserMdn(userMdn)
          ? t("validationPhoneInvalid")
          : null;

  /** Urutan langkah + syarat lengkapnya — sumber badge status, pesan inline, dan ringkasan pesanan. */
  const stepChecks = [
    ...(requiresAccountInput
      ? [{ id: "account-section", label: t("stepLabelAccount"), ok: isAccountStepCompleted, message: t("toastFillAccount") }]
      : []),
    { id: "product-section", label: t("stepLabelProduct"), ok: isProductStepCompleted, message: t("toastSelectProduct") },
    {
      id: "payment-method-section",
      label: t("stepLabelPayment"),
      ok: isPaymentStepCompleted && isPaymentAllowedForSelection,
      message: isPaymentStepCompleted ? t("validationMethodAmount") : t("toastSelectPayment"),
    },
    { id: "contact-section", label: t("stepLabelContact"), ok: contactMessage === null, message: contactMessage },
  ];
  const firstIncomplete = stepChecks.find((step) => !step.ok);

  // Error hanya di langkah yang ditunjuk & hilang sendiri begitu langkah itu lengkap (tidak "loncat" ke langkah berikut)
  const stepStatuses: Record<string, StepStatus> = Object.fromEntries(
    stepChecks.map((step) => [
      step.id,
      { done: step.ok, error: flaggedStep === step.id && !step.ok ? step.message : null },
    ]),
  );
  const stepSummary = stepChecks.map(({ label, ok }) => ({ label, done: ok }));

  /** Scroll + fokus ke langkah pertama yang belum lengkap dan tampilkan pesannya. true = ada yang kurang. */
  const revealFirstIncompleteStep = () => {
    if (!firstIncomplete) return false;
    setFlaggedStep(firstIncomplete.id);
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document
      .getElementById(firstIncomplete.id)
      ?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    document.getElementById(`${firstIncomplete.id}-title`)?.focus({ preventScroll: true });
    return true;
  };

  // Metode yang tidak menerima total produk terpilih tampil nonaktif, dengan alasannya di kartu
  // (bukan dipilih lalu dibatalkan + toast). Sebelum produk dipilih, semua metode tersedia apa adanya.
  const paymentMethodsForProduct = dataPaymentMethods
    ? {
        ...dataPaymentMethods,
        data: (dataPaymentMethods.data ?? []).map((category) => ({
          ...category,
          methods: (category.methods ?? []).map((payment) => {
            const limit = activeProduct ? paymentTotalLimit(payment, productPrice) : null;
            return {
              ...payment,
              available: payment.available && !limit,
              disabled_note:
                payment.available && limit
                  ? t(limit === "min" ? "methodMinNote" : "methodMaxNote", {
                      amount: formatPrice(limit === "min" ? payment.min_total : payment.max_total),
                    })
                  : undefined,
            };
          }),
        })),
      }
    : dataPaymentMethods;

  const handleOpenConfirm = () => {
    if (revealFirstIncompleteStep()) return;
    setOpenModalConfirm(true);
  };

  /** Isian akun untuk dicek ulang di modal konfirmasi (nilai dropdown ditampilkan dengan namanya). */
  const accountFields = account
    ? inputs
        .map((input) => {
          const raw = String(account[input.key] ?? "");
          const option = input.Options?.find((opt) => opt.value === raw);
          return { label: input.label, value: option?.name ?? raw };
        })
        .filter((field) => field.value)
    : [];

  const handleCreateOrder = () => {
    mutate({
      email: email,
      payment_method_id: selectedPayment.id,
      game_data: account,
      product_id: selectedPackage.id,
      ...(needsUserMdn ? { user_mdn: normalizeUserMdn(userMdn) } : {}),
      referral_code: referralCode ? referralCode.trim() : undefined,
    });
  };

  const sections: ReactElement<{ step?: number }>[] = [
    ...(inputs.length > 0
      ? [
          <AccountComponent
            account={account}
            setAccount={setSelectedAccount}
            onAccountNameChange={setAccountName}
            game={dataGameDetail.data}
            key="account"
            gameData={inputs}
          />,
        ]
      : []),

    <ProductList
      productGame={dataGameDetail}
      setSelectedPackage={setSelectedPackage}
      key="product"
      product={categoryProduct}
      activeProduct={activeProduct}
      isLocked={lockProductStep}
      onLockedAction={revealFirstIncompleteStep}
    />,

    <PaymentMethodList
      ActiveProduct={activeProduct}
      setSelectedPaymentMethod={setSelectedPayment}
      PaymentMethod={paymentMethodsForProduct}
      activePayment={activePayment}
      selectedPackage={selectedPackage}
      isLocked={lockPaymentStep}
      onLockedAction={revealFirstIncompleteStep}
    />,

    <ContactForm
      setSelectedEmail={setSelectedEmail}
      email={email}
      requiresPhone={needsUserMdn}
      userMdn={userMdn}
      setUserMdn={setUserMdn}
      referralCode={referralCode}
      setReferralCode={setReferralCode}
      isLocked={lockContactStep}
      onLockedAction={revealFirstIncompleteStep}
    />,
  ];

  return (
    <TopUpLayout>
      <GameHeader game={dataGameDetail.data} />
      {regionMismatch && (
        <RegionNotice
          gameName={dataGameDetail.data.name}
          region={regionMismatch}
          gameRegion={gameRegion}
          onSwitchToGameRegion={switchToGameRegion}
        />
      )}
      <TopUpGrid>
        <StepStatusContext.Provider value={stepStatuses}>
          <div className="flex min-w-0 flex-col gap-4">
            {sections.map((Section, i) =>
              cloneElement(Section, {
                step: i + 1,
                key: `section-${i}`,
              }),
            )}
          </div>
        </StepStatusContext.Provider>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-20">
          <OrderTransactionComponent
            handleConfirm={handleOpenConfirm}
            Payment={activePayment}
            Product={activeProduct}
            gameName={dataGameDetail.data.name}
            accountName={accountName}
            steps={stepSummary}
          />
          <HelpCard />
        </aside>
      </TopUpGrid>
      <div className="mt-8 flex flex-col gap-5">
        <GameDescription game={dataGameDetail} />
        <FAQSection />
      </div>
      {/* Spacer setinggi bar order mobile (diukur MobileOrderBar) supaya konten bawah tidak tertutup */}
      <div aria-hidden className="h-[var(--mobile-order-bar-height,0px)] lg:hidden" />
      <MobileOrderBar
        Payment={activePayment}
        Product={activeProduct}
        handleConfirm={handleOpenConfirm}
        steps={stepSummary}
      />
      <ConfirmModal
        open={openModalConfirm}
        setOpen={setOpenModalConfirm}
        Payment={activePayment}
        Product={activeProduct}
        onConfirm={handleCreateOrder}
        loading={isPending}
        accountName={accountName}
        accountFields={accountFields}
        email={email}
        phone={needsUserMdn ? userMdn : undefined}
      />
    </TopUpLayout>
  );
}
