import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { useTranslations } from 'next-intl'
import { AR_One_Sans } from 'next/font/google'

const geist = AR_One_Sans({
  subsets: ['latin-ext'],
})

export default function BrandComponent() {
  const t = useTranslations('Footer')

  return (
    <div className="max-w-sm">
      <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-5">About</h3>

      {/* Logo + Tagline */}
      <div className="flex flex-col gap-2 mb-4">
        <img
          alt="Logo"
          className="object-contain w-40 sm:w-44"
          src="https://s3.nevaobjects.id/image-dev/uploads/20260121141804.png"
        />
        <p
          className={`${geist.className} text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed`}
        >
          Ahlinya Top Up Game Favoritmu
        </p>
      </div>

      {/* About text */}
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{t('about')}</p>

      {/* Socials */}
      <div className="flex items-center gap-3">
        <a
          href="https://www.instagram.com/pakargaming.id/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 hover:bg-purple-500 hover:text-white transition-all duration-300"
        >
          <FaInstagram className="w-5 h-5" />
        </a>

        <a
          href="https://wa.me/62XXXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white transition-all duration-300"
        >
          <FaWhatsapp className="w-5 h-5" />
        </a>
      </div>
    </div>
  )
}
