import { GameInput } from '../../types/Game'

interface AccountCardProps {
  gameData: GameInput[]
  step?: number
}

export default function AccountCard({ gameData, step = 1 }: AccountCardProps) {
  return (
    <div className="relative w-full sm:w-150">
      {/* Step Badge */}
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md border-2 border-white dark:border-zinc-900 z-10">
        {step}
      </div>

      <div className="bg-black/5 dark:bg-white/10 backdrop-blur-lg rounded-3xl p-4 sm:p-6 border border-white/20 shadow-xl">
        {/* Title */}
        <h2 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
          Masukkan Data Akun
        </h2>

        {/* Inputs */}
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
                    name={`game_data.${input.key}`}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-white dark:bg-white/20 border border-gray-300 dark:border-white/30 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition text-sm"
                  >
                    <option value="">{input.placeholder}</option>
                    {input.Options?.map((opt, key) => (
                      <option key={key} value={opt.value}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={input.input_type}
                    name={`game_data.${input.key}`}
                    placeholder={input.placeholder}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-white dark:bg-white/20 border border-gray-300 dark:border-white/30 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-purple-300 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-white/30 transition text-sm"
                  />
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
