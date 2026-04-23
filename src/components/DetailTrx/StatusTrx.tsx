"use client";

import { useCallback, useState } from "react";
import { Check, X, Clock, Copy } from "lucide-react";
import { PaymentDataWithDetailProduct } from "../../types/Transaction";
import { Link } from "../../i18n/routing";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface TransactionStatusCardProps {
  data?: PaymentDataWithDetailProduct;
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
  "w-full rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:from-pink-600 hover:to-purple-700 active:scale-95 transition-all duration-200 flex justify-center items-center";

export default function TransactionStatusCard({
  data,
}: TransactionStatusCardProps) {
  const t = useTranslations("TransactionStatus");

  if (!data) {
    return null;
  }

  const statusConfig = {
    PAID: {
      label: t("statusSuccess"),
      icon: <Check size={24} />,
      bg: "bg-green-100 dark:bg-green-900",
      text: "text-green-700 dark:text-green-400",
    },
    FAILED: {
      label: t("statusFailed"),
      icon: <X size={24} />,
      bg: "bg-red-100 dark:bg-red-900",
      text: "text-red-700 dark:text-red-400",
    },
    PENDING: {
      label: t("statusPending"),
      icon: <Clock size={24} />,
      bg: "bg-yellow-100 dark:bg-yellow-900",
      text: "text-yellow-700 dark:text-yellow-400",
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
        <div className="flex w-full flex-col items-center gap-4">
          <div className={btnPrimary}>{t("checkOtp")}</div>
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
            <img
              src={qrImageSrc}
              alt={t("qrAlt")}
              className="h-40 w-40 rounded-lg border border-gray-300 object-contain shadow-sm dark:border-gray-600"
            />
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

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col items-center space-y-4 rounded-2xl border border-gray-200 bg-white px-6 py-8 shadow-sm dark:border-purple-500/30 dark:bg-white/5">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full ${cfg.bg} ${cfg.text}`}
        >
          {cfg.icon}
        </div>

        <h2 className={`text-lg font-semibold ${cfg.text}`}>{cfg.label}</h2>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          {data.status === "PAID"
            ? t("msgPaid")
            : data.status === "FAILED"
              ? t("msgFailed")
              : t("msgPending")}
        </p>

        {data.status === "PENDING" ? renderPendingActions() : null}

        {data.status === "FAILED" && (
          <Link
            href={`/games/${data.detail_product?.game_slug}`}
            className="
              mt-4 w-full inline-flex justify-center items-center
              rounded-2xl
              bg-gradient-to-r from-red-500 to-red-700
              py-3 text-sm font-semibold text-white
              shadow-md hover:shadow-lg
              hover:from-red-600 hover:to-red-800
              active:scale-95
              transition-all duration-200
            "
          >
            {t("retryTransaction")}
          </Link>
        )}

        {data.status === "PAID" && (
          <Link
            href={`/games/${data.detail_product?.game_slug}`}
            className="
              mt-4 w-full inline-flex justify-center items-center
              rounded-2xl
              bg-gradient-to-r from-blue-500 to-blue-700
              py-3 text-sm font-semibold text-white
              shadow-md hover:shadow-lg
              hover:from-blue-600 hover:to-blue-800
              active:scale-95
              transition-all duration-200
            "
          >
            {t("buyAgain")}
          </Link>
        )}
      </div>
    </div>
  );
}
