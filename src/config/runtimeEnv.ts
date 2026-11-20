/**
 * Konfigurasi yang dibaca saat server JALAN — dari .env server (`environment:` compose, lihat
 * deploy/*.env.example) atau .env lokal saat `yarn dev` — bukan saat `next build`. Jadi mengubah nilainya
 * cukup restart container, tanpa build ulang image.
 *
 * Next.js mengganti `process.env.NEXT_PUBLIC_X` (akses langsung) dengan nilainya saat build, di kode server
 * juga; image Docker dibangun tanpa nilai itu, jadi akses langsung = kosong selamanya di image. Akses lewat
 * nama (`process.env[name]`) tidak diganti ("dynamic lookups will not be inlined", dokumentasi Next.js),
 * sehingga dibaca saat runtime. Karena itu:
 * - kode server: baca NEXT_PUBLIC_* hanya lewat fungsi di sini, jangan `process.env.NEXT_PUBLIC_*` langsung;
 * - komponen client: `usePublicEnv()` (src/providers/PublicEnvProvider.tsx), diisi layout per request.
 *
 * Pengecualian: NEXT_PUBLIC_IMAGE_HOSTS tetap build-time (src/config/images.ts), karena dipakai
 * next.config.ts `images.remotePatterns` yang dikunci saat build.
 */

/** Nilai env saat runtime; kosong → undefined. */
function readRuntimeEnv(name: string): string | undefined {
  return process.env[name] || undefined
}

/**
 * Base URL backend (tanpa /v1) untuk SEMUA request DARI SERVER INI: proxy /api/proxy, sitemap, metadata
 * game, maintenance, pengumuman, logout. Hanya API_INTERNAL_URL — di server alamat backend di network
 * Docker (http://172.16.10.10:4001), saat `yarn dev` lokal boleh URL publik. Tidak ada fallback ke
 * NEXT_PUBLIC_API_BASE_URL: kosong = request server gagal (instrumentation.ts menulis error saat start).
 * Jangan dipakai untuk URL yang dibuka browser: alamat internal tidak bisa dijangkau pembeli.
 */
export function getServerApiBaseUrl(): string | undefined {
  return readRuntimeEnv('API_INTERNAL_URL')
}

/**
 * Base URL backend (tanpa /v1) yang dibuka BROWSER pembeli, KHUSUS login & link Google (redirect ke
 * /v1/auth/google). Harus alamat publik (https://api.pakargaming.id), bukan alamat internal Docker.
 * Bukan untuk request server — itu getServerApiBaseUrl().
 */
export function getPublicApiBaseUrl(): string | undefined {
  return readRuntimeEnv('NEXT_PUBLIC_API_BASE_URL')
}

/** Site key Cloudflare Turnstile (publik; secret-nya TURNSTILE_SECRET_KEY). Hanya untuk kode server. */
export function getTurnstileSiteKey(): string | undefined {
  return readRuntimeEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY')
}

/** Nilai publik yang dibutuhkan komponen client. Semuanya memang boleh terlihat di browser. */
export type PublicEnv = {
  /** Untuk navigasi browser langsung ke backend (OAuth Google), bukan untuk fetch — fetch lewat /api/proxy. */
  apiBaseUrl: string
  turnstileSiteKey: string
  gaMeasurementId: string
  footerLogoUrl: string
}

/** Dipanggil layout (server) per request, lalu diteruskan ke PublicEnvProvider. */
export function getPublicEnv(): PublicEnv {
  return {
    apiBaseUrl: getPublicApiBaseUrl() ?? '',
    turnstileSiteKey: getTurnstileSiteKey() ?? '',
    gaMeasurementId: readRuntimeEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID') ?? '',
    footerLogoUrl: readRuntimeEnv('NEXT_PUBLIC_FOOTER_LOGO_URL') ?? '',
  }
}
