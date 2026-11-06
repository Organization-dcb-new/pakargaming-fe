'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FOOTER_CONTACT } from './Footer/config'

const DISMISS_KEY = 'cs-bubble-dismissed'
const VISIBLE_MS = 3500 // bubble stays visible
const HIDDEN_MS = 1500 // gap before it reappears (≈5s cycle)

export default function GlobalWhatsAppButton() {
  const t = useTranslations('CSButton')
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const url = `https://wa.me/${FOOTER_CONTACT.whatsappNumber}?text=${encodeURIComponent(t('message'))}`

  // Restore dismissed state for the session
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem(DISMISS_KEY) === '1') {
      setDismissed(true)
    }
  }, [])

  // Recurring show/hide cycle
  useEffect(() => {
    if (dismissed) {
      setShow(false)
      return
    }

    let active = true
    let showTimer: ReturnType<typeof setTimeout>
    let hideTimer: ReturnType<typeof setTimeout>

    const loop = () => {
      if (!active) return
      setShow(true)
      showTimer = setTimeout(() => {
        if (!active) return
        setShow(false)
        hideTimer = setTimeout(loop, HIDDEN_MS)
      }, VISIBLE_MS)
    }

    const initial = setTimeout(loop, 1500)

    return () => {
      active = false
      clearTimeout(initial)
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [dismissed])

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDismissed(true)
    if (typeof window !== 'undefined') sessionStorage.setItem(DISMISS_KEY, '1')
  }

  return (
    <div
      className="
        fixed isolate z-[55]
        right-4 sm:right-5 md:right-6
        max-lg:bottom-[calc(0.625rem+env(safe-area-inset-bottom,0px)+max(3.25rem,var(--mobile-order-bar-height,0px)))]
        lg:bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))]
      "
    >
      {/* Attention bubble */}
      <div
        aria-hidden={!show}
        className={`absolute bottom-full right-0 mb-3 w-max max-w-[15rem] origin-bottom-right transition-all duration-300 ease-out motion-reduce:transition-none ${
          show && !dismissed
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none translate-y-2 scale-95 opacity-0'
        }`}
      >
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={show && !dismissed ? undefined : -1}
          className="relative flex items-center gap-2 rounded-xl rounded-br-sm border border-border bg-card/95 px-3.5 py-2.5 pr-8 text-sm font-semibold text-foreground shadow-lg backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t('bubble')}
          {/* Speech-bubble tail pointing at the button */}
          <span className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 border-b border-r border-border bg-card" />
        </a>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label={t('dismiss')}
          tabIndex={show && !dismissed ? undefined : -1}
          className="absolute -right-2 -top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors duration-200 hover:border-primary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>

      {/* Chat button — pill gelap bertema; ikon WhatsApp tetap hijau supaya langsung dikenali */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="
          group relative z-10 flex items-center gap-2.5 rounded-full
          border border-border bg-card/95 p-1.5 text-foreground shadow-xl backdrop-blur-md
          transition-[border-color,box-shadow,transform] duration-200
          hover:-translate-y-0.5 hover:border-primary hover:shadow-glow
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
          touch-manipulation motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:pr-4
        "
        aria-label={t('aria')}
      >
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-whatsapp text-white">
          {/* Denyut halus di sekitar ikon (bukan seluruh tombol) */}
          {!dismissed && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full bg-whatsapp opacity-40 motion-safe:animate-ping"
            />
          )}
          <svg className="relative h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M20.52 3.48A11.91 11.91 0 0012.05 0C5.41 0 .02 5.39.02 12.05c0 2.13.56 4.22 1.63 6.06L0 24l6.06-1.6a11.97 11.97 0 005.99 1.53h.01c6.64 0 12.03-5.39 12.03-12.05 0-3.21-1.25-6.23-3.57-8.45zM12.05 21.9h-.01a9.88 9.88 0 01-5.03-1.38l-.36-.21-3.6.95.96-3.51-.23-.36a9.85 9.85 0 01-1.52-5.34c0-5.45 4.44-9.89 9.9-9.89a9.9 9.9 0 019.89 9.9c0 5.45-4.44 9.89-9.9 9.89zm5.45-7.36c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.17c-.17.2-.35.22-.65.07-.3-.15-1.28-.47-2.44-1.5-.9-.8-1.51-1.8-1.69-2.1-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.23-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37s-1.05 1.03-1.05 2.5 1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.1 4.48.71.3 1.27.48 1.7.62.71.22 1.36.19 1.87.11.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
          </svg>
        </span>

        <span className="hidden font-display text-sm font-bold sm:inline">{t('label')}</span>
      </a>
    </div>
  )
}
