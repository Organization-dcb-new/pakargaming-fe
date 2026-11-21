'use client'

import { Loader2, MailWarning, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useResendVerification } from '@/features/auth/api/auth'
import { parseAuthError, useAuthErrorMessage } from '@/features/auth/lib/authErrors'
import { spinnerClass } from '@/features/auth/styles'
import { HudPanel } from '@/components/ui/hud-panel'
import { focusRing } from '@/styles/focusRing'
import { cn } from '@/lib/cn'

/**
 * Banner Dasbor untuk akun yang emailnya belum diverifikasi. Riwayat transaksi & kode voucher dicocokkan
 * lewat email, jadi backend baru membukanya setelah pemilik email mengklik link verifikasi (kontrak H1).
 */
export default function VerifyEmailBanner({ email }: { email: string }) {
  const t = useTranslations('VerifyEmailBanner')
  const resend = useResendVerification()
  const errorMessage = useAuthErrorMessage()

  const onResend = () => {
    resend.mutate(undefined, {
      onSuccess: (state) => {
        toast.success(state.email_verified ? t('alreadyVerified') : t('sent', { email }))
      },
      onError: (error) => toast.error(errorMessage(parseAuthError(error))),
    })
  }

  return (
    <HudPanel
      as="section"
      aria-labelledby="verify-email-title"
      accent={false}
      borderClassName="bg-warning/60"
      innerClassName="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6"
    >
      <MailWarning className="size-6 shrink-0 text-warning" aria-hidden="true" />
      <div className="min-w-0 flex-1 space-y-1">
        <h2 id="verify-email-title" className="font-display text-base font-bold text-foreground">
          {t('title')}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t('body', { email })}
        </p>
      </div>
      <button
        type="button"
        onClick={onResend}
        disabled={resend.isPending}
        aria-busy={resend.isPending || undefined}
        className={cn(
          'chamfer inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors duration-200 [--chamfer:8px] hover:bg-primary/85 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none',
          focusRing,
        )}
      >
        {resend.isPending ? (
          <Loader2 className={spinnerClass} aria-hidden="true" />
        ) : (
          <Send className="size-4" aria-hidden="true" />
        )}
        {resend.isPending ? t('sending') : t('resend')}
      </button>
    </HudPanel>
  )
}
