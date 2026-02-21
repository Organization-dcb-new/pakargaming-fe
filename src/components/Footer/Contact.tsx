import { Mail, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function ContactComponent() {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
        Hubungi Kami
      </h3>

      <ul className="space-y-3">
        <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
          <Phone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <a href="https://wa.me/628131793708" target="_blank" className="text-sm font-medium">
            +62 813-1793-708
          </a>
        </li>

        <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
          <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <a href="mailto:pakargaming1@gmail.com" className="text-sm font-medium break-all">
            pakargaming1@gmail.com
          </a>
        </li>
      </ul>
    </div>
  )
}
