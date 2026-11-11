'use client'

import { useLocale } from 'next-intl'
import { useTransition } from 'react'
import { usePathname, useRouter } from '@/i18n/routing'
import { setEntranceSuppressed, startPageTransition, waitForDocumentLang } from '@/lib/pageTransition'

export type LocaleCode = 'id' | 'en'

/** Jeda setelah locale baru ter-render, supaya komponen yang mount ulang (navbar, dsb.) selesai
 *  settle sebelum snapshot crossfade diambil. Pakai setTimeout: rAF tidak jalan selama render ditahan. */
const SETTLE_MS = 80

/** Ganti bahasa dengan crossfade halaman (dipakai popover pengaturan, menu mobile, halaman maintenance). */
export function useLocaleSwitch() {
  const locale = useLocale() as LocaleCode
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const switchLocale = (next: LocaleCode) => {
    if (next === locale) return
    setEntranceSuppressed(true)
    startPageTransition(async () => {
      startTransition(() => {
        router.replace(pathname, { locale: next })
      })
      await waitForDocumentLang(next)
      await new Promise((resolve) => setTimeout(resolve, SETTLE_MS))
    }).finally(() => setEntranceSuppressed(false))
  }

  return { locale, switchLocale, isPending }
}
