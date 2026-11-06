'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@wrksz/themes/client'
import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { Button } from './ui/button'
import { useTranslations } from 'next-intl'
import { startPageTransition } from '../lib/pageTransition'

export function ThemeToggle() {
  const t = useTranslations('Theme')
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // resolvedTheme (bukan theme): saat tema "system", theme === 'system' sehingga toggle tidak berefek
  const toggleTheme = () => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark'
    // flushSync: update tema harus ter-commit (class di <html> berganti) di dalam callback
    // supaya snapshot "sesudah" crossfade sudah bertema baru.
    startPageTransition(() => flushSync(() => setTheme(next)))
  }

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
