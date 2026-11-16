const FALLBACK_API_BASE_URL = 'https://api.pakargaming.id'

/**
 * Origin backend untuk navigasi browser langsung (OAuth Google tidak lewat /api/proxy). Nilainya dari
 * pemanggil: getPublicApiBaseUrl() di server, usePublicEnv().apiBaseUrl di client (src/config/runtimeEnv.ts).
 * Selalu URL publik, bukan API_INTERNAL_URL: yang membukanya browser pembeli.
 */
function normalizeApiBaseUrl(apiBaseUrl: string | undefined) {
  return (apiBaseUrl || FALLBACK_API_BASE_URL).replace(/\/+$/, '')
}

/**
 * Pintu masuk/daftar dengan Google untuk tombol di browser. Route server ini membuat nonce, menyimpannya
 * di cookie HttpOnly browser ini, lalu redirect ke backend dengan hash-nya (kontrak M5). Kode login yang
 * kembali hanya bisa ditukar dengan nonce itu, jadi link berisi `auth_code` milik orang lain tidak bisa
 * membuat kita login ke akun mereka.
 */
export const GOOGLE_SIGN_IN_START_PATH = '/api/session/google/start'

interface GoogleAuthUrlOptions {
  /** NEXT_PUBLIC_API_BASE_URL saat runtime; kosong → api.pakargaming.id. */
  apiBaseUrl: string | undefined
  /** `link` = hubungkan Google ke akun yang sedang login. */
  intent?: 'link'
  /** Tiket dari `POST /v1/auth/google/link/start` (hanya untuk `link`). */
  ticket?: string
  /** SHA-256 nonce (base64url tanpa padding) — hanya diisi route GOOGLE_SIGN_IN_START_PATH. */
  binding?: string
}

/**
 * URL backend untuk mulai OAuth Google.
 * - tanpa intent → masuk/daftar dengan Google (backend kembali ke `/?auth_code=<code>`). Jangan dipakai
 *   langsung dari browser: lewat GOOGLE_SIGN_IN_START_PATH supaya ada binding-nya.
 * - `link` + tiket dari `POST /v1/auth/google/link/start` → hubungkan Google ke akun yang sedang
 *   login (backend kembali ke `/?google_link=<code>`). Tiket mengikat link ke akun ini, jadi kode
 *   link milik orang lain tidak bisa dipakai di akun kita.
 */
export function getGoogleAuthUrl({ apiBaseUrl, intent, ticket, binding }: GoogleAuthUrlOptions) {
  const url = new URL(`${normalizeApiBaseUrl(apiBaseUrl)}/v1/auth/google`)
  if (intent) url.searchParams.set('intent', intent)
  if (ticket) url.searchParams.set('ticket', ticket)
  if (binding) url.searchParams.set('binding', binding)
  return url.toString()
}
