"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { FOOTER_SOCIAL } from "../../Footer/config";

interface FAQItem {
  question: string;
  answer: string | JSX.Element;
}

export default function FAQSection() {
  const t = useTranslations("GameCheckout");
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqData: FAQItem[] = useMemo(
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
              href={FOOTER_SOCIAL.instagram}
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

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      aria-labelledby="faq-title"
      className="rounded-2xl border border-border bg-card p-5 sm:p-8"
    >
      <div className="mb-5 flex items-center gap-3">
        <span aria-hidden className="h-6 w-1.5 shrink-0 -skew-x-12 bg-gradient-brand" />
        <h2
          id="faq-title"
          className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl"
        >
          {t("faqTitle")}
        </h2>
      </div>

      <div className="space-y-3">
        {faqData.map((item, index) => {
          const isOpen = activeIndex === index;
          return (
            <div key={index} className="overflow-hidden rounded-xl border border-border">
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring motion-reduce:transition-none"
              >
                <span className="font-semibold text-foreground">{item.question}</span>
                <ChevronDown
                  aria-hidden
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 motion-reduce:transition-none ${
                    isOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              <div
                id={`faq-panel-${index}`}
                className={`overflow-hidden px-4 transition-all duration-300 ease-in-out motion-reduce:transition-none ${
                  isOpen ? "max-h-[500px] py-3 opacity-100" : "max-h-0 py-0 opacity-0"
                }`}
              >
                <div className="max-w-prose text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
