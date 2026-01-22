'use client'
import { Link, usePathname } from '../i18n/routing'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'
import { LogOut } from 'lucide-react'
import Cookies from 'js-cookie'

import UseLoginGoogleOauth from '../hooks/useLogin'
import SearchComponent from './Search/Search'

type AuthUser = {
  name: string
  email: string
  picture?: string
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null

  const user = Cookies.get('user')
  if (!user) return null

  try {
    return JSON.parse(user)
  } catch {
    return null
  }
}

export default function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const authUser = getAuthUser()
    setUser(authUser)
    setLoading(false)
  }, [])

  return { user, loading }
}

const logout = () => {
  Cookies.remove('token')
  Cookies.remove('user')

  window.location.href = '/'
}

export function Navigation() {
  const [openProfile, setOpenProfile] = useState(false)

  const pathname = usePathname()
  const t = useTranslations('Navigation')
  const { loginWithGoogle } = UseLoginGoogleOauth()
  const { user, loading } = useAuth()

  useEffect(() => {
    const handler = () => setOpenProfile(false)
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [])

  const navLinks = [{ path: '/my-transaction', label: t('transaction'), auth: true }]
  const visibleNavLinks = navLinks.filter((link) => !link.auth || user)

  if (loading) {
    return (
      <nav className="border-b border-purple-500/20 bg-white/80 dark:bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 animate-pulse">
            {/* LEFT: LOGO */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-white/10" />
              <div className="h-4 sm:h-5 w-24 sm:w-28 rounded bg-gray-200 dark:bg-white/10" />
            </div>

            {/* CENTER: NAV LINKS (DESKTOP) */}
            <div className="hidden md:flex items-center gap-6">
              <div className="h-4 w-12 rounded bg-gray-200 dark:bg-white/10" />
              <div className="h-4 w-14 rounded bg-gray-200 dark:bg-white/10" />
              <div className="h-4 w-20 rounded bg-gray-200 dark:bg-white/10" />
            </div>

            {/* RIGHT: ACTIONS */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gray-200 dark:bg-white/10" />
              <div className="hidden sm:block h-8 sm:h-9 w-20 sm:w-24 rounded-full bg-gray-200 dark:bg-white/10" />
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      <nav className="border-b border-purple-500/30 dark:border-purple-500/20 bg-white dark:bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <img
                src="https://s3.nevaobjects.id/image-dev/uploads/20260121141804.png"
                alt="Logo"
                className="object-contain w-48"
              />
            </Link>

            {/* Desktop Navigation */}
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
                <LanguageSwitcher />
                <ThemeToggle />

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

                      <span className="text-sm font-medium text-gray-800 dark:text-white">
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
                          <button
                            onClick={logout}
                            className="group cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-900 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-500/10 transition"
                          >
                            <LogOut className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                            <span className="text-red-600 dark:text-red-400 font-medium">
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

            {/* Mobile Menu Button & Actions */}
            <div className="md:hidden flex items-center gap-2 sm:gap-3">
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
          </div>
        </div>
      </nav>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-purple-500/30 backdrop-blur-md">
        <div className="flex justify-center items-center gap-2 py-3 px-2">
          {visibleNavLinks.map(({ path, label }) => (
            <Link
              key={path}
              href={path}
              className={`
        px-3 py-2
        rounded-full
        text-sm font-medium
        transition
        ${
          pathname === path
            ? 'bg-purple-600 text-white'
            : 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-600/40 dark:text-white dark:hover:bg-purple-700/60'
        }
      `}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
