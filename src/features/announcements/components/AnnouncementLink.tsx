'use client'

import type { ReactNode } from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link, routing } from '@/i18n/routing'
import { cn } from '@/lib/cn'

/** "/en/games/x" → "/games/x": Link sudah menambahkan bahasa aktif pengunjung sendiri. */
function withoutLocale(path: string) {
  const match = path.match(/^\/([^/?#]+)(.*)$/)
  if (!match || !routing.locales.includes(match[1] as (typeof routing.locales)[number])) return path
  const rest = match[2]
  return rest.startsWith('/') ? rest : `/${rest}`
}

type AnnouncementLinkProps = {
  /** Sudah lolos safeLinkUrl: path storefront ("/…") atau URL http(s) */
  href: string
  className?: string
  iconClassName?: string
  onClick?: () => void
  children: ReactNode
}

/** Path storefront → Link next-intl (sesuai bahasa); URL http(s) → tab baru. */
export default function AnnouncementLink({ href, className, iconClassName, onClick, children }: AnnouncementLinkProps) {
  const t = useTranslations('Announcements')
  const iconClass = cn('h-3.5 w-3.5 shrink-0', iconClassName)

  if (href.startsWith('/')) {
    return (
      <Link href={withoutLocale(href)} className={className} onClick={onClick}>
        {children}
        <ArrowRight className={iconClass} aria-hidden />
      </Link>
    )
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
      {children}
      <span className="sr-only"> {t('opensInNewTab')}</span>
      <ExternalLink className={iconClass} aria-hidden />
    </a>
  )
}
