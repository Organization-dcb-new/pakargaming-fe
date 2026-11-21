'use client'

import { Loader2 } from 'lucide-react'
import type { HTMLInputAutoCompleteAttribute, ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import PasswordInput from './PasswordInput'
import { authHintClass, authInputClass, authLabelClass, primaryButtonClass, spinnerClass } from '@/features/auth/styles'

interface BaseFieldProps {
  name: string
  label: string
  placeholder?: string
  autoComplete: HTMLInputAutoCompleteAttribute
  hint?: string
}

/** Field teks (nama/email) — label, aria-invalid & aria-describedby di-wire oleh ui/form. */
export function AuthTextField({
  name,
  label,
  placeholder,
  autoComplete,
  hint,
  type = 'text',
}: BaseFieldProps & { type?: 'text' | 'email' }) {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="gap-1.5">
          <FormLabel className={authLabelClass}>{label}</FormLabel>
          <FormControl>
            <input
              type={type}
              inputMode={type === 'email' ? 'email' : undefined}
              autoComplete={autoComplete}
              autoCapitalize={type === 'email' ? 'none' : undefined}
              spellCheck={false}
              placeholder={placeholder}
              className={authInputClass}
              {...field}
              value={field.value ?? ''}
            />
          </FormControl>
          {hint && <FormDescription className={authHintClass}>{hint}</FormDescription>}
          <FormMessage className="text-xs font-medium" />
        </FormItem>
      )}
    />
  )
}

/** Field password + toggle tampilkan; `labelAction` mis. link "Lupa password?" di kanan label. */
export function AuthPasswordField({
  name,
  label,
  placeholder,
  autoComplete,
  hint,
  labelAction,
}: BaseFieldProps & { labelAction?: ReactNode }) {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <FormLabel className={authLabelClass}>{label}</FormLabel>
            {labelAction}
          </div>
          <FormControl>
            <PasswordInput
              autoComplete={autoComplete}
              placeholder={placeholder}
              {...field}
              value={field.value ?? ''}
            />
          </FormControl>
          {hint && <FormDescription className={authHintClass}>{hint}</FormDescription>}
          <FormMessage className="text-xs font-medium" />
        </FormItem>
      )}
    />
  )
}

/**
 * Tombol submit utama (chamfer). Disabled lewat <fieldset disabled> induknya saat pending.
 * `verifying`: Turnstile belum memberi token → spinner + label "Memverifikasi keamanan…".
 */
export function SubmitButton({
  pending,
  pendingLabel,
  verifying = false,
  children,
}: {
  pending: boolean
  pendingLabel: string
  verifying?: boolean
  children: ReactNode
}) {
  const t = useTranslations('AuthDialog')
  const busy = pending || verifying

  return (
    <button type="submit" aria-busy={busy || undefined} className={primaryButtonClass}>
      {busy && <Loader2 className={spinnerClass} aria-hidden="true" />}
      {pending ? pendingLabel : verifying ? t('captchaVerifying') : children}
    </button>
  )
}
