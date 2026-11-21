/**
 * Region akun game yang dipilih pembeli di navbar (id, my, …). Disimpan di cookie supaya bertahan antar
 * kunjungan dan bisa dibaca server kelak. Modul ini tanpa React: hook-nya ada di `hooks/useRegion.ts`.
 */

/** Region bawaan toko (Indonesia); dipakai sebelum pembeli memilih. */
export const HOME_REGION = 'id'

const REGION_COOKIE = 'pg_region'
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365
/** Kode negara dua huruf; isi cookie lain (rusak / diubah tangan) diabaikan. */
const REGION_CODE = /^[a-z]{2}$/

const listeners = new Set<() => void>()

export function readRegionChoice(): string {
  if (typeof document === 'undefined') return HOME_REGION
  const raw = document.cookie
    .split('; ')
    .find((part) => part.startsWith(`${REGION_COOKIE}=`))
    ?.slice(REGION_COOKIE.length + 1)
  return raw && REGION_CODE.test(raw) ? raw : HOME_REGION
}

export function writeRegionChoice(code: string) {
  const region = code.toLowerCase()
  if (!REGION_CODE.test(region) || region === readRegionChoice()) return
  document.cookie = `${REGION_COOKIE}=${region}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`
  listeners.forEach((notify) => notify())
}

export function subscribeRegionChoice(notify: () => void) {
  listeners.add(notify)
  return () => {
    listeners.delete(notify)
  }
}
