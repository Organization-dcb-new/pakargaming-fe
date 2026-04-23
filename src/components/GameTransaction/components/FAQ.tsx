"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

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
              href="https://www.instagram.com/pakargaming.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
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
    <div className="w-full max-w-[1030px] mx-auto px-4 sm:px-0 mt-12">
      <div className="bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            {t("faqTitle")}
          </h2>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border border-purple-500/20 rounded-xl overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                className="w-full text-left px-4 py-3 flex justify-between items-center hover:bg-purple-500/5 transition-all"
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.question}
                </span>
                <span
                  className={`transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    className={`w-5 h-5 text-purple-500 transition-all duration-300 ease-in-out ${
                      activeIndex === index
                        ? "rotate-180 scale-110"
                        : "rotate-0 scale-100 opacity-70"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>

              <div
                className={`px-4 transition-all duration-300 ease-in-out overflow-hidden ${
                  activeIndex === index
                    ? "max-h-[500px] py-3 opacity-100"
                    : "max-h-0 py-0 opacity-0"
                }`}
              >
                <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
