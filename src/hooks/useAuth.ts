import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import type { AuthUser } from '../types/Auth'

export type { AuthUser }

/**
 * Dikirim setiap cookie sesi berubah tanpa reload halaman (login email/password, callback Google),
 * supaya semua instance useAuth (navbar, dasbor, checkout) membaca ulang cookie.
 */
const AUTH_CHANGE_EVENT = 'pakargaming:auth-change'

export default function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sync = () => {
      setUser(getAuthUser())
      setToken(Cookies.get('token') || null)
      setLoading(false)
    }

    sync()
    window.addEventListener(AUTH_CHANGE_EVENT, sync)
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, sync)
  }, [])

  return { user, token, loading }
}

/** Simpan sesi persis seperti alur Google: cookie `token` (JWT) + `user` (JSON string). */
export function setSession(token: string, user: AuthUser | string) {
  Cookies.set('token', token)
  Cookies.set('user', typeof user === 'string' ? user : JSON.stringify(user))
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export const logout = () => {
  Cookies.remove('token')
  Cookies.remove('user')

  window.location.href = '/'
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null

  const user = Cookies.get('user')
  if (!user) return null

  try {
    return JSON.parse(user)
  } catch {
    return null
  }
}
