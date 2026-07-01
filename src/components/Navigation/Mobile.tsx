'use client'

import { useState } from 'react'
import { LayoutDashboard, LogOut, Menu } from 'lucide-react'
import { ThemeToggle } from '../ThemeToggle'
import { LanguageSwitcher } from '../LanguageSwitcher'
import SearchComponent from './Search'
import { useTranslations } from 'next-intl'
import { Link } from '../../i18n/routing'
import LogoutConfirmDialog from '../Auth/LogoutConfirmDialog'
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

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

export default function MobileNavigation({
  user,
  loginWithGoogle,
  setOpenProfile,
  mobileSearchOpen,
  onMobileSearchOpenChange,
}: MobileNaviProps) {
  const t = useTranslations('Navigation')
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)

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
            className={`inline-flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-xl border border-brand/30 bg-card text-brand shadow-sm transition hover:border-brand hover:shadow-md active:scale-[0.97] ${focusRing}`}
          >
            <Menu className="h-6 w-6" strokeWidth={2} />
          </button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="z-[100] flex w-[min(100%,20rem)] flex-col gap-0 border-border p-0 sm:max-w-sm [&>button]:right-3.5 [&>button]:top-3.5"
        >
          <SheetHeader className="border-b border-border px-4 pb-3 pt-4 text-left">
            <SheetTitle className="text-lg text-foreground">{t('menu')}</SheetTitle>
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t('languageAndTheme')}
              </p>
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-brand/20 bg-brand/5 p-3">
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
                className={`flex w-full touch-manipulation items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-2 px-4 py-3.5 text-sm font-semibold text-brand-foreground shadow-md shadow-brand/30 transition hover:brightness-110 hover:shadow-lg hover:shadow-brand/50 active:scale-[0.99] ${focusRing}`}
              >
                <img
                  src="/icons/google.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 rounded-full bg-white p-0.5"
                />
                {t('login')}
              </button>
            )}

            {user && (
              <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex gap-3">
                  <img
                    src={
                      user.picture ||
                      `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                        user.name || 'User'
                      )}`
                    }
                    alt={user.name}
                    className="h-12 w-12 shrink-0 rounded-full border border-brand/30 bg-card"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className={`flex touch-manipulation items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-brand/10 ${focusRing}`}
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0 text-brand" />
                  {t('dashboard')}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    setLogoutOpen(true)
                  }}
                  className={`flex w-full touch-manipulation items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-destructive transition hover:bg-destructive/10 ${focusRing}`}
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  {t('logout')}
                </button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <LogoutConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </div>
  )
}
