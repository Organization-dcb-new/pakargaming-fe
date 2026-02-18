"use client";

import { GetGameResponse } from "../../../types/Game";

interface DescriptionProps {
  game: GetGameResponse;
}

export default function DescriptionGame({ game }: DescriptionProps) {
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
            Deskripsi Game
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
                ? `Cara Redeem Voucher di ${game.data.name}`
                : `Cara Top Up ${game.data.name}`}
            </h3>
            {!isVoucher && (
              <div className="space-y-2">
                <ol className="list-decimal list-inside space-y-1">
                  <li>Masukan Data Akun</li>
                  <li>Pilih Server (Jika ada)</li>
                  <li>Pilih Nominal</li>
                  <li>Masukan jumlah pembelian</li>
                  <li>Pilih Metode Pembayaran</li>
                  <li>Masukan Email</li>
                  <li>Masukan Kode Promo (Jika ada)</li>
                  <li>Klik Beli dan Lakukan Pembayaran</li>
                  <li>Selesai</li>
                </ol>
              </div>
            )}
            {isVoucher && (
              <div className="space-y-2">
                <ol className="list-decimal list-inside space-y-1">
                  <li>Pilih Nominal</li>
                  <li>Masukan jumlah pembelian</li>
                  <li>Pilih Metode Pembayaran</li>
                  <li>Masukan Email (Wajib)</li>
                  <li>Masukan Kode Promo (Jika ada)</li>
                  <li>Klik Beli dan Lakukan Pembayaran</li>
                  <li>
                    Cek Email atau Menu Transaksi untuk melihat Kode Voucher
                  </li>
                  <li>Redeem Kode Voucher di websitenya</li>
                  <li>Selesai</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
