'use client'

import { useTheme } from '@wrksz/themes/client'
import { useLocale, useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import FormAlert from './FormAlert'
import { textLinkClass } from './styles'

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

interface TurnstileOptions {
  sitekey: string
  theme?: 'light' | 'dark' | 'auto'
  language?: string
  appearance?: 'always' | 'execute' | 'interaction-only'
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
  'before-interactive-callback'?: () => void
  'after-interactive-callback'?: () => void
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileOptions) => string
  reset: (widgetId?: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let scriptPromise: Promise<TurnstileApi> | null = null

/** Script Cloudflare dimuat sekali, dan hanya saat form auth dibuka (bukan di setiap halaman). */
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  scriptPromise ??= new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () =>
      window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile tidak tersedia'))
    script.onerror = () => {
      scriptPromise = null
      script.remove()
      reject(new Error('Script Turnstile gagal dimuat'))
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}

type Status = 'verifying' | 'ready' | 'error'

/**
 * Cloudflare Turnstile untuk form login, daftar, dan lupa password; tokennya diverifikasi proxy.
 * Tanpa NEXT_PUBLIC_TURNSTILE_SITE_KEY hook ini tidak melakukan apa-apa, jadi form berjalan seperti biasa.
 * Mode `interaction-only`: widget hanya muncul kalau Cloudflare butuh interaksi — biasanya tidak terlihat.
 */
export function useTurnstile() {
  const t = useTranslations('AuthDialog')
  const locale = useLocale()
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === 'light' ? 'light' : 'dark'

  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('verifying')
  const [interactive, setInteractive] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!SITE_KEY || !container) return

    let cancelled = false
    setToken(null)
    setStatus('verifying')

    loadTurnstile()
      .then((turnstile) => {
        if (cancelled) return
        widgetIdRef.current = turnstile.render(container, {
          sitekey: SITE_KEY,
          theme,
          language: locale,
          appearance: 'interaction-only',
          callback: (value) => {
            setToken(value)
            setStatus('ready')
          },
          // Token kedaluwarsa (±5 menit) diperbarui otomatis oleh Turnstile
          'expired-callback': () => {
            setToken(null)
            setStatus('verifying')
          },
          'error-callback': () => {
            setToken(null)
            setStatus('error')
          },
          'before-interactive-callback': () => setInteractive(true),
          'after-interactive-callback': () => setInteractive(false),
        })
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
      if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current)
      widgetIdRef.current = null
      setInteractive(false)
    }
  }, [theme, locale, attempt])

  /** Token hanya berlaku sekali: setelah dipakai submit, minta token baru. */
  const reset = useCallback(() => {
    if (!SITE_KEY || !widgetIdRef.current) return
    setToken(null)
    setStatus('verifying')
    try {
      window.turnstile?.reset(widgetIdRef.current)
    } catch {
      // Container sudah dilepas (mis. form lupa password berganti ke layar "email terkirim")
    }
  }, [])

  const enabled = Boolean(SITE_KEY)

  /** Bungkus tombol submit: widget (kalau perlu interaksi) dan pesan gagal muat tampil tepat di atasnya. */
  const withWidget = (submit: ReactNode) => {
    if (!enabled) return submit
    return (
      <div className="flex flex-col">
        {status === 'error' && (
          <FormAlert
            tone="error"
            className="mb-4"
            actions={
              <button type="button" className={textLinkClass} onClick={() => setAttempt((n) => n + 1)}>
                {t('captchaRetry')}
              </button>
            }
          >
            {t('captchaLoadFailed')}
          </FormAlert>
        )}
        <div ref={containerRef} className={interactive ? 'mb-4 flex justify-center' : undefined} />
        {submit}
      </div>
    )
  }

  return {
    token,
    /** Belum ada token: submit ditahan (tombol menampilkan "Memverifikasi…" atau pesan gagal di atasnya). */
    blocked: enabled && !token,
    verifying: enabled && status === 'verifying',
    reset,
    withWidget,
  }
}
