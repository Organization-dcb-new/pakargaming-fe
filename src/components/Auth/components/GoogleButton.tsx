'use client'

import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState, type ReactNode } from 'react'
import { getGoogleAuthUrl } from '../../../lib/authUrls'
import { cn } from '../../ui/utils'
import { secondaryButtonClass, spinnerClass } from './styles'

interface GoogleButtonProps {
  /** `link` = hubungkan Google ke akun yang sedang login. */
  intent?: 'link'
  children: ReactNode
  className?: string
}

/** Navigasi penuh ke OAuth Google di backend (bukan lewat /api/proxy). */
export function GoogleButton({ intent, children, className }: GoogleButtonProps) {
  const t = useTranslations('AuthDialog')
  const [redirecting, setRedirecting] = useState(false)

  // Kembali lewat tombol Back (bfcache) → tombol aktif lagi
  useEffect(() => {
    const reset = () => setRedirecting(false)
    window.addEventListener('pageshow', reset)
    return () => window.removeEventListener('pageshow', reset)
  }, [])

  return (
    <button
      type="button"
      disabled={redirecting}
      aria-busy={redirecting || undefined}
      onClick={() => {
        setRedirecting(true)
        window.location.href = getGoogleAuthUrl(intent)
      }}
      className={cn(secondaryButtonClass, className)}
    >
      {redirecting ? (
        <Loader2 className={spinnerClass} aria-hidden="true" />
      ) : (
        <img
          src="/icons/google.svg"
          alt=""
          aria-hidden="true"
          className="h-5 w-5 shrink-0 rounded-full bg-white p-0.5"
        />
      )}
      {redirecting ? t('redirecting') : children}
    </button>
  )
}

export function OrDivider() {
  const t = useTranslations('AuthDialog')

  return (
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {t('or')}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
    </div>
  )
}
