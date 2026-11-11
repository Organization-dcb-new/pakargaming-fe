'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Link } from '@/i18n/routing'
import { AUTH_LIMITS, createAuthSchemas } from '@/features/auth/lib/authSchema'
import { Form } from '@/components/ui/form'
import { cn } from '@/lib/cn'
import { useRegister } from '@/features/auth/api/auth'
import { useEmailDraft } from '@/features/auth/hooks/useEmailDraft'
import { parseAuthError, useAuthErrorMessage } from '@/features/auth/lib/authErrors'
import type { AuthFormProps } from '@/features/auth/types/authDialog'
import { AuthPasswordField, AuthTextField, SubmitButton } from './AuthFields'
import FormAlert from './FormAlert'
import { GoogleButton, OrDivider } from './GoogleButton'
import { textLinkClass } from '@/features/auth/styles'
import { useTurnstile } from '@/features/auth/hooks/useTurnstile'

export default function RegisterForm({
  defaultEmail,
  onEmailChange,
  onSwitchMode,
  onDone,
}: AuthFormProps) {
  const t = useTranslations('AuthDialog')
  const tv = useTranslations('AuthValidation')
  const schema = useMemo(() => createAuthSchemas(tv).register, [tv])
  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { name: '', email: defaultEmail, password: '' },
  })
  const signUp = useRegister()
  const errorMessage = useAuthErrorMessage()
  const error = signUp.error ? parseAuthError(signUp.error) : null
  const captcha = useTurnstile()

  useEmailDraft(form, onEmailChange)

  const onSubmit = form.handleSubmit((values) => {
    if (captcha.blocked) return
    signUp.mutate(
      { ...values, captchaToken: captcha.token },
      {
        onSuccess: (session) => {
          toast.success(t('registerSuccess', { name: session.user.name }))
          onDone()
        },
        onSettled: captcha.reset,
      },
    )
  })

  return (
    <div className="flex flex-col gap-5">
      <Form {...form}>
        <form onSubmit={onSubmit} noValidate>
          <fieldset disabled={signUp.isPending} className="flex min-w-0 flex-col gap-4">
            {error && (
              <FormAlert
                tone="error"
                actions={
                  error.code === 'emailRegistered' ? (
                    <button
                      type="button"
                      className={textLinkClass}
                      onClick={() => onSwitchMode('login')}
                    >
                      {t('goToLogin')}
                    </button>
                  ) : undefined
                }
              >
                {errorMessage(error)}
              </FormAlert>
            )}

            <AuthTextField
              name="name"
              label={t('nameLabel')}
              placeholder={t('namePlaceholder')}
              autoComplete="name"
            />
            <AuthTextField
              name="email"
              type="email"
              label={t('emailLabel')}
              placeholder={t('emailPlaceholder')}
              autoComplete="email"
            />
            <AuthPasswordField
              name="password"
              label={t('passwordLabel')}
              placeholder={t('newPasswordPlaceholder', { min: AUTH_LIMITS.passwordMin })}
              autoComplete="new-password"
              hint={t('passwordHint', { min: AUTH_LIMITS.passwordMin, max: AUTH_LIMITS.passwordMax })}
            />

            {captcha.withWidget(
              <SubmitButton
                pending={signUp.isPending || captcha.verifying}
                pendingLabel={signUp.isPending ? t('processing') : t('captchaVerifying')}
              >
                {t('submitRegister')}
              </SubmitButton>,
            )}

            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              {t.rich('terms', {
                terms: (chunks) => (
                  <Link href="/term-and-condition" onClick={onDone} className={cn(textLinkClass, 'text-xs')}>
                    {chunks}
                  </Link>
                ),
                privacy: (chunks) => (
                  <Link href="/policy-and-privacy" onClick={onDone} className={cn(textLinkClass, 'text-xs')}>
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </fieldset>
        </form>
      </Form>

      <OrDivider />
      <GoogleButton>{t('continueWithGoogle')}</GoogleButton>
    </div>
  )
}
