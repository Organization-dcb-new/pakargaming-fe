/** Verifikasi Cloudflare Turnstile di server (proxy). Kunci rahasia tidak pernah sampai ke browser. */

import { getTurnstileSiteKey } from '@/config/runtimeEnv'

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/**
 * Aktif hanya kalau kedua kunci terisi. Kalau cuma secret yang diisi, widget tidak tampil di browser
 * sehingga semua login/daftar akan ditolak — guard ini mencegah salah konfigurasi itu.
 */
export function isTurnstileEnabled() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && getTurnstileSiteKey())
}

/**
 * Secret diisi tapi site key kosong → Turnstile diam-diam MATI. Biasanya karena NEXT_PUBLIC_TURNSTILE_SITE_KEY
 * lupa diisi di .env server (keduanya dibaca saat runtime, lihat src/config/runtimeEnv.ts).
 * Dicek saat server start (src/instrumentation.ts) supaya kelihatan di log.
 */
export function isTurnstileMisconfigured() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY) && !getTurnstileSiteKey()
}

/** Fail-closed: kalau Cloudflare tidak bisa dihubungi, request auth ditolak (bot tidak lolos saat gangguan). */
export async function verifyTurnstile(token: string | null, remoteIp?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret || !token) return false

  const body = new URLSearchParams({ secret, response: token })
  if (remoteIp) body.set('remoteip', remoteIp)

  try {
    const res = await fetch(VERIFY_URL, { method: 'POST', body, signal: AbortSignal.timeout(5000) })
    const result = (await res.json()) as { success?: boolean; 'error-codes'?: string[] }
    if (!result.success) console.warn('[Turnstile] ditolak', result['error-codes'])
    return result.success === true
  } catch (error) {
    console.error('[Turnstile] verifikasi gagal', error instanceof Error ? error.message : error)
    return false
  }
}
