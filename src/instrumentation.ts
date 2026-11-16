/**
 * Dijalankan Next.js sekali saat server start. Dipakai untuk memeriksa konfigurasi keamanan yang
 * kalau salah tidak membuat error, tapi diam-diam mematikan proteksi. Sengaja hanya log (tidak
 * menghentikan server): salah konfigurasi di sini tidak boleh membuat storefront mati saat deploy.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const { isTurnstileMisconfigured } = await import('@/lib/turnstile')
  const { clientIpHeaderName, isClientIpHeaderMisconfigured } = await import('@/lib/clientIp')
  const { getApiBaseUrl } = await import('@/config/runtimeEnv')

  if (!getApiBaseUrl()) {
    console.error(
      '[Config] NEXT_PUBLIC_API_BASE_URL kosong → semua request /api/proxy gagal (500). Isi di .env server ' +
        '(deploy/*.env.example) atau .env lokal, lalu restart.',
    )
  }

  if (isTurnstileMisconfigured()) {
    console.error(
      '[Security] TURNSTILE_SECRET_KEY diisi tapi NEXT_PUBLIC_TURNSTILE_SITE_KEY kosong → Turnstile MATI ' +
        '(login/daftar/lupa password tanpa captcha). Isi NEXT_PUBLIC_TURNSTILE_SITE_KEY di .env server, lalu restart.',
    )
  }

  if (isClientIpHeaderMisconfigured()) {
    console.error(
      `[Security] CLIENT_IP_HEADER="${process.env.CLIENT_IP_HEADER}" bukan nama header yang sah → ` +
        `memakai "${clientIpHeaderName()}".`,
    )
  }

  if (process.env.NODE_ENV === 'production' && !process.env.STOREFRONT_PROXY_SECRET) {
    console.warn(
      '[Security] STOREFRONT_PROXY_SECRET kosong → backend tidak bisa membedakan X-Client-IP dari proxy ini ' +
        'dengan yang dikarang. Isi nilai yang sama di FE dan backend.',
    )
  }
}
