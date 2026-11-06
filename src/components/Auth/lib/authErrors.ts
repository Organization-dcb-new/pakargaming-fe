import axios from 'axios'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

export type AuthErrorCode =
  | 'emailRegistered'
  | 'invalidCredentials'
  | 'googleAccount'
  | 'tooManyAttempts'
  | 'resetLinkInvalid'
  | 'linkCodeInvalid'
  | 'googleLinkedElsewhere'
  | 'alreadyLinked'
  | 'validation'
  | 'network'
  | 'generic'

export interface AuthError {
  code: AuthErrorCode
  /** Dari header Retry-After (429), dalam detik. */
  retryAfterSeconds?: number
}

/** Pesan error backend (stabil, bahasa Inggris) → kode i18n di namespace `AuthErrors`. */
const MESSAGE_TO_CODE: Record<string, AuthErrorCode> = {
  'email already registered': 'emailRegistered',
  'invalid email or password': 'invalidCredentials',
  'account uses google sign-in': 'googleAccount',
  'too many login attempts': 'tooManyAttempts',
  'invalid or expired reset link': 'resetLinkInvalid',
  'invalid or expired link code': 'linkCodeInvalid',
  'google account already linked to another user': 'googleLinkedElsewhere',
  'account already linked to google': 'alreadyLinked',
}

function parseRetryAfter(value: unknown): number | undefined {
  if (typeof value !== 'string' && typeof value !== 'number') return undefined
  const seconds = Number(value)
  if (Number.isFinite(seconds) && seconds >= 0) return seconds

  // Retry-After juga boleh berupa HTTP-date
  const date = Date.parse(String(value))
  if (Number.isNaN(date)) return undefined
  return Math.max(0, Math.round((date - Date.now()) / 1000))
}

export function parseAuthError(error: unknown): AuthError {
  if (!axios.isAxiosError(error)) return { code: 'generic' }

  const response = error.response
  if (!response) return { code: 'network' }

  const rawMessage = (response.data as { message?: unknown } | undefined)?.message
  const message = typeof rawMessage === 'string' ? rawMessage.trim().toLowerCase() : ''
  const code = MESSAGE_TO_CODE[message]

  if (response.status === 429 || code === 'tooManyAttempts') {
    return {
      code: 'tooManyAttempts',
      retryAfterSeconds: parseRetryAfter(response.headers?.['retry-after']),
    }
  }
  if (code) return { code }
  if (response.status === 400) return { code: 'validation' }
  return { code: 'generic' }
}

/** Ubah AuthError jadi kalimat yang ramah user (sesuai locale aktif). */
export function useAuthErrorMessage() {
  const t = useTranslations('AuthErrors')

  return useCallback(
    (error: AuthError) => {
      if (error.code === 'tooManyAttempts') {
        if (!error.retryAfterSeconds) return t('tooManyAttemptsNoTime')
        return t('tooManyAttempts', { minutes: Math.max(1, Math.ceil(error.retryAfterSeconds / 60)) })
      }
      return t(error.code)
    },
    [t],
  )
}
