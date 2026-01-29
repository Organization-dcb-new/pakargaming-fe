'use client'

import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'
import { GetGameResponse, Price } from '../../types/Game'
import { formatPrice } from '../../utils/format_price'

interface ProductComponentProps {
  game: GetGameResponse
  activeProduct: Price | null
  step?: number
}

export function ProductComponent({ game, activeProduct, step = 2 }: ProductComponentProps) {
  return (
    <div className="relative w-[350px] sm:w-150 mt-5 ">
      {/* Step Badge */}
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md border-2 border-white dark:border-zinc-900 z-10">
        {step}
      </div>

      <div className="bg-black/5 dark:bg-white/10 backdrop-blur-lg rounded-3xl p-4 sm:p-6 border border-purple-500/30 hover:border-purple-500 transition-all duration-300 shadow-xl">
        {/* Title */}
        <h2 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
          Pilih Nominal Top Up
        </h2>

        {/* Package Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
          {game?.data?.product.map((pkg) => {
            const isSelected = activeProduct?.id === pkg.id

            return (
              <div
                key={pkg.id}
                className={`
          relative cursor-pointer rounded-xl p-2
          transition-all duration-300
          ${
            isSelected
              ? 'border-2 border-purple-500 bg-white dark:bg-white/20 shadow-md scale-[1.02]'
              : 'border border-purple-500/30 bg-white/80 dark:bg-white/20 hover:border-purple-500 hover:bg-white dark:hover:bg-white/30 hover:scale-[1.01]'
          }
        `}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-purple-500 rounded-full p-1 shadow-md">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                )}
                <p className="text-xs sm:text-xs md:text-xs font-semibold text-gray-900 dark:text-white text-center mb-0.5">
                  {pkg.name.split('(').map((part, idx, arr) => (
                    <span key={idx}>
                      {idx > 0 ? '(' : ''}
                      {part}
                      {idx < arr.length - 1 && <br />}
                    </span>
                  ))}
                </p>
                <div className="flex items-center p-1 rounded">
                  <div className="flex-shrink-0 w-[50px] sm:w-[60px] ">
                    <Image
                      src={
                        pkg.image ||
                        'https://s3.nevaobjects.id/image-dev/uploads/20260123164455.webp'
                      }
                      alt="img-product"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>

                  <p className="flex-1 text-xs  font-bold text-purple-600 dark:text-purple-400 text-center">
                    Rp. {formatPrice(pkg.selling_price)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
