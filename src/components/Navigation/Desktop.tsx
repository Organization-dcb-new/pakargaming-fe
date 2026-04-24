import { Link } from '../../i18n/routing'
import SearchComponent from './Search'
import { ThemeToggle } from '../ThemeToggle'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { LogOut, LayoutDashboard } from 'lucide-react'
import { logout } from '../../hooks/useAuth'
import { useTranslations } from 'next-intl'

export type NavLink = {
  path: string
  label: string
  auth: boolean
}

interface DesktopNavProps {
  visibleNavLinks: NavLink[]
  loginWithGoogle: () => void
  user: any
  openProfile: boolean
  setOpenProfile: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DesktopNavigation({
  visibleNavLinks,
  loginWithGoogle,
  user,
  openProfile,
  setOpenProfile,
}: DesktopNavProps) {
  const t = useTranslations('Navigation')

  return (
    <div className="hidden min-w-0 flex-1 shrink md:flex md:min-w-0 md:items-center md:gap-4 lg:gap-8">
      <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4 lg:gap-6">
        <div className="min-w-0 flex-1">
          <SearchComponent variant="desktop" />
        </div>
        {visibleNavLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className="
    relative text-sm font-semibold
    text-purple-600 dark:text-purple-400
    transition-colors duration-200
    hover:text-purple-600 dark:hover:text-purple-400
    after:absolute after:left-0 after:-bottom-1
    after:h-[2px] after:w-0
    after:bg-purple-600 dark:after:bg-purple-400
    after:transition-all after:duration-300
    hover:after:w-full
  "
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-2 border-l border-purple-500/20 pl-3 dark:border-purple-500/20 md:gap-3 lg:gap-4 lg:pl-8">
        <LanguageSwitcher />
        <ThemeToggle />

        {!user ? (
          <button
            type="button"
            onClick={loginWithGoogle}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-white shadow-sm transition-all hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30 active:scale-[0.98] dark:bg-purple-500 dark:hover:bg-purple-600 md:gap-3 md:px-5 lg:px-6 touch-manipulation"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 bg-white rounded-full p-0.5 shadow-sm"
            />
            <span className="font-medium">{t('login')}</span>
          </button>
        ) : (
          <div className="relative">
            <div
              onClick={(e) => {
                e.stopPropagation()
                setOpenProfile((prev) => !prev)
              }}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <img
                src={
                  user.picture ||
                  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                    user.name || 'User'
                  )}`
                }
                alt={user.name}
                className="w-9 h-9 rounded-full border border-purple-500/30 bg-white"
              />

              <span className="text-sm font-medium text-gray-800 dark:text-white hidden lg:inline">
                {user.name}
              </span>
            </div>

            {/* Dropdown */}
            {openProfile && (
              <div className="absolute right-0 z-50 mt-3 w-[min(14rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-purple-500/20 bg-white shadow-xl backdrop-blur-xl sm:w-56 dark:border-purple-500/30 dark:bg-slate-900/90">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-purple-500/20">
                  <img
                    src={user.picture || '/avatar.png'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border border-purple-500/30"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Menu */}
                <div className="py-2">
                  <Link
                    href="/dashboard"
                    className="group w-full flex items-center gap-3 px-4 py-3 text-sm 
             text-gray-800 dark:text-white
             hover:bg-purple-500/10 
             transition-all duration-200"
                  >
                    <LayoutDashboard
                      className="w-4 h-4 text-gray-600 dark:text-white/80 
               group-hover:text-purple-600 
               dark:group-hover:text-purple-400
               group-hover:scale-110 
               transition-all duration-200"
                    />

                    <span
                      className="font-medium 
               group-hover:text-purple-600 
               dark:group-hover:text-purple-400 
               transition-colors duration-200"
                    >
                      {t('dashboard')}
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={logout}
                    className="group flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm text-gray-800 transition-all duration-200 hover:bg-purple-500/10 dark:text-white touch-manipulation"
                  >
                    <LogOut
                      className="w-4 h-4 text-gray-600 dark:text-white/80 
               group-hover:text-purple-600 
               dark:group-hover:text-purple-400
               group-hover:scale-110 
               transition-all duration-200"
                    />

                    <span
                      className="font-medium 
               group-hover:text-purple-600 
               dark:group-hover:text-purple-400 
               transition-colors duration-200"
                    >
                      {t('logout')}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
