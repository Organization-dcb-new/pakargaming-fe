'use client'

import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import useLoginGoogleOauth from '@/features/auth/hooks/useLoginGoogleOauth'

/**
 * Layar transit login Google: hook menukar `?auth_code` dengan sesi lalu redirect.
 * Tinggi = viewport − navbar (h-14 / md:h-16), sama seperti /check-transaction, supaya pas di tengah.
 */
export default function GoogleSignInCallback() {
  const t = useTranslations('Auth')
  useLoginGoogleOauth()

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-4 px-4 text-center md:min-h-[calc(100dvh-4rem)]"
    >
      <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
      <p className="font-display text-lg font-semibold text-foreground">{t('loggingIn')}</p>
    </div>
  )
}
