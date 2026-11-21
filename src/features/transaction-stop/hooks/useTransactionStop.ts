'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { TransactionStopStatus } from '@/features/transaction-stop/types/transactionStop'
import { normalizeTransactionStop, TRANSACTION_OPEN } from '@/features/transaction-stop/lib/normalizeTransactionStop'

/** Datanya dari cache server (/api/transaction-stop), jadi poll ini tidak membebani backend. */
const POLL_MS = 60_000
/** Cek ulang sedikit setelah resume_at, supaya jam server Next pasti sudah melewatinya. */
const RESUME_GRACE_MS = 1000
/** Batas setTimeout (~24,8 hari); lebih jauh dari itu cukup ditangani poll. */
const MAX_TIMER_MS = 2_147_483_647

/**
 * Status stop transaksi untuk halaman checkout. Dibaca saat mount, lalu tiap POLL_MS selama tab terlihat
 * dan saat tab kembali terlihat — gaya yang sama dengan MaintenanceWatcher. Belum terbaca / gagal dibaca →
 * dianggap terbuka (backend tetap menolak checkout dengan 503 selama stop).
 *
 * `refresh()` dipanggil setelah checkout ditolak 503, supaya pemberitahuannya langsung muncul.
 */
export function useTransactionStop() {
  const [status, setStatus] = useState<TransactionStopStatus>(TRANSACTION_OPEN)
  const mountedRef = useRef(false)
  /** Nomor request terakhir & yang hasilnya sudah dipakai: balasan lama yang datang belakangan dibuang */
  const requestSeq = useRef(0)
  const appliedSeq = useRef(0)

  const refresh = useCallback(async () => {
    const seq = ++requestSeq.current
    try {
      const res = await fetch('/api/transaction-stop', { cache: 'no-store' })
      if (!res.ok) return
      const next = normalizeTransactionStop(await res.json())
      if (!next || !mountedRef.current || seq < appliedSeq.current) return
      appliedSeq.current = seq
      setStatus(next)
    } catch {
      // Gagal cek = biarkan tampilan sekarang; dicoba lagi di interval berikutnya
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    void refresh()

    const check = () => {
      if (!document.hidden) void refresh()
    }

    const id = setInterval(check, POLL_MS)
    document.addEventListener('visibilitychange', check)
    return () => {
      mountedRef.current = false
      clearInterval(id)
      document.removeEventListener('visibilitychange', check)
    }
  }, [refresh])

  // Stop dengan perkiraan buka: cek ulang tepat setelah resume_at supaya tombol beli langsung aktif lagi.
  // Server yang memutuskan (jam pembeli bisa beda); kalau masih dihentikan, poll yang melanjutkan.
  useEffect(() => {
    if (!status.is_stopped || !status.resume_at) return
    const delay = Date.parse(status.resume_at) - Date.now() + RESUME_GRACE_MS
    if (!(delay > 0) || delay > MAX_TIMER_MS) return
    const id = setTimeout(() => void refresh(), delay)
    return () => clearTimeout(id)
  }, [status, refresh])

  return {
    isStopped: status.is_stopped,
    message: status.message,
    resumeAt: status.resume_at,
    refresh,
  }
}
