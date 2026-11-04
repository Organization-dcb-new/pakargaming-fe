export type MaintenanceSchedule = {
  id: string
  name: string
  is_maintenance: boolean
  start_time: string | null
  end_time: string | null
}

// Backend membatasi /maintenances 60 req/menit per IP, dan semua request FE keluar dari IP server
// yang sama. Karena itu hasilnya di-cache di server Next, bukan dipanggil langsung dari browser.
const REVALIDATE_SECONDS = 30
const TIMEOUT_MS = 3000

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
    next: { revalidate: REVALIDATE_SECONDS },
  })
  if (!res.ok) return []

  const body = await res.json()
  return Array.isArray(body?.data) ? body.data : []
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
 * Gagal/timeout dianggap tidak maintenance supaya situs tetap bisa diakses saat backend bermasalah.
 */
export async function getActiveMaintenance(): Promise<MaintenanceSchedule | null> {
  try {
    const schedules = await withTimeout(fetchSchedules(), TIMEOUT_MS, [])
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
