import { AlertCircle } from 'lucide-react'
export default function NotesCard() {
  return (
    <div className="w-full max-w-md mx-auto px-4 mt-4">
      <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
        {/* Header */}
        <div className="mb-2 flex items-center gap-2">
          <AlertCircle className="text-orange-500" size={16} />
          <h3 className="text-sm font-semibold text-gray-800">Catatan</h3>
        </div>

        {/* Content */}
        <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700 leading-snug list-disc pl-4">
          <li>Salin no. transaksi jika transaksi tanpa login.</li>
          <li>Halaman tidak perlu kamu refresh, status transaksi akan update otomatis.</li>
          <li>
            Jika perlu bantuan, hubungi Customer Care Lapakgaming via WhatsApp{' '}
            <a
              href="https://wa.me/6281280000203"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline"
            >
              081280000203
            </a>
            .
          </li>
          <li>Selesaikan pembayaran sebelum batas waktu.</li>
          <li>Bayar sesuai nominal yang diminta, termasuk kode unik jika ada.</li>
          <li>Proses konfirmasi pembayaran otomatis 1–5 menit setelah kamu membayar.</li>
          <li>Jika beli voucher, cek email secara berkala untuk mendapatkan kode voucher.</li>
        </ul>
      </div>
    </div>
  )
}
