import { z } from 'zod'

/** Aturan sama dengan backend (topup-be): nama trim 1–100, email valid, password 8–72 karakter. */
export const AUTH_LIMITS = {
  nameMax: 100,
  passwordMin: 8,
  passwordMax: 72,
} as const

/** `t` dari useTranslations('AuthValidation') — pesan error langsung tampil lewat <FormMessage>. */
type Translate = (key: string, values?: Record<string, number>) => string

export function createAuthSchemas(t: Translate) {
  // Sengaja tanpa .pipe(z.email()): dengan tsconfig `strict: false`, zod v4 menganggap hasil pipe opsional
  const email = z
    .string()
    .trim()
    .min(1, t('emailRequired'))
    .regex(z.regexes.email, t('emailInvalid'))

  const newPassword = z
    .string()
    .min(AUTH_LIMITS.passwordMin, t('passwordMin', { min: AUTH_LIMITS.passwordMin }))
    .max(AUTH_LIMITS.passwordMax, t('passwordMax', { max: AUTH_LIMITS.passwordMax }))

  return {
    login: z.object({
      email,
      password: z.string().min(1, t('passwordRequired')),
    }),
    register: z.object({
      name: z
        .string()
        .trim()
        .min(1, t('nameRequired'))
        .max(AUTH_LIMITS.nameMax, t('nameMax', { max: AUTH_LIMITS.nameMax })),
      email,
      password: newPassword,
    }),
    forgot: z.object({ email }),
    reset: z
      .object({
        password: newPassword,
        confirmPassword: z.string().min(1, t('confirmRequired')),
      })
      .refine((values) => values.password === values.confirmPassword, {
        message: t('passwordMismatch'),
        path: ['confirmPassword'],
      }),
  }
}

export type AuthSchemas = ReturnType<typeof createAuthSchemas>
