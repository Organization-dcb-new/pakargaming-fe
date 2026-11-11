'use client'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Price } from '@/types/game'
import { PaymentMethod } from '@/types/paymentMethod'
import { calculateTotalPrice } from './PaymentMethodList'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ConfirmModalProps {
  loading?: boolean
  onConfirm: () => void
  Product: Price
  Payment: PaymentMethod
  setOpen: (value: boolean) => void
  open: boolean
  /** Nickname hasil cek ID — paling penting dicek ulang supaya tidak salah kirim */
  accountName?: string | null
  /** Isian akun (User ID, Zone, Server, …) dengan label dari data game */
  accountFields?: { label: string; value: string }[]
  email?: string | null
  /** Hanya untuk metode yang butuh nomor HP (OVO, Smartfren) */
  phone?: string
}

/** Modal konfirmasi pesanan — Dialog ui/ (focus trap, Esc, aria-modal; rules §7). */
export default function ConfirmModal({
  loading = false,
  onConfirm,
  setOpen,
  open,
  Product,
  Payment,
  accountName,
  accountFields = [],
  email,
  phone,
}: ConfirmModalProps) {
  const t = useTranslations('GameCheckout')
  const finalPrice = calculateTotalPrice(Payment, Product)

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        // Jangan bisa ditutup saat order sedang diproses
        if (!loading) setOpen(value)
      }}
    >
      <DialogContent className="chamfer gap-5 rounded-none border-0 bg-card p-6 [--chamfer:20px] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-brand sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            {t('confirmTitle')}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t('confirmSubtitle')}
          </DialogDescription>
        </DialogHeader>

        {/* Tujuan top-up dulu: kesalahan di sini tidak bisa dibatalkan setelah dibayar */}
        <dl className="flex flex-col gap-2.5 rounded-sm border border-primary/30 bg-primary/5 p-4 text-sm">
          {accountName && (
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{t('confirmAccount')}</dt>
              <dd className="truncate text-right font-display text-base font-bold text-foreground">{accountName}</dd>
            </div>
          )}
          {accountFields.map((field) => (
            <div key={field.label} className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{field.label}</dt>
              <dd className="break-all text-right font-semibold text-foreground">{field.value}</dd>
            </div>
          ))}
          {email && (
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{t('confirmEmail')}</dt>
              <dd className="break-all text-right font-semibold text-foreground">{email}</dd>
            </div>
          )}
          {phone && (
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{t('confirmPhone')}</dt>
              <dd className="text-right font-semibold text-foreground">{phone}</dd>
            </div>
          )}
        </dl>

        <dl className="flex flex-col gap-2.5 rounded-sm bg-muted p-4 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{t('confirmProduct')}</dt>
            <dd className="text-right font-semibold text-foreground">{Product?.name || '-'}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{t('confirmPayment')}</dt>
            <dd className="text-right font-semibold text-foreground">{Payment?.name || '-'}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 border-t border-border pt-2.5">
            <dt className="font-semibold text-foreground">{t('confirmTotal')}</dt>
            <dd className="font-display text-xl font-bold text-primary">Rp {finalPrice}</dd>
          </div>
        </dl>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="h-12 flex-1 cursor-pointer rounded-sm border border-border text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
          >
            {t('confirmEdit')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="chamfer flex h-12 flex-[2] cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary text-sm font-bold text-primary-foreground transition-colors duration-200 hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden />}
            {loading ? t('confirmProcessing') : t('confirmContinue')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
