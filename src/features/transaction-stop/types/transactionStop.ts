/**
 * Status stop transaksi, bentuk yang sama dengan `data` GET /v1/transaction-stop dan balasan
 * /api/transaction-stop. Saat tidak dihentikan, `message` dan `resume_at` null.
 */
export type TransactionStopStatus = {
  /** Checkout baru sedang dihentikan sekarang */
  is_stopped: boolean
  /** Teks dari admin untuk pembeli; null = pakai teks bawaan */
  message: string | null
  /** Perkiraan dibuka lagi (RFC3339 dengan offset); null = belum ada perkiraan */
  resume_at: string | null
}
