'use client'

import { CirclePause, Clock } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/cn'
import { formatResumeAt } from '@/features/transaction-stop/lib/formatResumeAt'

interface TransactionStopNoticeProps {
  /** Teks dari admin; null = teks bawaan */
  message: string | null
  resumeAt: string | null
  /** Untuk aria-describedby tombol yang dinonaktifkan karena stop ini */
  id?: string
  className?: string
  /** Versi ringkas (di modal konfirmasi): tanpa keterangan tambahan */
  compact?: boolean
}

/**
 * Pemberitahuan saat admin menghentikan transaksi baru sementara. Halaman tetap bisa dijelajahi dan
 * pembayaran yang sudah dibuat tetap diproses; hanya checkout baru yang ditahan (backend menolak 503).
 * Gaya mengikuti RegionNotice (kotak warning di atas grid checkout).
 */
export default function TransactionStopNotice({ message, resumeAt, id, className, compact = false }: TransactionStopNoticeProps) {
  const t = useTranslations('TransactionStop')
  const locale = useLocale()
  // Hanya dirender setelah status terbaca di browser, jadi jam "sekarang" tidak memicu hydration mismatch
  const resumeLabel = resumeAt ? formatResumeAt(resumeAt, locale) : ''

  return (
    <div
      id={id}
      role="status"
      className={cn(
        'flex gap-3 rounded-sm border border-warning/40 bg-warning/10',
        compact ? 'p-3' : 'p-4',
        className,
      )}
    >
      <CirclePause className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden />
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-semibold text-foreground">{t('title')}</p>
        <p className="whitespace-pre-line break-words text-sm text-muted-foreground">
          {message || t('defaultMessage')}
        </p>
        {resumeLabel && (
          <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Clock className="h-4 w-4 shrink-0 text-warning" aria-hidden />
            {t('resumeAt', { time: resumeLabel })}
          </p>
        )}
        {!compact && <p className="pt-1 text-xs text-muted-foreground">{t('browseHint')}</p>}
      </div>
    </div>
  )
}
