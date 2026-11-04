export type MaintenanceSchedule = {
  id: string
  name: string
  is_maintenance: boolean
  start_time: string | null
  end_time: string | null
}

// Backend membatasi /maintenances 60 req/menit per IP, dan semua request FE keluar dari IP server
// yang sama. Karena itu hasilnya di-cache di memori server Next (bukan dipanggil dari browser), dan
// backend dipanggil paling sering sekali per REFRESH_MS — termasuk saat backend sedang error.
const REFRESH_MS = 30_000
/** Batas tunggu render halaman saat belum ada data sama sekali */
const TIMEOUT_MS = 3000
/** Batas fetch ke backend; tanpa ini request yang menggantung memblokir refresh berikutnya */
const FETCH_TIMEOUT_MS = 10_000

const toMs = (iso: string | null) => (iso ? Date.parse(iso) : Number.NaN)

/** Sama dengan status `live` di topup-admin-fe (components/Maintenance/maintenance-status.ts). */
export function isMaintenanceLive(m: MaintenanceSchedule, now: number) {
  if (!m.is_maintenance) return false
  const start = toMs(m.start_time)
  const end = toMs(m.end_time)
  if (!Number.isNaN(end) && end < now) return false
  if (!Number.isNaN(start) && start > now) return false
  return true
}

async function fetchSchedules(): Promise<MaintenanceSchedule[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  if (!baseUrl) return []

  const res = await fetch(`${baseUrl}/v1/maintenances`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const body = await res.json()
  return Array.isArray(body?.data) ? body.data : []
}

type MaintenanceStore = {
  cached: { schedules: MaintenanceSchedule[]; fetchedAt: number } | null
  inflight: Promise<MaintenanceSchedule[]> | null
}

// Disimpan di globalThis: layout dan route /api/maintenance dibundel sebagai modul terpisah,
// jadi variabel modul biasa membuat dua cache yang bisa saling beda status.
const globalStore = globalThis as typeof globalThis & { __maintenanceStore?: MaintenanceStore }
const store = (globalStore.__maintenanceStore ??= { cached: null, inflight: null })

function refreshSchedules() {
  store.inflight ??= fetchSchedules()
    .catch((error) => {
      console.error('[Maintenance] gagal mengambil jadwal:', error)
      // Pakai data terakhir: kalau backend mati di tengah maintenance, halaman maintenance tetap tampil
      return store.cached?.schedules ?? []
    })
    .then((schedules) => {
      store.cached = { schedules, fetchedAt: Date.now() }
      return schedules
    })
    .finally(() => {
      store.inflight = null
    })
  return store.inflight
}

/** Stale-while-revalidate: data lama langsung dipakai sambil diperbarui di background. */
function getSchedules() {
  const { cached } = store
  if (cached && Date.now() - cached.fetchedAt < REFRESH_MS) return Promise.resolve(cached.schedules)
  const refreshing = refreshSchedules()
  if (cached) return Promise.resolve(cached.schedules)
  return withTimeout(refreshing, TIMEOUT_MS, [])
}

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout>
  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

const endOf = (m: MaintenanceSchedule) => {
  const end = toMs(m.end_time)
  return Number.isNaN(end) ? Infinity : end
}

/**
 * Jadwal maintenance yang sedang berjalan, atau null.
 * Belum pernah dapat data + backend gagal/lambat (> TIMEOUT_MS) → dianggap tidak maintenance,
 * supaya situs tetap bisa diakses.
 */
export async function getActiveMaintenance(): Promise<MaintenanceSchedule | null> {
  try {
    const schedules = await getSchedules()
    const now = Date.now()
    const live = schedules.filter((m) => isMaintenanceLive(m, now))
    if (live.length === 0) return null

    // Kalau ada beberapa yang aktif, tampilkan yang selesainya paling akhir
    return live.reduce((a, b) => (endOf(b) > endOf(a) ? b : a))
  } catch (error) {
    console.error('[Maintenance] gagal mengambil jadwal:', error)
    return null
  }
}
