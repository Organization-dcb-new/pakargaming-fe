'use client'

import { useTheme } from '@wrksz/themes/client'
import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { startPageTransition } from '@/lib/pageTransition'

export type ThemeChoice = 'dark' | 'light' | 'system'

/**
 * Ganti tema dengan crossfade halaman. `theme`/`resolvedTheme` baru terisi setelah mount
 * (di server tema belum diketahui → hindari hydration mismatch).
 */
export function useThemeSwitch() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const switchTheme = (next: ThemeChoice) => {
    if (next === theme) return
    // flushSync: update tema harus ter-commit (class di <html> berganti) di dalam callback
    // supaya snapshot "sesudah" crossfade sudah bertema baru.
    startPageTransition(() => flushSync(() => setTheme(next)))
  }

  return {
    mounted,
    theme: mounted ? (theme as ThemeChoice | undefined) : undefined,
    resolvedTheme: mounted ? resolvedTheme : undefined,
    switchTheme,
  }
}
