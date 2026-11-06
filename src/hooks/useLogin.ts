'use client'

import { useCallback, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Cookies from 'js-cookie'
import { toast } from 'sonner'
import { useAuthDialog } from '../components/Auth/AuthDialogProvider'
import { useLinkGoogle } from '../components/Auth/hooks/useAuthApi'
import { parseAuthError, useAuthErrorMessage } from '../components/Auth/lib/authErrors'
import { useRouter as useLocaleRouter } from '../i18n/routing'
import { getGoogleAuthUrl } from '../lib/authUrls'
import { setSession } from './useAuth'

/** Query param yang dikirim backend setelah OAuth Google — dibuang dari URL setelah diproses. */
const AUTH_REDIRECT_PARAMS = ['token', 'user', 'auth_error', 'google_link']

/**
 * Hook ini bisa ter-mount lebih dari sekali (Navigation + auth/callback) dan efeknya jalan dua kali
 * di StrictMode. Kode link Google sekali pakai, jadi tiap redirect diproses sekali per page load
 * (redirect OAuth selalu full page load, jadi Set ini otomatis kosong lagi).
 */
const handledRedirects = new Set<string>()

function claimRedirect(key: string) {
  if (handledRedirects.has(key)) return false
  handledRedirects.add(key)
  return true
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export default function useLoginGoogleOauth() {
  const router = useRouter()
  const localeRouter = useLocaleRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations('AuthRedirect')
  const errorMessage = useAuthErrorMessage()
  const { openAuthDialog } = useAuthDialog()
  const { mutate: linkGoogle } = useLinkGoogle()

  const loginWithGoogle = useCallback(() => {
    window.location.href = getGoogleAuthUrl()
  }, [])

  useEffect(() => {
    const token = searchParams.get('token')
    const user = searchParams.get('user')
    const authError = searchParams.get('auth_error')
    const linkCode = searchParams.get('google_link')

    // Login Google berhasil → simpan cookie sesi (alur lama, tidak berubah)
    if (token && user) {
      setSession(token, safeDecode(user))
      router.replace('/')
      return
    }

    if (!authError && !linkCode) return

    const rest = new URLSearchParams(searchParams.toString())
    AUTH_REDIRECT_PARAMS.forEach((key) => rest.delete(key))
    const query = rest.toString()
    const cleanUrl = query ? `${pathname}?${query}` : pathname

    const handleRedirect = () => {
      if (authError) {
        if (claimRedirect(`auth_error:${authError}`)) {
          if (authError === 'google_email_registered') {
            // Email Google ini milik akun email+password yang belum terhubung: login dulu, link dari Dasbor
            openAuthDialog({ mode: 'login', notice: 'googleEmailRegistered' })
          } else {
            toast.error(t('googleFailed'))
          }
        }
        router.replace(cleanUrl, { scroll: false })
        return
      }

      if (!linkCode || !claimRedirect(`google_link:${linkCode}`)) return

      if (!Cookies.get('token')) {
        toast.error(t('linkNeedsLogin'))
        openAuthDialog({ mode: 'login' })
        router.replace(cleanUrl, { scroll: false })
        return
      }

      const toastId = toast.loading(t('linking'))
      linkGoogle(linkCode, {
        onSuccess: () => toast.success(t('linkSuccess'), { id: toastId }),
        onError: (error) => toast.error(errorMessage(parseAuthError(error)), { id: toastId }),
        onSettled: () => localeRouter.replace('/dashboard'),
      })
    }

    // Tunda satu tick: <Toaster> (di <main>) baru subscribe setelah efek Navigation ini jalan,
    // toast yang dikirim lebih awal hilang. Klaim diambil di dalam timer → aman di StrictMode.
    const timer = window.setTimeout(handleRedirect, 0)
    return () => window.clearTimeout(timer)
  }, [searchParams, pathname, router, localeRouter, t, errorMessage, openAuthDialog, linkGoogle])

  return { loginWithGoogle }
}
