'use client'

import { Link } from '../i18n/routing'
import { Instagram, Mail, Phone, MapPin, Gamepad2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('Footer')
  const tNav = useTranslations('Navigation')

  return (
    <footer className="bg-white/80 dark:bg-black/40 backdrop-blur-sm border-t border-purple-200 dark:border-purple-500/20 pt-16 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex  gap-2 sm:gap-3">
              <img
                alt="Logo"
                className="object-contain mb-5 w-48 sm:w-48"
                src="https://s3.nevaobjects.id/image-dev/uploads/20260121141804.png"
              />
            </Link>

            <p className="text-gray-600 dark:text-gray-400 mb-6">{t('about')}</p>
            <div className="flex gap-4">
              {[Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="https://www.instagram.com/pakargaming.id/"
                  target="_blank"
                  className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 hover:bg-purple-500 hover:text-white transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-6">{t('links')}</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/games"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {tNav('games')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-6">{t('contact')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                <span>
                  Jl. Damai 1 No.11, RT.7/RW.01, Cipete Utara, Kec. Kby. Baru, Kota Jakarta, Jakarta
                  Selatan, Daerah Khusus Ibukota Jakarta 12150
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span>0821-7220-1364</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span>pakargaming1@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-6">Newsletter</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Dapatkan info promo dan game terbaru.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-gray-100 dark:bg-black/40 border border-purple-200 dark:border-purple-500/20 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <button className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-purple-200 dark:border-purple-500/20 pt-8 text-center">
          <p className="text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} AuraGame. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
