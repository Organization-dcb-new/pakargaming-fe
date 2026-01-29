import { ReactNode } from 'react'

interface StepCardProps {
  step: number
  title: string
  children: ReactNode
}

export default function StepCard({ step, title, children }: StepCardProps) {
  return (
    <div className="relative">
      {/* Badge Nomor Step */}
      <div
        className="
        absolute -top-3 -left-3
        w-8 h-8
        flex items-center justify-center
        rounded-full
        text-xs font-bold text-white
        bg-gradient-to-br from-purple-500 to-pink-500
        border-2 border-white dark:border-zinc-900
        shadow-lg z-10
      "
      >
        {step}
      </div>

      {/* Card */}
      <div
        className="
        bg-black/5 dark:bg-white/10
        backdrop-blur-lg
        rounded-3xl
        p-5 mb-6
        border border-purple-400/40
        shadow-xl
      "
      >
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h2>

        {children}
      </div>
    </div>
  )
}
