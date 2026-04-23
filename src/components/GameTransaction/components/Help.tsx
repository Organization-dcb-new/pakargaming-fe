'use client'
import { Headset } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function HelpCard() {
  const t = useTranslations('GameCheckout')
  return (
    <a
      href="https://wa.me/628131793708" 
      target="_blank"
      rel="noopener noreferrer"
      className='w-full flex justify-center xl:w-100 xl:self-start'
    >
      <div className="bg-black/5 w-full sm:w-150  dark:bg-white/10 rounded-3xl p-4 sm:p-6 border border-purple-500/30 hover:border-purple-500 transition-all duration-300 shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
        {/* Header with icon */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30">
            <Headset className="w-5 h-5 text-purple-500" />
          </div>

          <div className="flex flex-col">
            <p className="text-sm font-bold text-gray-900 dark:text-white">{t('helpTitle')}</p>
            <p className="text-xs text-gray-600 dark:text-purple-200 leading-relaxed">
              {t('helpSubtitle')}
            </p>
          </div>
        </div>
      </div>
    </a>
  )
}
