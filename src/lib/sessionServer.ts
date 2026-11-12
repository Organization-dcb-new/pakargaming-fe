import type { NextRequest, NextResponse } from 'next/server'
import type { AuthUser } from '@/types/auth'
import { LEGACY_TOKEN_COOKIE, SESSION_COOKIE, USER_COOKIE } from './session'

/** Khusus server (route handler / proxy). Browser tidak pernah memegang JWT sesi. */

const baseCookieOptions = {
  path: '/',
  sameSite: 'lax' as const,
  // Production selalu HTTPS. Di `next dev` (http://localhost) flag Secure membuat Safari menolak cookie.
  secure: process.env.NODE_ENV === 'production',
}

/**
 * Nonce login Google yang diikat ke browser ini (kontrak M5). Ditulis /api/session/google/start,
 * dibaca proxy saat `v1/auth/google/exchange` lalu langsung dihapus (sekali pakai).
 */
export const GOOGLE_BINDING_COOKIE = 'pg_google_binding'

/**
 * Payload JWT TANPA verifikasi tanda tangan — hanya untuk memilah jenis token dan membaca `exp`.
 * Keaslian token tetap diperiksa backend.
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
    return payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : null
  } catch {
    return null
  }
}

/**
 * Hanya token pembeli yang boleh lewat storefront. Token admin/NOC (punya klaim `admin_id`) ditolak:
 * tanpa ini, token admin yang bocor bisa dipakai dari internet lewat /api/proxy, karena backend
 * menerima semua request dari IP server FE.
 */
function isBuyerToken(token: string): boolean {
  const payload = decodeJwtPayload(token)
  return payload !== null && !('admin_id' in payload)
}

/** Sisa umur JWT dalam detik (dari klaim `exp`), supaya cookie hilang bersamaan dengan token-nya. */
function secondsUntilExpiry(token: string): number | undefined {
  const exp = decodeJwtPayload(token)?.exp
  if (typeof exp !== 'number') return undefined
  return Math.max(0, Math.floor(exp - Date.now() / 1000))
}

/** Tanpa `exp` → cookie sesi browser (hilang saat browser ditutup), sama seperti perilaku js-cookie dulu. */
function lifetime(token: string) {
  const maxAge = secondsUntilExpiry(token)
  return maxAge === undefined ? {} : { maxAge }
}

/**
 * Hanya field yang dipakai UI yang disimpan — cookie ini bisa dibaca JS dan ikut terkirim di setiap request.
 * Email sengaja tetap ada: UI memakainya (menu akun navbar, kartu Dasbor, isi otomatis email checkout).
 */
function toCookieUser(raw: unknown): AuthUser | null {
  if (!raw || typeof raw !== 'object') return null
  const { name, email, picture } = raw as Record<string, unknown>
  if (typeof name !== 'string' || typeof email !== 'string') return null
  return { name, email, picture: typeof picture === 'string' && picture ? picture : null }
}

/**
 * Token sesi pembeli dari cookie HttpOnly, atau null (tidak ada / bukan token pembeli).
 * Cookie lama `token` (sebelum pindah ke HttpOnly) tidak diterima lagi: JWT hanya berumur 12 jam dan
 * migrasinya sudah berhari-hari lalu, jadi isinya pasti sudah kedaluwarsa.
 */
export function readSessionToken(req: NextRequest): { token: string } | null {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  return token && isBuyerToken(token) ? { token } : null
}

/** Ada cookie sesi, apa pun isinya — untuk membersihkan cookie yang ditolak readSessionToken. */
export function hasSessionCookie(req: NextRequest): boolean {
  return req.cookies.has(SESSION_COOKIE)
}

export function readCookieUser(req: NextRequest): AuthUser | null {
  const raw = req.cookies.get(USER_COOKIE)?.value
  if (!raw) return null
  try {
    return toCookieUser(JSON.parse(raw))
  } catch {
    return null
  }
}

/** Tulis sesi: JWT di cookie HttpOnly + profil tampilan di cookie biasa, umur keduanya mengikuti `exp` JWT. */
export function writeSession(res: NextResponse, token: string, user: unknown) {
  const life = lifetime(token)
  res.cookies.set(SESSION_COOKIE, token, { ...baseCookieOptions, ...life, httpOnly: true })
  writeUser(res, token, user)
  expire(res, LEGACY_TOKEN_COOKIE)
}

/** Perbarui cookie profil saja (mis. foto setelah link Google), umurnya tetap mengikuti sesi. */
export function writeUser(res: NextResponse, token: string, user: unknown) {
  const cookieUser = toCookieUser(user)
  if (!cookieUser) return
  res.cookies.set(USER_COOKIE, JSON.stringify(cookieUser), { ...baseCookieOptions, ...lifetime(token) })
}

export function clearSession(res: NextResponse) {
  expire(res, SESSION_COOKIE)
  // Sisa cookie lama (bisa dibaca JS) ikut dibersihkan walau tidak lagi diterima
  expire(res, LEGACY_TOKEN_COOKIE)
  expire(res, USER_COOKIE)
}

/**
 * Nonce binding Google dari cookie, atau null. Hanya ASCII terlihat (tanpa spasi/CR/LF), maksimal 256
 * karakter, karena nilainya diteruskan apa adanya sebagai header ke backend.
 */
export function readGoogleBinding(req: NextRequest): string | null {
  const value = req.cookies.get(GOOGLE_BINDING_COOKIE)?.value
  return value && /^[\x21-\x7e]{1,256}$/.test(value) ? value : null
}

/** Nonce Google sekali pakai: dihapus setelah exchange, berhasil maupun gagal. */
export function clearGoogleBinding(res: NextResponse) {
  expire(res, GOOGLE_BINDING_COOKIE)
}

/** Path harus `/`: tanpa itu browser memakai path request (/api/proxy/...) dan cookie aslinya tidak terhapus. */
function expire(res: NextResponse, name: string) {
  res.cookies.set(name, '', { ...baseCookieOptions, maxAge: 0 })
}
