'use client'

import { useState } from 'react'
import { LayoutDashboard, LogIn, LogOut, Menu } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '../../i18n/routing'
import { ThemeToggle } from '../ThemeToggle'
import { LanguageSwitcher } from '../LanguageSwitcher'
import LogoutConfirmDialog from '../Auth/LogoutConfirmDialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { BrandMark } from './Logo'
import { NAV_ITEMS, focusRing, getAvatarSrc, isNavActive } from './config'

interface MobileNavProps {
  user: any
  /** Buka dialog Masuk/Daftar (Google tetap tersedia di dalam dialog). */
  onLogin: () => void
}

const sectionLabelClass = 'px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground'
const itemClass =
  'flex h-10 w-full touch-manipulation items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-200'
const itemStateClass = (active: boolean) =>
  active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'

export default function MobileNavigation({ user, onLogin }: MobileNavProps) {
  const t = useTranslations('Navigation')
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)
  const dashboardActive = isNavActive(pathname, '/dashboard')

  return (
    <div className="shrink-0 lg:hidden">
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label={t('openMenu')}
            className={`-ml-2 inline-flex h-10 w-10 touch-manipulation items-center justify-center rounded-lg text-foreground transition-colors duration-200 hover:bg-accent ${focusRing}`}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="z-[100] flex w-[min(100%,18rem)] flex-col gap-0 border-border p-0 [&>button]:right-4 [&>button]:top-5"
        >
          <SheetHeader className="h-14 flex-row items-center border-b border-border px-4 py-0">
            <BrandMark />
            <SheetTitle className="sr-only">{t('menu')}</SheetTitle>
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain px-3 py-4">
            <nav aria-label={t('mainNav')} className="space-y-1">
              <p className={`${sectionLabelClass} pb-1`}>{t('menu')}</p>
              {NAV_ITEMS.map(({ href, labelKey, icon: Icon }) => {
                const active = isNavActive(pathname, href)
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMenu}
                    aria-current={active ? 'page' : undefined}
                    className={`${itemClass} ${itemStateClass(active)} ${focusRing}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {t(labelKey)}
                  </Link>
                )
              })}
            </nav>

            <div className="space-y-2">
              <p className={sectionLabelClass}>{t('languageAndTheme')}</p>
              <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
                <LanguageSwitcher />
                <div className="ml-auto shrink-0">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {user ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2">
                  <img
                    src={getAvatarSrc(user)}
                    alt=""
                    aria-hidden="true"
                    className="h-9 w-9 shrink-0 rounded-full border border-border bg-card object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  aria-current={dashboardActive ? 'page' : undefined}
                  className={`${itemClass} ${itemStateClass(dashboardActive)} ${focusRing}`}
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {t('dashboard')}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu()
                    setLogoutOpen(true)
                  }}
                  className={`${itemClass} cursor-pointer text-destructive hover:bg-destructive/10 ${focusRing}`}
                >
                  <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {t('logout')}
                </button>
              </div>
            ) : (
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => {
                  closeMenu()
                  onLogin()
                }}
                className={`chamfer flex h-11 w-full cursor-pointer touch-manipulation items-center justify-center gap-2 rounded-sm bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors duration-200 hover:bg-primary/85 ${focusRing}`}
              >
                <LogIn className="h-4 w-4 shrink-0" aria-hidden="true" />
                {t('login')}
              </button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <LogoutConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </div>
  )
}
