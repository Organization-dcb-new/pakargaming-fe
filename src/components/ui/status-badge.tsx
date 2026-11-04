'use client'

import { CheckCircle2, Clock, XCircle, type LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from './utils'

type StatusKey = 'paid' | 'pending' | 'failed'

/** Backend memakai beberapa ejaan: detail-trx → PAID/PENDING/FAILED, dashboard → Success/Pending/Failed. */
export function normalizeTransactionStatus(status?: string | null): StatusKey {
  const s = (status || '').toUpperCase()
  if (s === 'PAID' || s === 'SUCCESS') return 'paid'
  if (s === 'FAILED' || s === 'EXPIRED' || s === 'CANCELLED' || s === 'CANCELED') return 'failed'
  return 'pending'
}

const STATUS_STYLE: Record<StatusKey, { className: string; Icon: LucideIcon }> = {
  paid: { className: 'bg-success text-success-foreground', Icon: CheckCircle2 },
  pending: { className: 'bg-pending text-pending-foreground', Icon: Clock },
  failed: { className: 'bg-destructive text-destructive-foreground', Icon: XCircle },
}

/** Badge status transaksi (rules §5): warna dari token status + ikon + label, bukan warna saja. */
export function StatusBadge({ status, className }: { status?: string | null; className?: string }) {
  const t = useTranslations('Common')
  const key = normalizeTransactionStatus(status)
  const { className: tone, Icon } = STATUS_STYLE[key]
  const label = { paid: t('statusPaid'), pending: t('statusPending'), failed: t('statusFailed') }[key]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold',
        tone,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {label}
    </span>
  )
}
