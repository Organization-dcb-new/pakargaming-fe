import { createHash, randomBytes } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getPublicApiBaseUrl } from '@/config/runtimeEnv'
import { getGoogleAuthUrl } from '@/features/auth/lib/authUrls'
import { GOOGLE_BINDING_COOKIE } from '@/lib/sessionServer'

/** Sama dengan umur state OAuth di backend: lewat dari ini login Google memang harus diulang. */
const BINDING_MAX_AGE_SECONDS = 600

/** Tiap klik harus dapat nonce baru — jangan pernah di-cache. */
export const dynamic = 'force-dynamic'

/**
 * Mulai login/daftar dengan Google (kontrak M5). Nonce acak disimpan di cookie HttpOnly browser ini, dan
 * backend hanya diberi hash-nya. Saat `?auth_code` kembali, proxy menukar kode itu dengan membawa nonce
 * dari cookie; backend menolak kalau hash-nya tidak cocok. Jadi link berisi `auth_code` milik penyerang
 * tidak bisa membuat korban login ke akun penyerang (lalu voucher yang dibeli korban terkirim ke email
 * penyerang). Mode link Google tidak lewat sini: sudah diikat lewat tiket dari akun yang login.
 */
export function GET(req: NextRequest) {
  const nonce = randomBytes(32).toString('base64url')
  const binding = createHash('sha256').update(nonce).digest('base64url')

  // URL publik, bukan API_INTERNAL_URL: yang membuka redirect ini browser pembeli.
  const res = NextResponse.redirect(getGoogleAuthUrl({ apiBaseUrl: getPublicApiBaseUrl(), binding }), 302)
  res.cookies.set(GOOGLE_BINDING_COOKIE, nonce, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isHttps(req),
    path: '/',
    maxAge: BINDING_MAX_AGE_SECONDS,
  })
  res.headers.set('Cache-Control', 'no-store')
  return res
}

/**
 * Di belakang edge proxy, URL request di Next bisa tetap `http:`; protokol aslinya ada di X-Forwarded-Proto.
 * Production selalu HTTPS (sama seperti cookie sesi di sessionServer).
 */
function isHttps(req: NextRequest): boolean {
  const forwarded = req.headers.get('x-forwarded-proto')?.split(',')[0]?.trim().toLowerCase()
  return forwarded === 'https' || req.nextUrl.protocol === 'https:' || process.env.NODE_ENV === 'production'
}
