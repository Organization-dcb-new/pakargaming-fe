'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { getGoogleAuthUrl } from '../../../lib/authUrls'
import { createAuthSchemas } from '../../../schemas/auth_schema'
import { Form } from '../../ui/form'
import { cn } from '../../ui/utils'
import { useEmailLogin } from '../hooks/useAuthApi'
import { useEmailDraft } from '../hooks/useEmailDraft'
import { parseAuthError, useAuthErrorMessage } from '../lib/authErrors'
import type { AuthDialogNotice, AuthFormProps } from '../types'
import { AuthPasswordField, AuthTextField, SubmitButton } from './AuthFields'
import FormAlert from './FormAlert'
import { GoogleButton, OrDivider } from './GoogleButton'
import { textLinkClass } from './styles'

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

  useEmailDraft(form, onEmailChange)

  const onSubmit = form.handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: (session) => {
        toast.success(t('loginSuccess', { name: session.user.name }))
        onDone()
      },
    })
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

            <SubmitButton pending={login.isPending} pendingLabel={t('processing')}>
              {t('submitLogin')}
            </SubmitButton>
          </fieldset>
        </form>
      </Form>

      <OrDivider />
      <GoogleButton>{t('continueWithGoogle')}</GoogleButton>
    </div>
  )
}
