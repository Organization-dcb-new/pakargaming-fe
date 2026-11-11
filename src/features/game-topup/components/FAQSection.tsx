"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { SOCIAL_LINKS } from "@/config/site"
import FaqPanel, { type FaqItem } from '@/components/FaqPanel'

export default function FAQSection() {
  const t = useTranslations("GameCheckout");

  const faqData: FaqItem[] = useMemo(
    () => [
      { question: t("faq1q"), answer: t("faq1a") },
      { question: t("faq2q"), answer: t("faq2a") },
      {
        question: t("faq3q"),
        answer: (
          <ul className="list-disc list-inside space-y-1">
            <li>{t("faq3Li1")}</li>
            <li>{t("faq3Li2")}</li>
            <li>{t("faq3Li3")}</li>
            <li>{t("faq3Li4")}</li>
          </ul>
        ),
      },
      {
        question: t("faq4q"),
        answer: (
          <ul className="list-disc list-inside space-y-1">
            <li>{t("faq4Li1")}</li>
            <li>{t("faq4Li2")}</li>
            <li>{t("faq4Li3")}</li>
            <li>{t("faq4Li4")}</li>
          </ul>
        ),
      },
      {
        question: t("faq5q"),
        answer: (
          <div className="space-y-2">
            <p>{t("faq5P1")}</p>
            <ul className="list-disc list-inside space-y-1">
              <li>{t("faq5Li1")}</li>
              <li>{t("faq5Li2")}</li>
            </ul>
            <p>{t("faq5P2")}</p>
          </div>
        ),
      },
      {
        question: t("faq6q"),
        answer: (
          <div>
            <p>{t("faq6P1")}</p>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              {t("faq6Link")}
            </a>
          </div>
        ),
      },
    ],
    [t],
  );

  return <FaqPanel id="faq" title={t("faqTitle")} items={faqData} />;
}
