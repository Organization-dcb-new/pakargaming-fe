'use client'

import { Link, usePathname } from '../../i18n/routing'
import { ShoppingCart, Menu, X, Gamepad2 } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { getTotalItems } = useCart()
  const t = useTranslations('Navigation')

  const navLinks = [
    { path: '/', label: t('home') },
    { path: '/games', label: t('games') },
  ]

  return (
    <nav className="border-b border-purple-500/20 dark:border-purple-500/20 bg-white/80 dark:bg-black/20 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Gamepad2 className="w-8 h-8 text-purple-500 dark:text-purple-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-600">
              AuraGame
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  href={path}
                  className={`${
                    pathname === path
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  } transition-colors duration-200 font-medium`}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 border-l border-purple-500/20 dark:border-purple-500/20 pl-8">
              <LanguageSwitcher />
              <ThemeToggle />

              <button className="bg-purple-600 cursor-pointer hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25">
                {t('login')}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link href="/cart" className="relative p-2 text-gray-700 dark:text-gray-300">
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-purple-500/20 dark:border-purple-500/20">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                href={path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === path
                    ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-purple-50/50 dark:hover:bg-purple-500/5'
                }`}
              >
                {label}
              </Link>
            ))}
            <button className="w-full mt-4  bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
              {t('login')}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
