'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const POLL_MS = 60_000

/**
 * Layout tidak dirender ulang saat navigasi di sisi client, jadi status maintenance dicek berkala.
 * Kalau berubah, router.refresh() merender ulang layout supaya halaman maintenance muncul/hilang.
 */
export default function MaintenanceWatcher({ active }: { active: boolean }) {
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    const check = async () => {
      if (document.hidden) return
      try {
        const res = await fetch('/api/maintenance', { cache: 'no-store' })
        if (!res.ok) return
        const data: { active: boolean } = await res.json()
        if (!cancelled && data.active !== active) router.refresh()
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
  }, [active, router])

  return null
}
