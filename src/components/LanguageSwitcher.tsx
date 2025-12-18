'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '../i18n/routing'
import { Globe } from 'lucide-react'
import { useState, useTransition } from 'react'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const handleLocaleChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale })
      setIsOpen(false)
    })
  }

  return (
    <div className="relative ">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center cursor-pointer gap-2 text-gray-300 hover:text-white transition-colors"
      >
        <Globe className="w-5 h-5" />
        <span className="uppercase">{locale}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-slate-800 border border-purple-500/20 rounded-lg shadow-xl overflow-hidden z-50">
          <button
            onClick={() => handleLocaleChange('en')}
            disabled={isPending}
            className={`w-full text-left cursor-pointer px-4 py-2 hover:bg-purple-500/20 transition-colors ${
              locale === 'en' ? 'text-purple-400' : 'text-gray-300'
            }`}
          >
            English
          </button>
          <button
            onClick={() => handleLocaleChange('id')}
            disabled={isPending}
            className={`w-full cursor-pointer text-left px-4 py-2 hover:bg-purple-500/20 transition-colors ${
              locale === 'id' ? 'text-purple-400' : 'text-gray-300'
            }`}
          >
            Indonesia
          </button>
        </div>
      )}
    </div>
  )
}
