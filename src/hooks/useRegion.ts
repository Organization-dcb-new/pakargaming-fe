'use client'

import { useSyncExternalStore } from 'react'
import { useGetRegions } from '@/api/useGetRegions'
import { HOME_REGION, readRegionChoice, subscribeRegionChoice, writeRegionChoice } from '@/lib/region'

const noSubscribe = () => () => {}

/**
 * Region akun game pilihan pembeli. Etalase, pencarian, dan katalog A–Z hanya menampilkan game region ini.
 *
 * - `choice`: isi cookie apa adanya — dipakai halaman game untuk membandingkan dengan region game.
 * - `region`: `choice` bila region itu masih punya game tampil, selain itu region toko — dipakai katalog.
 * - `ready`: false selama hydration (server tidak tahu cookie-nya), supaya efek tidak salah baca region.
 */
export function useRegion() {
  const choice = useSyncExternalStore(subscribeRegionChoice, readRegionChoice, () => HOME_REGION)
  const ready = useSyncExternalStore(noSubscribe, () => true, () => false)
  const { data } = useGetRegions()
  const regions = data?.data ?? []
  // Daftar belum ada (memuat/gagal) → percaya pilihan pembeli; backend tetap memvalidasi.
  const listed = regions.length === 0 || regions.some((r) => r.code === choice)

  return {
    region: listed ? choice : HOME_REGION,
    choice,
    regions,
    setRegion: writeRegionChoice,
    ready,
  }
}
