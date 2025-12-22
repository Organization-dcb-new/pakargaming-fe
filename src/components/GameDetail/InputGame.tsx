'use client'

import { AlertCircle, Info } from 'lucide-react'
import { Controller, Control, FieldErrors } from 'react-hook-form'
import { GetGameResponse } from '../../types/Game'
import { OrderFormValues } from '../../schemas/order_schema'

interface InputProps {
  InputGame: GetGameResponse
  control: Control<OrderFormValues>
  errors: FieldErrors<OrderFormValues>
}

export default function InputGame({ InputGame, control, errors }: InputProps) {
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
        1
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
        {/* Title */}
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            Masukkan Data Akun
          </h2>
          <Info className="w-4 h-4 text-purple-500 dark:text-purple-300" />
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-purple-200 mb-4 text-xs leading-snug">
          Masukkan data akun sesuai dengan yang tertera di dalam game untuk memproses top up.
        </p>

        {/* Dynamic Inputs */}
        <div className="flex flex-col gap-4">
          {InputGame?.data?.input
            ?.sort((a, b) => a.sort_order - b.sort_order)
            .map((input) => (
              <Controller
                key={input.id}
                name={`game_data.${input.key}`}
                control={control}
                defaultValue=""
                rules={{
                  required: input.required ? `${input.label} wajib diisi` : false,
                }}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-white mb-1">
                      {input.label}
                      {input.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    <input
                      {...field}
                      type={input.input_type}
                      placeholder={input.placeholder}
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
                    {errors?.game_data?.[input.key] && (
                      <div className="mt-2 flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        {errors.game_data[input.key]?.message}
                      </div>
                    )}
                  </div>
                )}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
