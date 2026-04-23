"use client";

import { GetGameResponse } from "../../../types/Game";
import { useTranslations } from "next-intl";

interface DescriptionProps {
  game: GetGameResponse;
}

export default function DescriptionGame({ game }: DescriptionProps) {
  const t = useTranslations("GameCheckout");
  const isVoucher = game?.data?.category.name === "Voucher";

  return (
    <div
      id="description-game"
      className="
        relative
        w-full
        max-w-[600px]
        xl:max-w-[1030px]
        mx-auto
        px-4
        sm:px-0
      "
    >
      <div
        className="
        bg-black/5 dark:bg-white/5
        backdrop-blur-sm
        rounded-2xl sm:rounded-3xl
        p-5 sm:p-8
        border border-purple-500/30
        hover:border-purple-500
        transition-all duration-500
        shadow-xl
      "
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-2 sm:mb-3">
          <div className="w-1 h-5 sm:h-6 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
          <h2 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t("descriptionHeader")}
          </h2>
        </div>

        {/* Description */}
        <div
          className="
          text-sm
          leading-6 sm:leading-relaxed
          text-gray-700 dark:text-gray-300/90
          whitespace-pre-line
          break-words
        "
        >
          {game.data.description}
        </div>

        {/* Cara Top Up */}
        <div className="space-y-6  mt-2">
          <div className="text-sm leading-6 text-gray-700 dark:text-gray-300">
            <h3 className="mb-2 text-sm sm:text-base font-semibold text-purple-600 dark:text-purple-400">
              {game.data.category.name === "Voucher"
                ? t("howToRedeemTitle", { name: game.data.name })
                : t("howToTopUpTitle", { name: game.data.name })}
            </h3>
            {!isVoucher && (
              <div className="space-y-2">
                <ol className="list-decimal list-inside space-y-1">
                  <li>{t("topupStep1")}</li>
                  <li>{t("topupStep2")}</li>
                  <li>{t("topupStep3")}</li>
                  <li>{t("topupStep4")}</li>
                  <li>{t("topupStep5")}</li>
                  <li>{t("topupStep6")}</li>
                  <li>{t("topupStep7")}</li>
                  <li>{t("topupStep8")}</li>
                  <li>{t("topupStep9")}</li>
                </ol>
              </div>
            )}
            {isVoucher && (
              <div className="space-y-2">
                <ol className="list-decimal list-inside space-y-1">
                  <li>{t("voucherStep1")}</li>
                  <li>{t("voucherStep2")}</li>
                  <li>{t("voucherStep3")}</li>
                  <li>{t("voucherStep4")}</li>
                  <li>{t("voucherStep5")}</li>
                  <li>{t("voucherStep6")}</li>
                  <li>{t("voucherStep7")}</li>
                  <li>{t("voucherStep8")}</li>
                  <li>{t("voucherStep9")}</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
