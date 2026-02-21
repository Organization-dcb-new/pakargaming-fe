import { useTranslations } from 'next-intl'
import { AR_One_Sans } from 'next/font/google'

const geist = AR_One_Sans({
  subsets: ['latin-ext'],
})
export default function BrandComponent() {
  const t = useTranslations('Footer')

  return (
    <div className="max-w-sm">
      <div className="flex flex-col gap-3 mb-4">
        {/* Logo */}
        <img
          alt="Logo"
          className="object-contain w-40 sm:w-48"
          src="https://s3.nevaobjects.id/image-dev/uploads/20260121141804.png"
        />

        {/* Company Name + Tagline */}
        <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white leading-snug">
          PT Aura Pakar Inovasi
          <span
            className={`${geist.className} block text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-400`}
          >
            Ahlinya Top Up Game Favoritmu
          </span>
        </h2>

        {/* Address */}
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Jl. Damai 1 No.11, RT.11/RW.01, Cipete Utara, Kec. Kby. Baru, Kota Jakarta Selatan,
          Jakarta, Daerah Khusus Ibukota Jakarta 12150
        </p>
      </div>
    </div>
  )
}
