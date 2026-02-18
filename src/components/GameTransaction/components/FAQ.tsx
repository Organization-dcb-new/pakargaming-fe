"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string | JSX.Element;
}

const faqData: FAQItem[] = [
  {
    question: "Apakah aman melakukan top up di Pakargaming?",
    answer: `Ya, 100% aman. Kamu tidak perlu login ke akun game. Cukup masukkan User ID / Server ID dan lakukan pembayaran. Item akan langsung terkirim otomatis ke akunmu dengan data tetap terlindungi.`,
  },
  {
    question: "Berapa lama item masuk ke akun saya?",
    answer: `Proses sangat cepat, hanya beberapa detik setelah pembayaran berhasil.`,
  },
  {
    question: "Metode pembayaran apa saja yang tersedia di Pakargaming?",
    answer: (
      <ul className="list-disc list-inside space-y-1">
        <li>E-Wallets</li>
        <li>QRIS</li>
        <li>Transfer Bank</li>
        <li>Virtual Account & metode lainnya</li>
      </ul>
    ),
  },
  {
    question: "Bagaimana cara mengetahui ID saya?",
    answer: (
      <ul className="list-disc list-inside space-y-1">
        <li>Buka aplikasi game</li>
        <li>Tekan ikon profil di layar utama</li>
        <li>Lihat nomor ID di bawah nama karakter</li>
        <li>Salin dan gunakan saat top up di Pakargaming</li>
      </ul>
    ),
  },
  {
    question: "Mengapa item saya belum masuk setelah bayar?",
    answer: (
      <div className="space-y-2">
        <p>Jika lebih dari 15 menit item belum masuk, cek kembali:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>User ID sudah benar atau belum</li>
          <li>Status pembayaran berhasil atau tidak</li>
        </ul>
        <p>
          Jika masih bermasalah, hubungi CS Pakargaming melalui Chat Support /
          WhatsApp untuk bantuan.
        </p>
      </div>
    ),
  },
  {
    question: "Apakah ada promo di Pakargaming?",
    answer: (
      <div>
        <p>
          Tentu! Ada diskon dan event menarik. Ikuti sosial media resmi
          Pakargaming agar selalu update.
        </p>
        <a
          href="https://www.instagram.com/pakargaming.id/"
          target="_blank"
          className="text-purple-600 hover:underline"
        >
          Instagram Pakargaming
        </a>
      </div>
    ),
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-[1030px] mx-auto px-4 sm:px-0 mt-12">
      <div className="bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            FAQ
          </h2>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border border-purple-500/20 rounded-xl overflow-hidden transition-all"
            >
              {/* Question */}
              <button
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
                  {/* Arrow Icon */}
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

              {/* Answer */}
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
