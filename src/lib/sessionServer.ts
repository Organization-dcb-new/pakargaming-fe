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

/** Sisa umur JWT dalam detik (dari klaim `exp`), supaya cookie hilang bersamaan dengan token-nya. */
function secondsUntilExpiry(token: string): number | undefined {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'))
    if (typeof payload?.exp !== 'number') return undefined
    return Math.max(0, Math.floor(payload.exp - Date.now() / 1000))
  } catch {
    return undefined
  }
}

/** Tanpa `exp` → cookie sesi browser (hilang saat browser ditutup), sama seperti perilaku js-cookie dulu. */
function lifetime(token: string) {
  const maxAge = secondsUntilExpiry(token)
  return maxAge === undefined ? {} : { maxAge }
}

/** Hanya field yang dipakai UI yang disimpan — cookie ini bisa dibaca JS dan ikut terkirim di setiap request. */
function toCookieUser(raw: unknown): AuthUser | null {
  if (!raw || typeof raw !== 'object') return null
  const { name, email, picture } = raw as Record<string, unknown>
  if (typeof name !== 'string' || typeof email !== 'string') return null
  return { name, email, picture: typeof picture === 'string' && picture ? picture : null }
}

export function readSessionToken(req: NextRequest): { token: string; legacy: boolean } | null {
  const current = req.cookies.get(SESSION_COOKIE)?.value
  if (current) return { token: current, legacy: false }

  const legacy = req.cookies.get(LEGACY_TOKEN_COOKIE)?.value
  return legacy ? { token: legacy, legacy: true } : null
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
  expire(res, LEGACY_TOKEN_COOKIE)
  expire(res, USER_COOKIE)
}

/** Path harus `/`: tanpa itu browser memakai path request (/api/proxy/...) dan cookie aslinya tidak terhapus. */
function expire(res: NextResponse, name: string) {
  res.cookies.set(name, '', { ...baseCookieOptions, maxAge: 0 })
}
