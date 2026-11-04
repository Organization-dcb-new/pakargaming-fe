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
    <section
      id="description-game"
      aria-labelledby="description-game-title"
      className="rounded-2xl border border-border bg-card p-5 sm:p-8"
    >
      <div className="mb-4 flex items-center gap-3">
        <span aria-hidden className="h-6 w-1.5 shrink-0 -skew-x-12 bg-gradient-brand" />
        <h2
          id="description-game-title"
          className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl"
        >
          {t("descriptionHeader")}
        </h2>
      </div>

      <div className="max-w-prose space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p className="whitespace-pre-line break-words">{game.data.description}</p>

        <div>
          <h3 className="mb-2 font-display text-base font-semibold text-primary">
            {isVoucher
              ? t("howToRedeemTitle", { name: game.data.name })
              : t("howToTopUpTitle", { name: game.data.name })}
          </h3>
          <ol className="list-inside list-decimal space-y-1 marker:font-semibold marker:text-foreground">
            {!isVoucher ? (
              <>
                  <li>{t("topupStep1")}</li>
                  <li>{t("topupStep2")}</li>
                  <li>{t("topupStep3")}</li>
                  <li>{t("topupStep4")}</li>
                  <li>{t("topupStep5")}</li>
                  <li>{t("topupStep6")}</li>
                  <li>{t("topupStep7")}</li>
                  <li>{t("topupStep8")}</li>
                  <li>{t("topupStep9")}</li>
              </>
            ) : (
              <>
                  <li>{t("voucherStep1")}</li>
                  <li>{t("voucherStep2")}</li>
                  <li>{t("voucherStep3")}</li>
                  <li>{t("voucherStep4")}</li>
                  <li>{t("voucherStep5")}</li>
                  <li>{t("voucherStep6")}</li>
                  <li>{t("voucherStep7")}</li>
                  <li>{t("voucherStep8")}</li>
                  <li>{t("voucherStep9")}</li>
              </>
            )}
          </ol>
        </div>
      </div>
    </section>
  );
}
