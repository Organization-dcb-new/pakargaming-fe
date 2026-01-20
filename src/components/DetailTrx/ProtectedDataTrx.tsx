import { ShieldAlert } from 'lucide-react'

export default function ProtectDataCard() {
  return (
    <div className="w-full max-w-md mx-auto px-4 mt-4">
      <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
        {/* Header */}
        <div className="mb-1.5 flex items-center gap-2">
          <ShieldAlert className="text-blue-600" size={16} />
          <h3 className="text-sm font-semibold text-gray-800">Protect Your Data</h3>
        </div>

        {/* Sub title */}
        <p className="mb-2 text-xs font-medium text-gray-600">Jaga Keamanan Datamu</p>

        {/* Content */}
        <p className="text-xs sm:text-sm text-gray-700 leading-snug">
          Data & bukti pembayaran itu <span className="font-semibold text-red-600">rahasia</span>.
          Jangan berikan ke siapapun kecuali pihak resmi Ambagaming{' '}
          <span className="font-medium">(jika perlu)</span>.
        </p>
      </div>
    </div>
  )
}
