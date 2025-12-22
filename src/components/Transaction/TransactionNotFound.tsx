import { XCircle } from "lucide-react";

export function TransactionNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-xl space-y-4">
        <XCircle className="w-14 h-14 text-red-500 mx-auto" />

        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Transaksi Tidak Ditemukan
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Order ID tidak valid atau transaksi sudah tidak tersedia.
        </p>

        <button
          onClick={() => (window.location.href = '/')}
          className="
            mt-4 w-full rounded-full py-3 cursor-pointer
            bg-gradient-to-r from-pink-500 to-purple-600
            hover:from-pink-600 hover:to-purple-700
            text-white font-semibold
            transition active:scale-95
          "
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  )
}
