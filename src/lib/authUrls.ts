const FALLBACK_API_BASE_URL = 'https://api.pakargaming.id'

/** Origin backend untuk navigasi browser langsung (OAuth Google tidak lewat /api/proxy). */
function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || FALLBACK_API_BASE_URL).replace(/\/+$/, '')
}

/**
 * URL mulai OAuth Google.
 * - tanpa intent → masuk/daftar dengan Google
 * - `link` → hubungkan Google ke akun yang sedang login (backend kembali ke `/?google_link=<code>`)
 */
export function getGoogleAuthUrl(intent?: 'link') {
  const url = `${getApiBaseUrl()}/v1/auth/google`
  return intent ? `${url}?intent=${intent}` : url
}
