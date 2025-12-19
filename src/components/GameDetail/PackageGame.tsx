import { CheckCircle2 } from 'lucide-react'
import { GetGameResponse, Price } from '../../types/Game'
import Image from 'next/image'
import { formatPrice } from '../../utils/format_price'

interface PackageGameProps {
  PackageGame: GetGameResponse
  activePackage: Price | null
  setSelectedPackage: (pkg: Price) => void
}
export default function PackageGame({
  PackageGame,
  activePackage,
  setSelectedPackage,
}: PackageGameProps) {
  return (
    <div
      className="
     dark:bg-white/10
    bg-black/5
    backdrop-blur-lg
    rounded-3xl
    p-5 mb-6
    border border-white/20 dark:border-white/20

    shadow-xl
  "
    >
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Pilih Nominal Top Up</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PackageGame?.data?.product.map((pkg) => {
          const isSelected = activePackage?.id === pkg.id

          return (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg)}
              className={`relative cursor-pointer rounded-2xl p-3 transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 border border-white shadow-md scale-[1.02]'
                  : 'bg-white/80 dark:bg-white/20 border border-gray-300 dark:border-white/30 hover:bg-white dark:hover:bg-white/30 hover:scale-[1.01]'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              )}

              <div className="flex justify-center">
                <div className="relative w-full max-w-[100px] aspect-[4/5]">
                  <Image src={pkg.image} alt={pkg.name} fill style={{ objectFit: 'contain' }} />
                </div>
              </div>

              <h3 className="text-sm font-semibold text-gray-900 dark:text-white text-center mb-0.5">
                {pkg.name}
              </h3>

              <div className="text-center">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  Rp. {formatPrice(pkg.selling_price)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
