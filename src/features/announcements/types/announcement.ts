/** Warna/nada pengumuman: info (netral), warning (gangguan/masalah), promo (penawaran). */
export type AnnouncementLevel = 'info' | 'warning' | 'promo'

/** bar = strip tipis di atas navbar; popup = dialog, satu per kunjungan. */
export type AnnouncementDisplay = 'bar' | 'popup'

/** Bentuk `GET /v1/announcements` (publik) dari topup-be, sudah dinormalisasi (lib/normalizeAnnouncements.ts). */
export type PublicAnnouncement = {
  id: string
  title: string
  /** Teks polos, boleh berisi baris baru. Jangan pernah dirender sebagai HTML. */
  body: string
  level: AnnouncementLevel
  display: AnnouncementDisplay
  /** '' | path storefront ("/games/mlbb") | URL http(s) */
  link_url: string
  /** Kosong → label default dari i18n */
  link_label: string
  /** '' | URL http(s); hanya dipakai popup */
  image_url: string
  starts_at: string | null
  ends_at: string | null
  /** Berubah saat admin mengedit — pengunjung yang sudah menutup versi lama melihat versi baru */
  updated_at: string
}
