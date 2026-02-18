'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string | JSX.Element
}

const faqData: FAQItem[] = [
  {
    question: 'Metode pembayaran apa saja yang tersedia?',
    answer: (
      <ul className="list-disc list-inside space-y-1">
        <li>E-Wallet (OVO, DANA, GoPay, ShopeePay)</li>
        <li>QRIS (Semua aplikasi yang mendukung QRIS)</li>
        <li>Transfer Bank</li>
        <li>Virtual Account (BCA, BRI, BNI, Mandiri, dll)</li>
      </ul>
    ),
  },
  {
    question: 'Apakah pembayaran di Pakargaming aman?',
    answer:
      'Ya, semua transaksi pembayaran diproses melalui sistem payment gateway yang aman dan terenkripsi. Data pembayaran kamu tidak disimpan oleh sistem kami.',
  },
  {
    question: 'Berapa lama pembayaran terverifikasi?',
    answer:
      'Pembayaran menggunakan E-Wallet dan QRIS biasanya terverifikasi otomatis dalam hitungan detik. Untuk transfer bank, proses bisa memakan waktu 1–5 menit tergantung sistem bank.',
  },
  {
    question: 'Kenapa pembayaran saya gagal?',
    answer: (
      <div className="space-y-2">
        <p>Beberapa penyebab umum pembayaran gagal:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Saldo tidak mencukupi</li>
          <li>Waktu pembayaran sudah melewati batas</li>
          <li>Koneksi internet terputus saat proses pembayaran</li>
          <li>Kesalahan saat memasukkan nominal transfer</li>
        </ul>
      </div>
    ),
  },
  {
    question: 'Apakah bisa membatalkan transaksi?',
    answer:
      'Transaksi yang belum dibayar akan otomatis dibatalkan oleh sistem setelah melewati batas waktu pembayaran. Jika sudah dibayar, transaksi tidak bisa dibatalkan.',
  },
  {
    question: 'Bagaimana jika saldo sudah terpotong tapi status belum berhasil?',
    answer: (
      <div className="space-y-2">
        <p>Jika saldo sudah terpotong tetapi status transaksi belum berhasil:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Tunggu 5–15 menit untuk proses sinkronisasi otomatis</li>
          <li>Cek kembali status transaksi di halaman riwayat</li>
        </ul>
        <p>
          Jika masih bermasalah, segera hubungi Customer Service dengan menyertakan bukti
          pembayaran.
        </p>
      </div>
    ),
  },
]

export default function PaymentFAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className="w-full max-w-[1030px] mx-auto px-4 sm:px-0 mt-12">
      <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-200 dark:border-purple-500/30 shadow-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
          <h2
            className="text-base sm:text-lg
 font-semibold text-gray-900 dark:text-white"
          >
            FAQ Pembayaran
          </h2>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border border-purple-500/20 rounded-xl overflow-hidden transition-all"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full text-left px-4 py-3 flex justify-between items-center hover:bg-purple-500/5 transition-all"
              >
                <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                  {item.question}
                </span>

                <svg
                  className={`w-5 h-5 text-purple-500 transition-all duration-300 ${
                    activeIndex === index ? 'rotate-180 scale-110' : 'rotate-0 scale-100 opacity-70'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`px-4 transition-all duration-300 ease-in-out overflow-hidden ${
                  activeIndex === index
                    ? 'max-h-[500px] py-3 opacity-100'
                    : 'max-h-0 py-0 opacity-0'
                }`}
              >
                <div
                  className="text-xs sm:text-sm
 text-gray-700 dark:text-gray-300 leading-relaxed"
                >
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
