'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { House, LayoutDashboard, Loader2, LogIn, MailCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import useAuth from '@/hooks/useAuth'
import { Link } from '@/i18n/routing'
import { verifyEmail } from '@/features/auth/api/auth'
import { parseAuthError, useAuthErrorMessage } from '@/features/auth/lib/authErrors'
import { primaryButtonClass, secondaryButtonClass, spinnerClass } from '@/features/auth/styles'
import { STATE_GLYPH } from '@/components/ui/state-glyph'
import { HudPanel } from '@/components/ui/hud-panel'
import { useAuthDialog } from './AuthDialogProvider'
import FormAlert from './FormAlert'
import ResetPasswordResult from './ResetPasswordResult'

/**
 * Halaman tujuan link email verifikasi (`/verify-email?token=...`).
 *
 * Verifikasi sengaja menunggu klik tombol, bukan otomatis saat halaman dibuka: pemindai link di layanan
 * email bisa membuka halaman ini sendiri, dan email yang dipakai orang lain untuk mendaftar tidak boleh
 * ikut terverifikasi tanpa pemiliknya sadar.
 */
export default function VerifyEmail({ token }: { token: string | null }) {
  const t = useTranslations('VerifyEmail')
  const { user } = useAuth()
  const { openAuthDialog } = useAuthDialog()
  const queryClient = useQueryClient()
  const errorMessage = useAuthErrorMessage()

  const verify = useMutation({
    mutationKey: ['auth', 'verify-email'],
    mutationFn: (value: string) => verifyEmail(value),
    onSuccess: () => {
      // Dasbor (kalau terbuka di tab ini) membaca ulang status email dan riwayatnya
      queryClient.invalidateQueries({ queryKey: ['auth-me'] })
      queryClient.invalidateQueries({ queryKey: ['transactions-dashboard'] })
    },
  })
  const error = verify.error ? parseAuthError(verify.error) : null

  const homeLink = (
    <Link href="/" className={secondaryButtonClass}>
      <House className="size-4" aria-hidden="true" />
      {t('home')}
    </Link>
  )
  const nextStep = user ? (
    <Link href="/dashboard" className={primaryButtonClass}>
      <LayoutDashboard className="size-4" aria-hidden="true" />
      {t('dashboard')}
    </Link>
  ) : (
    <button type="button" aria-haspopup="dialog" onClick={() => openAuthDialog({ mode: 'login' })} className={primaryButtonClass}>
      <LogIn className="size-4" aria-hidden="true" />
      {t('login')}
    </button>
  )

  let content
  if (!token) {
    content = (
      <ResetPasswordResult glyph={STATE_GLYPH.error} tone="destructive" title={t('missingTitle')} description={t('missingBody')}>
        <div className="flex flex-col gap-3">{homeLink}</div>
      </ResetPasswordResult>
    )
  } else if (verify.isSuccess) {
    content = (
      <div role="status">
        <ResetPasswordResult
          glyph={STATE_GLYPH.success}
          tone="success"
          title={t('successTitle')}
          description={t('successBody')}
          focusOnMount
        >
          <div className="flex flex-col gap-3">
            {nextStep}
            {homeLink}
          </div>
        </ResetPasswordResult>
      </div>
    )
  } else if (error?.code === 'verifyLinkInvalid') {
    content = (
      <div role="alert">
        <ResetPasswordResult
          glyph={STATE_GLYPH.expired}
          tone="warning"
          title={t('invalidTitle')}
          description={t('invalidBody')}
          focusOnMount
        >
          <div className="flex flex-col gap-3">
            {nextStep}
            {homeLink}
          </div>
        </ResetPasswordResult>
      </div>
    )
  } else {
    content = (
      <ResetPasswordResult glyph={STATE_GLYPH.email} tone="primary" title={t('title')} description={t('description')}>
        <div className="flex flex-col gap-3">
          {error && <FormAlert tone="error">{errorMessage(error)}</FormAlert>}
          <button
            type="button"
            onClick={() => verify.mutate(token)}
            disabled={verify.isPending}
            aria-busy={verify.isPending || undefined}
            className={primaryButtonClass}
          >
            {verify.isPending ? (
              <Loader2 className={spinnerClass} aria-hidden="true" />
            ) : (
              <MailCheck className="size-4" aria-hidden="true" />
            )}
            {verify.isPending ? t('processing') : t('submit')}
          </button>
          <p className="text-center text-xs leading-relaxed text-muted-foreground">{t('notYouHint')}</p>
        </div>
      </ResetPasswordResult>
    )
  }

  return (
    // Setinggi layar (viewport − navbar), kartu di tengah — sama seperti halaman atur password
    <section className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-7xl items-center justify-center px-4 py-12 sm:px-6 md:min-h-[calc(100dvh-4rem)] lg:px-8">
      <HudPanel className="w-full max-w-md" innerClassName="p-6 sm:p-8">
        {content}
      </HudPanel>
    </section>
  )
}
