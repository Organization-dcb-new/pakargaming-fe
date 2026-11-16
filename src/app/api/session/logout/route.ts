import { NextRequest, NextResponse } from 'next/server'
import { getServerApiBaseUrl } from '@/config/runtimeEnv'
import { getClientIp } from '@/lib/clientIp'
import { CSRF_HEADER, CSRF_HEADER_VALUE } from '@/lib/session'
import { clearSession, readSessionToken } from '@/lib/sessionServer'

/** Batas tunggu backend: logout tidak boleh tertahan karena backend lambat atau mati. */
const REVOKE_TIMEOUT_MS = 3000

/**
 * Cookie sesi HttpOnly tidak bisa dihapus JavaScript, jadi logout di browser memanggil endpoint ini.
 * Sebelum cookie dihapus, token dicabut dulu di backend (`POST /v1/auth/logout`): JWT berlaku 12 jam, dan
 * tanpa ini token yang sempat tersalin tetap bisa dipakai walau pemiliknya sudah keluar.
 */
export async function POST(req: NextRequest) {
  if (req.headers.get(CSRF_HEADER) !== CSRF_HEADER_VALUE) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  const session = readSessionToken(req)
  if (session) await revokeOnBackend(req, session.token)

  const res = NextResponse.json({ success: true })
  clearSession(res)
  return res
}

/** Gagal menghubungi backend tidak menghalangi logout: cookie tetap dihapus. */
async function revokeOnBackend(req: NextRequest, token: string) {
  const backendUrl = getServerApiBaseUrl()
  if (!backendUrl) return

  // Header sama seperti /api/proxy: backend hanya memercayai X-Client-IP yang membawa kunci storefront
  const headers: Record<string, string> = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'X-Client-IP': getClientIp(req.headers),
  }
  const proxySecret = process.env.STOREFRONT_PROXY_SECRET
  if (proxySecret) headers['X-Storefront-Key'] = proxySecret

  try {
    const res = await fetch(`${backendUrl.replace(/\/+$/, '')}/v1/auth/logout`, {
      method: 'POST',
      headers,
      cache: 'no-store',
      signal: AbortSignal.timeout(REVOKE_TIMEOUT_MS),
    })
    // 401 = token memang sudah tidak berlaku (kedaluwarsa/dicabut) — tidak perlu dicatat
    if (!res.ok && res.status !== 401) {
      console.error('[Logout] backend refused to revoke the session', { status: res.status })
    }
  } catch (error) {
    console.error('[Logout] could not reach the backend to revoke the session', {
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
