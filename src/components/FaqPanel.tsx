"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { HudPanel } from "@/components/ui/hud-panel";

export interface FaqItem {
  question: string;
  answer: ReactNode;
}

interface FaqPanelProps {
  /** Prefix id unik per halaman — dipakai untuk id judul, tombol, dan panel jawaban */
  id: string;
  title: ReactNode;
  items: FaqItem[];
  className?: string;
}

/**
 * Panel FAQ gaya HUD: judul berbilah miring + akordeon bernomor (01, 02, …), satu item terbuka.
 * Dipakai halaman top-up (FAQSection) dan detail transaksi (PaymentFAQ) supaya tampilannya sama.
 */
export default function FaqPanel({ id, title, items, className }: FaqPanelProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <HudPanel
      as="section"
      aria-labelledby={`${id}-title`}
      accent={false}
      className={className}
      innerClassName="p-5 sm:p-8"
    >
      <div className="mb-5 flex items-center gap-3">
        <span aria-hidden className="h-6 w-1.5 shrink-0 -skew-x-12 bg-gradient-brand" />
        <h2
          id={`${id}-title`}
          className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl"
        >
          {title}
        </h2>
      </div>

      <div className="space-y-2.5">
        {items.map((item, index) => {
          const isOpen = activeIndex === index;
          return (
            // Dua lapis: luar = warna garis (clip-path memotong border biasa), dalam = isi kartu.
            // Lapis dalam WAJIB bg-card solid — warna transparan di sini membuat warna garis tembus ke seluruh kartu.
            // Sorotan item terbuka = gradient tipis lewat background-image di atas bg-card.
            <div
              key={index}
              className={`chamfer p-px transition-colors duration-200 [--chamfer:12px] motion-reduce:transition-none ${
                isOpen ? "bg-primary/50" : "bg-border hover:bg-primary/40"
              }`}
            >
              <div
                className={`chamfer relative bg-card [--chamfer:11.6px] ${
                  isOpen ? "bg-linear-to-r from-primary/10 to-transparent to-60%" : ""
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-y-0 left-0 w-0.5 bg-primary transition-opacity duration-200 motion-reduce:transition-none ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                />
                <button
                  type="button"
                  id={`${id}-trigger-${index}`}
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`${id}-panel-${index}`}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:gap-4 sm:px-5"
                >
                  <span
                    aria-hidden
                    className={`w-6 shrink-0 font-display text-sm font-bold tabular-nums transition-colors duration-200 motion-reduce:transition-none ${
                      isOpen ? "text-primary" : "text-muted-foreground/70"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-semibold text-foreground">{item.question}</span>
                  <ChevronDown
                    aria-hidden
                    className={`h-5 w-5 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${
                      isOpen ? "rotate-180 text-primary" : "text-muted-foreground"
                    }`}
                  />
                </button>

                <div
                  id={`${id}-panel-${index}`}
                  role="region"
                  aria-labelledby={`${id}-trigger-${index}`}
                  hidden={!isOpen}
                  className="pb-4 pl-[3.25rem] pr-4 animate-in fade-in-0 slide-in-from-top-1 duration-200 motion-reduce:animate-none sm:pl-[3.75rem] sm:pr-5"
                >
                  <div className="max-w-prose text-sm leading-relaxed text-muted-foreground">{item.answer}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </HudPanel>
  );
}
