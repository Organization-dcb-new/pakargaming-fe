import { Mail, MapPin, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function ContactComponent() {
  const t = useTranslations('Footer')

  return (
    <div>
      <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-6">{t('contact')}</h3>
      <ul className="space-y-4">
        <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
          <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
          <span className="text-sm">
            Jl. Damai 1 No.11, RT.7/RW.01, Cipete Utara, Kec. Kby. Baru, Kota Jakarta, Jakarta
            Selatan, Daerah Khusus Ibukota Jakarta 12150
          </span>
        </li>
        <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span className="text-sm">+628131793708</span>
        </li>
        <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span className="text-sm">pakargaming1@gmail.com</span>
        </li>
      </ul>
    </div>
  )
}
