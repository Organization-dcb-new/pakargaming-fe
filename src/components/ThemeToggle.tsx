'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useThemeSwitch } from '@/hooks/useThemeSwitch'

/** Tombol terang/gelap ringkas — dipakai halaman maintenance. Navbar memakai popover pengaturan. */
export function ThemeToggle() {
  const t = useTranslations('Theme')
  const { mounted, resolvedTheme, switchTheme } = useThemeSwitch()

  // resolvedTheme (bukan theme): saat tema "system", theme === 'system' sehingga toggle tidak berefek
  const toggleTheme = () => switchTheme(resolvedTheme === 'dark' ? 'light' : 'dark')

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9" aria-label={t('toggle')}>
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-9 h-9 cursor-pointer"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{t('toggle')}</span>
    </Button>
  )
}
