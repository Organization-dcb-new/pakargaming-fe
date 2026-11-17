import { getServerApiBaseUrl } from '@/config/runtimeEnv'
import type { PublicAnnouncement } from '@/features/announcements/types/announcement'
import { isAnnouncementLive, normalizeAnnouncements } from './normalizeAnnouncements'

// Sama seperti maintenance (src/features/maintenance/lib/maintenance.ts): backend membatasi
// /announcements per pemanggil, dan semua request FE keluar dari server yang sama. Hasilnya di-cache di
// memori server Next (browser tidak memanggil backend), dan backend dipanggil paling sering sekali per
// REFRESH_MS — termasuk saat backend sedang error.
const REFRESH_MS = 60_000
/** Batas tunggu render halaman saat cache perlu di-refresh */
const TIMEOUT_MS = 3000
/** Batas fetch ke backend; tanpa ini request yang menggantung memblokir refresh berikutnya */
const FETCH_TIMEOUT_MS = 10_000

async function fetchAnnouncements(): Promise<PublicAnnouncement[]> {
  const baseUrl = getServerApiBaseUrl()
  if (!baseUrl) return []

  const res = await fetch(`${baseUrl}/v1/announcements`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const body = await res.json()
  // `data: null` = daftar kosong (slice nil di Go); bentuk lain = balasan rusak → pakai data terakhir
  if (body?.data == null) return []
  if (!Array.isArray(body.data)) throw new Error('data is not an array')
  return normalizeAnnouncements(body.data)
}

type AnnouncementStore = {
  cached: { announcements: PublicAnnouncement[]; fetchedAt: number } | null
  inflight: Promise<PublicAnnouncement[]> | null
}

// Disimpan di globalThis: layout dan route /api/announcements dibundel sebagai modul terpisah,
// jadi variabel modul biasa membuat dua cache yang bisa saling beda isi.
const globalStore = globalThis as typeof globalThis & { __announcementStore?: AnnouncementStore }
const store = (globalStore.__announcementStore ??= { cached: null, inflight: null })

function refreshAnnouncements() {
  store.inflight ??= fetchAnnouncements()
    .catch((error) => {
      console.error('[Announcements] gagal mengambil pengumuman:', error)
      // Pakai data terakhir; belum pernah dapat data → kosong
      return store.cached?.announcements ?? []
    })
    .then((announcements) => {
      store.cached = { announcements, fetchedAt: Date.now() }
      return announcements
    })
    .finally(() => {
      store.inflight = null
    })
  return store.inflight
}

/**
 * Data paling lama REFRESH_MS. Saat perlu refresh, request menunggu hasilnya maksimal TIMEOUT_MS;
 * lewat dari itu pakai data terakhir (atau kosong kalau belum pernah dapat data).
 */
function getAnnouncements() {
  const { cached } = store
  if (cached && Date.now() - cached.fetchedAt < REFRESH_MS) return Promise.resolve(cached.announcements)
  return withTimeout(refreshAnnouncements(), TIMEOUT_MS, cached?.announcements ?? [])
}

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout>
  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

/**
 * Pengumuman yang tayang sekarang (terbaru dulu, urutan backend). Disaring ulang dengan jam server Next
 * di setiap panggilan, jadi pengumuman yang berakhir/mulai di tengah periode cache tetap tepat waktu.
 * Gagal/lambat dan belum pernah dapat data → kosong, supaya halaman tetap tampil.
 */
export async function getActiveAnnouncements(): Promise<PublicAnnouncement[]> {
  try {
    const announcements = await getAnnouncements()
    const now = Date.now()
    return announcements.filter((announcement) => isAnnouncementLive(announcement, now))
  } catch (error) {
    console.error('[Announcements] gagal mengambil pengumuman:', error)
    return []
  }
}
