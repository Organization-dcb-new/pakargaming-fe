import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { CSRF_HEADER, CSRF_HEADER_VALUE, LEGACY_TOKEN_COOKIE, USER_COOKIE } from '../lib/session'
import type { AuthUser } from '../types/Auth'

export type { AuthUser }

/**
 * Dikirim setiap cookie sesi berubah tanpa reload halaman (login email/password, callback Google),
 * supaya semua instance useAuth (navbar, dasbor, checkout) membaca ulang cookie.
 */
const AUTH_CHANGE_EVENT = 'pakargaming:auth-change'

/**
 * JWT sesi ada di cookie HttpOnly yang hanya dibaca proxy (/api/proxy) — JavaScript tidak bisa melihatnya.
 * Status login di UI diambil dari cookie profil `user`, yang ditulis server bersamaan dan umurnya sama.
 */
export default function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sync = () => {
      setUser(getAuthUser())
      setLoading(false)
    }

    sync()
    window.addEventListener(AUTH_CHANGE_EVENT, sync)
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, sync)
  }, [])

  return { user, isLoggedIn: user !== null, loading }
}

/** Panggil setelah login berhasil: cookie sudah ditulis server, komponen tinggal membaca ulang. */
export function notifyAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

/** Hapus sesi tanpa redirect. Cookie HttpOnly hanya bisa dihapus server → endpoint logout. */
export async function endSession() {
  try {
    await fetch('/api/session/logout', {
      method: 'POST',
      headers: { [CSRF_HEADER]: CSRF_HEADER_VALUE },
      credentials: 'same-origin',
    })
  } catch {
    // Offline: tetap bersihkan sisi browser; cookie HttpOnly ikut kedaluwarsa bersama JWT-nya
  }
  Cookies.remove(USER_COOKIE)
  Cookies.remove(LEGACY_TOKEN_COOKIE)
}

export const logout = async () => {
  await endSession()
  window.location.href = '/'
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null

  const user = Cookies.get(USER_COOKIE)
  if (!user) return null

  try {
    return JSON.parse(user)
  } catch {
    return null
  }
}
