'use client'
import { Mail } from 'lucide-react'

interface EmailProps {
  email: string
  setEmail: (email: string) => void
}

export default function EmailInput({ email, setEmail }: EmailProps) {
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
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Email</h2>
        <Mail className="w-4 h-4 text-purple-400 dark:text-purple-300" />
      </div>

      <p className="text-gray-600 dark:text-purple-200 mb-3 text-xs leading-snug">
        Email digunakan untuk mengirimkan bukti pembayaran & status transaksi.
      </p>

      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="contoh@email.com"
        className="
      w-full px-4 py-3 rounded-2xl
      bg-white/80 dark:bg-white/20
      border border-gray-300 dark:border-white/30
      text-gray-900 dark:text-white
      placeholder-gray-400 dark:placeholder-purple-300
      focus:outline-none
      focus:border-purple-500
      focus:bg-white dark:focus:bg-white/30
      transition-all
      text-sm
    "
      />
    </div>
  )
}
