import { X, Clock, Check } from 'lucide-react'

export default function TransactionTracking() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="rounded-3xl border border-gray-200 bg-white px-4 py-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-gray-900">
          Status Transaksi
        </h2>

        {/* TRACKING */}
        <div className="grid grid-cols-3">
          {/* STEP 1 */}
          <div className="relative flex flex-col items-center">
            {/* right line */}
            <div className="absolute right-0 top-4 h-0.5 w-[calc(50%-16px)] bg-gray-200" />

            <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white">
              <X size={16} />
            </div>

            <p className="mt-2 text-sm font-semibold text-red-600">Bayar</p>
            <p className="text-xs text-gray-500 text-center">
              Lewat batas waktu
            </p>
            <p className="text-[11px] text-gray-400">
              20 Jan 2026 • 11:20
            </p>
          </div>

          {/* STEP 2 */}
          <div className="relative flex flex-col items-center opacity-60">
            {/* left line */}
            <div className="absolute left-0 top-4 h-0.5 w-[calc(50%-16px)] bg-gray-200" />
            {/* right line */}
            <div className="absolute right-0 top-4 h-0.5 w-[calc(50%-16px)] bg-gray-200" />

            <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-white">
              <Clock size={16} />
            </div>

            <p className="mt-2 text-sm font-medium text-gray-600">Diproses</p>
            <p className="text-xs text-gray-500 text-center">
              Menunggu pembayaran
            </p>
          </div>

          {/* STEP 3 */}
          <div className="relative flex flex-col items-center opacity-60">
            {/* left line */}
            <div className="absolute left-0 top-4 h-0.5 w-[calc(50%-16px)] bg-gray-200" />

            <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-white">
              <Check size={16} />
            </div>

            <p className="mt-2 text-sm font-medium text-gray-600">Selesai</p>
            <p className="text-xs text-gray-500 text-center">
              Transaksi selesai
            </p>
          </div>
        </div>

        {/* ALERT */}
        <div className="mt-4 rounded-2xl bg-red-100 px-4 py-3">
          <p className="text-sm font-semibold text-gray-900">
            Udah lewat batas waktu bayar
          </p>
          <p className="text-xs text-gray-700">
            Kamu bisa buat transaksi baru.
          </p>
        </div>

        {/* BUTTON */}
        <button className="mt-4 w-full rounded-full bg-blue-800 py-3 text-sm font-semibold text-white hover:bg-blue-900 transition">
          Beli lagi
        </button>
      </div>
    </div>
  )
}
