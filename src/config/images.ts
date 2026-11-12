/**
 * Host gambar remote yang dioptimasi next/image (resize sesuai layar + WebP/AVIF).
 * Dipakai `next.config.ts` (images.remotePatterns) dan `canOptimize()` di src/lib/image.ts.
 *
 * Gambar dari host lain tetap tampil, hanya tanpa optimasi — jadi data dari host baru tidak
 * membuat halaman error.
 *
 * Hanya host persis, tanpa wildcard: `**.digitaloceanspaces.com` dulu membuat optimizer server ini mau
 * mengambil & memproses gambar dari bucket Spaces milik SIAPA PUN. Bucket DigitalOcean yang dipakai
 * backend (S3_PUBLIC_URL) adalah `aura-s3` di sgp1 — endpoint langsung dan CDN-nya didaftarkan di bawah.
 * Bucket/CDN lain → tambahkan di sini, atau lewat env build `NEXT_PUBLIC_IMAGE_HOSTS`
 * (daftar hostname dipisah koma, mis. `cdn.pakargaming.id,bucket-prod.sgp1.digitaloceanspaces.com`).
 */
const DEFAULT_IMAGE_HOSTS = [
  'res.cloudinary.com',
  's3.nevaobjects.id',
  'aura-s3.sgp1.digitaloceanspaces.com',
  'aura-s3.sgp1.cdn.digitaloceanspaces.com',
]

/** Host tambahan dari env. Entri ber-wildcard atau bukan hostname diabaikan. */
const EXTRA_IMAGE_HOSTS = (process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? '')
  .split(',')
  .map((host) => host.trim().toLowerCase())
  .filter((host) => /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(host))

export const OPTIMIZED_IMAGE_HOSTS: readonly string[] = Array.from(
  new Set([...DEFAULT_IMAGE_HOSTS, ...EXTRA_IMAGE_HOSTS]),
)
