import type { TransactionStopStatus } from '@/features/transaction-stop/types/transactionStop'

// Helper murni (tanpa React, tanpa env server): dipakai cache server (lib/transactionStop.ts) dan
// useTransactionStop (memvalidasi balasan /api/transaction-stop).

/** Checkout terbuka — juga dipakai saat status belum pernah didapat (fail open: backend tetap menolak 503). */
export const TRANSACTION_OPEN: TransactionStopStatus = Object.freeze({
  is_stopped: false,
  message: null,
  resume_at: null,
})

const toMs = (iso: string | null) => (iso ? Date.parse(iso) : Number.NaN)

/** Status dari backend/route → TransactionStopStatus, atau null kalau bentuknya tidak bisa dibaca. */
export function normalizeTransactionStop(raw: unknown): TransactionStopStatus | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  if (typeof r.is_stopped !== 'boolean') return null
  if (!r.is_stopped) return TRANSACTION_OPEN

  const message = typeof r.message === 'string' ? r.message.trim() : ''
  // Waktu yang tidak bisa dibaca = tanpa perkiraan (tetap dihentikan; lebih aman daripada dibuka)
  const resumeAt = typeof r.resume_at === 'string' && !Number.isNaN(Date.parse(r.resume_at)) ? r.resume_at : null
  return { is_stopped: true, message: message || null, resume_at: resumeAt }
}

/** Jam resume_at sudah lewat pada `now` (stop tanpa resume_at tidak pernah lewat). */
export function isResumeDue(status: TransactionStopStatus, now: number): boolean {
  const resume = toMs(status.resume_at)
  return status.is_stopped && !Number.isNaN(resume) && resume <= now
}

/**
 * Status yang berlaku pada `now`: stop yang resume_at-nya sudah lewat dianggap selesai, sama dengan
 * backend (TransactionStopActive: resume_at harus setelah now). Dipakai saat menyajikan data cache,
 * supaya stop tetap terangkat tepat waktu walau cache-nya belum diperbarui.
 */
export function effectiveTransactionStop(status: TransactionStopStatus, now: number): TransactionStopStatus {
  return status.is_stopped && !isResumeDue(status, now) ? status : TRANSACTION_OPEN
}
