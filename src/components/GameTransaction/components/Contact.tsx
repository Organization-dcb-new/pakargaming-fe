'use client'
import { Mail } from 'lucide-react'

interface ContactFormProps {
  step?: number
  setSelectedEmail: React.Dispatch<React.SetStateAction<string | null>>
  email: string
}

export default function ContactForm({ step, setSelectedEmail, email }: ContactFormProps) {
  return (
    <div className="relative w-full sm:w-150 ">
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
        {step}
      </div>

      <div className="bg-black/5 dark:bg-white/10  rounded-3xl p-4 sm:p-6 border border-purple-500/30 hover:border-purple-500 transition-all duration-300 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            Email <span className="text-red-500">*</span>
          </h2>
          <Mail className="w-4 h-4 text-purple-400 dark:text-purple-300" />
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-purple-200 mb-4 text-xs leading-snug">
          Email digunakan untuk mengirim kode voucher & bukti transaksi
        </p>
        {/* Input */}
        <input
          type="email"
          value={email ?? ''}
          required
          onChange={(e) => setSelectedEmail(e.target.value)}
          placeholder="contoh@email.com"
          className="
    w-full px-4 py-3 rounded-2xl
    bg-white/80 dark:bg-white/20
    border border-purple-500/50 dark:border-purple-300
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
      </div>
    </div>
  )
}
