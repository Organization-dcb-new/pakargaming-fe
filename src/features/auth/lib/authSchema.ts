import { z } from 'zod'

/** Aturan sama dengan backend (topup-be): nama trim 1–60, email valid, password 8–72 karakter. */
export const AUTH_LIMITS = {
  nameMax: 60,
  passwordMin: 8,
  passwordMax: 72,
} as const

/**
 * Karakter nama yang diterima backend: huruf (aksara apa pun) beserta tanda diakritiknya, spasi, dan . ' ’ -.
 * Tanpa angka, titik dua, atau garis miring — nama pernah dipakai menyisipkan link/nominal palsu.
 */
// Lewat konstruktor: target TS ES2017 belum mengenal literal \p{…} (semua browser modern sudah mendukung)
const NAME_PATTERN = new RegExp("^[\\p{L}\\p{M} .'’-]+$", 'u')
const HAS_LETTER = new RegExp('\\p{L}', 'u')

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
        .max(AUTH_LIMITS.nameMax, t('nameMax', { max: AUTH_LIMITS.nameMax }))
        .refine((name) => name === '' || (NAME_PATTERN.test(name) && HAS_LETTER.test(name)), t('nameInvalid')),
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
