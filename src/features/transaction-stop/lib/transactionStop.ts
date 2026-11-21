import { getServerApiBaseUrl } from '@/config/runtimeEnv'
import type { TransactionStopStatus } from '@/features/transaction-stop/types/transactionStop'
import {
  effectiveTransactionStop,
  isResumeDue,
  normalizeTransactionStop,
  TRANSACTION_OPEN,
} from './normalizeTransactionStop'

// Sama seperti maintenance (src/features/maintenance/lib/maintenance.ts): backend membatasi
// /transaction-stop 60 req/menit per IP, dan semua request FE keluar dari IP server yang sama. Hasilnya
// di-cache di memori server Next (browser tidak memanggil backend), dan backend dipanggil paling sering
// sekali per REFRESH_MS — termasuk saat backend sedang error.
const REFRESH_MS = 30_000
/**
 * Umur cache minimum sebelum boleh diperbarui lebih cepat dari REFRESH_MS (checkout ditolak 503, atau
 * resume_at lewat). Membatasi tambahan panggilan ke backend: paling banyak sekali per 5 detik.
 */
const MIN_REFRESH_MS = 5000
/** Batas tunggu render/route saat cache perlu di-refresh */
const TIMEOUT_MS = 3000
/** Batas fetch ke backend; tanpa ini request yang menggantung memblokir refresh berikutnya */
const FETCH_TIMEOUT_MS = 10_000

async function fetchStatus(): Promise<TransactionStopStatus> {
  const baseUrl = getServerApiBaseUrl()
  if (!baseUrl) return TRANSACTION_OPEN

  const res = await fetch(`${baseUrl}/v1/transaction-stop`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const body = await res.json()
  // Balasan rusak → lempar, supaya data terakhir yang dipakai
  const status = normalizeTransactionStop(body?.data)
  if (!status) throw new Error('data is not a transaction stop status')
  return status
}

type TransactionStopStore = {
  cached: { status: TransactionStopStatus; fetchedAt: number } | null
  inflight: Promise<TransactionStopStatus> | null
  /** Checkout baru saja ditolak 503: status mungkin sudah berubah, jangan tunggu REFRESH_MS penuh */
  invalidated: boolean
}

// Disimpan di globalThis: route /api/transaction-stop dan proxy /api/proxy dibundel sebagai modul
// terpisah, jadi variabel modul biasa membuat dua cache yang bisa saling beda status.
const globalStore = globalThis as typeof globalThis & { __transactionStopStore?: TransactionStopStore }
const store = (globalStore.__transactionStopStore ??= { cached: null, inflight: null, invalidated: false })

function refreshStatus() {
  if (!store.inflight) {
    store.invalidated = false
    store.inflight = fetchStatus()
      .catch((error) => {
        console.error('[TransactionStop] gagal mengambil status:', error)
        // Pakai data terakhir: kalau backend mati di tengah stop, pemberitahuannya tetap tampil
        return store.cached?.status ?? TRANSACTION_OPEN
      })
      .then((status) => {
        store.cached = { status, fetchedAt: Date.now() }
        return status
      })
      .finally(() => {
        store.inflight = null
      })
  }
  return store.inflight
}

function isFresh(cached: NonNullable<TransactionStopStore['cached']>, now: number) {
  const age = now - cached.fetchedAt
  if (age >= REFRESH_MS) return false
  if (age < MIN_REFRESH_MS) return true
  if (store.invalidated) return false
  // resume_at lewat setelah data terakhir diambil: tanya ulang sekali, siapa tahu admin memperpanjangnya
  // (setelah itu fetchedAt > resume_at, jadi tidak berulang walau jam backend sedikit beda)
  if (isResumeDue(cached.status, now) && Date.parse(cached.status.resume_at as string) > cached.fetchedAt) {
    return false
  }
  return true
}

/**
 * Data paling lama REFRESH_MS. Saat perlu refresh, request menunggu hasilnya maksimal TIMEOUT_MS;
 * lewat dari itu pakai data terakhir (atau terbuka kalau belum pernah dapat data).
 */
function getStatus() {
  const { cached } = store
  if (cached && isFresh(cached, Date.now())) return Promise.resolve(cached.status)
  return withTimeout(refreshStatus(), TIMEOUT_MS, cached?.status ?? TRANSACTION_OPEN)
}

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout>
  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

/**
 * Status stop transaksi yang berlaku sekarang. resume_at dicek ulang dengan jam server Next di setiap
 * panggilan, jadi stop terangkat tepat waktu walau cache belum diperbarui.
 * Belum pernah dapat data + backend gagal/lambat (> TIMEOUT_MS) → dianggap terbuka (fail open):
 * backend tetap menolak checkout dengan 503 selama stop, ini hanya lapisan tampilan.
 */
export async function getTransactionStop(): Promise<TransactionStopStatus> {
  try {
    return effectiveTransactionStop(await getStatus(), Date.now())
  } catch (error) {
    console.error('[TransactionStop] gagal mengambil status:', error)
    return TRANSACTION_OPEN
  }
}

/**
 * Dipanggil proxy saat POST v1/transactions dibalas 503: stop transaksi mungkin baru dinyalakan, jadi
 * pembacaan berikutnya mengambil ulang dari backend (paling cepat MIN_REFRESH_MS sejak data terakhir).
 * Tanpa ini, refresh() di browser setelah 503 bisa mendapat cache lama hingga 30 detik.
 */
export function invalidateTransactionStop() {
  store.invalidated = true
}
