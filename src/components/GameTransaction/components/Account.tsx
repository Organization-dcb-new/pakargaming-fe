'use client'
import { useForm } from 'react-hook-form'
import { useEffect, useRef } from 'react'
import { GameDetail, GameInput } from '../../../types/Game'
import { useCheckIDV2 } from '../hooks/useCheckID'

type DynamicAccount = Record<string, any>

interface AccountCardProps {
  gameData: GameInput[]
  step?: number
  game: GameDetail
  setAccount: React.Dispatch<React.SetStateAction<DynamicAccount | null>>
  account: DynamicAccount
}

export default function AccountCard({
  gameData,
  step = 1,
  game,
  setAccount,
  account,
}: AccountCardProps) {
  const { mutate, isPending, data } = useCheckIDV2()

  const { register, watch } = useForm<Record<string, string>>({
    mode: 'onChange',
  })

  const values = watch()

  const hasCheckedRef = useRef(false)
  const lastPayloadRef = useRef<string>('')

  useEffect(() => {
    if (data?.username) {
      const newAccount = {
        ...values,
      }
      setAccount(newAccount)
    }
  }, [data])

  useEffect(() => {
    hasCheckedRef.current = false
  }, [values])

  useEffect(() => {
    const requiredFilled = gameData.filter((g) => g.required).every((g) => values[g.key])

    if (!requiredFilled) {
      hasCheckedRef.current = false
      return
    }

    const payloadString = JSON.stringify(values)

    if (payloadString === lastPayloadRef.current) return

    if (hasCheckedRef.current) return

    const t = setTimeout(() => {
      mutate({
        category_code: game.code,
        game_id: game.id,
        provider_id: game.provider_id,
        game_data: values,
      })

      hasCheckedRef.current = true
      lastPayloadRef.current = payloadString
    }, 500)

    return () => clearTimeout(t)
  }, [data, values, game.id, setAccount, account])

  return (
    <div id="account-section" className="relative w-full sm:w-150 ">
      {/* Step Badge */}
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md border-2 border-white dark:border-zinc-900 z-10">
        {step}
      </div>

      <div className="bg-black/5 dark:bg-white/10 backdrop-blur-lg rounded-3xl p-4 sm:p-6 border border-purple-500/30 hover:border-purple-500 transition-all duration-300 shadow-xl">
        <h2 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
          Masukkan Data Akun
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {gameData
            ?.sort((a, b) => a.sort_order - b.sort_order)
            .map((input) => (
              <div key={input.id} className="flex flex-col">
                <label className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white mb-1">
                  {input.label}
                  {input.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {input.input_type === 'dropdown' ? (
                  <select
                    {...register(input.key, { required: input.required })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-white dark:bg-white/20 border border-purple-500/30 text-gray-900 dark:text-white text-sm outline-none transition-all duration-200 hover:border-purple-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-white dark:focus:bg-white/30"
                  >
                    <option value="">{input.placeholder}</option>
                    {input.Options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    {...register(input.key, { required: input.required })}
                    type={input.input_type}
                    placeholder={input.placeholder}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-white dark:bg-white/20 border border-purple-500/30 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-purple-300 text-sm outline-none transition-all duration-200 hover:border-purple-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-white dark:focus:bg-white/30"
                  />
                )}
              </div>
            ))}
        </div>

        {(isPending || data?.username) && (
          <div className="mt-4 flex items-center">
            {isPending && (
              <div className="flex items-center gap-2 text-purple-500 text-sm">
                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                Mengecek ID akun...
              </div>
            )}

            {!isPending && data?.username && (
              <div className="text-green-500 text-sm font-semibold">✓ Account: {data.username}</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
