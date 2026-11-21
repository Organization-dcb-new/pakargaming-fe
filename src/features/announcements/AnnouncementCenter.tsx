'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { PublicAnnouncement } from '@/features/announcements/types/announcement'
import { dismissKey, normalizeAnnouncements } from '@/features/announcements/lib/normalizeAnnouncements'
import { useDismissedAnnouncements } from '@/features/announcements/hooks/useDismissedAnnouncements'
import AnnouncementBar from '@/features/announcements/components/AnnouncementBar'
import AnnouncementPopup from '@/features/announcements/components/AnnouncementPopup'

/** Datanya dari cache server (/api/announcements), jadi poll ini tidak membebani backend. */
const POLL_MS = 5 * 60_000

/**
 * Pengumuman dari admin: `bar` ditumpuk di atas navbar (terbaru di atas), `popup` paling banyak satu per
 * pemuatan halaman (yang terbaru dan belum ditutup; berikutnya tampil di pemuatan halaman selanjutnya).
 * Dirender layout di atas <Navbar />, hanya saat halaman maintenance tidak tampil.
 *
 * Daftar awal dari server (layout); layout tidak dirender ulang saat navigasi client, jadi diperbarui
 * berkala selama tab terlihat dan saat tab kembali terlihat — gaya yang sama dengan MaintenanceWatcher.
 */
export default function AnnouncementCenter({ initial }: { initial: PublicAnnouncement[] }) {
  const t = useTranslations('Announcements')
  const [announcements, setAnnouncements] = useState(initial)

  // router.refresh() (mis. dari MaintenanceWatcher) merender ulang layout → pakai data server terbaru
  useEffect(() => {
    setAnnouncements(initial)
  }, [initial])

  useEffect(() => {
    let cancelled = false

    const check = async () => {
      if (document.hidden) return
      try {
        const res = await fetch('/api/announcements', { cache: 'no-store' })
        if (!res.ok) return
        const data: { announcements?: unknown } = await res.json()
        if (!cancelled && Array.isArray(data?.announcements)) {
          setAnnouncements(normalizeAnnouncements(data.announcements))
        }
      } catch {
        // Gagal cek = biarkan tampilan sekarang; dicoba lagi di interval berikutnya
      }
    }

    const onVisibilityChange = () => {
      if (!document.hidden) check()
    }

    const id = setInterval(check, POLL_MS)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      cancelled = true
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  const { ready, dismissed, dismiss } = useDismissedAnnouncements(announcements.map(dismissKey))

  // Popup yang dipilih untuk pemuatan halaman ini. Tetap tersimpan setelah ditutup: animasi tutup tetap
  // jalan, dan popup lain tidak langsung menyusul.
  const [popup, setPopup] = useState<PublicAnnouncement | null>(null)
  const [popupOpen, setPopupOpen] = useState(false)

  useEffect(() => {
    if (!ready || popup) return
    const next = announcements.find((a) => a.display === 'popup' && !dismissed.has(dismissKey(a)))
    if (!next) return
    setPopup(next)
    setPopupOpen(true)
  }, [ready, popup, announcements, dismissed])

  // Versi terbaru dari popup yang sedang tampil; hilang dari daftar (berakhir/dihapus) → ikut tertutup
  const livePopup = popup ? announcements.find((a) => a.id === popup.id) : undefined
  const shownPopup = livePopup ?? popup

  const closePopup = () => {
    if (shownPopup) dismiss(dismissKey(shownPopup))
    setPopupOpen(false)
  }

  // Sebelum storage terbaca (render pertama = HTML server) belum ada yang ditampilkan
  const bars = ready
    ? announcements.filter((a) => a.display === 'bar' && !dismissed.has(dismissKey(a)))
    : []

  return (
    <>
      {bars.length > 0 && (
        <section aria-label={t('regionLabel')}>
          {bars.map((announcement) => {
            const key = dismissKey(announcement)
            return <AnnouncementBar key={key} announcement={announcement} onDismiss={() => dismiss(key)} />
          })}
        </section>
      )}
      {shownPopup && (
        <AnnouncementPopup announcement={shownPopup} open={popupOpen && Boolean(livePopup)} onClose={closePopup} />
      )}
    </>
  )
}
