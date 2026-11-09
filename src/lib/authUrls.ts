const FALLBACK_API_BASE_URL = 'https://api.pakargaming.id'

/** Origin backend untuk navigasi browser langsung (OAuth Google tidak lewat /api/proxy). */
function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || FALLBACK_API_BASE_URL).replace(/\/+$/, '')
}

/**
 * URL mulai OAuth Google.
 * - tanpa intent → masuk/daftar dengan Google (backend kembali ke `/?auth_code=<code>`)
 * - `link` + tiket dari `POST /v1/auth/google/link/start` → hubungkan Google ke akun yang sedang
 *   login (backend kembali ke `/?google_link=<code>`). Tiket mengikat link ke akun ini, jadi kode
 *   link milik orang lain tidak bisa dipakai di akun kita.
 */
export function getGoogleAuthUrl(intent?: 'link', ticket?: string) {
  const url = new URL(`${getApiBaseUrl()}/v1/auth/google`)
  if (intent) url.searchParams.set('intent', intent)
  if (ticket) url.searchParams.set('ticket', ticket)
  return url.toString()
}
