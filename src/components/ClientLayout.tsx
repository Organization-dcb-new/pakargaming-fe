'use client'

import { useState } from 'react'
import { LayoutDashboard, LogOut } from 'lucide-react'
import { Link, usePathname } from '../i18n/routing'
import { useTranslations } from 'next-intl'
import LogoutConfirmDialog from './Auth/LogoutConfirmDialog'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const t = useTranslations('ClientLayout')
  const [logoutOpen, setLogoutOpen] = useState(false)

  const menus = [{ name: t('dashboard'), href: '/dashboard', icon: LayoutDashboard }]

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <aside className="hidden w-56 shrink-0 md:block">
        <div className="sticky top-24 rounded-2xl border border-border bg-card p-3 shadow-sm">
          <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t('menu')}
          </p>

          <nav className="flex flex-col gap-1">
            {menus.map((menu) => {
              const isActive = pathname === menu.href
              const Icon = menu.icon
              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand text-white'
                      : 'text-muted-foreground hover:bg-brand/10 hover:text-brand'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {menu.name}
                </Link>
              )
            })}
          </nav>

          <div className="my-2 border-t border-border" />

          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {t('logout')}
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>

      <LogoutConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </div>
  )
}
