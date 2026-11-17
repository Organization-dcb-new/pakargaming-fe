import type {
  AnnouncementDisplay,
  AnnouncementLevel,
  PublicAnnouncement,
} from '@/features/announcements/types/announcement'

// Helper murni (tanpa React, tanpa env server): dipakai cache server (lib/announcements.ts) dan
// AnnouncementCenter (memvalidasi balasan /api/announcements).

const LEVELS: readonly AnnouncementLevel[] = ['info', 'warning', 'promo']
const DISPLAYS: readonly AnnouncementDisplay[] = ['bar', 'popup']

const text = (value: unknown) => (typeof value === 'string' ? value : '')

/** Karakter kontrol: browser membuang tab/baris baru di URL, jadi "/\t/evil.com" bisa menjadi "//evil.com". */
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/

/** URL http(s) dengan host; selain itu ''. */
export function safeHttpUrl(value: string): string {
  const trimmed = value.trim()
  if (!trimmed || CONTROL_CHARS.test(trimmed)) return ''
  try {
    const url = new URL(trimmed)
    return (url.protocol === 'https:' || url.protocol === 'http:') && url.hostname ? url.href : ''
  } catch {
    return ''
  }
}

/**
 * Path storefront ("/games/mlbb") atau URL http(s); selain itu ''. "//host" dan "/\host" ditolak
 * karena browser membukanya sebagai host lain; `javascript:` dsb. ditolak karena bukan http(s).
 */
export function safeLinkUrl(value: string): string {
  const trimmed = value.trim()
  if (!trimmed.startsWith('/')) return safeHttpUrl(trimmed)
  if (CONTROL_CHARS.test(trimmed) || trimmed[1] === '/' || trimmed[1] === '\\') return ''
  return trimmed
}

/** null/'' → null; string tanggal valid → apa adanya; selain itu undefined (jadwal tidak bisa dibaca). */
function time(value: unknown): string | null | undefined {
  if (value === null || value === undefined || value === '') return null
  return typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? value : undefined
}

/** Satu item dari backend → PublicAnnouncement, atau null kalau tidak bisa ditampilkan dengan aman. */
export function normalizeAnnouncement(raw: unknown): PublicAnnouncement | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>

  const id = text(r.id).trim()
  const title = text(r.title).trim()
  // Tampilan yang tidak dikenal (versi backend lebih baru) dilewati, bukan ditebak
  const display = DISPLAYS.find((d) => d === r.display)
  const startsAt = time(r.starts_at)
  const endsAt = time(r.ends_at)
  if (!id || !title || !display || startsAt === undefined || endsAt === undefined) return null

  return {
    id,
    title,
    body: text(r.body).trim(),
    level: LEVELS.find((l) => l === r.level) ?? 'info',
    display,
    link_url: safeLinkUrl(text(r.link_url)),
    link_label: text(r.link_label).trim(),
    image_url: safeHttpUrl(text(r.image_url)),
    starts_at: startsAt,
    ends_at: endsAt,
    updated_at: text(r.updated_at),
  }
}

/** Array dari backend → daftar valid (urutan backend = terbaru dulu dipertahankan, id ganda dibuang). */
export function normalizeAnnouncements(raw: unknown): PublicAnnouncement[] {
  if (!Array.isArray(raw)) return []
  const seen = new Set<string>()
  const list: PublicAnnouncement[] = []
  for (const item of raw) {
    const announcement = normalizeAnnouncement(item)
    if (!announcement || seen.has(announcement.id)) continue
    seen.add(announcement.id)
    list.push(announcement)
  }
  return list
}

/** Sedang tayang pada `now`: sudah mulai (atau tanpa mulai) dan belum berakhir (atau tanpa akhir). */
export function isAnnouncementLive(announcement: PublicAnnouncement, now: number): boolean {
  if (announcement.starts_at && Date.parse(announcement.starts_at) > now) return false
  if (announcement.ends_at && Date.parse(announcement.ends_at) <= now) return false
  return true
}

/** Kunci "sudah ditutup" per versi: diedit admin (updated_at berubah) → tampil lagi. */
export const dismissKey = (announcement: Pick<PublicAnnouncement, 'id' | 'updated_at'>) =>
  `${announcement.id}:${announcement.updated_at}`
