import { Info } from 'lucide-react'
import { GetGameResponse } from '../../types/Game'

interface InputProps {
  InputGame: GetGameResponse
}

export default function InputGame({ InputGame }: InputProps) {
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
      {/* Title */}
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Masukkan Data Akun</h2>
        <Info className="w-4 h-4 text-purple-500 dark:text-purple-300" />
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-purple-200 mb-4 text-xs leading-snug">
        Masukkan data akun sesuai dengan yang tertera di dalam game untuk memproses top up.
      </p>

      {/* Inputs */}
      <div className="flex flex-col gap-4">
        {InputGame?.data?.input
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((input) => (
            <div key={input.id}>
              <label className="block text-sm font-semibold text-gray-800 dark:text-white mb-1">
                {input.label}
                {input.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              <input
                type={input.input_type}
                placeholder={input.placeholder}
                required={input.required}
                className="
              w-full px-4 py-3 rounded-2xl
              bg-white dark:bg-white/20
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
          ))}
      </div>
    </div>
  )
}
