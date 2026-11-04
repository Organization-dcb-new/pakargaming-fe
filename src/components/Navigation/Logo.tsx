'use client'

import Image from 'next/image'
import { Link } from '../../i18n/routing'
import { useTranslations } from 'next-intl'
import { focusRing } from './config'

/** Ikon + wordmark "PAKARGAMING" (kata kedua cyan); dipakai di topbar dan header drawer mobile. */
export function BrandMark() {
  const t = useTranslations('Navigation')

  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <Image
        src="/logo.png"
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 object-contain"
      />
      <span className="truncate font-display text-lg font-bold uppercase tracking-wider text-foreground">
        {t.rich('wordmark', {
          accent: (chunks) => <span className="text-primary">{chunks}</span>,
        })}
      </span>
    </span>
  )
}

export default function LogoNavigation({
  collapsedOnMobile = false,
}: {
  /** Saat true (search mobile melebar): logo menyusut halus supaya animasi search rata kanan */
  collapsedOnMobile?: boolean
}) {
  return (
    <Link
      href="/"
      tabIndex={collapsedOnMobile ? -1 : undefined}
      className={[
        'relative z-10 shrink-0 touch-manipulation rounded-md',
        focusRing,
        'max-md:inline-block max-md:min-w-0 max-md:overflow-hidden max-md:transition-[max-width,opacity] max-md:duration-300 max-md:ease-in-out motion-reduce:transition-none',
        collapsedOnMobile
          ? 'max-md:pointer-events-none max-md:max-w-0 max-md:opacity-0'
          : 'max-md:max-w-48 max-md:opacity-100',
      ].join(' ')}
    >
      <BrandMark />
    </Link>
  )
}
