import { useEffect, useState } from 'react'
import { Link, usePathname } from '../../i18n/routing'
import SearchComponent from './Search'
import { ThemeToggle } from '../ThemeToggle'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { LogOut, LayoutDashboard } from 'lucide-react'
import { useTranslations } from 'next-intl'
import LogoutConfirmDialog from '../Auth/LogoutConfirmDialog'

export type NavLink = {
  path: string
  label: string
  auth: boolean
  external?: boolean
}

interface DesktopNavProps {
  visibleNavLinks: NavLink[]
  loginWithGoogle: () => void
  user: any
  openProfile: boolean
  setOpenProfile: React.Dispatch<React.SetStateAction<boolean>>
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

export default function DesktopNavigation({
  visibleNavLinks,
  loginWithGoogle,
  user,
  openProfile,
  setOpenProfile,
}: DesktopNavProps) {
  const t = useTranslations('Navigation')
  const pathname = usePathname()
  const [logoutOpen, setLogoutOpen] = useState(false)

  // Tutup dropdown profil dengan tombol Escape
  useEffect(() => {
    if (!openProfile) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenProfile(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openProfile, setOpenProfile])

  return (
    <div className="hidden min-w-0 flex-1 shrink md:flex md:min-w-0 md:items-center md:gap-4 lg:gap-8">
      <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4 lg:gap-6">
        <div className="min-w-0 flex-1">
          <SearchComponent variant="desktop" />
        </div>
        {visibleNavLinks.map((link) => {
          const active = pathname === link.path
          const isExternal = link.external || link.path.startsWith('http')
          
          if (isExternal) {
            return (
              <a
                key={link.path}
                href={link.path}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative rounded-sm text-sm font-semibold text-brand transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-brand after:transition-all after:duration-300 hover:after:w-full after:w-0 ${focusRing}`}
              >
                {link.label}
              </a>
            )
          }

          return (
            <Link
              key={link.path}
              href={link.path}
              aria-current={active ? 'page' : undefined}
              className={`relative rounded-sm text-sm font-semibold text-brand transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-brand after:transition-all after:duration-300 hover:after:w-full ${
                active ? 'after:w-full' : 'after:w-0'
              } ${focusRing}`}
            >
              {link.label}
            </Link>
          )
        })}
      </div>

      <div className="flex shrink-0 items-center gap-2 border-l border-brand/20 pl-3 md:gap-3 lg:gap-4 lg:pl-8">
        <LanguageSwitcher />
        <ThemeToggle />

        {!user ? (
          <button
            type="button"
            onClick={loginWithGoogle}
            className={`flex cursor-pointer touch-manipulation items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-2 px-4 py-2 text-brand-foreground shadow-md shadow-brand/30 transition-all hover:brightness-110 hover:shadow-lg hover:shadow-brand/50 active:scale-[0.98] md:gap-3 md:px-5 lg:px-6 ${focusRing}`}
          >
            <img
              src="/icons/google.svg"
              alt=""
              aria-hidden="true"
              className="h-5 w-5 rounded-full bg-white p-0.5 shadow-sm"
            />
            <span className="font-medium">{t('login')}</span>
          </button>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setOpenProfile((prev) => !prev)
              }}
              aria-haspopup="menu"
              aria-expanded={openProfile}
              className={`flex select-none items-center gap-3 rounded-full transition-colors ${focusRing}`}
            >
              <img
                src={
                  user.picture ||
                  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                    user.name || 'User'
                  )}`
                }
                alt={user.name}
                className="h-9 w-9 rounded-full border border-brand/30 bg-card"
              />

              <span className="hidden text-sm font-medium text-foreground lg:inline">
                {user.name}
              </span>
            </button>

            {/* Dropdown */}
            {openProfile && (
              <div
                role="menu"
                className="absolute right-0 z-50 mt-3 w-[min(14rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl backdrop-blur-xl sm:w-56"
              >
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-border px-4 py-4">
                  <img
                    src={user.picture || '/avatar.png'}
                    alt=""
                    aria-hidden="true"
                    className="h-10 w-10 rounded-full border border-brand/30"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                {/* Menu */}
                <div className="py-2">
                  <Link
                    href="/dashboard"
                    role="menuitem"
                    className={`group flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground transition-all duration-200 hover:bg-brand/10 ${focusRing} focus-visible:-outline-offset-2`}
                  >
                    <LayoutDashboard className="h-4 w-4 text-muted-foreground transition-all duration-200 group-hover:scale-110 group-hover:text-brand" />
                    <span className="font-medium transition-colors duration-200 group-hover:text-brand">
                      {t('dashboard')}
                    </span>
                  </Link>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setOpenProfile(false)
                      setLogoutOpen(true)
                    }}
                    className={`group flex w-full cursor-pointer touch-manipulation items-center gap-3 px-4 py-3 text-sm text-foreground transition-all duration-200 hover:bg-destructive/10 ${focusRing} focus-visible:-outline-offset-2`}
                  >
                    <LogOut className="h-4 w-4 text-muted-foreground transition-all duration-200 group-hover:scale-110 group-hover:text-destructive" />
                    <span className="font-medium transition-colors duration-200 group-hover:text-destructive">
                      {t('logout')}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <LogoutConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </div>
  )
}
