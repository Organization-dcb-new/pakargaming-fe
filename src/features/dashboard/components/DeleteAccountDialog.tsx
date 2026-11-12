'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useId, useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteAccount, type AuthMe } from '@/features/auth/api/auth'
import FormAlert from '@/features/auth/components/FormAlert'
import PasswordInput from '@/features/auth/components/PasswordInput'
import { parseAuthError, useAuthErrorMessage } from '@/features/auth/lib/authErrors'
import {
  authHintClass,
  authInputClass,
  authLabelClass,
  primaryButtonClass,
  secondaryButtonClass,
  spinnerClass,
} from '@/features/auth/styles'
import { useRouter } from '@/i18n/routing'
import { cn } from '@/lib/cn'
import { notifyAuthChange } from '@/lib/sessionClient'

// Bentuk CTA sama dengan dialog lain, merah karena aksinya permanen
const confirmButtonClass = cn(primaryButtonClass, 'bg-destructive text-destructive-foreground hover:bg-destructive/85')

interface DeleteAccountDialogProps {
  me: AuthMe
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Konfirmasi hapus akun. Akun berpassword wajib memasukkan password saat ini; akun Google tanpa password
 * mengetik ulang email akunnya. Setelah berhasil, proxy sudah menghapus cookie sesi — tinggal pulang ke beranda.
 */
export default function DeleteAccountDialog({ me, open, onOpenChange }: DeleteAccountDialogProps) {
  const t = useTranslations('DeleteAccount')
  const router = useRouter()
  const queryClient = useQueryClient()
  const remove = useDeleteAccount()
  const errorMessage = useAuthErrorMessage()
  const inputId = useId()
  const [value, setValue] = useState('')
  const error = remove.error ? parseAuthError(remove.error) : null
  const usesPassword = me.has_password

  const reset = (next: boolean) => {
    if (remove.isPending) return
    if (!next) {
      setValue('')
      remove.reset()
    }
    onOpenChange(next)
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!value.trim()) return
    remove.mutate(usesPassword ? { password: value } : { confirmation: value.trim() }, {
      onSuccess: () => {
        toast.success(t('success'))
        queryClient.clear()
        // Cookie profil sudah dihapus proxy → navbar & halaman lain membaca ulang status login
        notifyAuthChange()
        router.replace('/')
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={reset}>
      <AlertDialogContent className="chamfer gap-6 rounded-none border-0 bg-card p-6 shadow-none [--chamfer:20px] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-destructive sm:max-w-md">
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
          <AlertDialogHeader className="gap-2 text-left">
            <AlertDialogTitle className="flex items-center gap-2.5 font-display text-xl font-bold text-foreground before:h-5 before:w-1.5 before:shrink-0 before:-skew-x-12 before:bg-destructive">
              {t('dialogTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
              {t('dialogBody')}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <fieldset disabled={remove.isPending} className="flex min-w-0 flex-col gap-3">
            {error && <FormAlert tone="error">{errorMessage(error)}</FormAlert>}
            <div className="flex flex-col gap-1.5">
              <label htmlFor={inputId} className={authLabelClass}>
                {usesPassword ? t('passwordLabel') : t('confirmLabel')}
              </label>
              {usesPassword ? (
                <PasswordInput
                  id={inputId}
                  autoComplete="current-password"
                  placeholder={t('passwordPlaceholder')}
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  aria-invalid={error?.code === 'wrongPassword' || undefined}
                />
              ) : (
                <input
                  id={inputId}
                  type="email"
                  inputMode="email"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder={me.email}
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  aria-invalid={error?.code === 'deleteNotConfirmed' || undefined}
                  className={authInputClass}
                />
              )}
              {!usesPassword && <p className={authHintClass}>{t('confirmHint', { email: me.email })}</p>}
            </div>
          </fieldset>

          <AlertDialogFooter className="gap-2.5 sm:grid sm:grid-cols-2">
            <AlertDialogCancel type="button" disabled={remove.isPending} className={secondaryButtonClass}>
              {t('cancel')}
            </AlertDialogCancel>
            {/* Tombol biasa, bukan AlertDialogAction: dialog harus tetap terbuka kalau password salah */}
            <button
              type="submit"
              disabled={remove.isPending || !value.trim()}
              aria-busy={remove.isPending || undefined}
              className={confirmButtonClass}
            >
              {remove.isPending && <Loader2 className={spinnerClass} aria-hidden="true" />}
              {remove.isPending ? t('processing') : t('confirm')}
            </button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
