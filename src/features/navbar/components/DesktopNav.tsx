'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import { isNavActive } from '@/features/navbar/config'
import { cn } from '@/lib/cn'
import { focusRing } from '@/styles/focusRing'
import SettingsMenu from './SettingsMenu'

/** Aksi kanan di desktop (≥ lg): link Cek Transaksi + popover pengaturan. Menu akun dirender Navbar. */
export default function DesktopNav() {
  const t = useTranslations('Navigation')
  const pathname = usePathname()
  const checkActive = isNavActive(pathname, '/check-transaction')

  return (
    <div className="hidden shrink-0 items-center gap-1 lg:flex">
      <nav aria-label={t('mainNav')}>
        <Link
          href="/check-transaction"
          aria-current={checkActive ? 'page' : undefined}
          className={cn(
            'inline-flex h-10 items-center rounded-lg px-3 text-sm font-semibold transition-colors duration-200',
            checkActive
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            focusRing,
          )}
        >
          {t('checkTransaction')}
        </Link>
      </nav>
      <SettingsMenu />
      <div aria-hidden="true" className="mx-1.5 h-6 w-px bg-border" />
    </div>
  )
}
