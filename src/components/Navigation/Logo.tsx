'use client'

import { Link } from '../../i18n/routing'
import { useTranslations } from 'next-intl'

export default function LogoNavigation({
  collapsedOnMobile = false,
}: {
  /** Saat true (search mobile melebar): logo menyusut halus supaya animasi search rata kanan */
  collapsedOnMobile?: boolean
}) {
  const t = useTranslations('Navigation')

  return (
    <Link
      href="/"
      className={[
        'relative z-10 shrink-0 touch-manipulation',
        'max-md:inline-block max-md:min-w-0 max-md:overflow-hidden max-md:transition-[max-width,opacity] max-md:duration-300 max-md:ease-in-out',
        collapsedOnMobile
          ? 'max-md:pointer-events-none max-md:max-w-0 max-md:opacity-0'
          : 'max-md:max-w-[min(10rem,42vw)] max-md:opacity-100',
      ].join(' ')}
    >
      <div className="flex items-center justify-start md:mr-1 lg:mr-2">
        <div className="animate-fadeInUp max-w-[min(9.5rem,38vw)] sm:max-w-none">
          <img
            src="https://s3.nevaobjects.id/image-dev/uploads/20260121141804.png"
            alt={t('logoAlt')}
            className="
    object-contain object-left
    h-9 w-auto min-[400px]:h-10 sm:h-11 md:h-12

    animate-floatSoft

    drop-shadow-[0_10px_25px_rgba(0,0,0,0.25)]
    hover:drop-shadow-[0_14px_35px_rgba(139,92,246,0.35)]
    transition-all duration-500
  "
          />
        </div>
      </div>
    </Link>
  )
}
