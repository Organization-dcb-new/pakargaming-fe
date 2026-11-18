'use client'

import { CheckCircle2, Clock, XCircle, type LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/cn'

type StatusKey = 'paid' | 'pending' | 'failed'

/** Backend memakai beberapa ejaan: detail-trx → PAID/PENDING/FAILED, dashboard → Success/Pending/Failed. */
export function normalizeTransactionStatus(status?: string | null): StatusKey {
  const s = (status || '').toUpperCase()
  if (s === 'PAID' || s === 'SUCCESS') return 'paid'
  // REFUNDED: dana sudah kembali — bukan pembayaran yang masih ditunggu (dulu jatuh ke 'pending'
  // sehingga halaman bayar muncul lagi).
  if (s === 'FAILED' || s === 'EXPIRED' || s === 'CANCELLED' || s === 'CANCELED' || s === 'REFUNDED') return 'failed'
  return 'pending'
}

/**
 * Satu sumber warna per status — berhasil / menunggu / gagal:
 * `badge` (StatusBadge), `accent` (bilah status di kartu transaksi), `border` (garis tepi HudPanel).
 */
const STATUS_STYLE: Record<StatusKey, { badge: string; accent: string; border: string; Icon: LucideIcon }> = {
  paid: { badge: 'bg-success text-success-foreground', accent: 'bg-success', border: 'bg-success/60', Icon: CheckCircle2 },
  pending: { badge: 'bg-pending text-pending-foreground', accent: 'bg-pending', border: 'bg-pending/60', Icon: Clock },
  failed: {
    badge: 'bg-destructive text-destructive-foreground',
    accent: 'bg-destructive',
    border: 'bg-destructive/60',
    Icon: XCircle,
  },
}

export const statusAccentClass = (status?: string | null) => STATUS_STYLE[normalizeTransactionStatus(status)].accent

export const statusBorderClass = (status?: string | null) => STATUS_STYLE[normalizeTransactionStatus(status)].border

/** Badge status transaksi (rules §5): warna dari token status + ikon + label, bukan warna saja. */
export function StatusBadge({
  status,
  label: labelOverride,
  className,
}: {
  status?: string | null
  /** Teks pengganti label bawaan (mis. "Diproses" untuk pesanan dibayar yang belum terkirim). */
  label?: string
  className?: string
}) {
  const t = useTranslations('Common')
  const key = normalizeTransactionStatus(status)
  const { badge: tone, Icon } = STATUS_STYLE[key]
  const label = labelOverride || { paid: t('statusPaid'), pending: t('statusPending'), failed: t('statusFailed') }[key]

  return (
    <span
      className={cn(
        // Tag jajar genjang seperti chip & badge show; isi dimiringkan balik supaya tegak
        'inline-flex -skew-x-12 items-center rounded-sm px-2.5 py-0.5 text-xs font-bold',
        tone,
        className,
      )}
    >
      <span className="inline-flex skew-x-12 items-center gap-1">
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {label}
      </span>
    </span>
  )
}
