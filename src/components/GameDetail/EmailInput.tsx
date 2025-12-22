'use client'
import { Mail } from 'lucide-react'
import { OrderFormValues } from '../../schemas/order_schema'
import { UseFormRegister } from 'react-hook-form'

interface EmailProps {
  register: UseFormRegister<OrderFormValues>
  error?: string
}

export default function EmailInput({ register, error }: EmailProps) {
  return (
    <div className="relative">
      {/* Step Badge */}
      <div
        className="
      absolute -top-2 -left-2
      sm:-top-3 sm:-left-3
      w-7 h-7 sm:w-8 sm:h-8
      rounded-full
      flex items-center justify-center
      text-[11px] sm:text-xs font-bold
      bg-gradient-to-br from-purple-500 to-pink-500
      text-white
      shadow-md
      border-2 border-white dark:border-zinc-900
      z-10
    "
      >
        4
      </div>

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
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Email</h2>
          <Mail className="w-4 h-4 text-purple-400 dark:text-purple-300" />
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-purple-200 mb-4 text-xs leading-snug">
          Email digunakan untuk mengirimkan bukti pembayaran & status transaksi.
        </p>

        {/* Input */}
        <input
          type="email"
          required
          {...register('email')}
          placeholder="contoh@email.com"
          className="
        w-full px-4 py-3 rounded-2xl
        bg-white/80 dark:bg-white/20
        border border-gray-300 dark:border-white/30
        text-gray-900 dark:text-white
        placeholder-gray-400 dark:placeholder-purple-300
        focus:outline-none
        focus:border-purple-500
        focus:ring-2 focus:ring-purple-500/20
        focus:bg-white dark:focus:bg-white/30
        transition-all duration-200
        text-sm
      "
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </div>
  )
}
