'use client'

import { useTranslations } from 'next-intl'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/cn'
import { logout } from '@/lib/sessionClient'
import { primaryButtonClass, secondaryButtonClass } from '@/features/auth/styles'

// Tombol aksi = bentuk CTA chamfer yang sama, warna merah karena aksinya destruktif
const confirmButtonClass = cn(
  primaryButtonClass,
  'bg-destructive text-destructive-foreground hover:bg-destructive/85',
)

interface LogoutConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Konfirmasi keluar — gaya panel HUD seperti dialog Masuk/Daftar, aksen merah (aksi destruktif). */
export default function LogoutConfirmDialog({ open, onOpenChange }: LogoutConfirmDialogProps) {
  const t = useTranslations('LogoutDialog')

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="chamfer gap-6 rounded-none border-0 bg-card p-6 shadow-none [--chamfer:20px] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-destructive sm:max-w-md">
        <AlertDialogHeader className="gap-2 text-left">
          <AlertDialogTitle className="flex items-center gap-2.5 font-display text-xl font-bold text-foreground before:h-5 before:w-1.5 before:shrink-0 before:-skew-x-12 before:bg-destructive">
            {t('title')}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
            {t('description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2.5 sm:grid sm:grid-cols-2">
          <AlertDialogCancel className={secondaryButtonClass}>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={logout} className={confirmButtonClass}>
            {t('confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
