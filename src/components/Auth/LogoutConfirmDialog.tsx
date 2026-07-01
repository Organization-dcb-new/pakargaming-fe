'use client'

import { LogOut } from 'lucide-react'
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
} from '../ui/alert-dialog'
import { buttonVariants } from '../ui/button'
import { cn } from '../ui/utils'
import { logout } from '../../hooks/useAuth'

interface LogoutConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function LogoutConfirmDialog({ open, onOpenChange }: LogoutConfirmDialogProps) {
  const t = useTranslations('LogoutDialog')

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 sm:mx-0">
            <LogOut className="h-6 w-6 text-destructive" aria-hidden />
          </div>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={logout}
            className={cn(buttonVariants({ variant: 'destructive' }))}
          >
            {t('confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
