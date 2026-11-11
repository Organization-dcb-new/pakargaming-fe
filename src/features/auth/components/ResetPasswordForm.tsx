'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { AUTH_LIMITS, createAuthSchemas } from '@/features/auth/lib/authSchema'
import { AuthPasswordField, SubmitButton } from './AuthFields'
import FormAlert from './FormAlert'
import { textLinkClass } from '@/features/auth/styles'
import { useResetPassword } from '@/features/auth/api/auth'
import { parseAuthError, useAuthErrorMessage } from '@/features/auth/lib/authErrors'
import { Form } from '@/components/ui/form'

interface ResetPasswordFormProps {
  token: string
  onSuccess: () => void
  onRequestNewLink: () => void
}

export default function ResetPasswordForm({ token, onSuccess, onRequestNewLink }: ResetPasswordFormProps) {
  const t = useTranslations('ResetPassword')
  const td = useTranslations('AuthDialog')
  const tv = useTranslations('AuthValidation')
  const schema = useMemo(() => createAuthSchemas(tv).reset, [tv])
  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { password: '', confirmPassword: '' },
  })
  const resetPassword = useResetPassword()
  const errorMessage = useAuthErrorMessage()
  const error = resetPassword.error ? parseAuthError(resetPassword.error) : null

  const onSubmit = form.handleSubmit(({ password }) => {
    resetPassword.mutate({ token, password }, { onSuccess })
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} noValidate>
        <fieldset disabled={resetPassword.isPending} className="flex min-w-0 flex-col gap-4">
          {error && (
            <FormAlert
              tone="error"
              actions={
                error.code === 'resetLinkInvalid' ? (
                  <button type="button" onClick={onRequestNewLink} className={textLinkClass}>
                    {t('requestNewLink')}
                  </button>
                ) : undefined
              }
            >
              {errorMessage(error)}
            </FormAlert>
          )}

          <AuthPasswordField
            name="password"
            label={t('newPasswordLabel')}
            placeholder={td('newPasswordPlaceholder', { min: AUTH_LIMITS.passwordMin })}
            autoComplete="new-password"
            hint={td('passwordHint', { min: AUTH_LIMITS.passwordMin, max: AUTH_LIMITS.passwordMax })}
          />
          <AuthPasswordField
            name="confirmPassword"
            label={t('confirmPasswordLabel')}
            placeholder={t('confirmPlaceholder')}
            autoComplete="new-password"
          />

          <SubmitButton pending={resetPassword.isPending} pendingLabel={t('processing')}>
            {t('submit')}
          </SubmitButton>
        </fieldset>
      </form>
    </Form>
  )
}
