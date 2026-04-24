'use client'

import { useState } from 'react'
import { LayoutDashboard, LogOut, Menu } from 'lucide-react'
import { ThemeToggle } from '../ThemeToggle'
import { LanguageSwitcher } from '../LanguageSwitcher'
import SearchComponent from './Search'
import { logout } from '../../hooks/useAuth'
import { useTranslations } from 'next-intl'
import { Link } from '../../i18n/routing'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'

interface MobileNaviProps {
  user: any
  loginWithGoogle: () => void
  setOpenProfile: React.Dispatch<React.SetStateAction<boolean>>
  openProfile: boolean
  mobileSearchOpen: boolean
  onMobileSearchOpenChange: (open: boolean) => void
}

export default function MobileNavigation({
  user,
  loginWithGoogle,
  setOpenProfile,
  mobileSearchOpen,
  onMobileSearchOpenChange,
}: MobileNaviProps) {
  const t = useTranslations('Navigation')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="relative z-0 flex min-w-0 flex-1 items-center justify-end gap-2 sm:justify-start md:hidden">
      {/* Phone: rata kanan + animasi max-width. Tablet (sm–md): penuh mendekati logo */}
      <div className="flex min-w-0 flex-1 justify-end max-sm:ml-auto sm:min-w-0 sm:w-full sm:justify-start">
        <div
          className={[
            'min-w-0 w-full overflow-hidden transition-[max-width] duration-300 ease-in-out sm:flex-1',
            mobileSearchOpen ? 'max-w-full' : 'max-w-12 sm:max-w-full',
          ].join(' ')}
        >
          <SearchComponent variant="mobile" onOpenChange={onMobileSearchOpenChange} />
        </div>
      </div>

      <Sheet
        open={menuOpen}
        onOpenChange={(open) => {
          setMenuOpen(open)
          if (open) setOpenProfile(false)
        }}
      >
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label={t('openMenu')}
            aria-expanded={menuOpen}
            className="touch-manipulation inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-white text-purple-700 shadow-sm transition hover:bg-purple-50 active:scale-[0.97] dark:border-purple-500/25 dark:bg-slate-800/90 dark:text-purple-200 dark:hover:bg-purple-950/50"
          >
            <Menu className="h-6 w-6" strokeWidth={2} />
          </button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="z-[100] flex w-[min(100%,20rem)] flex-col gap-0 border-purple-500/20 p-0 sm:max-w-sm dark:border-purple-500/30 [&>button]:right-3.5 [&>button]:top-3.5"
        >
          <SheetHeader className="border-b border-purple-500/15 px-4 pb-3 pt-4 text-left dark:border-purple-500/20">
            <SheetTitle className="text-lg text-purple-900 dark:text-white">{t('menu')}</SheetTitle>
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-purple-600/80 dark:text-purple-300/80">
                {t('languageAndTheme')}
              </p>
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-purple-500/20 bg-purple-50/50 p-3 dark:border-purple-500/25 dark:bg-slate-800/50">
                <LanguageSwitcher />
                <div className="ml-auto shrink-0">
                  <ThemeToggle />
                </div>
              </div>
            </div>

            {!user && (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  loginWithGoogle()
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-purple-700 active:scale-[0.99] dark:bg-purple-500 dark:hover:bg-purple-600 touch-manipulation"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt=""
                  className="h-5 w-5 shrink-0 rounded-full bg-white p-0.5"
                  aria-hidden
                />
                {t('login')}
              </button>
            )}

            {user && (
              <div className="space-y-3 rounded-xl border border-purple-500/20 bg-white p-4 shadow-sm dark:border-purple-500/30 dark:bg-slate-900/80">
                <div className="flex gap-3">
                  <img
                    src={
                      user.picture ||
                      `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                        user.name || 'User'
                      )}`
                    }
                    alt={user.name}
                    className="h-12 w-12 shrink-0 rounded-full border border-purple-500/30 bg-white"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-900 dark:text-white">{user.name}</p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-purple-100 dark:text-white dark:hover:bg-purple-500/15 touch-manipulation"
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />
                  {t('dashboard')}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    logout()
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 touch-manipulation"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  {t('logout')}
                </button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
