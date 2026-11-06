import { useEffect } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

/** Laporkan isi field `email` ke dialog supaya ikut terbawa saat pindah mode. */
export function useEmailDraft<T extends FieldValues>(
  form: UseFormReturn<T, any, any>,
  onEmailChange: (email: string) => void,
) {
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (typeof values.email === 'string') onEmailChange(values.email)
    })
    return () => subscription.unsubscribe()
  }, [form, onEmailChange])
}
