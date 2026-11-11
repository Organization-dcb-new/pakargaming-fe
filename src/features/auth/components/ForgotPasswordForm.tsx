'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, MailCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { createAuthSchemas } from '@/features/auth/lib/authSchema'
import { Form } from '@/components/ui/form'
import { cn } from '@/lib/cn'
import { useForgotPassword } from '@/features/auth/api/auth'
import { useEmailDraft } from '@/features/auth/hooks/useEmailDraft'
import { parseAuthError, useAuthErrorMessage } from '@/features/auth/lib/authErrors'
import type { AuthFormProps } from '@/features/auth/types/authDialog'
import { AuthTextField, SubmitButton } from './AuthFields'
import FormAlert from './FormAlert'
import { secondaryButtonClass, textLinkClass } from '@/features/auth/styles'
import { useTurnstile } from '@/features/auth/hooks/useTurnstile'

export default function ForgotPasswordForm({
  defaultEmail,
  onEmailChange,
  onSwitchMode,
}: Omit<AuthFormProps, 'onDone'>) {
  const t = useTranslations('AuthDialog')
  const tv = useTranslations('AuthValidation')
  const schema = useMemo(() => createAuthSchemas(tv).forgot, [tv])
  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { email: defaultEmail },
  })
  const forgot = useForgotPassword()
  const errorMessage = useAuthErrorMessage()
  const error = forgot.error ? parseAuthError(forgot.error) : null
  const captcha = useTurnstile()

  useEmailDraft(form, onEmailChange)

  const onSubmit = form.handleSubmit((values) => {
    if (captcha.blocked) return
    forgot.mutate({ ...values, captchaToken: captcha.token }, { onSettled: captcha.reset })
  })

  const backToLogin = (
    <button
      type="button"
      onClick={() => onSwitchMode('login')}
      className={cn(textLinkClass, 'inline-flex items-center gap-1.5 self-center text-sm')}
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      {t('backToLogin')}
    </button>
  )

  // Respons backend selalu sama (email terdaftar atau tidak) → pesan netral
  if (forgot.isSuccess) {
    return (
      <div role="status" className="flex flex-col items-center gap-4 text-center">
        <span
          aria-hidden="true"
          className="chamfer flex size-14 items-center justify-center bg-success/15 text-success [--chamfer:10px]"
        >
          <MailCheck className="size-7" />
        </span>
        <div className="space-y-2">
          <p className="font-display text-lg font-bold text-foreground">{t('forgotSentTitle')}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{t('forgotSentBody')}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{t('forgotSentHint')}</p>
        </div>
        <button
          type="button"
          onClick={() => onSwitchMode('login')}
          className={secondaryButtonClass}
        >
          {t('backToLogin')}
        </button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} noValidate>
        <fieldset disabled={forgot.isPending} className="flex min-w-0 flex-col gap-4">
          {error && <FormAlert tone="error">{errorMessage(error)}</FormAlert>}

          <AuthTextField
            name="email"
            type="email"
            label={t('emailLabel')}
            placeholder={t('emailPlaceholder')}
            autoComplete="email"
          />

          {captcha.withWidget(
            <SubmitButton
              pending={forgot.isPending || captcha.verifying}
              pendingLabel={forgot.isPending ? t('sending') : t('captchaVerifying')}
            >
              {t('submitForgot')}
            </SubmitButton>,
          )}

          {backToLogin}
        </fieldset>
      </form>
    </Form>
  )
}
