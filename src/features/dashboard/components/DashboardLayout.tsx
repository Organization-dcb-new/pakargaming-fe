'use client'

import { useState } from 'react'
import { LayoutDashboard, LogOut, Search } from 'lucide-react'
import { Link, usePathname } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import LogoutConfirmDialog from '@/features/auth/components/LogoutConfirmDialog'
import { focusRing } from '@/styles/focusRing'
import { cn } from '@/lib/cn'
import { HudPanel } from '@/components/ui/hud-panel'

const itemClass =
  'relative flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const t = useTranslations('ClientLayout')
  const [logoutOpen, setLogoutOpen] = useState(false)

  const menus = [
    { name: t('dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('checkTransaction'), href: '/check-transaction', icon: Search },
  ]

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:gap-8 lg:px-8">
      <aside className="hidden w-56 shrink-0 md:block">
        <HudPanel as="nav" aria-label={t('menu')} size="md" className="sticky top-24" innerClassName="p-3">
          <p className="flex items-center gap-2 px-3 pt-1.5 pb-2 font-display text-xs font-bold uppercase tracking-widest text-muted-foreground before:h-3 before:w-1 before:shrink-0 before:-skew-x-12 before:bg-gradient-brand">
            {t('menu')}
          </p>

          <ul className="flex flex-col gap-1">
            {menus.map((menu) => {
              const isActive = pathname === menu.href
              const Icon = menu.icon
              return (
                <li key={menu.href}>
                  <Link
                    href={menu.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      itemClass,
                      focusRing,
                      isActive
                        ? 'bg-primary/10 font-semibold text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    {/* Bar aktif di kiri — penanda posisi selain warna */}
                    {isActive && (
                      <span aria-hidden="true" className="absolute inset-y-2 left-0 w-[3px] bg-primary" />
                    )}
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {menu.name}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="my-2 h-px bg-border" />

          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className={cn(itemClass, focusRing, 'w-full cursor-pointer text-destructive hover:bg-destructive/10')}
          >
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
            {t('logout')}
          </button>
        </HudPanel>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>

      <LogoutConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </div>
  )
}
