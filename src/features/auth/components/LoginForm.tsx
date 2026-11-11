'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { getGoogleAuthUrl } from '@/features/auth/lib/authUrls'
import { createAuthSchemas } from '@/features/auth/lib/authSchema'
import { Form } from '@/components/ui/form'
import { cn } from '@/lib/cn'
import { useEmailLogin } from '@/features/auth/api/auth'
import { useEmailDraft } from '@/features/auth/hooks/useEmailDraft'
import { parseAuthError, useAuthErrorMessage } from '@/features/auth/lib/authErrors'
import type { AuthDialogNotice, AuthFormProps } from '@/features/auth/types/authDialog'
import { AuthPasswordField, AuthTextField, SubmitButton } from './AuthFields'
import FormAlert from './FormAlert'
import { GoogleButton, OrDivider } from './GoogleButton'
import { textLinkClass } from '@/features/auth/styles'
import { useTurnstile } from '@/features/auth/hooks/useTurnstile'

export default function LoginForm({
  defaultEmail,
  notice,
  onEmailChange,
  onSwitchMode,
  onDone,
}: AuthFormProps & { notice?: AuthDialogNotice }) {
  const t = useTranslations('AuthDialog')
  const tv = useTranslations('AuthValidation')
  const schema = useMemo(() => createAuthSchemas(tv).login, [tv])
  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { email: defaultEmail, password: '' },
  })
  const login = useEmailLogin()
  const errorMessage = useAuthErrorMessage()
  const error = login.error ? parseAuthError(login.error) : null
  const captcha = useTurnstile()

  useEmailDraft(form, onEmailChange)

  const onSubmit = form.handleSubmit((values) => {
    if (captcha.blocked) return
    login.mutate(
      { ...values, captchaToken: captcha.token },
      {
        onSuccess: (session) => {
          toast.success(t('loginSuccess', { name: session.user.name }))
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
          <fieldset disabled={login.isPending} className="flex min-w-0 flex-col gap-4">
            {notice === 'googleEmailRegistered' && (
              <FormAlert tone="info">{t('noticeGoogleEmailRegistered')}</FormAlert>
            )}

            {error && (
              <FormAlert
                tone="error"
                actions={
                  error.code === 'googleAccount' ? (
                    <>
                      <button
                        type="button"
                        className={textLinkClass}
                        onClick={() => {
                          window.location.href = getGoogleAuthUrl()
                        }}
                      >
                        {t('useGoogle')}
                      </button>
                      <button
                        type="button"
                        className={textLinkClass}
                        onClick={() => onSwitchMode('forgot')}
                      >
                        {t('setPasswordViaEmail')}
                      </button>
                    </>
                  ) : undefined
                }
              >
                {errorMessage(error)}
              </FormAlert>
            )}

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
              placeholder={t('passwordPlaceholder')}
              autoComplete="current-password"
              labelAction={
                <button
                  type="button"
                  className={cn(textLinkClass, 'text-xs')}
                  onClick={() => onSwitchMode('forgot')}
                >
                  {t('forgotLink')}
                </button>
              }
            />

            {captcha.withWidget(
              <SubmitButton
                pending={login.isPending || captcha.verifying}
                pendingLabel={login.isPending ? t('processing') : t('captchaVerifying')}
              >
                {t('submitLogin')}
              </SubmitButton>,
            )}
          </fieldset>
        </form>
      </Form>

      <OrDivider />
      <GoogleButton>{t('continueWithGoogle')}</GoogleButton>
    </div>
  )
}
