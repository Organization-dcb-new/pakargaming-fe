/**
 * Dijalankan Next.js sekali saat server start. Dipakai untuk memeriksa konfigurasi keamanan yang
 * kalau salah tidak membuat error, tapi diam-diam mematikan proteksi. Sengaja hanya log (tidak
 * menghentikan server): salah konfigurasi di sini tidak boleh membuat storefront mati saat deploy.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const { isTurnstileMisconfigured } = await import('@/lib/turnstile')
  const { clientIpHeaderName, isClientIpHeaderMisconfigured } = await import('@/lib/clientIp')

  if (isTurnstileMisconfigured()) {
    console.error(
      '[Security] TURNSTILE_SECRET_KEY diisi tapi NEXT_PUBLIC_TURNSTILE_SITE_KEY kosong di build ini → ' +
        'Turnstile MATI (login/daftar/lupa password tanpa captcha). Bangun ulang image dengan build-arg ' +
        'NEXT_PUBLIC_TURNSTILE_SITE_KEY.',
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
