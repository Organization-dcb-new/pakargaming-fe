import Link from 'next/link'
import SearchComponent from './Search'
import { ThemeToggle } from '../ThemeToggle'
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
  // const [open, setOpen] = useState(false)

  return (
    <div className="hidden md:flex items-center gap-8">
      <div className="flex items-center gap-6">
        <SearchComponent />
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

      <div className="flex items-center gap-4 border-l border-purple-500/20 dark:border-purple-500/20 pl-8">
        {/* <LanguageSwitcher /> */}
        <ThemeToggle />

        {/* <button onClick={() => setOpen(true)}>Login</button>

        <AuthModal isOpen={open} onClose={() => setOpen(false)} /> */}

        {!user ? (
          <button
            onClick={loginWithGoogle}
            className="flex items-center gap-3 cursor-pointer bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white px-6 py-2 rounded-full transition-all shadow-sm hover:shadow-lg hover:shadow-purple-500/30"
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
              <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white dark:bg-slate-900/90 backdrop-blur-xl shadow-xl border border-purple-500/20 dark:border-purple-500/30 overflow-hidden z-50">
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
                    href="/en/dashboard"
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
                      Dashboard
                    </span>
                  </Link>

                  <button
                    onClick={logout}
                    className="group w-full flex items-center gap-3 px-4 py-3 text-sm 
             text-gray-800 dark:text-white
             cursor-pointer
             hover:bg-purple-500/10
             transition-all duration-200"
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
                      Logout
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
