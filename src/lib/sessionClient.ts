import Cookies from 'js-cookie'
import type { AuthUser } from '@/types/auth'
import { CSRF_HEADER, CSRF_HEADER_VALUE, LEGACY_TOKEN_COOKIE, USER_COOKIE } from './session'

/**
 * Helper sesi di browser. Sengaja tanpa React: dipakai juga oleh API client (auto-logout saat 401),
 * yang ikut terimpor di kode server — modul ber-`useState` di jalur itu membuat `next build` gagal.
 */

/**
 * Dikirim setiap cookie sesi berubah tanpa reload halaman (login email/password, callback Google),
 * supaya semua instance useAuth (navbar, dasbor, checkout) membaca ulang cookie.
 */
export const AUTH_CHANGE_EVENT = 'pakargaming:auth-change'

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
