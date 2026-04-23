import { LogOut } from 'lucide-react'
import { ThemeToggle } from '../ThemeToggle'
import { LanguageSwitcher } from '../LanguageSwitcher'
import SearchComponent from './Search'
import { logout } from '../../hooks/useAuth'
import { useTranslations } from 'next-intl'

interface MobileNaviProps {
  user: any
  loginWithGoogle: () => void
  setOpenProfile: React.Dispatch<React.SetStateAction<boolean>>
  openProfile: boolean
}

export default function MobileNavigation({
  user,
  loginWithGoogle,
  setOpenProfile,
  openProfile,
}: MobileNaviProps) {
  const t = useTranslations('Navigation')

  return (
    <div className="md:hidden flex items-center gap-2 sm:gap-3">
      <SearchComponent />
      <LanguageSwitcher />
      <ThemeToggle />

      {/* Tombol login Google untuk mobile */}
      {!user && (
        <button
          onClick={loginWithGoogle}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white px-3 py-2 rounded-full text-sm transition-all shadow-sm hover:shadow-lg hover:shadow-purple-500/25"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5 bg-white rounded-full p-0.5 shadow-sm"
          />
          <span className="font-medium">{t('login')}</span>
        </button>
      )}

      {/* User dropdown */}
      {user && (
        <div
          onClick={(e) => {
            e.stopPropagation()
            setOpenProfile((prev) => !prev)
          }}
          className="relative flex items-center gap-2 cursor-pointer"
        >
          <img
            src={
              user.picture ||
              `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                user.name || 'User'
              )}`
            }
            alt={user.name}
            className="w-8 h-8 rounded-full border border-purple-500/30 bg-white"
          />
          <span className="text-sm font-medium text-gray-800 dark:text-white max-w-[80px] truncate hidden sm:inline">
            {user.name}
          </span>

          {/* Mobile Profile Dropdown */}
          {openProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900/95 backdrop-blur-xl shadow-xl border border-purple-500/20 dark:border-purple-500/30 overflow-hidden z-50">
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-purple-500/20">
                <img
                  src={user.picture || '/avatar.png'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border border-purple-500/30"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              {/* Menu */}
              <div className="py-2">
                <button
                  onClick={logout}
                  className="group cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-900 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-500/10 transition"
                >
                  <LogOut className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                  <span className="text-red-600 dark:text-red-400 font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
