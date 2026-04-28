"use client";

import { useCallback, useEffect, useState } from "react";
import { Ban, Check, Clock, Copy, X } from "lucide-react";
import { PaymentDataWithDetailProduct } from "../../types/Transaction";
import { Link } from "../../i18n/routing";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface TransactionStatusCardProps {
  data?: PaymentDataWithDetailProduct;
  isEmbedded?: boolean;
  progressOnly?: boolean;
  showProgress?: boolean;
}

function isImageLikeUrl(s: string | undefined): boolean {
  if (!s?.trim()) return false;
  const u = s.trim().toLowerCase();
  return (
    u.startsWith("http://") ||
    u.startsWith("https://") ||
    u.startsWith("data:image/")
  );
}

function isHttpUrl(s: string | undefined): boolean {
  if (!s?.trim()) return false;
  const u = s.trim().toLowerCase();
  return u.startsWith("http://") || u.startsWith("https://");
}

function isCarrierOrAirtimeChannel(ch: string | undefined): boolean {
  if (!ch) return false;
  return ch.includes("smartfren_airtime");
}

const EWALLET_CHANNELS = new Set(["shopeepay", "gopay", "dana", "ovo"]);

function PendingCopyBlock({
  label,
  value,
  hint,
  copySuccess,
}: {
  label: string;
  value: string;
  hint?: string;
  copySuccess: string;
}) {
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(copySuccess);
    setTimeout(() => setCopied(false), 1500);
  }, [value, copySuccess]);

  return (
    <div className="w-full space-y-2">
      <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
        {label}
      </p>
      {hint ? (
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          {hint}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onCopy}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-100 dark:border-gray-600 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
      >
        <span className="break-all text-left">{value}</span>
        {copied ? (
          <Check className="h-5 w-5 shrink-0 text-green-500" />
        ) : (
          <Copy className="h-5 w-5 shrink-0 text-gray-400" />
        )}
      </button>
    </div>
  );
}

const btnPrimary =
  "flex w-full items-center justify-center rounded-2xl bg-gray-900 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 active:scale-[0.99] dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100";

export default function TransactionStatusCard({
  data,
  isEmbedded = false,
  progressOnly = false,
  showProgress = true,
}: TransactionStatusCardProps) {
  const t = useTranslations("TransactionStatus");
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    if (!qrOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQrOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [qrOpen]);

  if (!data) {
    return null;
  }

  const statusConfig = {
    PAID: {
      label: t("statusSuccess"),
      icon: <Check size={24} />,
      bg: "bg-green-100 dark:bg-green-900",
      text: "text-green-700 dark:text-green-400",
      ring: "ring-green-200/80 dark:ring-green-700/40",
      panel:
        "border-green-200 bg-green-50/80 text-green-800 dark:border-green-700/50 dark:bg-green-900/20 dark:text-green-200",
      cta:
        "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500",
    },
    FAILED: {
      label: t("statusFailed"),
      icon: <X size={24} />,
      bg: "bg-red-100 dark:bg-red-900",
      text: "text-red-700 dark:text-red-400",
      ring: "ring-red-200/80 dark:ring-red-700/40",
      panel:
        "border-red-200 bg-red-50/80 text-red-800 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-200",
      cta:
        "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500",
    },
    PENDING: {
      label: t("statusPending"),
      icon: <Clock size={24} />,
      bg: "bg-yellow-100 dark:bg-yellow-900",
      text: "text-yellow-700 dark:text-yellow-400",
      ring: "ring-yellow-200/80 dark:ring-yellow-700/40",
      panel:
        "border-yellow-200 bg-yellow-50/80 text-yellow-800 dark:border-yellow-700/50 dark:bg-yellow-900/20 dark:text-yellow-200",
      cta:
        "bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100",
    },
  };

  const cfg = statusConfig[data?.status] || statusConfig.PENDING;

  const paymentChannel = data?.payment_channel?.toLowerCase() ?? "";
  const vaNumber = data?.va_number?.trim() ?? "";

  const qrImageSrc =
    (data?.qr_code_url && isImageLikeUrl(data.qr_code_url)
      ? data.qr_code_url
      : null) ||
    (data?.qr_string && isImageLikeUrl(data.qr_string)
      ? data.qr_string
      : null);

  const rawQrString =
    data?.qr_string?.trim() &&
    !isImageLikeUrl(data.qr_string) &&
    !qrImageSrc
      ? data.qr_string.trim()
      : "";

  const isVaChannel = paymentChannel.startsWith("va_");
  const isEwallet = EWALLET_CHANNELS.has(paymentChannel);
  const isOvoChannel = paymentChannel === "ovo";
  const isCarrier = isCarrierOrAirtimeChannel(paymentChannel);
  const isQrisChannel = paymentChannel === "qris";
  const isOtcChannel =
    paymentChannel === "alfamart_otc" || paymentChannel === "indomaret_otc";
  const otcOutlet = paymentChannel === "indomaret_otc" ? "Indomaret" : "Alfamart";
  const otcCode = vaNumber || data?.payment_number?.trim() || "";
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  }).format(data?.amount ?? 0);

  const amountLabel = t("transferExact", {
    amount: data?.amount?.toLocaleString("id-ID") ?? "",
  });

  const hasVaCopy = !!vaNumber;
  const paymentDisplayName =
    data.detail_product?.payment_name?.trim() || data.payment_channel;

  const renderPendingActions = () => {
    const carrierOnly = isCarrier && !isVaChannel;

    const hasQrVisual = !!qrImageSrc;
    const hasQrRaw = !!rawQrString;
    const hasPaymentLink = !!data.payment_url?.trim();

    const nothingShown =
      !hasQrVisual &&
      !hasQrRaw &&
      !hasVaCopy &&
      !carrierOnly &&
      !hasPaymentLink;

    if (nothingShown) {
      return null;
    }

    if (carrierOnly) {
      return (
        <div className="w-full space-y-4">
          <div className="w-full rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-700/60 dark:bg-blue-900/20 dark:text-blue-100">
            <p className="mb-2 text-sm font-semibold">{t("carrierTitle")}</p>
            <ol className="list-decimal space-y-2 pl-4">
              <li>{t("carrierStep1")}</li>
              <li>{t("carrierStep2")}</li>
              <li>{t("carrierStep3", { amount: formattedAmount })}</li>
              <li>{t("carrierStep4")}</li>
            </ol>
            <p className="mt-3 text-xs text-blue-800/80 dark:text-blue-200/80">
              {t("carrierNote")}
            </p>
          </div>
        </div>
      );
    }

    if (isOtcChannel && otcCode) {
      return (
        <div className="w-full space-y-4">
          <PendingCopyBlock
            label={t("otcPaymentCodeLabel", { outlet: otcOutlet })}
            value={otcCode}
            copySuccess={t("copySuccess")}
          />
          <div className="w-full rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700/60 dark:bg-amber-900/20 dark:text-amber-100">
            <ol className="list-decimal space-y-2 pl-4">
              <li>{t("otcStep1", { outlet: otcOutlet, code: otcCode })}</li>
              <li>{t("otcStep2", { outlet: otcOutlet })}</li>
              <li>
                {t("otcStep3", {
                  outlet: otcOutlet,
                  code: otcCode,
                  amount: formattedAmount,
                })}
              </li>
              <li>{t("otcStep4")}</li>
            </ol>
          </div>
          {hasPaymentLink ? (
            <a
              href={data.payment_url}
              target="_blank"
              rel="noopener noreferrer"
              className={btnPrimary}
            >
              {t("continuePayment")}
            </a>
          ) : null}
        </div>
      );
    }

    return (
      <div className="flex w-full flex-col items-center gap-4">
        {hasQrVisual ? (
          <div className="flex w-full flex-col items-center gap-2">
            <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
              {isQrisChannel || paymentChannel.includes("qris")
                ? t("payWithQris")
                : t("payWithChannel", { channel: data.payment_channel })}
            </p>
            <button
              type="button"
              onClick={() => setQrOpen(true)}
              aria-label={t("enlargeQrHint")}
              className="group relative block cursor-zoom-in overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-200 hover:scale-[1.03] hover:shadow-md dark:border-gray-600 dark:bg-white"
            >
              <img
                src={qrImageSrc}
                alt={t("qrAlt")}
                className="h-40 w-40 object-contain"
              />
              <span className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 via-black/0 to-black/0 pb-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-900 shadow-sm">
                  {t("enlargeQrHint")}
                </span>
              </span>
            </button>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              {t("scanQrHint")}
            </p>
            {isHttpUrl(qrImageSrc) ? (
              <a
                href={qrImageSrc}
                download={`QR-${data.payment_channel}.png`}
                className="w-full inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-purple-600 hover:to-pink-600 hover:shadow-lg active:scale-95"
              >
                {t("downloadQr")}
              </a>
            ) : null}
          </div>
        ) : null}

        {hasQrRaw ? (
          <PendingCopyBlock
            label={t("qrCodePaymentLabel")}
            value={rawQrString}
            hint={t("qrCodeHint")}
            copySuccess={t("copySuccess")}
          />
        ) : null}

        {hasVaCopy && isVaChannel ? (
          <PendingCopyBlock
            label={t("vaNumberLabel")}
            value={vaNumber}
            hint={amountLabel}
            copySuccess={t("copySuccess")}
          />
        ) : null}

        {isEwallet && hasPaymentLink ? (
          <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
            {isOvoChannel
              ? t("ovoHint")
              : t("payUsing", { name: paymentDisplayName })}
          </p>
        ) : null}

        {hasVaCopy && !isVaChannel && !carrierOnly ? (
          <PendingCopyBlock
            label={t("paymentNumberLabel")}
            value={vaNumber}
            hint={amountLabel}
            copySuccess={t("copySuccess")}
          />
        ) : null}

        {hasPaymentLink && !isOvoChannel ? (
          <a
            href={data.payment_url}
            target="_blank"
            rel="noopener noreferrer"
            className={btnPrimary}
          >
            {t("continuePayment")}
          </a>
        ) : null}
      </div>
    );
  };

  const paid = data.status === "PAID";
  const failed = data.status === "FAILED";

  const trackerSteps = [
    {
      Icon: Check,
      title: t("trackCreated"),
      desc: t("trackCreatedDesc"),
      state: "done" as const,
    },
    {
      Icon: paid ? Check : failed ? X : Clock,
      title: t("trackPayment"),
      desc: paid
        ? t("trackPaymentDescPaid")
        : failed
          ? t("trackPaymentDescFailed")
          : t("trackPaymentDescPending"),
      state: (paid ? "done" : failed ? "failed" : "current") as
        | "done"
        | "failed"
        | "current",
    },
    {
      Icon: paid ? Check : failed ? Ban : Clock,
      title: t("trackCompleted"),
      desc: paid
        ? t("trackCompletedDescPaid")
        : failed
          ? t("trackCompletedDescFailed")
          : t("trackCompletedDescPending"),
      state: (paid ? "done" : failed ? "failed" : "idle") as
        | "done"
        | "failed"
        | "idle",
    },
  ];

  const bubbleMap = {
    done: "bg-green-500 text-white",
    current: "bg-yellow-500 text-white",
    failed: "bg-red-500 text-white",
    idle: "bg-gray-100 text-gray-400 dark:bg-white/10 dark:text-gray-500",
  };

  const titleMap = {
    done: "text-gray-900 dark:text-white",
    current: "text-yellow-700 dark:text-yellow-400",
    failed: "text-red-700 dark:text-red-400",
    idle: "text-gray-400 dark:text-gray-500",
  };

  const connectorColor = (nextState: string) =>
    nextState === "done"
      ? "bg-green-500"
      : nextState === "failed"
        ? "bg-red-500"
        : "bg-gray-200 dark:bg-white/10";

  const progressTracker = (
    <div className="w-full">
      <div className="relative">
        <div
          className={`absolute left-[16.6667%] top-[19px] h-[2px] w-[33.3333%] rounded-full transition-all duration-500 ${connectorColor(trackerSteps[1].state)}`}
        />
        <div
          className={`absolute left-[50%] top-[19px] h-[2px] w-[33.3333%] rounded-full transition-all duration-500 ${connectorColor(trackerSteps[2].state)}`}
        />

        <div className="relative grid grid-cols-3">
          {trackerSteps.map((step, i) => {
            const Icon = step.Icon;
            const isCurrent = step.state === "current";
            return (
              <div key={i} className="flex flex-col items-center gap-2 px-1">
                <div className="relative">
                  {isCurrent && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-yellow-500/40" />
                  )}
                  <div
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-all ${bubbleMap[step.state]}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-[11px] font-semibold uppercase tracking-wide ${titleMap[step.state]}`}
                  >
                    {step.title}
                  </div>
                  <div className="mt-0.5 line-clamp-2 text-[10px] text-gray-500 dark:text-gray-400">
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (progressOnly) {
    return (
      <div className={`w-full ${isEmbedded ? "" : "max-w-sm"}`}>
        <div
          className={`px-2 py-3 sm:px-3 sm:py-4 ${
            isEmbedded
              ? ""
              : "rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-purple-500/30 dark:bg-white/5"
          }`}
        >
          {progressTracker}
        </div>
      </div>
    );
  }

  const qrLightbox =
    qrOpen && qrImageSrc ? (
      <div
        role="dialog"
        aria-modal="true"
        onClick={() => setQrOpen(false)}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setQrOpen(false);
          }}
          aria-label={t("closeQr")}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>

        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex w-full max-w-md flex-col items-center gap-4"
        >
          <img
            src={qrImageSrc}
            alt={t("qrAlt")}
            className="h-auto w-full rounded-2xl bg-white p-4 shadow-2xl"
          />
          <p className="text-center text-xs text-white/80">{t("scanQrHint")}</p>
          {isHttpUrl(qrImageSrc) ? (
            <a
              href={qrImageSrc}
              download={`QR-${data.payment_channel}.png`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-md transition hover:from-purple-600 hover:to-pink-600 active:scale-95"
            >
              {t("downloadQr")}
            </a>
          ) : null}
        </div>
      </div>
    ) : null;

  return (
    <div className={`w-full ${isEmbedded ? "" : "max-w-sm"}`}>
      {qrLightbox}
      <div
        className={`flex flex-col items-center space-y-4 px-2 py-3 sm:px-3 sm:py-4 ${
          isEmbedded
            ? ""
            : "rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-purple-500/30 dark:bg-white/5"
        }`}
      >
        {showProgress ? progressTracker : null}

        <div
          className={`relative flex h-16 w-16 items-center justify-center rounded-full ${cfg.bg} ${cfg.text} ring-4 ${cfg.ring}`}
        >
          {(data.status === "PAID" || data.status === "FAILED") && (
            <span
              className={`absolute -right-1 -top-1 h-4 w-4 rounded-full ${
                data.status === "PAID" ? "bg-green-500" : "bg-red-500"
              }`}
            />
          )}
          {cfg.icon}
        </div>

        <h2 className={`text-lg font-semibold ${cfg.text}`}>{cfg.label}</h2>

        <div
          className={`w-full rounded-xl border px-4 py-3 text-center text-sm font-medium ${cfg.panel}`}
        >
          {data.status === "PAID"
            ? t("msgPaid")
            : data.status === "FAILED"
              ? t("msgFailed")
              : t("msgPending")}
        </div>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          {data.status === "PAID"
            ? t("notePaid")
            : data.status === "FAILED"
              ? t("noteFailed")
              : t("notePending")}
        </p>

        {data.status === "PENDING" ? renderPendingActions() : null}

        {data.status === "FAILED" && (
          <Link
            href={`/games/${data.detail_product?.game_slug}`}
            className={`mt-4 inline-flex w-full items-center justify-center rounded-2xl py-3 text-sm font-semibold text-white shadow-sm transition active:scale-[0.99] ${cfg.cta}`}
          >
            {t("retryTransaction")}
          </Link>
        )}

        {data.status === "PAID" && (
          <Link
            href={`/games/${data.detail_product?.game_slug}`}
            className={`mt-4 inline-flex w-full items-center justify-center rounded-2xl py-3 text-sm font-semibold text-white shadow-sm transition active:scale-[0.99] ${cfg.cta}`}
          >
            {t("buyAgain")}
          </Link>
        )}
      </div>
    </div>
  );
}
